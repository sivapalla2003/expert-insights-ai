# Expert Insights AI

> **Evidence-grounded AI analysis of expert interviews for the European Robotic Surgery Market**

## 🚀 Live Test

### 🌐 [Open Live Application](YOUR_RENDER_URL_HERE)

**Live Demo:** https://expert-insights-ai.onrender.com/

> The live application allows you to explore expert-interview analysis, evidence retrieval, source quotes, timestamps, cross-expert comparisons, and grounded Q&A.

---

## 📌 Project Overview

**Expert Insights AI** is an evidence-grounded AI application designed to analyze expert interview transcripts and generate research insights while maintaining traceability to the original source material.

The application analyzes expert interviews from **France, Germany, and the UK** for a European robotic surgery market study.

Instead of allowing an AI model to generate unsupported answers, the system retrieves relevant transcript evidence first and uses the language model primarily for grounded synthesis.

### Core principle

> **The model is responsible for synthesis, but the source transcripts remain the source of truth.**

---

## 🎯 Problem

Analyzing multiple expert interviews manually can be time-consuming and makes it difficult to:

* Find relevant evidence quickly
* Compare different expert perspectives
* Preserve exact quotes
* Locate supporting timestamps
* Identify common themes and disagreements
* Prevent unsupported AI-generated claims
* Restrict analysis to specific experts or markets

**Expert Insights AI** addresses these challenges through an evidence-first retrieval and analysis workflow.

---

## ✨ Key Features

### 🔎 Evidence Retrieval

Retrieves relevant transcript segments before generating an answer.

Each evidence segment maintains:

* Expert
* Country / market
* Speaker
* Timestamp
* Transcript text
* Segment identity

### 💬 Grounded Q&A

Users can ask questions across the available expert interviews and receive answers grounded in the provided transcripts.

### 📝 Exact Source Quotes

Supporting quotes are extracted from the original transcript evidence rather than being treated as freely generated text.

### ⏱️ Timestamp Traceability

Each supporting source can be traced back to its original interview timestamp.

Example:

```text
France — Dr. Jean Martin
01:20

Capital budget approval is identified as a major adoption barrier.
```

### 🌍 Cross-Expert Analysis

The system can identify:

* Common themes
* Differences in perspectives
* Market-specific observations
* Areas of agreement
* Areas of disagreement

### 🎯 Scope-Aware Comparisons

Questions can be restricted to specific experts or markets.

For example:

```text
Compare France and UK on robotic surgery adoption barriers.
```

The system focuses retrieval on the requested scope instead of unnecessarily including other markets.

### 🛡️ Evidence Sufficiency

The system is designed to recognize when the available transcripts do not contain sufficient evidence.

For unsupported quantitative questions, the application can return:

```text
Insufficient evidence in the provided transcripts.
```

instead of inventing a number.

### 🔐 Quantitative Guardrails

The system avoids converting qualified observations into unsupported market-wide claims.

For example:

```text
15–20% more procedures annually in some stronger centres
```

should not become:

```text
The European market is growing 15–20% annually.
```

The original qualifier is preserved.

---

# 🧠 System Architecture

```text
                         User Question
                              │
                              ▼
                    Intent / Scope Detection
                              │
                              ▼
                      Evidence Retrieval
                              │
                              ▼
                    Evidence Sufficiency
                              │
                              ▼
                    Gemini Grounded Synthesis
                              │
                              ▼
                  Quote / Timestamp Validation
                              │
                              ▼
                         Final Answer
```

### Evidence-first workflow

```text
Question
   │
   ▼
Retrieve relevant transcript evidence
   │
   ▼
Check evidence sufficiency
   │
   ▼
Generate grounded synthesis
   │
   ▼
Validate quotes and timestamps
   │
   ▼
Return traceable answer
```

---

# 🏗️ Engineering Approach

The project separates the responsibilities of retrieval, synthesis, and validation.

### 1. Retrieval

The application first identifies transcript segments relevant to the user's question.

### 2. Grounding

Only retrieved transcript evidence is used as the foundation for the generated response.

### 3. Synthesis

Gemini converts the retrieved evidence into a concise research-oriented answer.

### 4. Validation

Supporting quotes and timestamps are checked against the underlying transcript data.

### 5. Scope Enforcement

When users specify a country or expert, the system restricts the analysis to that scope.

This architecture helps reduce hallucination and makes AI-generated research outputs easier to verify.

---

# 🧪 Validation & Testing

The project was validated against scenarios covering:

| Test | Validation                        |
| ---- | --------------------------------- |
| A    | Cross-market adoption barriers    |
| B    | ROI / TCO analysis                |
| C    | Surgeon training importance       |
| D    | Procurement timeline              |
| E    | Adoption growth evidence          |
| F    | Unsupported quantitative question |
| G    | France vs UK scoped comparison    |

