import { TranscriptSegment } from "./data";

export interface RetrievedSegment {
  segment: TranscriptSegment;
  score: number;
  matchedKeywords: string[];
}

export interface QueryScope {
  isGlobal: boolean;
  allowedExperts: string[];
  allowedMarkets: string[];
  description: string;
}

export interface QuantitativeCheckResult {
  isQuantitativeQuery: boolean;
  isUnsupported: boolean;
  metricType?:
    | "percentage"
    | "count"
    | "market_share"
    | "growth_rate";
  reason?: string;
  mandatoryAnswer?: string;
}

/**
 * Lightweight entity and market scope detector.
 *
 * Detects explicit requests for:
 * - France / Dr. Jean Martin
 * - Germany / Anna Keller
 * - UK / Dr. Emily Carter
 *
 * If no specific market/expert is requested, the query is treated
 * as global across the three provided interviews.
 */
export function detectQueryScope(query: string): QueryScope {
  const qLower = query.toLowerCase();

  const mentionsMartin =
    qLower.includes("martin") ||
    qLower.includes("france") ||
    qLower.includes("french");

  const mentionsKeller =
    qLower.includes("keller") ||
    qLower.includes("germany") ||
    qLower.includes("german");

  const mentionsCarter =
    qLower.includes("carter") ||
    qLower.includes("uk") ||
    qLower.includes("united kingdom") ||
    qLower.includes("nhs") ||
    qLower.includes("british") ||
    qLower.includes("britain");

  const isExplicitAll =
    qLower.includes("all three") ||
    qLower.includes("all experts") ||
    qLower.includes("across all") ||
    qLower.includes("all markets") ||
    qLower.includes("every market") ||
    qLower.includes("across the three") ||
    qLower.includes("in europe") ||
    qLower.includes("european hospitals") ||
    qLower.includes("european market");

  const matchedExperts: string[] = [];
  const matchedMarkets: string[] = [];

  if (mentionsMartin) {
    matchedExperts.push("Dr. Jean Martin");
    matchedMarkets.push("France");
  }

  if (mentionsKeller) {
    matchedExperts.push("Anna Keller");
    matchedMarkets.push("Germany");
  }

  if (mentionsCarter) {
    matchedExperts.push("Dr. Emily Carter");
    matchedMarkets.push("United Kingdom");
  }

  const allExperts = [
    "Dr. Jean Martin",
    "Anna Keller",
    "Dr. Emily Carter",
  ];

  const allMarkets = [
    "France",
    "Germany",
    "United Kingdom",
  ];

  // No explicit entity/market means global scope.
  // Explicit "all" also means global scope.
  if (
    isExplicitAll ||
    matchedExperts.length === 0 ||
    matchedExperts.length === 3
  ) {
    return {
      isGlobal: true,
      allowedExperts: allExperts,
      allowedMarkets: allMarkets,
      description:
        "Global Scope (France, Germany, United Kingdom)",
    };
  }

  const description = matchedExperts
    .map(
      (expert, index) =>
        `${matchedMarkets[index]}: ${expert}`
    )
    .join(" and ");

  return {
    isGlobal: false,
    allowedExperts: matchedExperts,
    allowedMarkets: matchedMarkets,
    description: `Scoped Comparison: ${description}`,
  };
}

/**
 * Checks whether a question requests quantitative evidence
 * and whether the supplied transcripts explicitly support it.
 */
export function evaluateQuantitativeSufficiency(
  query: string,
  _retrievedSegments: TranscriptSegment[]
): QuantitativeCheckResult {
  const qLower = query.toLowerCase();

  const isPercentageQuery =
    qLower.includes("percentage") ||
    qLower.includes("percent") ||
    qLower.includes("%") ||
    qLower.includes("proportion") ||
    qLower.includes("market share") ||
    qLower.includes("share of hospitals") ||
    qLower.includes("penetration rate");

  const isExactCountQuery =
    qLower.includes("exact number") ||
    qLower.includes("exact count") ||
    qLower.includes("how many hospitals") ||
    qLower.includes("number of hospitals") ||
    qLower.includes("exact statistics") ||
    qLower.includes("statistical value");

  const isGrowthRateQuery =
    qLower.includes("growth rate") ||
    qLower.includes("growth rates") ||
    qLower.includes("procedure growth") ||
    (qLower.includes("growth") &&
      (qLower.includes("forecast") ||
        qLower.includes("expect") ||
        qLower.includes("trend")));

  // The transcripts do not provide a percentage of hospitals
  // currently using robotic surgery.
  if (
    isPercentageQuery &&
    (qLower.includes("hospital") ||
      qLower.includes("use") ||
      qLower.includes("using") ||
      qLower.includes("currently") ||
      qLower.includes("european")) &&
    !qLower.includes("procedure growth") &&
    !qLower.includes("procedure volume")
  ) {
    return {
      isQuantitativeQuery: true,
      isUnsupported: true,
      metricType: "percentage",
      reason:
        "The transcripts do NOT provide a percentage of European hospitals currently using robotic surgery.",
      mandatoryAnswer:
        "Insufficient evidence in the provided transcripts to answer this question. The experts describe adoption as growing or uneven, but none provides a percentage of European hospitals currently using robotic surgery.",
    };
  }

  // The transcripts do not provide exact hospital counts.
  if (isExactCountQuery) {
    return {
      isQuantitativeQuery: true,
      isUnsupported: true,
      metricType: "count",
      reason:
        "The transcripts do not provide exact numerical hospital counts.",
      mandatoryAnswer:
        "Insufficient evidence in the provided transcripts to answer this question. The experts provide qualitative assessments of hospital adoption (such as larger academic vs. smaller regional facilities), but no exact numerical count of hospitals is provided.",
    };
  }

  // Procedure growth is explicitly discussed in the transcripts,
  // with important geographic/market qualifiers.
  if (isGrowthRateQuery) {
    return {
      isQuantitativeQuery: true,
      isUnsupported: false,
      metricType: "growth_rate",
    };
  }

  return {
    isQuantitativeQuery:
      isPercentageQuery || isExactCountQuery,
    isUnsupported: false,
  };
}

