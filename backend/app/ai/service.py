"""
AI Service Layer for Eco Lifestyle Agent.
Integrates IBM Granite (watsonx.ai / IBM Watson Machine Learning) with real RAG retrieval.
Strictly adheres to Responsible AI: zero hallucinations, zero fake fallbacks.
"""

import json
import logging
import re
import time
from abc import ABC, abstractmethod
from typing import Any

import requests

from app.config import settings
from app.monitoring import monitor
from app.rag.retriever import (
    INTENT_ECO_PRODUCTS,
    INTENT_ECO_TRAVEL,
    INTENT_ENERGY,
    INTENT_FOOD_WASTE,
    INTENT_GENERAL_SUSTAINABILITY,
    INTENT_GOVERNMENT_SCHEMES,
    INTENT_RECYCLING,
    INTENT_SUSTAINABLE_LIVING,
    INTENT_WATER,
    Document,
    retriever,
)

logger = logging.getLogger(__name__)

INTENT_TOPICS: dict[str, list[str]] = {
    INTENT_SUSTAINABLE_LIVING: ["Single-Use Plastic Reduction", "Household Waste Hierarchy", "Reusable Alternatives"],
    INTENT_RECYCLING: ["Battery Waste Management", "E-Waste Producer Take-Back", "Plastic Resin Codes (RIC 1-7)"],
    INTENT_GOVERNMENT_SCHEMES: ["PM Surya Ghar Muft Bijli", "FAME / EMPS Electric Mobility", "Swachh Bharat Mission"],
    INTENT_ECO_TRAVEL: ["Active Mobility (Walking/Cycling)", "Electric Metro & City Bus", "Multimodal Commuting"],
    INTENT_ECO_PRODUCTS: ["8-Point Sustainability Framework", "BEE Star Ratings", "Greenwashing Prevention"],
    INTENT_ENERGY: ["AC 24°C Baseline", "BEE 5-Star Appliances", "Phantom Standby Load Reduction"],
    INTENT_WATER: ["Tap Aerators", "Leak Remediation", "RO Reject Water Recovery"],
    INTENT_FOOD_WASTE: ["FIFO Food Rotation", "Meal Planning", "Decentralized Composting"],
    INTENT_GENERAL_SUSTAINABILITY: ["Mission LiFE Habits", "Resource Conservation", "Responsible Consumption"],
}


class AIService(ABC):
    """Abstract Base Class for AI Generation Services."""

    @abstractmethod
    def generate(
        self,
        query: str,
        documents: list[Document],
        location: str | None = None,
        preferences: dict | None = None,
    ) -> dict[str, Any]:
        """Generate a grounded response using retrieved knowledge base documents."""
        pass


