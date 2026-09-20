# ==============================================================================
# Stage 1: Build React Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Backend + Static Asset Server
# ==============================================================================
FROM python:3.11-slim AS runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy application code and knowledge base
COPY backend/ ./backend/
COPY knowledge_base/ ./knowledge_base/

# Pre-cache ONNX model and build ChromaDB during Docker build phase
# (Docker build has high memory limits, preventing runtime OOM on Render 512MB free tier)
RUN python -c "import chromadb; from chromadb.utils import embedding_functions; fn = embedding_functions.DefaultEmbeddingFunction(); fn(['warmup'])" && \
    python -c "import sys; sys.path.insert(0, 'backend'); from app.rag.vector_store import VectorStore; vs = VectorStore(persist_directory='backend/data/chroma_db'); vs.ingest(kb_dir='knowledge_base')"

# Copy compiled frontend dist from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist


# Expose default port
EXPOSE 8000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

# Start Uvicorn server dynamically binding to Render's assigned $PORT
CMD ["sh", "-c", "uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}"]
