"""
Real RAG Retriever for Eco Lifestyle Agent.
Connects intent classification with the ChromaDB persistent vector store.
Enforces source priority ranking and tracks retrieval telemetry.
"""

from dataclasses import dataclass
from pathlib import Path
import re
import time
from typing import Any

from app.monitoring import monitor
from app.rag.vector_store import VectorStore, DocumentChunk

# ---------------------------------------------------------------------------
# Intent label constants
# ---------------------------------------------------------------------------
INTENT_SUSTAINABLE_LIVING = 'SUSTAINABLE_LIVING'
INTENT_ECO_PRODUCTS = 'ECO_PRODUCTS'
INTENT_RECYCLING = 'RECYCLING'
INTENT_GOVERNMENT_SCHEMES = 'GOVERNMENT_SCHEMES'
INTENT_ECO_TRAVEL = 'ECO_TRAVEL'
INTENT_ENERGY = 'ENERGY'
INTENT_WATER = 'WATER'
INTENT_FOOD_WASTE = 'FOOD_WASTE'
INTENT_GENERAL_SUSTAINABILITY = 'GENERAL_SUSTAINABILITY'

_INTENT_MAP: list[tuple[str, list[str], str]] = [
    (
        INTENT_RECYCLING,
        ['recycle', 'recycling', 'battery', 'ewaste', 'e-waste', 'phone', 'disposal', 'dispose',
         'plastic bag', 'bin', 'waste', 'rubbish', 'segregation', 'segregate', 'hazard', 'electronic waste'],
        'recycling',
    ),
    (
        INTENT_GOVERNMENT_SCHEMES,
        [
            'scheme', 'government', 'solar', 'subsidy', 'fame', 'surya', 'swachh',
            'incentive', 'apply', 'eligibility', 'grant', 'muft bijli', 'ev subsidy',
            'scholarship', 'scholarships', 'jnanabhumi', 'jnana bhumi', 'student', 'students',
            'tuition', 'fee reimbursement', 'post-matric', 'college', 'vidya deevena', 'vasathi deevena',
            'internship', 'internships', 'pm internship', 'intern', 'youth', 'stipend',
            'farmer', 'farmers', 'agriculture', 'pm-kisan', 'pm kisan', 'kisan', 'crop', 'kusum',
            'pm-kusum', 'pmkusum', 'irrigation', 'pump', 'welfare', 'benefits', 'government scheme',
            'government schemes', 'yojana', 'mission', 'portal', 'ebus', 'ujjwala', 'amrit sarovar',
            'jal jeevan', 'kaushal vikas', 'skill development', 'pmkvy',
            'aicte', 'pragati', 'saksham', 'swanath', 'myscheme', 'india.gov', 'ncs', 'career',
            'job', 'jobs', 'employment', 'skill india', 'naps', 'apprenticeship', 'fasal bima',
            'pmfby', 'crop insurance', 'per drop more crop', 'organic', 'pkvy', 'soil health',
            'aif', 'kmy', 'clean air', 'ncap', 'prana', 'namami gange', 'ganga', 'mudra',
            'startup', 'standup', 'svanidhi', 'vishwakarma', 'msme', 'yasasvi', 'meeseva',
            'rythu bharosa', 'annadata', 'nredcap'
        ],
        'government_schemes',
    ),
    (
        INTENT_ECO_TRAVEL,
        ['travel', 'commute', 'transport', 'bus', 'metro', 'cycle', 'cycling',
         'walk', 'walking', 'carpool', 'car', 'trip', 'transit', 'commuter', 'ebus', 'mobility'],
        'eco_travel',
    ),
    (
        INTENT_ECO_PRODUCTS,
        ['product', 'buy', 'purchase', 'bottle', 'appliance', 'packaging',
         'reusable', 'sustainable product', 'material', 'durable', 'greenwashing', 'bldc'],
        'eco_products',
    ),
    (
        INTENT_ENERGY,
        ['electricity', 'energy', 'power', 'lights', 'appliance', 'ac', 'fan',
         'led', 'solar', 'watt', 'kwh', 'bee', 'star rating'],
        'sustainable_living',
    ),
    (
        INTENT_WATER,
        ['water', 'tap', 'leak', 'rainwater', 'irrigation', 'bath', 'shower',
         'washing', 'laundry', 'ro reject', 'aerator', 'jal jeevan', 'namami gange'],
        'sustainable_living',
    ),
    (
        INTENT_FOOD_WASTE,
        ['food', 'waste', 'leftovers', 'compost', 'meal', 'fridge', 'expiry',
         'cooking', 'plate', 'portion', 'bokashi', 'fifo'],
        'sustainable_living',
    ),
    (
        INTENT_SUSTAINABLE_LIVING,
        ['plastic', 'reduce', 'waste', 'lifestyle', 'habit', 'daily',
         'household', 'sustainability', 'mission life'],
        'sustainable_living',
    ),
]


@dataclass
class Document:
    title: str
    category: str
    content: str
    source: str
    source_url: str | None
    organization: str | None
    date: str | None
    location: str | None
    verification_status: str
    file_path: str
    summary: str | None = None
    subcategory: str | None = None
    target_group: str | None = None
    last_verified: str | None = None
    priority: int = 7
    status: str = "Active"
    score: float = 0.0

    def to_dict(self) -> dict[str, Any]:
        return {
            'title': self.title,
            'category': self.category,
            'subcategory': self.subcategory,
            'target_group': self.target_group,
            'content': self.content,
            'source': self.source,
            'source_url': self.source_url,
            'organization': self.organization,
            'date': self.date,
            'last_verified': self.last_verified,
            'location': self.location,
            'summary': self.summary,
            'priority': self.priority,
            'status': self.status,
            'verification_status': 'Verified Source',
            'file_path': self.file_path,
        }