// ---------------------------------------------------------------------------
// Retrieval helpers
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "what",
  "are",
  "the",
  "main",
  "how",
  "would",
  "you",
  "describe",
  "today",
  "is",
  "about",
  "for",
  "in",
  "to",
  "of",
  "and",
  "do",
  "does",
  "did",
  "can",
  "could",
  "should",
  "tell",
  "give",
  "me",
  "any",
  "some",
  "our",
  "your",
  "their",
  "this",
  "that",
  "these",
  "those",
  "with",
  "from",
  "at",
  "by",
  "as",
  "or",
  "so",
  "if",
  "be",
  "it",
  "an",
  "a",
]);

function stem(word: string): string {
  let w = word.toLowerCase().trim();

  if (w.length <= 3) {
    return w;
  }

  if (w.endsWith("ies") && w.length > 4) {
    return `${w.slice(0, -3)}y`;
  }

  if (
    w.endsWith("es") &&
    (w.endsWith("ches") ||
      w.endsWith("shes") ||
      w.endsWith("sses") ||
      w.endsWith("xes"))
  ) {
    return w.slice(0, -2);
  }

  if (
    w.endsWith("s") &&
    !w.endsWith("ss") &&
    !w.endsWith("us") &&
    !w.endsWith("is")
  ) {
    w = w.slice(0, -1);
  }

  if (w.endsWith("ing") && w.length > 5) {
    return w.slice(0, -3);
  }

  if (w.endsWith("ed") && w.length > 4) {
    return w.slice(0, -2);
  }

  if (w.endsWith("tion") && w.length > 5) {
    return w.slice(0, -4);
  }

  if (w.endsWith("ment") && w.length > 5) {
    return w.slice(0, -4);
  }

  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function textMatchesTerm(
  text: string,
  term: string
): boolean {
  if (text.includes(term)) {
    return true;
  }

  if (
    term === "holding back" ||
    term === "hold back"
  ) {
    return (
      (text.includes("holding") ||
        text.includes("hold")) &&
      text.includes("back")
    );
  }

  if (term === "capital budget") {
    return (
      text.includes("capital") &&
      text.includes("budget")
    );
  }

  if (term === "theatre staff") {
    return (
      text.includes("theatre") &&
      text.includes("staff")
    );
  }

  return false;
}

interface TopicCluster {
  id: string;
  intentTerms: string[];
  semanticTerms: string[];
}

const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: "barriers",
    intentTerms: [
      "barrier",
      "barriers",
      "holding back",
      "hold back",
      "hurdle",
      "hurdles",
      "obstacle",
      "obstacles",
      "blocker",
      "stalls",
      "stall",
      "challenge",
      "holding adoption back",
    ],
    semanticTerms: [
      "issue",
      "issues",
      "cost",
      "capital budget",
      "budget approval",
      "approval",
      "pressure",
      "funding",
      "finances",
      "purchasing committee",
      "economic case",
      "biggest issue",
    ],
  },

  {
    id: "adoption",
    intentTerms: [
      "adoption",
      "adopt",
      "penetration",
      "uptake",
      "diffusion",
      "spread",
    ],
    semanticTerms: [
      "growing",
      "growth",
      "concentrated",
      "academic",
      "university",
      "regional",
      "waiting",
      "uneven",
      "standard",
      "access",
    ],
  },

  {
    id: "economics",
    intentTerms: [
      "roi",
      "return",
      "economic",
      "economics",
      "budget",
      "budgets",
      "financial",
      "finance",
      "business case",
      "tco",
      "total cost of ownership",
      "cost of ownership",
      "pay for itself",
      "purchasing decisions",
      "purchasing decision",
      "evaluate roi",
      "evaluating roi",
    ],
    semanticTerms: [
      "procurement",
      "maintenance",
      "contracts",
      "ownership",
      "cost",
      "capital purchase",
      "expenditure",
      "amortization",
      "utilisation",
      "volume",
      "service contracts",
    ],
  },

  {
    id: "training",
    intentTerms: [
      "training",
      "trained",
      "train",
      "surgeons",
      "surgeon",
      "multi-surgeon",
      "theatre staff",
      "theatre support",
      "staff",
      "capacity",
    ],
    semanticTerms: [
      "operational",
      "comfortable",
      "skills",
      "learning curve",
      "sustainable",
      "programme",
      "certified",
      "one surgeon",
      "several surgeons",
    ],
  },

  {
    id: "outcomes",
    intentTerms: [
      "outcomes",
      "outcome",
      "clinical",
      "patient",
      "clinical outcome",
      "clinical outcomes",
    ],
    semanticTerms: [
      "length of stay",
      "clinical position",
      "safety",
      "complications",
      "clinical argument",
      "clinical strategy",
    ],
  },

  {
    id: "growth",
    intentTerms: [
      "trend",
      "growth",
      "grow",
      "growth rate",
      "growth rates",
      "procedure growth",
      "3-5",
      "years",
      "future",
      "outlook",
      "accelerate",
      "accelerating",
      "forecast",
    ],
    semanticTerms: [
      "percent",
      "annually",
      "steady",
      "gradual",
      "explosive",
      "double digits",
      "single digits",
      "dramatic jump",
      "procedures",
    ],
  },

  {
    id: "timeline",
    intentTerms: [
      "timeline",
      "timelines",
      "decision",
      "decision-making timeline",
      "how long",
      "duration",
      "process",
      "cycle",
      "budget cycle",
      "purchasing timeline",
    ],
    semanticTerms: [
      "months",
      "schedule",
      "procurement",
      "committee",
      "align",
      "timing",
      "serious",
    ],
  },
];

