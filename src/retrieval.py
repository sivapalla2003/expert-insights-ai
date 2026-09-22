import re
from typing import List, Optional, Tuple, Set
from src.models import TranscriptSegment

STOP_WORDS = {
    "what", "are", "the", "main", "how", "would", "you", "describe", "today",
    "is", "about", "for", "in", "to", "of", "and", "do", "does", "did",
    "can", "could", "should", "tell", "give", "me", "any", "some", "our",
    "your", "their", "this", "that", "these", "those", "with", "from",
    "at", "by", "as", "or", "so", "if", "be", "it", "an", "a"
}

TOPIC_CLUSTERS = [
    {
        "id": "barriers",
        "intent_terms": ["barrier", "barriers", "holding back", "hold back", "hurdle", "hurdles", "obstacle", "obstacles", "blocker", "stalls", "stall", "challenge"],
        "semantic_terms": ["issue", "issues", "cost", "capital budget", "budget approval", "approval", "pressure", "funding", "finances", "purchasing committee", "economic case"],
    },
    {
        "id": "adoption",
        "intent_terms": ["adoption", "adopt", "penetration", "uptake", "diffusion", "spread"],
        "semantic_terms": ["growing", "growth", "concentrated", "academic", "university", "regional", "waiting", "uneven", "standard", "access"],
    },
    {
        "id": "economics",
        "intent_terms": ["roi", "return", "economic", "economics", "budget", "budgets", "financial", "finance", "business case", "tco", "pay for itself"],
        "semantic_terms": ["procurement", "maintenance", "contracts", "ownership", "cost", "capital purchase", "expenditure", "amortization", "utilisation", "volume"],
    },
    {
        "id": "training",
        "intent_terms": ["training", "trained", "train", "surgeons", "surgeon", "theatre staff", "staff", "capacity"],
        "semantic_terms": ["operational", "comfortable", "skills", "learning curve", "sustainable", "programme"],
    },
    {
        "id": "outcomes",
        "intent_terms": ["outcomes", "outcome", "clinical", "patient", "clinical outcome", "clinical outcomes"],
        "semantic_terms": ["length of stay", "clinical position", "safety", "complications", "clinical argument", "clinical strategy"],
    },
    {
        "id": "growth",
        "intent_terms": ["trend", "growth", "grow", "3-5", "years", "future", "outlook", "accelerate", "accelerating"],
        "semantic_terms": ["percent", "annually", "steady", "gradual", "explosive", "double digits", "single digits", "dramatic jump"],
    },
    {
        "id": "timeline",
        "intent_terms": ["timeline", "decision", "how long", "duration", "process", "cycle", "budget cycle", "purchasing timeline"],
        "semantic_terms": ["months", "schedule", "procurement", "committee", "align", "timing", "serious"],
    },
]


def stem(w: str) -> str:
    word = w.lower().strip()
    if len(word) <= 3:
        return word
    if word.endswith("ies") and len(word) > 4:
        return word[:-3] + "y"
    if word.endswith("es") and any(word.endswith(x) for x in ["ches", "shes", "sses", "xes"]):
        return word[:-2]
    if word.endswith("s") and not any(word.endswith(x) for x in ["ss", "us", "is"]):
        word = word[:-1]
    if word.endswith("ing") and len(word) > 5:
        return word[:-3]
    if word.endswith("ed") and len(word) > 4:
        return word[:-2]
    if word.endswith("tion") and len(word) > 5:
        return word[:-4]
    if word.endswith("ment") and len(word) > 5:
        return word[:-4]
    return word


def tokenize(text: str) -> List[str]:
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", text.lower())
    return [t for t in cleaned.split() if len(t) > 1]


def text_matches_term(text: str, term: str) -> bool:
    if term in text:
        return True
    if term in ("holding back", "hold back"):
        return ("holding" in text or "hold" in text) and "back" in text
    if term == "capital budget":
        return "capital" in text and "budget" in text
    if term == "theatre staff":
        return "theatre" in text and "staff" in text
    return False


def retrieve_relevant_segments(
    query: str,
    all_segments: List[TranscriptSegment],
    top_k: int = 6,
    filter_expert: Optional[str] = None,
) -> List[Tuple[TranscriptSegment, float, List[str]]]:
    q_lower = query.lower()
    raw_tokens = tokenize(query)
    content_tokens = [t for t in raw_tokens if t not in STOP_WORDS]
    stemmed_content_tokens = [stem(t) for t in content_tokens]

    domain_topics: Set[str] = {"adoption"}

    matched_topics = [
        tc for tc in TOPIC_CLUSTERS
        if any(text_matches_term(q_lower, term) for term in tc["intent_terms"])
    ]

    focal_topic = None
    background_topic = None
    for tc in matched_topics:
        if tc["id"] not in domain_topics and focal_topic is None:
            focal_topic = tc
        elif tc["id"] in domain_topics and background_topic is None:
            background_topic = tc

    if focal_topic is None and matched_topics:
        focal_topic = matched_topics[0]

    results = []

    for idx, seg in enumerate(all_segments):
        if filter_expert and filter_expert.lower() not in seg.expert.lower():
            continue

        text_lower = seg.text.lower()
        seg_raw_tokens = tokenize(seg.text)
        seg_stemmed = [stem(t) for t in seg_raw_tokens]
        matched_keywords = set()

        score = 0.0

        prev_prompt: Optional[TranscriptSegment] = None
        if idx > 0 and seg.is_expert:
            prev = all_segments[idx - 1]
            if prev.expert == seg.expert and not prev.is_expert:
                prev_prompt = prev

        focal_matched_in_text = False
        focal_matched_in_prompt = False

        if focal_topic:
            for term in focal_topic["intent_terms"]:
                if text_matches_term(text_lower, term):
                    score += 6.0
                    focal_matched_in_text = True
                    matched_keywords.add(term)

            for term in focal_topic["semantic_terms"]:
                if text_matches_term(text_lower, term):
                    score += 4.0
                    focal_matched_in_text = True
                    matched_keywords.add(term)

            if prev_prompt:
                p_text = prev_prompt.text.lower()
                if any(text_matches_term(p_text, term) for term in focal_topic["intent_terms"]):
                    score += 10.0
                    focal_matched_in_prompt = True
                    matched_keywords.add(f"answering: {focal_topic['id']}")

                    if background_topic and any(text_matches_term(p_text, term) for term in background_topic["intent_terms"]):
                        score += 2.5
                        matched_keywords.add(f"answering: {background_topic['id']}")

        for i, ct in enumerate(content_tokens):
            sct = stemmed_content_tokens[i]
            if ct in seg_raw_tokens or sct in seg_stemmed:
                score += 3.0
                matched_keywords.add(ct)
            if prev_prompt:
                p_text = prev_prompt.text.lower()
                if ct in p_text or sct in p_text:
                    score += 3.0

        if background_topic:
            allow_domain_bonus = not focal_topic or focal_matched_in_text or focal_matched_in_prompt
            if allow_domain_bonus:
                for term in background_topic["intent_terms"]:
                    if text_matches_term(text_lower, term):
                        score += 2.0
                        matched_keywords.add(term)
                for term in background_topic["semantic_terms"]:
                    if text_matches_term(text_lower, term):
                        score += 1.0
                        matched_keywords.add(term)

        if focal_topic and not focal_matched_in_text and not focal_matched_in_prompt:
            score *= 0.15

        if seg.is_expert:
            score *= 1.6
        else:
            score *= 0.3

        if score > 0:
            results.append((seg, round(score, 2), list(matched_keywords)))

    results.sort(key=lambda x: x[1], reverse=True)
    return results[:top_k]

