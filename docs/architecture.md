# Eco Lifestyle Agent — System Architecture

This document describes the architectural design and component interactions of the **Eco Lifestyle Agent**.

```
+-------------------------------------------------------------------------+
|                              FRONTEND LAYER                             |
|    React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router 7      |
+-------------------------------------------------------------------------+
       |                                                 ^
       | HTTP POST /api/chat                             | JSON Response
       | HTTP GET  /api/sources, /api/schemes, etc.      |
       | HTTP POST /api/admin/reindex, etc.              |
       v                                                 |
+-------------------------------------------------------------------------+
|                               BACKEND API                               |
|                         FastAPI + Uvicorn Core                          |
+-------------------------------------------------------------------------+
       |                                                 |
       v                                                 v
+-------------------------------+       +---------------------------------+
|     RAG RETRIEVAL SERVICE     |       |       AI SERVICE ABSTRACTION    |
|   (app/rag/retriever.py)      |       |      (app/ai/service.py)        |
+-------------------------------+       +---------------------------------+
| - 9-Domain Intent Detection   |       | - AIService Interface           |
| - VectorStore Integration     |       | - GraniteAIService              |
| - Category & Location Boost   |       |   (IBM Watson Machine Learning /|
+-------------------------------+       |    watsonx.ai Text Generation)  |
       |                                +---------------------------------+
       v                                                 ^
+-------------------------------+                        |
|      CHROMADB VECTOR STORE    |                        |
|   (app/rag/vector_store.py)   |                        |
+-------------------------------+                        |
| - Persistent Collection       |                        |
| - ONNX all-MiniLM-L6-v2 Embed | -----------------------+
| - Overlapping Chunking        |
| - Dense Cosine Search         |
+-------------------------------+
       ^
       | Ingestion Engine (backend/ingest.py)
+-------------------------------+
|        KNOWLEDGE BASE         |
|  (Markdown with YAML Metadata)|
+-------------------------------+
| /sustainable_living           |
| /recycling                    |
| /eco_products                 |
| /government_schemes           |
| /eco_travel                   |
+-------------------------------+
```

---

## Component Details

### 1. Frontend Client
- **Architecture**: Single Page Application (SPA) driven by React Router.
- **Styling**: Tailwind CSS v4 using CSS theme tokens and dark eco palette.
- **State Management**: React custom hooks (`useChat`, `useProfile`) with browser `localStorage` caching for zero-friction user personalization.
- **Service Layer**: Centralized, typed API client (`frontend/src/services/api.ts`) managing all backend communications.

### 2. Backend API
- **Framework**: FastAPI with asynchronous routing and automatic OpenAPI/Swagger documentation.
- **Data Validation**: Pydantic v2 schemas enforcing strict request and response contracts (`ChatRequest`, `ChatResponse`, `AdminStatsResponse`, `ReindexResponse`).
- **Error Handling**: Graceful degradation—empty queries return 400 Bad Request; errors yield structured JSON with clear logging without silent mock fallbacks.

### 3. ChromaDB Vector Store & RAG Retrieval Engine
- **Corpus**: 26 curated Markdown documents across 5 sustainability categories (SWM Rules 2016, BEE Star Rating, CPCB E-Waste Rules 2022, MNRE PM Surya Ghar, FAME/EMPS, etc.).
- **Chunking**: Overlapping paragraph chunking (600 characters target, 100 characters overlap) preserving semantic cohesion across headings and lists.
- **Vector Embeddings**: Local, high-performance ONNX embeddings using `all-MiniLM-L6-v2` (384 dimensions) requiring zero cloud external dependency for embedding calculation.
- **Intent-Based Search**: 9-domain regex keyword classification boosts relevant categories during ChromaDB semantic similarity queries.
- **Location Boosting**: Geographic alignment bonus (+0.2 similarity) for regional recommendations (e.g., Delhi, Kurnool, Mumbai).

### 4. AI Service Layer (`GraniteAIService`)
- **Model**: `ibm/granite-3-8b-instruct` (or configured IBM Granite model via IBM Watson Machine Learning / watsonx.ai).
- **Authentication**: IAM token exchange via IBM Cloud IAM or bearer token authentication.
- **Prompt Grounding**: Context-bounded system prompt instructing the model to synthesize answers solely from retrieved factual context and refuse speculative fabrication.
- **Responsible Degradation**: If IBM credentials are missing or unreachable, the service transparently serves verified extracted context directly from ChromaDB without mock models or fabricated responses.