The validation process checks:

* Retrieval accuracy
* Metadata preservation
* Quote validation
* Timestamp accuracy
* Evidence sufficiency
* Unsupported-number rejection
* Query/answer consistency
* Comparison scope
* Qualifier preservation
* Stale-response prevention

---

# 📊 Demonstration Dataset

The current application contains three expert interviews.

### 🇫🇷 France

**Dr. Jean Martin**

Key areas:

* Robotic surgery adoption
* Capital budget approval
* ROI
* Surgeon training
* Procedure growth
* Hospital procurement timeline

### 🇩🇪 Germany

**Anna Keller**

Key areas:

* Uneven adoption
* Purchase cost
* Utilisation
* Total cost of ownership
* Training
* Procurement timelines

### 🇬🇧 United Kingdom

**Dr. Emily Carter**

Key areas:

* NHS adoption
* Funding
* Training capacity
* Clinical outcomes
* Hospital strategy
* Sustainable implementation

---

# 🛠️ Technology Stack

| Layer           | Technology        |
| --------------- | ----------------- |
| Frontend        | React             |
| Language        | TypeScript        |
| Backend         | Node.js + Express |
| Build Tool      | Vite              |
| AI Model        | Google Gemini     |
| Styling         | Tailwind CSS      |
| Package Manager | npm               |
| Source Control  | GitHub            |
| Deployment      | Render            |

---

# 📁 Project Structure

```text
expert-insights-ai/
│
├── data/
│   ├── interview_guide.txt
│   ├── transcript_1_france.txt
│   ├── transcript_2_germany.txt
│   └── transcript_3_uk.txt
│
├── server/
│   ├── data.ts
│   ├── gemini.ts
│   ├── retrieval.ts
│   └── validation.ts
│
├── src/
│   ├── components/
│   ├── data/
│   └── ...
│
├── tests/
│   └── test_analysis.py
│
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── .gitignore
```

---

# 🚀 Local Development

## Prerequisites

* Node.js 20+
* npm
* Google Gemini API key

## Installation

```bash
git clone https://github.com/sivapalla2003/expert-insights-ai.git

cd expert-insights-ai

npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📦 Production Build

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

---

# ☁️ Deployment

The application is designed to run as a Node.js web service on Render.

### Build Command

```bash
npm install && npm run build
```

### Start Command

```bash
npm start
```

### Environment Variable

```text
GEMINI_API_KEY
```

The API key should be configured through the deployment platform's environment variables and should **never be committed to GitHub**.

---

# 🔮 Scaling Strategy

The current application uses a lightweight retrieval approach because the demonstration dataset contains only a small number of transcripts.

For larger research datasets, the architecture can evolve toward hybrid retrieval:

```text
                    User Question
                         │
                         ▼
                  Query Processing
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Keyword Search       Vector Search
            BM25              Embeddings
              │                     │
              └──────────┬──────────┘
                         ▼
                      Reranking
                         │
                         ▼
                  Metadata Filtering
                         │
                         ▼
                    Evidence Pack
                         │
                         ▼
                  Gemini Synthesis
                         │
                         ▼
                Citation Validation
```

Potential future improvements:

* Vector database integration
* Embedding-based retrieval
* Hybrid BM25 + semantic search
* Reranking
* Persistent document storage
* Authentication
* Automated transcript ingestion
* Research report export
* Larger evaluation datasets
* Multi-project workspaces

The current implementation intentionally keeps the architecture lightweight while maintaining a clear path for scaling.

---

# 💡 Key Engineering Principles

### Evidence over generation

The source material is more authoritative than the generated response.

### Traceability over black-box answers

Important conclusions should be traceable to their underlying evidence.

### Know when not to answer

A reliable AI system should recognize insufficient evidence rather than confidently generate unsupported information.

### Preserve qualifiers

Context such as geographic scope, conditions, and uncertainty should remain attached to the evidence.

### Simple architecture first

Infrastructure should be introduced according to actual scale requirements rather than adding unnecessary complexity.

---

# 🎯 Project Objective

The objective of **Expert Insights AI** is to demonstrate how Generative AI can be integrated into a practical expert-research workflow while maintaining:

**Accuracy → Evidence → Traceability → Scope → Reliability**

The project focuses not only on generating an answer, but also on making the answer **verifiable and explainable through its source evidence**.

---


This project is a technical demonstration for expert-interview analysis. The included transcripts and resulting insights are part of the demonstration dataset and should not be interpreted as independent market research, investment advice, or clinical guidance.
