# Eco Lifestyle Agent

> **Primary SDG**: SDG 12 — Responsible Consumption and Production  
> **Architecture**: Semantic RAG with ChromaDB Vector Database & IBM Granite AI  
> **Tagline**: *"Small actions. Big impact."*

---

## 1. Project Overview
The **Eco Lifestyle Agent** is a production-grade, full-stack, RAG-powered (Retrieval-Augmented Generation) sustainability platform that empowers individuals, households, and communities to adopt practical, eco-conscious daily routines. The application retrieves verified sustainability guidance, regulatory recycling standards, and official government clean energy schemes from authoritative environmental sources (CPCB, BEE, MNRE, MoEFCC, UNEP).

Responses are strictly bounded by dense vector similarity search in **ChromaDB** and synthesized using **IBM Granite 3.0**, eliminating hallucinations and ensuring zero fake data.

---

## 2. Problem Statement (Problem Statement No. 6)
Modern citizens face an information paradox: high ecological awareness, but fragmented, confusing, and ungrounded advice. Everyday practical questions include:
- *"How can I reduce single-use plastic at home?"*
- *"Where and how do I dispose of swollen phone batteries or electronic waste in my city?"*
- *"What government incentives exist for residential rooftop solar under PM Surya Ghar?"*

Generic AI models often hallucinate municipal waste rules, fabricate subsidy calculations, or provide ungrounded commercial promotions. The Eco Lifestyle Agent roots every suggestion in verified statutory documents through Retrieval-Augmented Generation, promoting small daily actions with compound environmental impact.

---

## 3. UN SDG 12 Alignment
### SDG 12 — Responsible Consumption and Production
- **Target 12.5**: Substantially reduce waste generation through prevention, reduction, recycling, and reuse.
- **Target 12.8**: Ensure citizens have access to relevant information and awareness for sustainable development in harmony with nature.
- **Target 12.c**: Rationalize inefficient fossil-fuel subsidies and encourage household clean energy adoption.

---

## 4. Target Users
- **Households & Families**: Reducing domestic utility bills, water waste, and managing 3-bin waste segregation (wet, dry, domestic hazardous).
- **Students & Youth**: Developing low-footprint daily habits, circular economy practices, and active commuting.
- **Working Professionals**: Transitioning to rooftop solar, electric vehicles (EVs), and certified e-waste take-back programs.
- **Community Champions & RWAs**: Organizing zero-waste residential initiatives and decentralized composting.

---

## 5. Key Features
1. **Semantic RAG Eco Agent Chat**: Natural language interface with 9-domain intent classification, dense vector retrieval, grounded actions, and transparent provenance citations.
2. **Sustainable Living Guide**: Actionable playbooks for plastic reduction, electricity, water conservation, food waste (FIFO/composting), and household waste hierarchies.
3. **Regulatory Recycling Guide**: Statutory breakdown of battery waste, electronics (CPCB E-Waste Rules 2022), and plastic resin identification codes (RIC 1–7).
4. **Eco Product Selection Guide**: 8-point product lifecycle evaluation framework, single-use to reusable comparison matrix, and greenwashing warning indicators.
5. **Government Schemes Directory**: Accurate overviews of PM Surya Ghar Muft Bijli Yojana, FAME India / EMPS EV incentives, and Swachh Bharat Mission with official portals.
6. **Eco Travel Assistant**: Multimodal travel comparisons (walking, cycling, public transit, carpooling) with relative emission ratings and commuting tips.
7. **Daily Eco Actions Tracker**: Interactive micro-habit challenges with "Done", "Skip", and "Randomize" controls.
8. **Personal Sustainability Dashboard**: Activity trend charts, focus goal customizer, and privacy-respecting local profile settings.
9. **Responsible AI Portal**: Comprehensive documentation of ethical safeguards, fairness, privacy, hallucination prevention, and institutional deference.
10. **Vector Store & Admin Diagnostics**: Real-time ChromaDB statistics, one-click vector re-indexing (`/api/admin/reindex`), and live semantic retrieval inspector.

---

## 6. System Architecture

