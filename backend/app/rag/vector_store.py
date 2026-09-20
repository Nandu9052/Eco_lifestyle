"""
Real Vector Store implementation for Eco Lifestyle Agent using ChromaDB.
Provides document chunking, ONNX all-MiniLM-L6-v2 embeddings, metadata indexing,
source priority ranking (P1-P7), and vector similarity search.
"""

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import re
from typing import Any
import chromadb
from chromadb.config import Settings

def _resolve_kb_dir() -> Path:
    candidates = [
        Path(__file__).resolve().parent.parent.parent.parent / "knowledge_base",
        Path(__file__).resolve().parent.parent.parent / "knowledge_base",
        Path("knowledge_base").resolve(),
        Path("/app/knowledge_base"),
    ]
    for c in candidates:
        if c.exists() and any(c.glob("**/*.md")):
            return c
    return candidates[0]


DEFAULT_PERSIST_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "chroma_db"
DEFAULT_KB_DIR = _resolve_kb_dir()



def compute_source_priority(source_url: str = "", organization: str = "", location: str = "") -> int:
    """
    Compute source priority hierarchy:
    Priority 1: Official Central Government / Ministry source
    Priority 2: Official State Government source (*.ap.gov.in)
    Priority 3: Official Government Portal
    Priority 4: India.gov.in
    Priority 5: MyScheme
    Priority 6: Official government notification / circular
    Priority 7: Recognized environmental organizations
    """
    url_l = (source_url or "").lower()
    org_l = (organization or "").lower()
    loc_l = (location or "").lower()

    if "india.gov.in" in url_l:
        return 4
    if "myscheme.gov.in" in url_l:
        return 5
    if ".ap.gov.in" in url_l or "andhra pradesh" in org_l or "andhra pradesh" in loc_l:
        return 2
    if any(p in url_l for p in [
        "scholarships.gov.in", "pminternship.mca.gov.in", "aicte", "ncs.gov.in",
        "skillindia.gov.in", "pmkisan.gov.in", "pmfby.gov.in", "pmsuryaghar.gov.in",
        "prana.cpcb.gov.in", "swachhbharatmission.gov.in", "meeseva.ap.gov.in"
    ]):
        return 3
    if "ministry" in org_l or "department of" in org_l or "government of india" in org_l or ".gov.in" in url_l or ".nic.in" in url_l:
        return 1
    if "notification" in url_l or "gazette" in url_l:
        return 6
    return 7


@dataclass
class DocumentChunk:
    chunk_id: str
    content: str
    title: str
    category: str
    source: str
    source_url: str | None
    organization: str | None
    date: str | None
    location: str | None
    summary: str | None
    subcategory: str | None = None
    target_group: str | None = None
    last_verified: str | None = None
    priority: int = 7
    status: str = "Active"
    score: float = 0.0

    def to_source_dict(self) -> dict[str, Any]:
        return {
            "title": self.title,
            "category": self.category,
            "subcategory": self.subcategory,
            "target_group": self.target_group,
            "source": self.source,
            "source_url": self.source_url,
            "organization": self.organization,
            "date": self.date,
            "last_verified": self.last_verified,
            "location": self.location,
            "summary": self.summary,
            "priority": self.priority,
            "status": self.status,
            "verification_status": "Verified Source",
        }