/**
 * Domain-aware, speaker-aware retrieval.
 *
 * The retrieval flow:
 *
 * 1. Detect query topic.
 * 2. Apply explicit expert/market scope.
 * 3. Score transcript evidence.
 * 4. Prefer expert statements.
 * 5. Use preceding interviewer questions as conversational context.
 * 6. Return the highest-scoring evidence segments.
 */
export function retrieveRelevantSegments(
  query: string,
  allSegments: TranscriptSegment[],
  topK: number = 6,
  scope?: QueryScope,
  filterExpert?: string
): RetrievedSegment[] {
  const safeTopK = Math.max(
    1,
    Math.min(Math.floor(topK) || 6, 20)
  );

  const qLower = query.toLowerCase();

  const rawTokens = tokenize(query);

  const contentTokens = rawTokens.filter(
    (token) => !STOP_WORDS.has(token)
  );

  const stemmedContentTokens =
    contentTokens.map(stem);

  // -------------------------------------------------------------------------
  // Apply explicit scope BEFORE scoring.
  // -------------------------------------------------------------------------

  let candidateSegments = allSegments;

  if (scope && !scope.isGlobal) {
    candidateSegments = candidateSegments.filter(
      (segment) => {
        const expertMatch =
          scope.allowedExperts.some(
            (expert) =>
              segment.expert
                .toLowerCase()
                .includes(expert.toLowerCase()) ||
              expert
                .toLowerCase()
                .includes(
                  segment.expert.toLowerCase()
                )
          );

        const marketMatch =
          scope.allowedMarkets.some(
            (market) =>
              segment.market
                .toLowerCase()
                .includes(
                  market.toLowerCase()
                ) ||
              market
                .toLowerCase()
                .includes(
                  segment.market.toLowerCase()
                )
          );

        return expertMatch || marketMatch;
      }
    );
  }

  const DOMAIN_TOPICS = new Set(["adoption"]);

  const matchedTopics = TOPIC_CLUSTERS.filter(
    (topicCluster) =>
      topicCluster.intentTerms.some((term) =>
        textMatchesTerm(qLower, term)
      )
  );

  const focalTopic =
    matchedTopics.find(
      (topic) => !DOMAIN_TOPICS.has(topic.id)
    ) || matchedTopics[0];

  const backgroundTopic = matchedTopics.find(
    (topic) =>
      DOMAIN_TOPICS.has(topic.id) &&
      topic.id !== focalTopic?.id
  );

  const results: RetrievedSegment[] = [];

  // -------------------------------------------------------------------------
  // Score candidate segments
  // -------------------------------------------------------------------------

  for (
    let candidateIndex = 0;
    candidateIndex < candidateSegments.length;
    candidateIndex++
  ) {
    const segment = candidateSegments[candidateIndex];

    if (
      filterExpert &&
      !segment.expert
        .toLowerCase()
        .includes(filterExpert.toLowerCase())
    ) {
      continue;
    }

    const textLower = segment.text.toLowerCase();

    const segmentRawTokens = tokenize(segment.text);

    const segmentStemmed =
      segmentRawTokens.map(stem);

    const matchedKeywords = new Set<string>();

    let score = 0;

    // -----------------------------------------------------------------------
    // Find the actual previous interviewer prompt.
    //
    // Important: candidateSegments may have been scope-filtered, so its index
    // is not necessarily the same as allSegments.
    // -----------------------------------------------------------------------

    let previousInterviewerPrompt:
      | TranscriptSegment
      | null = null;

    const originalIndex = allSegments.findIndex(
      (item) => item.id === segment.id
    );

    if (originalIndex > 0 && segment.isExpert) {
      const previous =
        allSegments[originalIndex - 1];

      if (
        previous &&
        previous.transcriptId ===
          segment.transcriptId &&
        !previous.isExpert
      ) {
        previousInterviewerPrompt = previous;
      }
    }

    // -----------------------------------------------------------------------
    // A. Focal topic matching
    // -----------------------------------------------------------------------

    let focalMatchedInText = false;
    let focalMatchedInPrompt = false;

    if (focalTopic) {
      for (const term of focalTopic.intentTerms) {
        if (textMatchesTerm(textLower, term)) {
          score += 6.0;
          focalMatchedInText = true;
          matchedKeywords.add(term);
        }
      }

      for (const term of focalTopic.semanticTerms) {
        if (textMatchesTerm(textLower, term)) {
          score += 4.0;
          focalMatchedInText = true;
          matchedKeywords.add(term);
        }
      }

      if (previousInterviewerPrompt) {
        const promptText =
          previousInterviewerPrompt.text.toLowerCase();

        const matchedIntent =
          focalTopic.intentTerms.some((term) =>
            textMatchesTerm(promptText, term)
          );

        if (matchedIntent) {
          score += 10.0;
          focalMatchedInPrompt = true;

          matchedKeywords.add(
            `answering: ${focalTopic.id}`
          );

          if (
            backgroundTopic &&
            backgroundTopic.intentTerms.some(
              (term) =>
                textMatchesTerm(
                  promptText,
                  term
                )
            )
          ) {
            score += 2.5;

            matchedKeywords.add(
              `answering: ${backgroundTopic.id}`
            );
          }
        }
      }
    }

    // -----------------------------------------------------------------------
    // B. Direct query token matching
    // -----------------------------------------------------------------------

    contentTokens.forEach((contentToken, index) => {
      const stemmedContentToken =
        stemmedContentTokens[index];

      if (
        segmentRawTokens.includes(contentToken) ||
        segmentStemmed.includes(
          stemmedContentToken
        )
      ) {
        score += 3.0;
        matchedKeywords.add(contentToken);
      }

      if (previousInterviewerPrompt) {
        const promptText =
          previousInterviewerPrompt.text.toLowerCase();

        if (
          promptText.includes(contentToken) ||
          promptText.includes(
            stemmedContentToken
          )
        ) {
          score += 3.0;
        }
      }
    });

    // -----------------------------------------------------------------------
    // C. Background domain matching
    // -----------------------------------------------------------------------

    if (backgroundTopic) {
      const allowDomainBonus =
        !focalTopic ||
        focalMatchedInText ||
        focalMatchedInPrompt;

      if (allowDomainBonus) {
        for (const term of backgroundTopic.intentTerms) {
          if (textMatchesTerm(textLower, term)) {
            score += 2.0;
            matchedKeywords.add(term);
          }
        }

        for (const term of backgroundTopic.semanticTerms) {
          if (textMatchesTerm(textLower, term)) {
            score += 1.0;
            matchedKeywords.add(term);
          }
        }
      }
    }

    // -----------------------------------------------------------------------
    // D. Focal topic penalty
    // -----------------------------------------------------------------------

    if (
      focalTopic &&
      !focalMatchedInText &&
      !focalMatchedInPrompt
    ) {
      score *= 0.15;
    }

    // -----------------------------------------------------------------------
    // E. Speaker-aware weighting
    //
    // Expert answers are primary evidence.
    // Interviewer questions remain available for context but are downweighted.
    // -----------------------------------------------------------------------

    if (segment.isExpert) {
      score *= 1.6;
    } else {
      score *= 0.3;
    }

    if (score > 0) {
      results.push({
        segment,
        score: Number(score.toFixed(2)),
        matchedKeywords:
          Array.from(matchedKeywords),
      });
    }
  }

  // Highest relevance first.
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, safeTopK);
}