```text
+-------------------------------------------------------------------------+
|                              FRONTEND LAYER                             |
|    React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router 7      |
+-------------------------------------------------------------------------+
       |                                                 ^
       | HTTP POST /api/chat                             | JSON Response
       | HTTP GET  /api/sources, /api/schemes, etc.      |
       | HTTP POST /api/admin/reindex, /api/admin/stats  |
       v                                                 |
+-------------------------------------------------------------------------+
|                               BACKEND API                               |
|                         FastAPI + Uvicorn Core                          |
+-------------------------------------------------------------------------+
       |                                                 |
       v                                                 v
+-------------------------------+       +---------------------------------+
|     RAG RETRIEVAL SERVICE     |       |       AI SERVICE LAYER          |
|   (app/rag/retriever.py)      |       |      (app/ai/service.py)        |
+-------------------------------+       +---------------------------------+
| - 9-Domain Intent Classifier  |       | - GraniteAIService              |
| - Location Boost Logic        |       |   (IBM Watson Machine Learning /|
| - ChromaDB Vector Queries     |       |    watsonx.ai Text Generation)  |
+-------------------------------+       +---------------------------------+
       |                                                 ^
       v                                                 |
+-------------------------------+                        |
|      CHROMADB VECTOR STORE    |                        |
|   (app/rag/vector_store.py)   |                        |
+-------------------------------+                        |
| - 87 Semantic Vector Chunks   |                        |
| - ONNX all-MiniLM-L6-v2 Embed | -----------------------+
| - Overlapping Text Slices     |
+-------------------------------+
       ^
       | Ingestion Engine (backend/ingest.py)
+-------------------------------+
|     CURATED KNOWLEDGE BASE    |
|  (26 Markdown Files with Meta)|
+-------------------------------+
| /sustainable_living           |
| /recycling                    |
| /eco_products                 |
| /government_schemes           |
| /eco_travel                   |
+-------------------------------+
```

---

## 7. Semantic RAG Pipeline
1. **User Question**: Input natural language prompt with optional city location.
2. **Intent Classification**: Evaluates input against 9 environmental domains (`RECYCLING`, `GOVERNMENT_SCHEMES`, `ECO_TRAVEL`, `ECO_PRODUCTS`, `ENERGY`, `WATER`, `FOOD_WASTE`, `SUSTAINABLE_LIVING`, `GENERAL_SUSTAINABILITY`).
3. **ChromaDB Semantic Search**: Computes 384-dimensional dense embeddings via local ONNX `all-MiniLM-L6-v2`. Retrieves top candidate chunks with cosine similarity ranking and geographic location boosting (+0.2 bonus).
4. **Prompt Grounding**: Assembles an authoritative context block and injects strict anti-hallucination instructions.
5. **IBM Granite Inference**: Dispatches grounded prompt to IBM Watson Machine Learning / watsonx.ai.
6. **Structured Extraction**: Extracts direct concise answers, 3 practical action cards, ecological justifications, and verified source metadata.

---

## 8. IBM Granite Integration
The system integrates **IBM Granite 3.0** via IBM Watson Machine Learning:
- **Model**: `ibm/granite-3-8b-instruct` (or configured Granite variant).
- **IAM Authentication**: Automatic IAM token exchange or direct bearer tokens.
- **Grounding Constraints**: Bounded by retrieved vector chunks; zero speculative assertions.
- **Transparent Fallback**: When API keys are not yet configured, the system transparently serves verified extracted context directly from ChromaDB without mock models or fabricated responses.

---

## 9. Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (tested on Python 3.13)

### One-Click PowerShell Startup (Recommended)
From the project folder (`d:\Eco\eco-lifestyle-agent`), run:
```powershell
.\start-dev.ps1
```
This automatically launches both the FastAPI backend (`http://127.0.0.1:8000`) and the Vite frontend (`http://localhost:5173`) in separate PowerShell windows and opens your browser.

Alternatively, use the batch script:
```cmd
start-dev.bat
```

### Manual Setup
#### 1. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Ingest knowledge base into ChromaDB vector database
python ingest.py

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API docs available at **http://127.0.0.1:8000/docs**.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application opens at **http://localhost:5173**.

---

## 10. Environment Configuration

