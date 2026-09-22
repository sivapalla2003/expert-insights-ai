from typing import List, Optional, Dict, Any

try:
    from pydantic import BaseModel, Field
    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False

if HAS_PYDANTIC:
    class TranscriptSegment(BaseModel):
        id: str
        transcript_id: str
        expert: str
        role: str
        market: str
        speaker: str
        is_expert: bool
        timestamp: str
        text: str

    class Transcript(BaseModel):
        id: str
        expert: str
        role: str
        market: str
        raw_text: str
        segments: List[TranscriptSegment] = Field(default_factory=list)

    class ValidatedQuote(BaseModel):
        quote: str
        verbatim_text: Optional[str] = None
        expert: str
        market: str
        timestamp: str
        is_validated: bool = True
        confidence_score: float = 1.0
        validation_status: str = "verified"  # "verified", "fuzzy_matched", "unverified"
        warning_message: Optional[str] = None

    class IndividualAnalysis(BaseModel):
        expert: str
        role: str
        market: str
        question: str
        answer: str
        evidence: List[ValidatedQuote] = Field(default_factory=list)
        qualifiers_identified: List[str] = Field(default_factory=list)

    class CommonTheme(BaseModel):
        theme: str
        description: str
        experts: List[str] = Field(default_factory=list)

    class DifferenceItem(BaseModel):
        topic: str
        category: str
        description: str
        perspectives: List[Dict[str, Any]] = Field(default_factory=list)

    class CrossExpertAnalysis(BaseModel):
        question: str
        overall_synthesis: str
        expert_perspectives: List[Dict[str, Any]] = Field(default_factory=list)
        common_themes: List[CommonTheme] = Field(default_factory=list)
        differences: List[DifferenceItem] = Field(default_factory=list)
        evidence_list: List[ValidatedQuote] = Field(default_factory=list)

else:
    from dataclasses import dataclass, field

    @dataclass
    class TranscriptSegment:
        id: str
        transcript_id: str
        expert: str
        role: str
        market: str
        speaker: str
        is_expert: bool
        timestamp: str
        text: str

    @dataclass
    class Transcript:
        id: str
        expert: str
        role: str
        market: str
        raw_text: str
        segments: List[TranscriptSegment] = field(default_factory=list)

    @dataclass
    class ValidatedQuote:
        quote: str
        expert: str
        market: str
        timestamp: str
        verbatim_text: Optional[str] = None
        is_validated: bool = True
        confidence_score: float = 1.0
        validation_status: str = "verified"
        warning_message: Optional[str] = None

        def model_dump(self):
            return {
                "quote": self.quote,
                "expert": self.expert,
                "market": self.market,
                "timestamp": self.timestamp,
                "verbatim_text": self.verbatim_text,
                "is_validated": self.is_validated,
                "confidence_score": self.confidence_score,
                "validation_status": self.validation_status,
                "warning_message": self.warning_message,
            }

    @dataclass
    class IndividualAnalysis:
        expert: str
        role: str
        market: str
        question: str
        answer: str
        evidence: List[ValidatedQuote] = field(default_factory=list)
        qualifiers_identified: List[str] = field(default_factory=list)

    @dataclass
    class CommonTheme:
        theme: str
        description: str
        experts: List[str] = field(default_factory=list)

    @dataclass
    class DifferenceItem:
        topic: str
        category: str
        description: str
        perspectives: List[Dict[str, Any]] = field(default_factory=list)

    @dataclass
    class CrossExpertAnalysis:
        question: str
        overall_synthesis: str
        expert_perspectives: List[Dict[str, Any]] = field(default_factory=list)
        common_themes: List[CommonTheme] = field(default_factory=list)
        differences: List[DifferenceItem] = field(default_factory=list)
        evidence_list: List[ValidatedQuote] = field(default_factory=list)
