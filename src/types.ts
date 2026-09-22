export interface TranscriptSegment {
  id: string;
  transcriptId: string;
  expert: string;
  role: string;
  market: string;
  speaker: string;
  isExpert: boolean;
  timestamp: string;
  text: string;
}

export interface Transcript {
  id: string;
  expert: string;
  role: string;
  market: string;
  rawText: string;
  segments: TranscriptSegment[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  shortTitle: string;
  topic: string;
}

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

export interface IndividualAnalysisResponse {
  expert: string;
  role: string;
  market: string;
  question: string;
  answer: string;
  evidence: ValidatedQuote[];
  qualifiersIdentified: string[];
}

export interface CrossExpertAnalysisResponse {
  question: string;
  overallSynthesis: string;
  expertPerspectives: {
    expert: string;
    role: string;
    market: string;
    summary: string;
    evidence: ValidatedQuote[];
  }[];
  commonThemes: {
    theme: string;
    description: string;
    experts: string[];
  }[];
  differences: {
    topic: string;
    category: "Broad agreement" | "Different emphasis" | "Material difference";
    description: string;
    perspectives: { expert: string; stance: string }[];
  }[];
  evidenceList: ValidatedQuote[];
}

export interface ChatResponse {
  requestId: string;
  question: string;
  answer: string;
  evidence: ValidatedQuote[];
  insufficientEvidence: boolean;
  evidenceSufficiency: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT";
  scope: {
    isGlobal: boolean;
    allowedExperts: string[];
    allowedMarkets: string[];
    description: string;
  };
  retrievedSegmentCount: number;
  retrievedInfo?: {
    id: string;
    expert: string;
    market: string;
    timestamp: string;
    score: number;
    matchedKeywords: string[];
  }[];
  validationReport?: {
    allClaimsSupported: boolean;
    citationsBelongToCurrentQuestion: boolean;
    citationsBelongToScope: boolean;
    timestampsExact: boolean;
    quotesExact: boolean;
    numericalClaimsSupported: boolean;
    qualifiersPreserved: boolean;
    noStaleEvidence: boolean;
    noUnscopedEntities: boolean;
    passed: boolean;
  };
}
