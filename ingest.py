"""
Root ingestion entrypoint for Eco Lifestyle Agent.

Usage:
    python ingest.py
"""

import sys
from pathlib import Path

# Add backend directory to path
project_root = Path(__file__).resolve().parent
backend_dir = project_root / "backend"
sys.path.insert(0, str(backend_dir))

from app.rag.vector_store import VectorStore


def main():
    print("=" * 60)
    print(" ECO LIFESTYLE AGENT - KNOWLEDGE BASE INGESTION")
    print("=" * 60)

    kb_dir = project_root / "knowledge_base"
    print(f"Reading knowledge base from: {kb_dir}")

    if not kb_dir.exists():
        print(f"Error: Knowledge base directory not found at {kb_dir}")
        sys.exit(1)

    vector_store = VectorStore()
    print("Initializing ChromaDB embedding pipeline...")
    result = vector_store.ingest(kb_dir)

    print("\nIngestion Summary:")
    print(f" - Status:             {result.get('status')}")
    print(f" - Documents Indexed:  {result.get('documents_indexed')}")
    print(f" - Chunks Indexed:     {result.get('chunks_indexed')}")
    print(f" - Categories:         {', '.join(result.get('categories', []))}")
    print(f" - Vector Store Path:  {vector_store.persist_directory}")
    print("\nKnowledge Base is now fully indexed and ready for semantic vector search!\n")


if __name__ == "__main__":
    main()