### Backend (`backend/.env`):
```env
# IBM Granite / Watson Machine Learning Credentials
IBM_GRANITE_API_KEY=your_ibm_cloud_api_key
IBM_GRANITE_API_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29
IBM_GRANITE_MODEL_ID=ibm/granite-4-h-small
IBM_GRANITE_PROJECT_ID=your_watsonx_project_id
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

---

## 11. Testing & Verification

Run the comprehensive pytest suite verifying all endpoints, vector retrieval, intent detection, and admin operations:

```bash
cd backend
pytest tests/test_api.py -v
```

Output:
```text
tests/test_api.py::test_health_endpoint PASSED                           [  8%]
tests/test_api.py::test_chat_with_plastic_question PASSED                [ 16%]
tests/test_api.py::test_chat_with_recycling_question PASSED              [ 25%]
tests/test_api.py::test_chat_empty_message_returns_400 PASSED            [ 33%]
tests/test_api.py::test_retrieve_endpoint PASSED                         [ 41%]
tests/test_api.py::test_categories_endpoint PASSED                       [ 50%]
tests/test_api.py::test_sources_endpoint PASSED                          [ 58%]
tests/test_api.py::test_actions_endpoint PASSED                          [ 66%]
tests/test_api.py::test_travel_endpoint PASSED                           [ 75%]
tests/test_api.py::test_schemes_endpoint PASSED                          [ 83%]
tests/test_api.py::test_admin_stats_endpoint PASSED                      [ 91%]
tests/test_api.py::test_admin_reindex_endpoint PASSED                    [100%]
======================== 12 passed in 4.69s =========================
```

---

## 12. Knowledge Base & Government Sources (48 Documents, 206 Vector Chunks)
The knowledge base contains 48 verified, structured documents indexed into 206 dense vector chunks across 5 environmental and public welfare domains:

### Priority Government & Public Service Knowledge Sources:
1. **PM Internship Scheme**: Official portal `https://pminternship.mca.gov.in/` (Ministry of Corporate Affairs) - 1.25 crore youth youth internship initiative with ₹5,000 monthly stipend.
2. **AICTE Portal & Initiatives**: `https://www.aicte.gov.in/` - Technical education standards, PG scholarships, Pragati/Saksham schemes, green campus mandates.
3. **JnanaBhumi Andhra Pradesh**: `https://jnanabhumi.ap.gov.in/` - Unified education & scholarship portal for Post-Matric and Pre-Matric welfare.
4. **PM-KISAN**: `https://pmkisan.gov.in/` - Direct income support of ₹6,000/year in 3 installments for landholding farmers.
5. **PM Fasal Bima Yojana (PMFBY)**: `https://pmfby.gov.in/` - Low-premium crop insurance against natural calamities and drought.
6. **National Scholarship Portal (NSP)**: `https://scholarships.gov.in/` - Centralized national scholarship hub for students across India.
7. **National Career Service (NCS)**: `https://www.ncs.gov.in/` - Ministry of Labour & Employment employment exchange and skill matching.
8. **Skill India Digital Hub**: `https://www.skillindiadigital.gov.in/` - Free/subsidized vocational certifications and green skills training.
9. **PM Surya Ghar Muft Bijli Yojana**: `https://pmsuryaghar.gov.in/` - Rooftop solar subsidy up to ₹78,000 and 300 free monthly units.
10. **FAME India & EMPS**: `https://heavyindustries.gov.in/` - Electric vehicle adoption incentives for 2W, 3W, and commercial EVs.
11. **Swachh Bharat Mission (Urban 2.0)**: `https://swachhbharatmission.gov.in/` - 3-way waste segregation, legacy dumpsite remediation, and city composting.
12. **PRANA Air Quality Portal**: `https://prana.cpcb.gov.in/` - Real-time NCAP clean air monitoring across non-attainment cities.
13. **Andhra Pradesh State Portals**: MeeSeva (`https://meeseva.ap.gov.in/`), YSR Rythu Bharosa (`https://ysrrythubharosa.ap.gov.in/`), JVD Fee Reimbursement, and AP Rooftop Solar Net Metering.

```text
knowledge_base/
├── sustainable_living/    # (7 Docs) Plastic reduction, BEE star ratings, water conservation, food waste, Mission LiFE, home composting
├── recycling/             # (5 Docs) Batteries (BWM Rules 2022), E-Waste Rules 2022, SWM 2016 segregation, plastic resin codes (RIC 1-7)
├── eco_products/          # (5 Docs) 8-point lifecycle evaluation, packaging comparison, reusable alternatives, green certifications
├── government_schemes/    # (27 Docs) PM Internship, AICTE, JnanaBhumi, PM-KISAN, PMFBY, NSP, NCS, Skill India, PM Surya Ghar, FAME, PRANA, MeeSeva, etc.
└── eco_travel/            # (4 Docs) Active mobility (cycling/walking), electric metro, bus transit, carpooling & EV charging
```

---

## 13. Responsible AI Safeguards
- **Fairness**: Recommendations prioritize accessible, zero-cost lifestyle habits rather than expensive consumer goods.
- **Transparency**: Every answer exposes retrieved topics, document counts, vector confidence, and model identity.
- **Privacy**: Personalization is stored exclusively in client-side `localStorage`. No user tracking or login required.
- **Data Honesty**: Zero fabricated statistics, fake subsidies, or invented regulations. All documents are attributed to official authorities.
- **Human Oversight**: Critical safety items (e.g. lithium batteries, legal compliance) advise consulting official municipal and state authorities.
