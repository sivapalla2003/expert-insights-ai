import { TranscriptSegment } from "./data";

export interface ValidatedQuote {
  quote: string;
  verbatimText?: string;
  expert: string;
  market: string;
  timestamp: string;
  isValidated: boolean;
  confidenceScore: number;
  validationStatus: "verified" | "fuzzy_matched" | "unverified";
  warningMessage?: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[“’”"']/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates whether a candidate quote exists in the source transcript segments for the specified expert and timestamp.
 */
export function validateQuote(
  candidateQuote: string,
  candidateTimestamp: string,
  candidateExpert: string,
  segments: TranscriptSegment[]
): ValidatedQuote {
  // Find matching expert segments
  const expertSegments = segments.filter(
    (s) =>
      s.isExpert &&
      (s.expert.toLowerCase().includes(candidateExpert.toLowerCase()) ||
        candidateExpert.toLowerCase().includes(s.expert.toLowerCase()) ||
        s.market.toLowerCase().includes(candidateExpert.toLowerCase()))
  );

  // First look for exact timestamp match
  const timestampSegment = expertSegments.find((s) => s.timestamp === candidateTimestamp);

  const cleanQuote = normalize(candidateQuote);

  if (timestampSegment) {
    const cleanSegment = normalize(timestampSegment.text);

    // 1. Direct substring inclusion
    if (cleanSegment.includes(cleanQuote)) {
      return {
        quote: candidateQuote,
        verbatimText: timestampSegment.text,
        expert: timestampSegment.expert,
        market: timestampSegment.market,
        timestamp: timestampSegment.timestamp,
        isValidated: true,
        confidenceScore: 1.0,
        validationStatus: "verified",
      };
    }

    // 2. High-similarity token overlap or substring match
    const quoteWords = cleanQuote.split(" ").filter((w) => w.length > 2);
    const matchedWords = quoteWords.filter((w) => cleanSegment.includes(w));
    const ratio = quoteWords.length > 0 ? matchedWords.length / quoteWords.length : 0;

    if (ratio >= 0.75) {
      return {
        quote: timestampSegment.text, // auto-ground to exact source text
        verbatimText: timestampSegment.text,
        expert: timestampSegment.expert,
        market: timestampSegment.market,
        timestamp: timestampSegment.timestamp,
        isValidated: true,
        confidenceScore: ratio,
        validationStatus: "fuzzy_matched",
      };
    }
  }

  // Fallback: search across all segments of that expert
  for (const seg of expertSegments) {
    const cleanSeg = normalize(seg.text);
    if (cleanSeg.includes(cleanQuote) || cleanQuote.includes(cleanSeg)) {
      return {
        quote: seg.text,
        verbatimText: seg.text,
        expert: seg.expert,
        market: seg.market,
        timestamp: seg.timestamp,
        isValidated: true,
        confidenceScore: 0.9,
        validationStatus: "verified",
        warningMessage:
          seg.timestamp !== candidateTimestamp
            ? `Corrected timestamp from ${candidateTimestamp} to ${seg.timestamp} based on exact transcript source.`
            : undefined,
      };
    }
  }

  // Could not be validated
  return {
    quote: candidateQuote,
    expert: candidateExpert,
    market: expertSegments[0]?.market || "Unknown",
    timestamp: candidateTimestamp || "Unknown",
    isValidated: false,
    confidenceScore: 0.0,
    validationStatus: "unverified",
    warningMessage: "Quote could not be validated against the source transcript.",
  };
}