class RetrievalService:
    def __init__(self, knowledge_root: str | None = None):
        self.vector_store = VectorStore()
        if self.vector_store.collection.count() == 0:
            self.vector_store.ingest()

    def detect_intent(self, query: str) -> str:
        """Classify user query into one of 9 environmental domains."""
        q_lower = query.lower()
        best_intent = INTENT_GENERAL_SUSTAINABILITY
        best_score = 0

        for intent_label, keywords, _ in _INTENT_MAP:
            score = 0
            for kw in keywords:
                if ' ' in kw:
                    if kw in q_lower:
                        score += 3
                elif re.search(r'\b' + re.escape(kw) + r'\b', q_lower):
                    score += 1
            if score > best_score:
                best_score = score
                best_intent = intent_label

        return best_intent

    def retrieve(self, query: str, location: str | None = None, top_k: int = 5) -> list[Document]:
        """Retrieve priority-ranked documents matching the semantic query and location."""
        start_time = time.perf_counter()
        intent = self.detect_intent(query)
        target_category = None
        for intent_label, _, cat in _INTENT_MAP:
            if intent_label == intent:
                target_category = cat
                break

        effective_loc = location
        q_lower = query.lower()
        if not effective_loc:
            if any(k in q_lower for k in ["jnanabhumi", "jnana bhumi", "meeseva", "annadata", "rythu bharosa", "nredcap", "vidya deevena", "vasathi deevena"]):
                effective_loc = "Andhra Pradesh"
            else:
                for loc_candidate in ["andhra pradesh", "andhra", "kurnool", "delhi", "maharashtra", "karnataka", "telangana", "tamil nadu"]:
                    if loc_candidate in q_lower:
                        effective_loc = loc_candidate.title()
                        break

        chunks = self.vector_store.search(
            query=query,
            location=effective_loc,
            category=target_category if target_category != 'sustainable_living' else None,
            top_k=top_k,
        )

        if len(chunks) < 2 and target_category:
            broad_chunks = self.vector_store.search(
                query=query,
                location=effective_loc,
                category=None,
                top_k=top_k,
            )
            for bc in broad_chunks:
                if not any(c.title == bc.title for c in chunks):
                    chunks.append(bc)

        docs: list[Document] = []
        for c in chunks[:top_k]:
            docs.append(
                Document(
                    title=c.title,
                    category=c.category,
                    subcategory=c.subcategory,
                    target_group=c.target_group,
                    content=c.content,
                    source=c.source,
                    source_url=c.source_url,
                    organization=c.organization,
                    date=c.date,
                    last_verified=c.last_verified,
                    location=c.location,
                    summary=c.summary,
                    priority=c.priority,
                    status=c.status,
                    verification_status="Verified Source",
                    file_path=c.chunk_id,
                    score=c.score,
                )
            )

        duration_ms = (time.perf_counter() - start_time) * 1000.0
        monitor.record_query(
            query=query,
            intent=intent,
            location=effective_loc,
            doc_count=len(docs),
            duration_ms=duration_ms,
        )
        return docs

    def retrieve_by_category(self, category: str, top_k: int = 10) -> list[Document]:
        """Retrieve documents belonging to a specific sustainability category."""
        chunks = self.vector_store.search(
            query=category.replace("_", " "),
            category=category,
            top_k=top_k,
        )
        return [
            Document(
                title=c.title,
                category=c.category,
                subcategory=c.subcategory,
                target_group=c.target_group,
                content=c.content,
                source=c.source,
                source_url=c.source_url,
                organization=c.organization,
                date=c.date,
                last_verified=c.last_verified,
                location=c.location,
                summary=c.summary,
                priority=c.priority,
                status=c.status,
                verification_status="Verified Source",
                file_path=c.chunk_id,
                score=c.score,
            )
            for c in chunks
        ]

    def get_sources(self) -> list[dict[str, Any]]:
        """Return all unique verified sources."""
        return self.vector_store.get_all_sources()

    def get_source_registry(self) -> list[dict[str, Any]]:
        """Return full source registry for Admin."""
        return self.vector_store.get_source_registry()

    def update_source_status(self, doc_id: str, new_status: str) -> bool:
        """Update source status for Admin."""
        return self.vector_store.update_source_status(doc_id, new_status)

    def get_categories(self) -> list[str]:
        return [
            'sustainable_living',
            'recycling',
            'eco_products',
            'government_schemes',
            'eco_travel',
        ]

    def reindex(self, target_domain: str | None = None) -> dict[str, Any]:
        """Re-ingest knowledge documents with optional domain filter."""
        res = self.vector_store.ingest(target_domain=target_domain)
        monitor.record_event(
            event_type="reindex",
            details=f"Reindexed {res.get('documents_indexed')} documents ({res.get('chunks_indexed')} chunks) for domain '{target_domain or 'all'}'",
            status="success",
        )
        return res


# Global singleton
retriever = RetrievalService()
