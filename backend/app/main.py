from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.ai.service import get_ai_service
from app.config import settings
from app.models.schemas import (
    AdminLoginRequest,
    AdminStatsResponse,
    AdminVerifySourceRequest,
    ChatRequest,
    ChatResponse,
    ReindexResponse,
    RetrievalRequest,
)
from app.monitoring import monitor
from app.rag.retriever import retriever

app = FastAPI(title='Eco Lifestyle Agent API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def verify_admin(
    x_admin_key: str | None = Header(default=None, alias="X-Admin-Key"),
    authorization: str | None = Header(default=None),
) -> bool:
    """Validate administrator key for all admin control endpoints."""
    provided = x_admin_key
    if not provided and authorization:
        if authorization.startswith("Bearer "):
            provided = authorization.replace("Bearer ", "").strip()
        else:
            provided = authorization.strip()
    if not provided or provided != settings.admin_key:
        raise HTTPException(status_code=403, detail="Forbidden: Administrator credentials required.")
    return True



@app.on_event("startup")
def on_startup():
    """Ensure ChromaDB knowledge base is populated on startup."""
    try:
        col = retriever.vector_store.collection
        if col.count() == 0:
            print("[INFO] ChromaDB is empty on startup. Auto-ingesting knowledge base...")
            retriever.vector_store.ingest()
            print("[INFO] Knowledge base auto-ingestion completed.")
    except Exception as exc:
        print(f"[WARNING] Startup knowledge base check: {exc}")


@app.get('/api/health')
def health() -> dict[str, Any]:
    return {
        'status': 'ok',
        'service': 'eco-agent',
        'rag_engine': 'ChromaDB',
        'granite_configured': settings.granite_configured,
        'model_id': settings.granite_model_id,
        'demo_mode': False,
    }


@app.post('/api/admin/login')
def admin_login(payload: AdminLoginRequest) -> dict[str, Any]:
    """Verify admin key and authenticate admin session."""
    if payload.key.strip() == settings.admin_key:
        return {"status": "authenticated", "token": settings.admin_key}
    raise HTTPException(status_code=403, detail="Invalid admin passkey.")


@app.get('/api/admin/stats', response_model=AdminStatsResponse)
def admin_stats(_: bool = Depends(verify_admin)) -> dict[str, Any]:
    """Secured admin diagnostics endpoint."""
    stats = retriever.vector_store.get_stats()
    stats['granite_configured'] = settings.granite_configured
    stats['model_id'] = settings.granite_model_id
    stats['granite_metrics'] = monitor.get_granite_metrics()
    return stats


@app.get('/api/admin/sources')
def admin_sources(_: bool = Depends(verify_admin)) -> dict[str, Any]:
    """Return priority-ranked source registry for Admin."""
    return {"sources": retriever.get_source_registry()}


@app.get('/api/admin/logs')
def admin_logs(_: bool = Depends(verify_admin)) -> list[dict[str, Any]]:
    """Return RAG queries, latencies, and error telemetry logs for Admin."""
    return monitor.get_logs()


@app.post('/api/admin/verify-source')
def admin_verify_source(payload: AdminVerifySourceRequest, _: bool = Depends(verify_admin)) -> dict[str, Any]:
    """Update source verification status."""
    target = payload.source_title or payload.doc_id or ""
    new_status = payload.status
    if not new_status:
        new_status = "Active" if payload.verified else "Unverified"
    if not target:
        raise HTTPException(status_code=400, detail="Missing target source title or doc_id.")
    success = retriever.update_source_status(target, new_status)
    return {"status": "updated", "target": target, "new_status": new_status, "success": success}


@app.post('/api/admin/reindex', response_model=ReindexResponse)
def admin_reindex(domain: str | None = None, _: bool = Depends(verify_admin)) -> dict[str, Any]:
    """Targeted or full knowledge base re-indexing."""
    try:
        result = retriever.reindex(target_domain=domain)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Reindexing failed: {exc}') from exc


@app.post('/api/retrieve')
def retrieve(payload: RetrievalRequest) -> dict[str, Any]:
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail='Query cannot be empty.')

    try:
        documents = retriever.retrieve(payload.query, payload.location or None, top_k=5)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Retrieval error: {exc}') from exc

    if not documents:
        return {'documents': [], 'count': 0, 'message': 'No relevant documents found.'}

    return {'documents': [doc.to_dict() for doc in documents], 'count': len(documents)}


@app.post('/api/chat', response_model=ChatResponse)
def chat(payload: ChatRequest) -> dict[str, Any]:
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail='Question cannot be empty.')

    try:
        documents = retriever.retrieve(message, payload.location or None, top_k=5)
        ai_service = get_ai_service()
        result = ai_service.generate(message, documents, payload.location, payload.preferences)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Chat processing error: {exc}') from exc

    return {
        'answer': result['answer'],
        'actions': result['actions'],
        'sources': result['sources'],
        'intent': result['intent'],
        'confidence': result['confidence'],
        'model': result.get('model', settings.granite_model_id),
        'demo_mode': False,
        'retrieved_topics': result.get('retrieved_topics', []),
        'reason_for_recommendation': result.get('reason_for_recommendation', 'Information is grounded in retrieved documents.'),
    }