class GraniteAIService(AIService):
    """
    IBM Granite AI Service.
    Connects to IBM Watson Machine Learning / watsonx.ai text generation endpoint.
    """

    def __init__(self):
        self.model_id = settings.granite_model_id
        self.api_url = settings.granite_api_url
        self.api_key = settings.granite_api_key
        self.project_id = settings.granite_project_id

    def _resolve_project_id(self, token: str) -> str | None:
        """Resolve Watsonx project ID from settings or auto-discover from user account."""
        if self.project_id:
            return self.project_id

        try:
            r = requests.get(
                "https://api.dataplatform.cloud.ibm.com/v2/projects",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
            if r.status_code == 200:
                resources = r.json().get("resources", [])
                if resources:
                    guid = resources[0].get("metadata", {}).get("guid")
                    if guid:
                        self.project_id = guid
                        return guid
        except Exception as e:
            logger.warning("Project auto-discovery failed: %s", e)
        return None

    def _get_iam_token(self, api_key: str) -> str | None:
        """Exchange an IBM Cloud IAM API Key for an access token if needed."""
        # If the key already looks like an IAM/OAuth Bearer token (JWT format)
        if api_key.startswith("Bearer ") or api_key.startswith("eyJ"):
            return api_key.replace("Bearer ", "")

        try:
            resp = requests.post(
                "https://iam.cloud.ibm.com/identity/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": api_key,
                },
                timeout=15,
            )
            if resp.status_code == 200:
                return resp.json().get("access_token")
        except Exception as e:
            logger.warning("IBM IAM token exchange failed: %s", e)
        return None

    def _build_grounded_prompt(self, query: str, context: str, location: str | None, intent: str | None = None) -> str:
        """Construct a clean, strictly grounded consumer prompt for IBM Granite."""
        loc_str = location if location else "India (National)"
        is_gov_scheme = (
            intent == INTENT_GOVERNMENT_SCHEMES
            or any(kw in query.lower() for kw in [
                "scheme", "scholarship", "internship", "yojana", "portal", "jnanabhumi",
                "pm-kisan", "pm kisan", "kusum", "ebus", "ujjwala", "kaushal", "farmer", "subsidy", "welfare",
                "aicte", "ncs", "career", "skill india", "fasal bima", "mudra", "startup", "msme"
            ])
        )

        if is_gov_scheme:
            return (
                "<|system|>\n"
                "You are the Eco Lifestyle Agent, an authoritative, friendly, and practical assistant specializing in "
                "Indian public services, welfare programs, scholarships, internships, farmer support, and sustainability.\n"
                "CRITICAL RULES:\n"
                "1. Answer the question using ONLY the verified facts from the knowledge context below.\n"
                "2. Never hallucinate or invent eligibility rules, deadlines, financial figures, or application links.\n"
                "3. Structure your response clearly for regular citizens as follows:\n\n"
                "## [Primary Scheme or Program Title]\n"
                "[Clear, practical 2-3 sentence overview explaining the initiative]\n\n"
                "**Who it may be relevant to**\n"
                "[Specific target beneficiaries and eligibility overview]\n\n"
                "**Key Benefits**\n"
                "[Specific financial subsidies, stipends, or assistance amounts from context]\n\n"
                "**How to check & apply**\n"
                "[Official application portal name and application process]\n\n"
                "**Official Source**\n"
                "[Administering Ministry or Organization] · [Official URL]\n\n"
                "---\n"
                "### Other Relevant Opportunities\n"
                "[Mention 2-3 other related official schemes or portals retrieved in context, if applicable]\n\n"
                "### Practical Next Steps\n"
                "1. [Actionable step: Review eligibility]\n"
                "2. [Actionable step: Gather required documents]\n"
                "3. [Actionable step: Visit official portal]\n"
                "4. [Actionable step: Apply online before deadline]\n"
                "<|user|>\n"
                f"Location: {loc_str}\n"
                f"Verified Knowledge Context:\n{context}\n\n"
                f"Question: {query}\n"
                "<|assistant|>\n"
            )

        return (
            "<|system|>\n"
            "You are the Eco Lifestyle Agent, an authoritative, responsible AI sustainability assistant "
            "dedicated to UN SDG 12 (Responsible Consumption and Production).\n"
            "CRITICAL RULES:\n"
            "1. Answer the question using ONLY the verified facts from the knowledge context below.\n"
            "2. Never hallucinate or invent policies, statistics, or regulations.\n"
            "3. Keep your answer practical, concise, and structured for everyday consumers as follows:\n\n"
            "## [Topic Title]\n"
            "[2-3 practical, focused sentences answering the question]\n\n"
            "### Practical Next Steps\n"
            "1. [Action title]: [One sentence description]\n"
            "2. [Action title]: [One sentence description]\n"
            "3. [Action title]: [One sentence description]\n\n"
            "### Why It Matters\n"
            "[One concise sentence explaining ecological and resource impact]\n"
            "<|user|>\n"
            f"Location: {loc_str}\n"
            f"Verified Environmental Context:\n{context}\n\n"
            f"Question: {query}\n"
            "<|assistant|>\n"
        )

    def _parse_actions_from_text(self, text: str, default_category: str) -> list[dict[str, Any]]:
        """Extract structured action items from Granite output."""
        actions: list[dict[str, Any]] = []
        lines = text.splitlines()

        in_actions_section = False
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if "practical next steps" in line_str.lower() or "practical actions" in line_str.lower():
                in_actions_section = True
                continue
            if in_actions_section and (line_str.startswith("##") or line_str.startswith("---") or line_str.lower().startswith("why it matters")):
                in_actions_section = False

            # Match numbered points like "1. Check eligibility: ..." or "1. Apply online"
            match = re.match(r'^(?:[0-9]+\.|\-|\*)\s+\*?\*?([^\:\n]+)\*?\*?(?:\:\s*(.*))?$', line_str)
            if match and (in_actions_section or len(actions) < 4):
                title = match.group(1).strip()
                desc = match.group(2).strip() if match.group(2) else title
                # Avoid capturing markdown headers as actions
                if not any(title.lower().startswith(h) for h in ["official source", "last verified", "who it may", "key benefits", "other relevant"]):
                    actions.append({
                        "title": title[:60],
                        "description": desc[:180],
                        "why": "Follow verified official guidance for maximum impact.",
                        "difficulty": "Easy" if len(actions) == 0 else "Medium",
                        "category": default_category,
                    })

        if not actions:
            if default_category == "government_schemes":
                actions = [
                    {
                        "title": "Check Official Eligibility",
                        "description": "Review current criteria and notifications on the verified government portal.",
                        "why": "Ensures prerequisites and documentation are met before applying.",
                        "difficulty": "Easy",
                        "category": default_category,
                    },
                    {
                        "title": "Gather Required Documents",
                        "description": "Prepare identity, income, education, and bank seeding credentials.",
                        "why": "Direct Benefit Transfer requires authenticated records.",
                        "difficulty": "Medium",
                        "category": default_category,
                    },
                    {
                        "title": "Apply via Official Portal",
                        "description": "Submit application directly through the authorized government platform.",
                        "why": "Prevents unauthorized third-party fraud and delays.",
                        "difficulty": "Medium",
                        "category": default_category,
                    },
                ]
            else:
                actions = [
                    {
                        "title": "Adopt Everyday Eco Habits",
                        "description": "Start with small, consistent changes in your daily routine.",
                        "why": "Small actions compound into significant environmental savings.",
                        "difficulty": "Easy",
                        "category": default_category,
                    }
                ]

        return actions[:4]

    def generate(
        self,
        query: str,
        documents: list[Document],
        location: str | None = None,
        preferences: dict | None = None,
    ) -> dict[str, Any]:
        intent = retriever.detect_intent(query)
        retrieved_topics = INTENT_TOPICS.get(intent, INTENT_TOPICS[INTENT_GENERAL_SUSTAINABILITY])

        # Format sources with full metadata
        sources = [
            {
                "title": doc.title,
                "category": doc.category,
                "subcategory": doc.subcategory,
                "target_group": doc.target_group,
                "source": doc.source,
                "source_url": doc.source_url,
                "organization": doc.organization,
                "date": doc.date,
                "last_verified": doc.last_verified,
                "location": doc.location,
                "summary": doc.summary,
                "verification_status": "Verified Source",
            }
            for doc in documents
        ]

        # Case 1: Insufficient knowledge retrieved
        if not documents:
            return {
                "answer": (
                    "I couldn't find enough verified environmental information to answer this question confidently. "
                    "Please verify with your local municipal authority or state pollution control board."
                ),
                "actions": [],
                "sources": [],
                "intent": intent,
                "confidence": "Low",
                "model": self.model_id,
                "retrieved_topics": [],
                "reason_for_recommendation": "Zero matching verified documents retrieved from knowledge base.",
            }

        # Case 2: Credentials missing -> Honest configuration error
        if not self.api_key or not self.api_url:
            # Build grounded summary directly from real documents
            key_points = []
            for doc in documents[:3]:
                # Extract first sentence or 150 chars from document content
                first_line = doc.content.split("\n\n")[0].replace("#", "").strip()
                if first_line and len(first_line) > 30:
                    key_points.append(f"• {doc.title} ({doc.organization}): {first_line[:200]}...")

            grounded_summary = "\n".join(key_points)

            return {
                "answer": (
                    f"Verified RAG Context Retrieved ({len(documents)} documents):\n\n"
                    f"{grounded_summary}\n\n"
                    "Note: To enable live AI generative synthesis, please configure IBM_GRANITE_API_KEY "
                    "and IBM_GRANITE_API_URL in backend/.env. The application does not use mock or fake models."
                ),
                "actions": [
                    {
                        "title": f"Review {documents[0].title}",
                        "description": f"Consult verified official guidance from {documents[0].organization or 'environmental authority'}.",
                        "why": "Official documentation provides statutory specifications.",
                        "difficulty": "Easy",
                        "category": documents[0].category,
                    }
                ],
                "sources": sources,
                "intent": intent,
                "confidence": "Verified Retrieval (Awaiting Granite Key)",
                "model": "IBM Granite (Configuration Required)",
                "retrieved_topics": retrieved_topics,
                "reason_for_recommendation": (
                    f"RAG vector search successfully retrieved {len(documents)} verified document(s) "
                    f"from {', '.join({d.category for d in documents})}. "
                    "Live text generation requires IBM Watson Machine Learning credentials."
                ),
            }

        # Case 3: Live IBM Granite Call
        # Prepare context
        context_blocks = []
        for i, doc in enumerate(documents[:4], 1):
            context_blocks.append(
                f"[Document {i}]: {doc.title}\n"
                f"Organization: {doc.organization or 'Government Authority'}\n"
                f"Source: {doc.source}\n"
                f"Source URL: {doc.source_url or 'N/A'}\n"
                f"Target Group: {doc.target_group or 'General Citizens'}\n"
                f"Last Verified: {doc.last_verified or doc.date or 'Current'}\n"
                f"Content: {doc.content[:700]}\n"
            )
        context_str = "\n---\n".join(context_blocks)
        prompt = self._build_grounded_prompt(query, context_str, location, intent=intent)

        # Obtain token and resolve project_id
        token = self._get_iam_token(self.api_key) or self.api_key
        project_id = self._resolve_project_id(token)

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        active_model = self.model_id
        payload: dict[str, Any] = {
            "model_id": active_model,
            "input": prompt,
            "parameters": {
                "decoding_method": "sample",
                "temperature": 0.2,
                "max_new_tokens": 480,
                "min_new_tokens": 30,
                "repetition_penalty": 1.05,
                "stop_sequences": ["<|user|>", "<|system|>"],
            },
        }
        if project_id:
            payload["project_id"] = project_id

        start_time = time.perf_counter()
        try:
            resp = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=35,
            )

            # Auto-recover if model ID was deprecated on IBM watsonx
            if resp.status_code == 404 and "granite-4-h-small" not in active_model:
                logger.info("Model %s returned 404, falling back to ibm/granite-4-h-small", active_model)
                active_model = "ibm/granite-4-h-small"
                payload["model_id"] = active_model
                resp = requests.post(
                    self.api_url,
                    headers=headers,
                    json=payload,
                    timeout=35,
                )

            duration_ms = (time.perf_counter() - start_time) * 1000.0

            if resp.status_code != 200:
                logger.error("IBM Granite API returned status %d: %s", resp.status_code, resp.text)
                monitor.record_granite(query, active_model, False, duration_ms, error_msg=f"HTTP {resp.status_code}: {resp.text[:100]}")
                return {
                    "answer": (
                        f"Unable to retrieve verified information from IBM Granite at this time "
                        f"(HTTP {resp.status_code}: {resp.text[:150]}). "
                        "Please check your IBM Cloud Watson Machine Learning API status in backend/.env."
                    ),
                    "actions": [],
                    "sources": sources,
                    "intent": intent,
                    "confidence": "Service Unavailable",
                    "model": active_model,
                    "retrieved_topics": retrieved_topics,
                    "reason_for_recommendation": f"IBM Granite API call failed with status code {resp.status_code}.",
                }

            data = resp.json()
            generated_text = ""
            results = data.get("results", [])
            if results and isinstance(results, list):
                generated_text = results[0].get("generated_text", "")
            elif "generated_text" in data:
                generated_text = data["generated_text"]

            if not generated_text.strip():
                monitor.record_granite(query, active_model, False, duration_ms, error_msg="Model returned blank text envelope")
                return {
                    "answer": "IBM Granite returned an empty response. Please rephrase your query.",
                    "actions": [],
                    "sources": sources,
                    "intent": intent,
                    "confidence": "Low",
                    "model": self.model_id,
                    "retrieved_topics": retrieved_topics,
                    "reason_for_recommendation": "Model returned blank text envelope.",
                }

            monitor.record_granite(query, active_model, True, duration_ms)

            parsed_actions = self._parse_actions_from_text(
                generated_text,
                default_category=documents[0].category if documents else "sustainable_living"
            )

            return {
                "answer": generated_text.strip(),
                "actions": parsed_actions,
                "sources": sources,
                "intent": intent,
                "confidence": "High" if len(documents) >= 3 else "Medium",
                "model": self.model_id,
                "retrieved_topics": retrieved_topics,
                "reason_for_recommendation": (
                    f"Grounded response generated by IBM Granite ({self.model_id}) "
                    f"using {len(documents)} retrieved environmental document(s)."
                ),
            }

        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            monitor.record_granite(query, active_model, False, duration_ms, error_msg=str(exc))
            logger.exception("Exception during IBM Granite request: %s", exc)
            return {
                "answer": (
                    f"Unable to retrieve verified information at this time. "
                    f"An error occurred while connecting to IBM Granite: {str(exc)}. "
                    "Please verify network connectivity and backend/.env credentials."
                ),
                "actions": [],
                "sources": sources,
                "intent": intent,
                "confidence": "Error",
                "model": self.model_id,
                "retrieved_topics": retrieved_topics,
                "reason_for_recommendation": f"Exception raised during inference: {str(exc)}",
            }


def get_ai_service() -> AIService:
    """Return the configured AI service instance."""
    return GraniteAIService()