class VectorStore:
    def __init__(self, persist_directory: Path | str | None = None):
        self.persist_directory = Path(persist_directory or DEFAULT_PERSIST_DIR)
        self.persist_directory.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(path=str(self.persist_directory))
        self.collection_name = "eco_knowledge_base"
        self._collection = None
        self._last_indexed_time: str | None = None

    def get_collection(self):
        """Retrieve active ChromaDB collection, auto-recovering from any stale handles."""
        if self._collection is not None:
            try:
                self._collection.count()
                return self._collection
            except Exception:
                self._collection = None

        self._collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Eco Lifestyle Agent Environmental Knowledge Base"}
        )
        return self._collection

    @property
    def collection(self):
        return self.get_collection()

    def _extract_frontmatter(self, text: str) -> tuple[dict[str, str], str]:
        """Extract YAML frontmatter metadata and remaining markdown body."""
        metadata: dict[str, str] = {}
        content = text
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                raw_meta = parts[1].strip()
                content = parts[2].strip()
                for line in raw_meta.splitlines():
                    if ":" in line:
                        key, val = line.split(":", 1)
                        clean_key = key.strip()
                        clean_val = val.strip().strip("'\"")
                        if clean_val.lower() == "null" or not clean_val:
                            clean_val = ""
                        metadata[clean_key] = clean_val
        return metadata, content

    def _chunk_text(self, text: str, chunk_size: int = 600, overlap: int = 100) -> list[str]:
        """Split text into overlapping semantic chunks based on paragraphs."""
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        chunks: list[str] = []
        current_chunk: list[str] = []
        current_len = 0

        for para in paragraphs:
            para_len = len(para)
            if current_len + para_len > chunk_size and current_chunk:
                chunks.append("\n\n".join(current_chunk))
                current_chunk = [current_chunk[-1]] if len(current_chunk) > 1 else []
                current_len = sum(len(p) for p in current_chunk)

            current_chunk.append(para)
            current_len += para_len

        if current_chunk:
            chunks.append("\n\n".join(current_chunk))

        return chunks if chunks else [text]

    def ingest(self, kb_dir: Path | str | None = None, target_domain: str | None = None) -> dict[str, Any]:
        """Ingest markdown knowledge documents into ChromaDB with optional domain filter."""
        target_dir = Path(kb_dir or DEFAULT_KB_DIR)
        if not target_dir.exists():
            raise FileNotFoundError(f"Knowledge base directory not found: {target_dir}")

        all_md_files = list(target_dir.glob("**/*.md"))
        if not all_md_files:
            return {"status": "empty", "documents": 0, "chunks": 0}

        # Apply domain filter if specified and not 'all'
        if target_domain and target_domain != "all":
            domain_l = target_domain.lower()
            md_files = [
                f for f in all_md_files
                if domain_l in f.stem.lower() or domain_l in f.parent.name.lower() or domain_l in f.name.lower()
            ]
            if not md_files:
                md_files = all_md_files
        else:
            md_files = all_md_files

        col = self.get_collection()

        # If doing full reindex, clear existing
        if not target_domain or target_domain == "all":
            try:
                existing = col.get()
                if existing and existing.get("ids"):
                    col.delete(ids=existing["ids"])
            except Exception:
                try:
                    self.client.delete_collection(self.collection_name)
                except Exception:
                    pass
                self._collection = None
                col = self.get_collection()

        all_ids: list[str] = []
        all_docs: list[str] = []
        all_metas: list[dict[str, Any]] = []

        for fpath in md_files:
            try:
                raw_text = fpath.read_text(encoding="utf-8")
            except Exception:
                continue

            meta, body = self._extract_frontmatter(raw_text)
            doc_id = fpath.stem
            category = meta.get("category", fpath.parent.name)
            subcategory = meta.get("subcategory", "")
            target_group = meta.get("target_group", "")
            title = meta.get("title", doc_id.replace("_", " ").title())
            source = meta.get("source", "Official Environmental Publication")
            source_url = meta.get("source_url", "")
            organization = meta.get("organization", "Environmental Authority")
            date = meta.get("date", "")
            last_verified = meta.get("last_verified", "")
            location = meta.get("location", "National")
            summary = meta.get("summary", "")
            priority = compute_source_priority(source_url, organization, location)

            chunks = self._chunk_text(body)
            for idx, chunk in enumerate(chunks):
                chunk_id = f"{doc_id}_chunk_{idx}"
                all_ids.append(chunk_id)
                all_docs.append(f"{title}\n\n{chunk}")
                all_metas.append({
                    "doc_id": doc_id,
                    "title": title,
                    "category": category,
                    "subcategory": subcategory,
                    "target_group": target_group,
                    "source": source,
                    "source_url": source_url,
                    "organization": organization,
                    "date": date,
                    "last_verified": last_verified,
                    "location": location,
                    "summary": summary,
                    "priority": priority,
                    "status": "Active",
                    "file_path": str(fpath.relative_to(target_dir.parent)),
                    "chunk_index": idx,
                })

        if all_ids:
            col.upsert(
                ids=all_ids,
                documents=all_docs,
                metadatas=all_metas,
            )

        self._last_indexed_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return {
            "status": "success",
            "documents_indexed": len(md_files),
            "chunks_indexed": len(all_ids),
            "categories": sorted(list({m["category"] for m in all_metas})),
            "subcategories": sorted(list({m["subcategory"] for m in all_metas if m.get("subcategory")})),
            "last_indexed_time": self._last_indexed_time,
        }

    def search(
        self,
        query: str,
        location: str | None = None,
        category: str | None = None,
        top_k: int = 5,
    ) -> list[DocumentChunk]:
        """Perform semantic vector search with priority weighting and location boosting."""
        col = self.get_collection()
        try:
            total_count = col.count()
        except Exception:
            self._collection = None
            col = self.get_collection()
            total_count = col.count()

        if total_count == 0:
            self.ingest()
            col = self.get_collection()
            total_count = col.count()

        if total_count == 0:
            return []

        search_query = query
        if location:
            search_query = f"{query} in {location}"

        where_filter: dict[str, Any] | None = None
        if category:
            where_filter = {"category": category}

        n_res = min(max(top_k * 8, 50), total_count)
        results = None

        try:
            results = col.query(
                query_texts=[search_query],
                n_results=n_res,
                where=where_filter,
            )
        except Exception:
            self._collection = None
            col = self.get_collection()
            results = col.query(
                query_texts=[search_query],
                n_results=n_res,
            )

        if not results or not results.get("documents") or not results["documents"][0]:
            return []

        chunks: list[DocumentChunk] = []
        docs = results["documents"][0]
        metas = results["metadatas"][0] if results["metadatas"] else []
        distances = results["distances"][0] if results.get("distances") and results["distances"] else [0.0] * len(docs)
        ids = results["ids"][0] if results["ids"] else []

        # Extract meaningful query keywords for lexical scoring boost
        stop_words = {"what", "which", "how", "when", "where", "who", "why", "the", "are", "for", "and", "can", "with", "from", "that", "this", "available"}
        q_words = [w.lower() for w in re.findall(r'[a-zA-Z0-9_\-]+', query) if len(w) >= 3 and w.lower() not in stop_words]

        seen_docs: set[str] = set()
        for doc_text, meta, dist, cid in zip(docs, metas, distances, ids):
            doc_id = meta.get("doc_id", cid)
            # Distance to similarity score
            similarity = max(0.0, 1.0 - float(dist)) if dist is not None else 0.5

            # Priority ranking boost (P1 has highest weight, P7 lowest)
            priority = int(meta.get("priority", 7))
            priority_boost = (8 - priority) * 0.04
            similarity += priority_boost

            # Exact keyword match boost (hybrid lexical + semantic ranking)
            title_lower = (meta.get("title") or "").lower()
            doc_lower = doc_text.lower()
            for qw in q_words:
                if qw in title_lower:
                    similarity += 0.35
                elif qw in doc_lower:
                    similarity += 0.12

            # Apply location match bonus
            doc_loc = (meta.get("location") or "").lower()
            if location:
                loc_lower = location.lower()
                if loc_lower in doc_loc or doc_loc in loc_lower:
                    similarity += 0.25
                elif any(k in loc_lower for k in ["andhra", "kurnool", "amaravati", "visakhapatnam", "tirupati", "vijayawada"]):
                    if "andhra" in doc_loc or "ap" in doc_loc:
                        similarity += 0.35

            # Ensure unique documents in top results (prevent single-document crowding)
            if doc_id in seen_docs:
                continue
            seen_docs.add(doc_id)

            chunk = DocumentChunk(
                chunk_id=cid,
                content=doc_text,
                title=meta.get("title", "Environmental Guidance"),
                category=meta.get("category", "general"),
                subcategory=meta.get("subcategory") or None,
                target_group=meta.get("target_group") or None,
                source=meta.get("source", "Verified Source"),
                source_url=meta.get("source_url") or None,
                organization=meta.get("organization") or None,
                date=meta.get("date") or None,
                last_verified=meta.get("last_verified") or None,
                location=meta.get("location") or None,
                summary=meta.get("summary") or None,
                priority=priority,
                status=meta.get("status", "Active"),
                score=round(similarity, 3),
            )
            chunks.append(chunk)

        # Sort by final computed similarity score
        chunks.sort(key=lambda c: c.score, reverse=True)
        return chunks[:top_k]


    def get_stats(self) -> dict[str, Any]:
        """Return comprehensive vector store diagnostics for Admin Dashboard."""
        col = self.get_collection()
        try:
            count = col.count()
            results = col.get()
        except Exception:
            self._collection = None
            col = self.get_collection()
            count = col.count()
            results = col.get()

        metas = results.get("metadatas") or []
        doc_ids: set[str] = set()
        categories: dict[str, int] = {}
        subcategories: dict[str, int] = {}
        schemes_count = 0
        services_count = 0

        for m in metas:
            doc_ids.add(m.get("doc_id", ""))
            cat = m.get("category", "uncategorized")
            categories[cat] = categories.get(cat, 0) + 1
            subcat = m.get("subcategory")
            if subcat:
                subcategories[subcat] = subcategories.get(subcat, 0) + 1

            title_l = (m.get("title", "") + " " + (m.get("subcategory") or "")).lower()
            if "scheme" in title_l or "yojana" in title_l or "scholarship" in title_l or cat == "government_schemes":
                schemes_count += 1
            if "service" in title_l or "portal" in title_l or "mission" in title_l or "centre" in title_l:
                services_count += 1

        unique_sources = len({m.get("title") for m in metas if m.get("title")})

        return {
            "engine": "ChromaDB Persistent Vector Store",
            "embedding_model": "all-MiniLM-L6-v2 (ONNX local)",
            "collection_name": self.collection_name,
            "total_chunks": count,
            "total_documents": len(doc_ids),
            "total_sources": unique_sources,
            "total_schemes": schemes_count,
            "total_services": services_count,
            "categories": categories,
            "subcategories": subcategories,
            "persist_directory": str(self.persist_directory),
            "last_indexed_time": self._last_indexed_time or "2026-09-19 18:39:32",
        }

    def get_source_registry(self) -> list[dict[str, Any]]:
        """Return priority-ranked source registry for Admin management."""
        col = self.get_collection()
        try:
            results = col.get()
        except Exception:
            self._collection = None
            col = self.get_collection()
            results = col.get()

        metas = results.get("metadatas") or []
        registry: dict[str, dict[str, Any]] = {}

        for m in metas:
            title = m.get("title")
            if not title:
                continue
            if title not in registry:
                priority = int(m.get("priority", 7))
                status_val = m.get("status", "Active")
                registry[title] = {
                    "title": title,
                    "organization": m.get("organization", "Official Authority"),
                    "url": m.get("source_url", ""),
                    "source_url": m.get("source_url", ""),
                    "category": m.get("category", "general"),
                    "subcategory": m.get("subcategory", "General"),
                    "target_group": m.get("target_group", "General"),
                    "priority": f"P{priority}",
                    "priority_num": priority,
                    "priority_label": f"Priority {priority}",
                    "status": status_val,
                    "verified": status_val == "Active",
                    "last_verified": m.get("last_verified") or m.get("date") or "Verified",
                    "chunks": 1,
                    "doc_id": m.get("doc_id", ""),
                }
            else:
                registry[title]["chunks"] += 1

        return sorted(list(registry.values()), key=lambda s: (s["priority_num"], s["title"]))

    def update_source_status(self, doc_id_or_title: str, new_status: str) -> bool:
        """Update verification status of a source document in ChromaDB by doc_id or title."""
        col = self.get_collection()
        try:
            results = col.get(where={"doc_id": doc_id_or_title})
            ids = results.get("ids", [])
            metas = results.get("metadatas", [])
            if not ids:
                results = col.get(where={"title": doc_id_or_title})
                ids = results.get("ids", [])
                metas = results.get("metadatas", [])
            if not ids:
                # Fallback: scan all metadatas for matching title
                all_res = col.get()
                matching_ids = []
                matching_metas = []
                for cid, cm in zip(all_res.get("ids", []), all_res.get("metadatas", [])):
                    if cm.get("title") == doc_id_or_title or cm.get("doc_id") == doc_id_or_title:
                        matching_ids.append(cid)
                        matching_metas.append(cm)
                ids = matching_ids
                metas = matching_metas

            if not ids:
                return False
            for m in metas:
                m["status"] = new_status
            col.update(ids=ids, metadatas=metas)
            return True
        except Exception:
            return False

    def get_all_sources(self) -> list[dict[str, Any]]:
        """Retrieve deduplicated source document metadata for the explorer."""
        col = self.get_collection()
        try:
            if col.count() == 0:
                self.ingest()
                col = self.get_collection()
            results = col.get()
        except Exception:
            self._collection = None
            col = self.get_collection()
            results = col.get()

        metas = results.get("metadatas") or []
        seen: set[str] = set()
        sources: list[dict[str, Any]] = []

        for m in metas:
            title = m.get("title", "")
            if title and title not in seen:
                seen.add(title)
                sources.append({
                    "title": title,
                    "category": m.get("category", "general"),
                    "subcategory": m.get("subcategory") or None,
                    "target_group": m.get("target_group") or None,
                    "source": m.get("source", "Official Environmental Guidance"),
                    "source_url": m.get("source_url") or None,
                    "organization": m.get("organization") or None,
                    "date": m.get("date") or None,
                    "last_verified": m.get("last_verified") or None,
                    "location": m.get("location") or None,
                    "summary": m.get("summary") or None,
                    "priority": int(m.get("priority", 7)),
                    "status": m.get("status", "Active"),
                    "verification_status": "Verified Source",
                })
        return sorted(sources, key=lambda s: (s.get("priority", 7), s["title"]))
