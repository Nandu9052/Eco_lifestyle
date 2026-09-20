from dataclasses import dataclass, field
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    location: str | None = None
    preferences: dict[str, Any] = Field(default_factory=dict)


class RetrievalRequest(BaseModel):
    query: str = Field(..., min_length=1)
    location: str | None = None


class SourceItem(BaseModel):
    title: str
    category: str
    subcategory: str | None = None
    target_group: str | None = None
    source: str
    source_url: str | None = None
    organization: str | None = None
    date: str | None = None
    last_verified: str | None = None
    location: str | None = None
    summary: str | None = None
    verification_status: str = 'Verified Source'


class ActionItem(BaseModel):
    title: str
    description: str
    why: str
    difficulty: str


class ChatResponse(BaseModel):
    answer: str
    actions: list[ActionItem]
    sources: list[SourceItem]
    intent: str
    confidence: str
    model: str = 'granite'
    demo_mode: bool = False
    retrieved_topics: list[str] = []
    reason_for_recommendation: str = ''


class AdminStatsResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    engine: str
    embedding_model: str
    collection_name: str
    total_chunks: int
    total_documents: int
    total_sources: int = 0
    total_schemes: int = 0
    total_services: int = 0
    categories: dict[str, int]
    subcategories: dict[str, int] = Field(default_factory=dict)
    persist_directory: str
    granite_configured: bool
    model_id: str
    last_indexed_time: str = ""
    granite_metrics: dict[str, Any] = Field(default_factory=dict)


class AdminLoginRequest(BaseModel):
    key: str


class AdminVerifySourceRequest(BaseModel):
    doc_id: str | None = None
    source_title: str | None = None
    status: str | None = None
    verified: bool | None = None
    notes: str | None = None


class ReindexResponse(BaseModel):
    status: str
    documents_indexed: int
    chunks_indexed: int
    categories: list[str]
    subcategories: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Travel mode dataclass
# ---------------------------------------------------------------------------

@dataclass
class TravelMode:
    """Represents a single eco-friendly travel mode with comparison metadata."""
    mode: str
    icon: str
    best_for: str
    emission: str
    tips: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            'mode': self.mode,
            'icon': self.icon,
            'best_for': self.best_for,
            'emission': self.emission,
            'tips': self.tips,
        }


# ---------------------------------------------------------------------------
# User profile schemas
# ---------------------------------------------------------------------------

class UserProfile(BaseModel):
    """Optional user profile for personalising recommendations."""
    location: str | None = None
    user_type: str | None = None          # e.g. 'student', 'professional', 'family'
    goals: list[str] = Field(default_factory=list)  # e.g. ['reduce_plastic', 'save_energy']
    travel_preference: str | None = None  # e.g. 'cycling', 'public_transport'
    lifestyle_preference: str | None = None  # e.g. 'vegan', 'minimalist'


class ProfileUpdateRequest(BaseModel):
    """Request body for creating or updating a user profile."""
    location: str | None = None
    user_type: str | None = None
    goals: list[str] | None = None
    travel_preference: str | None = None
    lifestyle_preference: str | None = None
