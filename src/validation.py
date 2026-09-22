import re
from typing import List
from src.models import TranscriptSegment, ValidatedQuote


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[“’”\"\']", "", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def validate_quote(
    candidate_quote: str,
    candidate_timestamp: str,
    candidate_expert: str,
    all_segments: List[TranscriptSegment],
) -> ValidatedQuote:
    # Filter segments for this expert
    expert_segments = [
        s for s in all_segments
        if s.is_expert and (
            candidate_expert.lower() in s.expert.lower()
            or s.expert.lower() in candidate_expert.lower()
            or candidate_expert.lower() in s.market.lower()
        )
    ]

    target_seg = next((s for s in expert_segments if s.timestamp == candidate_timestamp), None)
    clean_quote = normalize_text(candidate_quote)

    if target_seg:
        clean_seg = normalize_text(target_seg.text)
        if clean_quote in clean_seg:
            return ValidatedQuote(
                quote=candidate_quote,
                verbatim_text=target_seg.text,
                expert=target_seg.expert,
                market=target_seg.market,
                timestamp=target_seg.timestamp,
                is_validated=True,
                confidence_score=1.0,
                validation_status="verified",
            )

        # Word overlap check
        quote_words = [w for w in clean_quote.split() if len(w) > 2]
        matched_words = [w for w in quote_words if w in clean_seg]
        ratio = len(matched_words) / len(quote_words) if quote_words else 0

        if ratio >= 0.70:
            return ValidatedQuote(
                quote=target_seg.text,  # ground to exact verbatim
                verbatim_text=target_seg.text,
                expert=target_seg.expert,
                market=target_seg.market,
                timestamp=target_seg.timestamp,
                is_validated=True,
                confidence_score=ratio,
                validation_status="fuzzy_matched",
            )

    # Search other segments of same expert
    for seg in expert_segments:
        clean_seg = normalize_text(seg.text)
        if clean_quote in clean_seg or clean_seg in clean_quote:
            return ValidatedQuote(
                quote=seg.text,
                verbatim_text=seg.text,
                expert=seg.expert,
                market=seg.market,
                timestamp=seg.timestamp,
                is_validated=True,
                confidence_score=0.9,
                validation_status="verified",
                warning_message=f"Adjusted timestamp from {candidate_timestamp} to {seg.timestamp} based on exact transcript source."
                if seg.timestamp != candidate_timestamp else None,
            )

    # Unverified
    return ValidatedQuote(
        quote=candidate_quote,
        expert=candidate_expert,
        market=expert_segments[0].market if expert_segments else "Unknown",
        timestamp=candidate_timestamp or "Unknown",
        is_validated=False,
        confidence_score=0.0,
        validation_status="unverified",
        warning_message="Quote could not be validated against the source transcript.",
    )
