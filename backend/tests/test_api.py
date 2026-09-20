"""
API tests for the Eco Lifestyle Agent backend using FastAPI TestClient.

Run with:
    pytest tests/test_api.py -v
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    """Provide a TestClient instance for the test suite."""
    with TestClient(app) as c:
        yield c


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

def test_health_endpoint(client: TestClient):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'ok'
    assert data['rag_engine'] == 'ChromaDB'
    assert 'granite_configured' in data
    assert 'model_id' in data


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

def test_chat_with_plastic_question(client: TestClient):
    payload = {'message': 'How can I reduce plastic use at home?', 'location': 'Kurnool'}
    response = client.post('/api/chat', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 'answer' in data
    assert isinstance(data['answer'], str) and len(data['answer']) > 0
    assert 'actions' in data
    assert isinstance(data['actions'], list)
    assert 'sources' in data
    assert isinstance(data['sources'], list)
    assert len(data['sources']) > 0
    assert 'intent' in data
    assert 'confidence' in data
    assert 'model' in data
    assert data.get('demo_mode') is False


def test_chat_with_recycling_question(client: TestClient):
    payload = {'message': 'How do I recycle old batteries?', 'location': 'Mumbai'}
    response = client.post('/api/chat', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 'answer' in data
    assert data['intent'] == 'RECYCLING'
    assert len(data['actions']) >= 1
    assert len(data['sources']) >= 1


def test_chat_empty_message_returns_400(client: TestClient):
    response = client.post('/api/chat', json={'message': '   ', 'location': 'Delhi'})
    assert response.status_code == 400
    assert 'empty' in response.json()['detail'].lower()


# ---------------------------------------------------------------------------
# Retrieve
# ---------------------------------------------------------------------------

def test_retrieve_endpoint(client: TestClient):
    response = client.post('/api/retrieve', json={'query': 'battery recycling', 'location': 'Kurnool'})
    assert response.status_code == 200
    data = response.json()
    assert 'documents' in data
    assert 'count' in data
    assert isinstance(data['documents'], list)


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

def test_categories_endpoint(client: TestClient):
    response = client.get('/api/categories')
    assert response.status_code == 200
    data = response.json()
    assert 'categories' in data
    categories = data['categories']
    assert isinstance(categories, list)
    assert 'recycling' in categories
    assert 'sustainable_living' in categories


# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------

def test_sources_endpoint(client: TestClient):
    response = client.get('/api/sources')
    assert response.status_code == 200
    data = response.json()
    assert 'sources' in data
    assert isinstance(data['sources'], list)
    assert len(data['sources']) > 0


# ---------------------------------------------------------------------------
# Actions
# ---------------------------------------------------------------------------

def test_actions_endpoint(client: TestClient):
    response = client.get('/api/actions')
    assert response.status_code == 200
    data = response.json()
    assert 'actions' in data
    actions = data['actions']
    assert isinstance(actions, list)
    assert len(actions) >= 8
    # Validate structure of each action
    required_fields = {'title', 'description', 'why', 'difficulty', 'category'}
    for action in actions:
        assert required_fields.issubset(action.keys()), f'Action missing fields: {action}'


# ---------------------------------------------------------------------------
# Travel
# ---------------------------------------------------------------------------

def test_travel_endpoint(client: TestClient):
    response = client.get('/api/travel')
    assert response.status_code == 200
    data = response.json()
    assert 'modes' in data
    assert 'disclaimer' in data
    modes = data['modes']
    assert isinstance(modes, list)
    assert len(modes) == 4
    mode_names = {m['mode'] for m in modes}
    assert 'Walking' in mode_names
    assert 'Cycling' in mode_names
    assert 'Public Transport' in mode_names
    assert 'Carpool' in mode_names
    for mode in modes:
        assert 'tips' in mode
        assert isinstance(mode['tips'], list)
        assert len(mode['tips']) >= 1


# ---------------------------------------------------------------------------
# Schemes
# ---------------------------------------------------------------------------

def test_schemes_endpoint(client: TestClient):
    response = client.get('/api/schemes')
    assert response.status_code == 200
    data = response.json()
    assert 'schemes' in data
    assert isinstance(data['schemes'], list)
    for scheme in data['schemes']:
        assert scheme.get('category') == 'government_schemes'


# ---------------------------------------------------------------------------
# Admin Endpoints (Vector Store Diagnostics & Re-indexing)
# ---------------------------------------------------------------------------

def test_admin_stats_endpoint(client: TestClient):
    response = client.get('/api/admin/stats')
    assert response.status_code == 200
    data = response.json()
    assert 'engine' in data
    assert 'ChromaDB' in data['engine']
    assert 'total_chunks' in data
    assert data['total_chunks'] > 0
    assert 'total_documents' in data
    assert data['total_documents'] > 0
    assert 'categories' in data
    assert isinstance(data['categories'], dict)
    assert 'granite_configured' in data
    assert 'model_id' in data


def test_admin_reindex_endpoint(client: TestClient):
    response = client.post('/api/admin/reindex')
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'success'
    assert data['documents_indexed'] >= 20
    assert data['chunks_indexed'] >= 50
    assert isinstance(data['categories'], list)
    assert 'recycling' in data['categories']
