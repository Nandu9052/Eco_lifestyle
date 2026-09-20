# Eco Lifestyle Agent — Project Overview

> **SDG Alignment**: UN Sustainable Development Goal 12 (Responsible Consumption and Production)  
> **Architecture**: Semantic RAG with ChromaDB Vector Store & IBM Granite Inference  
> **Tagline**: *"Small actions. Big impact."*

---

## 2. Problem Statement (Problem Statement No. 6)
Modern citizens face an information paradox when attempting to adopt environmentally sustainable lifestyles. While awareness of climate change and plastic pollution is high, actionable guidance is fragmented, confusing, and often laden with corporate greenwashing or unrealistic advice. 

Individuals regularly seek answers to simple, everyday questions:
- *How do I properly dispose of or recycle an old lithium-ion battery in my city?*
- *What government subsidies exist for installing residential rooftop solar?*
- *How do I choose durable, low-emission household goods without falling for eco-label marketing gimmicks?*

Generic generative AI chatbots frequently hallucinate municipal recycling rules, invent fictitious government schemes, or provide generic, ungrounded responses. The **Eco Lifestyle Agent** solves this through a tailored **Retrieval-Augmented Generation (RAG)** pipeline backed by curated, verified environmental knowledge documents and responsible AI safeguards.

---

## 3. Primary SDG Alignment
**SDG 12 — Responsible Consumption and Production**
- **Target 12.5**: Substantially reduce waste generation through prevention, reduction, recycling, and reuse.
- **Target 12.8**: Ensure that people everywhere have relevant information and awareness for sustainable development and lifestyles in harmony with nature.
- **Target 12.c**: Rationalize inefficient fossil-fuel subsidies and encourage clean household energy adoption.

---

## 4. Target Users
1. **Households & Families**: Seeking practical segregation protocols (wet, dry, domestic hazardous), food waste reduction tips, and energy-saving measures to lower utility bills.
2. **Students & Youth**: Looking for budget-friendly sustainable habits, public transit routes, and active commute options.
3. **Working Professionals**: Seeking rapid, trustworthy information on electric vehicles (EVs), e-waste disposal, and home solar programs.
4. **Community Champions & Educators**: Facilitating neighborhood clean-up drives, zero-waste workshops, and local composting initiatives.

---

## 5. Why AI?
Unlike static FAQ portals or lengthy PDF policy documents, an AI conversational agent:
- Understands ambiguous, colloquial natural language queries.
- Adapts guidance to user context (e.g. location, lifestyle persona, commute distance).
- Synthesizes complex regulatory frameworks (e.g., Solid Waste Management Rules, PM Surya Ghar guidelines) into concise, 3-point practical action cards.

---

## 6. Why RAG (Retrieval-Augmented Generation)?
Generic LLMs are prone to hallucinations, temporal staleness, and geographic insensitivity. RAG is foundational because:
- **Zero Hallucination of Critical Rules**: The agent bases responses strictly on retrieved knowledge chunks from vetted government ministries and environmental bodies.
- **Source Transparency**: Every recommendation cites exact sources, organizations, and publication dates.
- **Local Context Boosting**: Prioritizes municipal guidelines relevant to the user's declared location (e.g. Kurnool, Andhra Pradesh).
- **Graceful Uncertainty Declaration**: When reliable local knowledge is missing, the system explicitly declares: *"Local disposal rules may vary. Please verify with your municipal authority."*

---

## 7. AI & RAG Workflow Pipeline
```text
User Question
      ↓
Query Pre-processing & Intent Classification (9 Environmental Domains)
      ↓
Dense Vector Semantic Search (ChromaDB + ONNX all-MiniLM-L6-v2 Embeddings)
      ↓
Metadata & Location Boost Filtering (Top-K Chunks)
      ↓
Context-Bounded Prompt Construction (System Grounding Safeguards)
      ↓
IBM Granite Inference Generation (IBM Watson Machine Learning / watsonx.ai)
      ↓
Practical Action Extraction (Title, Description, Ecological Justification, Difficulty)
      ↓
Verified Source Attribution & Provenance Attachment
      ↓
Structured Output to User
```

---

## 8. Responsible AI Principles
1. **Fairness**: Recommendations avoid assuming high disposable income or uniform municipal infrastructure.
2. **Transparency**: Explains *why* an answer was generated, detailing retrieved topics, confidence ratings, and exact document sources.
3. **Privacy by Design**: Personalization is optional and stored locally in browser `localStorage`. No personal data is harvested.
4. **Data Honesty**: Zero hallucinations or invented data. If reliable context is absent, the agent transparently declares uncertainty and directs users to official portals.
5. **Human Oversight**: Users are directed to official portals (e.g., `pmsuryaghar.gov.in`, `cpcb.nic.in`) to verify statutory procedures.

---

## 9. Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide React icons, Recharts data visualization.
- **Backend API**: Python 3.13, FastAPI, Uvicorn, Pydantic v2.
- **Vector Database & RAG**: ChromaDB persistent vector store with ONNX `all-MiniLM-L6-v2` local embeddings, chunking with overlap, category boosting, and location filtering.
- **AI Model Layer**: IBM Granite 3.0 (`ibm/granite-3-8b-instruct` via IBM Watson Machine Learning / watsonx.ai) with zero-hallucination prompt constraints.
- **Testing**: Pytest with FastAPI TestClient (100% pass rate).

---

## 10. Core Application Features
- 💬 **Eco Agent Chat**: Conversational interface with follow-up suggestions, action cards, verified source citations, and expandable RAG transparency.
- 🌿 **Sustainable Living Guide**: Actionable guides for plastic reduction, water conservation, electricity, food waste, and lifestyle habits.
- ♻️ **Local Recycling Guide**: Breakdown of batteries, mobile phones, computers, and plastic resin codes (1–7) with location input.
- 🛍️ **Eco Product Guide**: 8-point purchasing framework, single-use to reusable comparison table, and greenwashing warning detector.
- 🏛️ **Government Schemes Directory**: Overview of PM Surya Ghar Muft Bijli Yojana, FAME India EV scheme, Swachh Bharat Mission, and National Solar Mission.
- 🚲 **Eco Travel Assistant**: Multi-modal transit comparisons (walking, cycling, public transit, carpool) with emission ratings and practical commute tips.
- ✅ **Daily Eco Actions Tracker**: Interactive daily micro-habit challenge with "Done", "Skip", and "Randomize" controls.
- 📊 **Personal Sustainability Dashboard**: Activity tracking chart, focus goal customizer, and local preference manager.
- 🛡️ **Responsible AI Portal**: Comprehensive documentation of ethical safeguards and SDG 12 alignment.
- ⚙️ **Admin & Diagnostic Console**: Real-time ChromaDB vector store diagnostics, live semantic retrieval inspector, and re-indexing engine.
