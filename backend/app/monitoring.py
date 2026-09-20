import time
from collections import deque
from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class SystemEvent:
    timestamp: str
    event_type: str  # 'rag_retrieval', 'granite_inference', 'reindex', 'system_error'
    query: str | None = None
    intent: str | None = None
    location: str | None = None
    details: str = ""
    duration_ms: float = 0.0
    status: str = "success"  # 'success', 'warning', 'error'
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class MonitorService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MonitorService, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        self._events: deque[SystemEvent] = deque(maxlen=200)
        self.total_queries: int = 0
        self.granite_calls: int = 0
        self.granite_errors: int = 0
        self.last_granite_success: str | None = None
        self.last_latency_ms: float = 0.0
        self.latencies: list[float] = []

    def record_event(
        self,
        event_type: str,
        query: str | None = None,
        intent: str | None = None,
        location: str | None = None,
        details: str = "",
        duration_ms: float = 0.0,
        status: str = "success",
        metadata: dict[str, Any] | None = None,
    ) -> SystemEvent:
        event = SystemEvent(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            event_type=event_type,
            query=query,
            intent=intent,
            location=location,
            details=details,
            duration_ms=round(duration_ms, 2),
            status=status,
            metadata=metadata or {},
        )
        self._events.appendleft(event)
        return event

    def record_query(self, query: str, intent: str, location: str | None, doc_count: int, duration_ms: float):
        self.total_queries += 1
        self.record_event(
            event_type="rag_retrieval",
            query=query,
            intent=intent,
            location=location,
            details=f"Retrieved {doc_count} verified knowledge documents",
            duration_ms=duration_ms,
            status="success" if doc_count > 0 else "warning",
            metadata={"doc_count": doc_count},
        )

    def record_granite(self, query: str, model_id: str, success: bool, duration_ms: float, error_msg: str | None = None):
        self.granite_calls += 1
        self.last_latency_ms = round(duration_ms, 2)
        self.latencies.append(duration_ms)
        if len(self.latencies) > 50:
            self.latencies.pop(0)

        if success:
            self.last_granite_success = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.record_event(
                event_type="granite_inference",
                query=query,
                details=f"Grounded response generated using {model_id} ({round(duration_ms, 1)}ms)",
                duration_ms=duration_ms,
                status="success",
                metadata={"model_id": model_id},
            )
        else:
            self.granite_errors += 1
            self.record_event(
                event_type="granite_inference",
                query=query,
                details=f"Granite API error: {error_msg or 'Inference failure'}",
                duration_ms=duration_ms,
                status="error",
                metadata={"model_id": model_id, "error": error_msg},
            )

    def get_logs(self, limit: int = 50) -> list[dict[str, Any]]:
        return [e.to_dict() for e in list(self._events)[:limit]]

    def get_granite_metrics(self) -> dict[str, Any]:
        avg_latency = round(sum(self.latencies) / len(self.latencies), 1) if self.latencies else 0.0
        return {
            "total_calls": self.granite_calls,
            "error_count": self.granite_errors,
            "last_successful_request": self.last_granite_success,
            "last_latency_ms": self.last_latency_ms,
            "avg_latency_ms": avg_latency,
        }


monitor = MonitorService()
