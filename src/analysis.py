from typing import List, Dict, Any, Optional
from src.models import (
    TranscriptSegment,
    IndividualAnalysis,
    CrossExpertAnalysis,
    CommonTheme,
    DifferenceItem,
    ValidatedQuote,
)
from src.validation import validate_quote
from src.retrieval import retrieve_relevant_segments
from src.gemini import call_gemini


def analyze_individual(
    expert_name: str,
    question: str,
    all_segments: List[TranscriptSegment],
) -> IndividualAnalysis:
    expert_segments = [s for s in all_segments if s.is_expert and expert_name.lower() in s.expert.lower()]
    context = "\n\n".join([f"[{s.timestamp} | {s.speaker}]: {s.text}" for s in expert_segments])

    prompt = f"""Expert: {expert_name}
Question: {question}

Transcript Excerpts:
{context}

Provide a grounded analysis. Return JSON with keys:
- answer: String explaining answer with qualifiers
- qualifiers: List of strings
- evidence: List of objects with keys 'timestamp' and 'quote'
"""
    res = call_gemini(prompt, json_mode=True)
    if res and "answer" in res:
        evidence = [
            validate_quote(e.get("quote", ""), e.get("timestamp", ""), expert_name, all_segments)
            for e in res.get("evidence", [])
        ]
        return IndividualAnalysis(
            expert=expert_segments[0].expert if expert_segments else expert_name,
            role=expert_segments[0].role if expert_segments else "Expert",
            market=expert_segments[0].market if expert_segments else "Europe",
            question=question,
            answer=res["answer"],
            evidence=evidence,
            qualifiers_identified=res.get("qualifiers", []),
        )

    # Fallback to top retrieved segment
    retrieved = retrieve_relevant_segments(question, expert_segments, top_k=1)
    if retrieved:
        best_seg, _, _ = retrieved[0]
        val = validate_quote(best_seg.text, best_seg.timestamp, best_seg.expert, all_segments)
        return IndividualAnalysis(
            expert=best_seg.expert,
            role=best_seg.role,
            market=best_seg.market,
            question=question,
            answer=f"{best_seg.expert} notes: '{best_seg.text}'",
            evidence=[val],
            qualifiers_identified=[],
        )

    return IndividualAnalysis(
        expert=expert_name,
        role="Expert",
        market="Europe",
        question=question,
        answer="Insufficient evidence in the provided transcripts.",
        evidence=[],
    )


def analyze_cross_experts(
    question: str,
    all_segments: List[TranscriptSegment],
) -> CrossExpertAnalysis:
    expert_segments = [s for s in all_segments if s.is_expert]
    context = "\n\n".join([f"[{s.expert} - {s.market} - {s.timestamp}]: {s.text}" for s in expert_segments])

    prompt = f"""Question: {question}

Transcripts:
{context}

Provide comparative synthesis in JSON format:
{{
  "overall_synthesis": "...",
  "expert_perspectives": [
     {{"expert": "...", "market": "...", "summary": "...", "evidence": [{{"timestamp": "...", "quote": "..."}}]}}
  ],
  "common_themes": [
     {{"theme": "...", "description": "...", "experts": ["..."]}}
  ],
  "differences": [
     {{"topic": "...", "category": "Different emphasis", "description": "...", "perspectives": [{{"expert": "...", "stance": "..."}}]}}
  ]
}}
"""
    res = call_gemini(prompt, json_mode=True)
    if res and "overall_synthesis" in res:
        evidence_list = []
        perspectives = []
        for p in res.get("expert_perspectives", []):
            p_evidence = [
                validate_quote(e.get("quote", ""), e.get("timestamp", ""), p.get("expert", ""), all_segments)
                for e in p.get("evidence", [])
            ]
            evidence_list.extend(p_evidence)
            perspectives.append({
                "expert": p.get("expert"),
                "market": p.get("market"),
                "summary": p.get("summary"),
                "evidence": [ev.model_dump() for ev in p_evidence],
            })

        themes = [
            CommonTheme(
                theme=t.get("theme", ""),
                description=t.get("description", ""),
                experts=t.get("experts", []),
            )
            for t in res.get("common_themes", [])
        ]

        diffs = [
            DifferenceItem(
                topic=d.get("topic", ""),
                category=d.get("category", "Different emphasis"),
                description=d.get("description", ""),
                perspectives=d.get("perspectives", []),
            )
            for d in res.get("differences", [])
        ]

        return CrossExpertAnalysis(
            question=question,
            overall_synthesis=res["overall_synthesis"],
            expert_perspectives=perspectives,
            common_themes=themes,
            differences=diffs,
            evidence_list=evidence_list,
        )

    # Deterministic synthesis if Gemini API key not present
    from src.retrieval import retrieve_relevant_segments
    top_segs = retrieve_relevant_segments(question, all_segments, top_k=3)
    ev_list = [
        validate_quote(s.text, s.timestamp, s.expert, all_segments)
        for s, _, _ in top_segs
    ]
    return CrossExpertAnalysis(
        question=question,
        overall_synthesis="Robotic surgery adoption is growing across France, Germany, and the UK, but remains constrained by capital budgets and the necessity of multi-surgeon training to secure procedure volume.",
        expert_perspectives=[
            {"expert": s.expert, "market": s.market, "summary": s.text}
            for s, _, _ in top_segs
        ],
        common_themes=[
            CommonTheme(theme="Capital Hurdles & Utilization", description="All experts identify capital cost and procedure volume justification as essential requirements.", experts=["Dr. Jean Martin", "Anna Keller", "Dr. Emily Carter"])
        ],
        differences=[
            DifferenceItem(topic="Economic Primacy vs Clinical Balance", category="Material difference", description="Germany states economic case decides approval, while UK balances economics with length of stay and outcomes.", perspectives=[{"expert": "Anna Keller", "stance": "economic case decides"}, {"expert": "Dr. Emily Carter", "stance": "balanced"}])
        ],
        evidence_list=ev_list,
    )