@app.get('/api/categories')
def categories() -> dict[str, Any]:
    return {'categories': ['sustainable_living', 'recycling', 'eco_products', 'government_schemes', 'eco_travel']}


@app.get('/api/sources')
def sources() -> dict[str, Any]:
    return {'sources': retriever.get_sources()}


@app.get('/api/recycling')
def recycling() -> dict[str, Any]:
    docs = retriever.retrieve_by_category('recycling')
    return {'recycling': [doc.to_dict() for doc in docs]}


@app.get('/api/schemes')
def schemes() -> dict[str, Any]:
    docs = retriever.retrieve_by_category('government_schemes')
    return {'schemes': [doc.to_dict() for doc in docs]}


@app.get('/api/actions')
def actions() -> dict[str, Any]:
    return {
        'actions': [
            {
                'title': 'Carry a reusable bottle',
                'description': 'Keep a refillable water bottle with you at all times.',
                'why': 'Reduces single-use plastic and avoids convenience waste.',
                'difficulty': 'Easy',
                'category': 'sustainable_living',
            },
            {
                'title': 'Switch off unnecessary lights',
                'description': 'Turn off lights and appliances when leaving a room.',
                'why': 'Saves electricity and reduces your household carbon footprint.',
                'difficulty': 'Easy',
                'category': 'sustainable_living',
            },
            {
                'title': 'Sort e-waste correctly',
                'description': 'Drop old batteries and electronics at certified collection points.',
                'why': 'Prevents hazardous materials from entering landfills and water supplies.',
                'difficulty': 'Medium',
                'category': 'recycling',
            },
            {
                'title': 'Plan meals to reduce food waste',
                'description': 'Write a weekly meal plan and shop only for what you need.',
                'why': 'Food waste is a major source of avoidable greenhouse gas emissions.',
                'difficulty': 'Easy',
                'category': 'sustainable_living',
            },
            {
                'title': 'Use public transport or carpool',
                'description': 'Choose shared travel for commutes and longer journeys.',
                'why': 'Distributes emissions across more passengers and reduces traffic.',
                'difficulty': 'Medium',
                'category': 'eco_travel',
            },
            {
                'title': 'Fix dripping taps',
                'description': 'Repair leaking taps and pipes as soon as they are noticed.',
                'why': 'A dripping tap can waste thousands of litres of water per year.',
                'difficulty': 'Easy',
                'category': 'sustainable_living',
            },
            {
                'title': 'Compost kitchen scraps',
                'description': 'Compost vegetable peels, coffee grounds, and eggshells at home.',
                'why': 'Composting diverts organic waste from landfill and enriches soil.',
                'difficulty': 'Medium',
                'category': 'sustainable_living',
            },
            {
                'title': 'Check government eco-schemes',
                'description': 'Look up local subsidies for solar panels, EV charging, or energy-efficient appliances.',
                'why': 'Government incentives can significantly lower the cost of sustainable upgrades.',
                'difficulty': 'Medium',
                'category': 'government_schemes',
            },
        ]
    }


@app.get('/api/travel')
def travel() -> dict[str, Any]:
    return {
        'modes': [
            {
                'mode': 'Walking',
                'icon': '🚶',
                'best_for': '< 2km',
                'emission': 'Zero',
                'tips': [
                    'Choose walking routes with shade or covered paths in hot weather.',
                    'Use a comfortable backpack to carry essentials hands-free.',
                    'Track steps with a free app to stay motivated.',
                ],
            },
            {
                'mode': 'Cycling',
                'icon': '🚲',
                'best_for': '2-10km',
                'emission': 'Near-zero',
                'tips': [
                    'Keep tyres inflated for lower rolling resistance and easier pedalling.',
                    'Plan a cycle-safe route before your first commute.',
                    'Use a front basket or panniers to avoid carrying a heavy backpack.',
                ],
            },
            {
                'mode': 'Public Transport',
                'icon': '🚌',
                'best_for': 'Any distance',
                'emission': 'Low',
                'tips': [
                    'Use a rechargeable smart card to save time and often money.',
                    'Travel outside peak hours when possible to reduce crowding.',
                    'Combine bus or metro with a short walk to maximise efficiency.',
                ],
            },
            {
                'mode': 'Carpool',
                'icon': '🚗',
                'best_for': 'Long distance',
                'emission': 'Medium',
                'tips': [
                    'Share fuel costs equally using a simple per-kilometre split.',
                    'Agree on pickup and drop-off points in advance to save detour time.',
                    'Use a dedicated carpool app to find reliable co-passengers.',
                ],
            },
        ],
        'disclaimer': (
            'Recommendations based on general sustainable transportation principles. '
            'Actual options depend on local infrastructure.'
        ),
    }


# Production SPA & Static Assets Serving for unified Render / Docker deployment
def _resolve_frontend_dist() -> Path | None:
    candidates = [
        Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
        Path("/app/frontend/dist"),
        Path("frontend/dist").resolve(),
    ]
    for c in candidates:
        if c.exists() and (c / "index.html").exists():
            return c
    return None


frontend_dist = _resolve_frontend_dist()
if frontend_dist:
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(str(frontend_dist / "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API route not found.")
        file_path = frontend_dist / full_path
        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(frontend_dist / "index.html"))
else:
    @app.get('/')
    def root() -> dict[str, str]:
        return {'message': 'Eco Lifestyle Agent backend is running.'}


