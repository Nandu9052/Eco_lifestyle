# RAG (Retrieval-Augmented Generation) Workflow

Retrieval-Augmented Generation (RAG) is the core technical differentiator of the Eco Lifestyle Agent. Instead of querying a generative model directly—which often produces plausible-sounding hallucinations—our system roots every response in verified documents.

---

## Detailed Step-by-Step Pipeline

```
1. USER QUERY
   e.g. "How should I dispose of an old laptop battery in Kurnool?"
      │
      ▼
2. QUERY PROCESSING & NORMALIZATION
   - Lowercasing, punctuation stripping, word boundary extraction.
   - User location extraction ("Kurnool").
      │
      ▼
3. INTENT DETECTION
   - Keyword evaluation against 9 defined intent mappings:
     * RECYCLING (battery, e-waste, dispose, etc.) -> BOOST 'recycling' category
     * GOVERNMENT_SCHEMES (solar, subsidy, fame, etc.) -> BOOST 'government_schemes'
     * ECO_TRAVEL (bus, metro, cycle, commute, etc.) -> BOOST 'eco_travel'
     * ECO_PRODUCTS (appliance, packaging, bottle, etc.) -> BOOST 'eco_products'
     * ENERGY (electricity, power, ac, led, etc.) -> BOOST 'sustainable_living'
     * WATER (water, tap, leak, rain, etc.) -> BOOST 'sustainable_living'
     * FOOD_WASTE (food, scrap, compost, etc.) -> BOOST 'sustainable_living'
     * SUSTAINABLE_LIVING (general habits) -> BOOST 'sustainable_living'
     * GENERAL_SUSTAINABILITY (default)
      │
      ▼
4. SEMANTIC VECTOR RETRIEVAL & BOOSTING
   - Convert user query + location into 384-dimensional dense vector embeddings using local ONNX all-MiniLM-L6-v2.
   - Query ChromaDB persistent collection with cosine similarity search.
   - Apply metadata filter targeting the detected intent category.
   - Apply geographic bonus (+0.2 similarity score) for regional matches.
   - If filtered search yields under 2 matches, execute a broad semantic query and blend results.
   - Rank and select Top-K (default top 5) deduplicated document chunks.
      │
      ▼
5. CONTEXT AUGMENTATION & PROMPT BOUNDING
   - Extract title, organization, source URL, and full chunk content for the top documents.
   - Assemble a structured ground-truth context envelope.
   - Prepend strict system instructions:
     "Answer the user's question using ONLY the verified facts from the knowledge context below.
      Never hallucinate, speculate, or fabricate statistics, laws, or subsidies."
      │
      ▼
6. AI GENERATION (IBM Granite / Responsible Direct Grounding)
   - When credentials are present: Post to IBM Watson Machine Learning / watsonx.ai running IBM Granite 3.0.
   - When credentials are not yet configured: Return structured verified context directly without fake or mock models.
   - Parse concise direct answer, 3 actionable items, and ecological importance.
      │
      ▼
7. GROUNDED RESPONSE & METADATA ATTACHMENT
   - Attach verified source cards with verified external links and provenance badges.
   - Provide expandable "Why this answer?" RAG transparency view showing:
     * Detected intent domain
     * Model name (e.g. ibm/granite-3-8b-instruct)
     * Confidence rating (High/Medium/Low based on vector similarity and context depth)
     * Retrieved environmental topics
     * Complete list of cited documents
```

---

## Handling Edge Cases & Uncertainty

| Scenario | System Behavior |
|---|---|
| **Empty or whitespace-only query** | Returns HTTP 400 Bad Request: "Question cannot be empty." |
| **No matching documents found** | Returns Low confidence with honest disclosure: *"I couldn't find enough verified environmental information to answer this question confidently. Please verify with your local municipal authority or state pollution control board."* |
| **Awaiting IBM Granite Credentials** | Accurately states that live generation is awaiting Watson Machine Learning credentials while presenting genuine verified knowledge chunks directly. |
| **Local rules variation** | Explicitly appends disclaimer: *"Local disposal rules may vary. Please verify with your municipal authority."* |
| **Government scheme query** | Directs user to the official portal (e.g. `pmsuryaghar.gov.in`, `heavyindustries.gov.in`) rather than fabricating subsidy calculations. |
