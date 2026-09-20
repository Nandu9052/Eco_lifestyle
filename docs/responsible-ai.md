# Responsible AI Framework & SDG Alignment

The **Eco Lifestyle Agent** implements responsible artificial intelligence practices tailored to environmental stewardship and UN Sustainable Development Goal 12 (Responsible Consumption and Production).

---

## The 6 Responsible AI Principles in Action

### 1. Fairness & Inclusivity
- **Socio-economic Awareness**: Guidance focuses on zero-cost or low-cost daily habits (e.g., bucket baths, switching off idle appliances, segregating wet/dry waste) rather than assuming users can purchase high-end eco-appliances or electric vehicles.
- **Infrastructure Realism**: Acknowledges that public recycling collection, dedicated bicycle lanes, and organic composting services vary drastically across tier-1 cities, tier-2 towns, and rural regions.

### 2. Transparency & Explainability
- **Inspectable Reasoning**: Every response includes an expandable "Why this answer?" drawer displaying:
  - The detected user intent.
  - Retrieved subject topics.
  - Number of matching documents and retrieval confidence score.
  - Exact knowledge sources referenced with direct statutory links.
- **Model State Indicator**: Clear badges indicate model inference state (`RAG Grounded · IBM Granite`). The system never manufactures fake LLM output.

### 3. Privacy & Data Minimization
- **No Compulsory Registration**: Users do not need an account, email address, or phone number to access full agent functionality.
- **Local-Only Personalization**: User preferences (location, goals, commuter persona) are persisted exclusively in client-side `localStorage`.
- **Zero Third-Party Tracking**: No telemetry or advertising trackers are embedded.

### 4. Source Reliability & Grounding
- **Curated Knowledge Base**: Documents are sourced from established environmental and governmental authorities:
  - Ministry of New and Renewable Energy (MNRE)
  - Bureau of Energy Efficiency (BEE)
  - Central Pollution Control Board (CPCB)
  - Ministry of Environment, Forest and Climate Change (MoEFCC)
  - UN Environment Programme (UNEP)
- **Elimination of Commercial Endorsements**: The agent does not sell products or endorse commercial vendors.

### 5. Hallucination Prevention & Data Honesty
- **No Fabricated Data**: The system strictly avoids inventing government scheme subsidies, eligibility percentages, or municipal fine structures.
- **Strict Verification Provenance**: Every document contains explicit metadata (`verification_status: Verified Source`) linking to gazette notifications, ministry portals, or statutory rules.

### 6. Human Oversight & Institutional Deference
- **Safety First**: Electronic waste containing lithium batteries, fluorescent bulbs, and broken screens requires specialized handling. The agent instructs users to contact authorized recyclers and never attempt dangerous DIY disassembly or open burning.
- **Official Portals**: Direct external links to government portals (`pmsuryaghar.gov.in`, `swachhbharatmission.gov.in`) are provided so users can verify active policies directly with state authorities.
