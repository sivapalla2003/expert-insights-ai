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

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    shortTitle: "Adoption & Penetration",
    topic: "adoption",
    question:
      "How would you describe current adoption of robotic surgery in your market?",
  },
  {
    id: 2,
    shortTitle: "Barriers to Adoption",
    topic: "barriers",
    question: "What are the main barriers to adoption?",
  },
  {
    id: 3,
    shortTitle: "Budgets & ROI Importance",
    topic: "economics",
    question:
      "How important are hospital budgets and ROI in purchasing decisions?",
  },
  {
    id: 4,
    shortTitle: "Surgeon Training & Clinical Outcomes",
    topic: "training",
    question:
      "How important are surgeon training and clinical outcomes?",
  },
  {
    id: 5,
    shortTitle: "3–5 Year Adoption Trend",
    topic: "growth",
    question:
      "What adoption trend do you expect over the next 3–5 years?",
  },
  {
    id: 6,
    shortTitle: "Purchasing Decision Timeline",
    topic: "timeline",
    question:
      "What is the typical hospital decision-making timeline for purchasing a new robotic system?",
  },
];

export const PROJECT_METADATA = {
  company: "Hasamex",
  role: "AI Engineer / GenAI Engineer",
  project: "European Robotic Surgery Market",
  subtitle: "Evidence-grounded analysis of expert interviews",
  objective:
    "Understand hospital adoption, barriers, economics, and purchasing behaviour for robotic surgery systems in Europe.",
  expertsCount: 3,
  marketsCount: 3,
  questionsCount: 6,
  markets: ["France", "Germany", "United Kingdom"],
};

export const RAW_TRANSCRIPT_1 = `Expert:
Dr. Jean Martin

Role:
Head of Urology

Market:
France

00:00
Interviewer: Thanks for joining. To begin, how would you describe robotic surgery adoption in France today?

00:18
Dr. Martin: Adoption is growing, but it is still concentrated in larger academic hospitals and private centres with stronger capital budgets. Smaller regional hospitals are much slower.

01:12
Interviewer: What is holding adoption back?

01:20
Dr. Martin: The biggest issue is still capital budget approval. Hospitals may like the technology clinically, but purchasing committees need a strong economic case before approving a system.

02:14
Interviewer: So ROI is important?

02:18
Dr. Martin: Very important. The clinical argument may get surgeons interested, but the finance team wants to understand utilisation, procedure volume, maintenance cost and whether the system will actually pay for itself.

03:05
Interviewer: What about training?

03:10
Dr. Martin: Training matters, especially in the first year. If only one surgeon can use the system, the economics become difficult. Hospitals want several surgeons trained so utilisation is high enough.

04:02
Interviewer: Are clinical outcomes still the main driver?

04:08
Dr. Martin: Clinical outcomes are necessary, but they are not enough on their own. If two systems offer similar outcomes, the hospital will look hard at economics and utilisation.

05:00
Interviewer: What do you expect over the next three to five years?

05:07
Dr. Martin: I expect adoption to continue increasing, probably steadily rather than explosively. I would expect maybe 15 to 20 percent more procedures annually in some of the stronger centres, but smaller hospitals will remain slower.

06:02
Interviewer: How long does a purchase decision normally take?

06:08
Dr. Martin: Six to twelve months is realistic once the hospital becomes serious. It can be longer if the capital committee pushes the purchase into the next budget cycle.`;

export const RAW_TRANSCRIPT_2 = `Expert:
Anna Keller

Role:
Former Hospital Procurement Director

Market:
Germany

00:00
Interviewer: How would you describe robotic surgery adoption in Germany today?

00:16
Anna Keller: It is growing, but adoption is quite uneven. Large university hospitals are much more advanced, while many smaller hospitals are still waiting.

01:05
Interviewer: What are the main barriers?

01:10
Anna Keller: Cost is the first barrier. These are large capital purchases, and hospital finances are under pressure. The second issue is proving that the system will be used enough.

02:03
Interviewer: What does procurement focus on?

02:08
Anna Keller: We look at total cost of ownership, expected procedure volume, maintenance, service contracts and training requirements. A strong clinical case helps, but the economic case decides whether it gets approved.

03:00
Interviewer: How important is surgeon training?

03:05
Anna Keller: Very important operationally. If the hospital buys a system but only one surgeon is comfortable using it, utilisation will be poor. That weakens the business case.

04:04
Interviewer: Do you expect adoption to accelerate?

04:09
Anna Keller: Yes, but I would not expect a dramatic jump. I think growth will be gradual, especially because many hospitals have other competing capital priorities.

05:02
Interviewer: Any rough expectation over the next three to five years?

05:08
Anna Keller: I would expect continued growth, but probably closer to high single digits or low double digits in procedure volumes rather than something like 20 percent across the whole market.

06:00
Interviewer: How long can the purchase process take?

06:05
Anna Keller: Nine to eighteen months is common. Procurement, clinical leadership, finance and management all need to align, so it can move slowly.`;

export const RAW_TRANSCRIPT_3 = `Expert:
Dr. Emily Carter

Role:
Consultant Urologist

Market:
United Kingdom

00:00
Interviewer: How would you describe adoption in the UK?

00:14
Dr. Carter: Adoption is increasing, and in some larger NHS trusts robotic surgery is becoming standard for selected procedures. But access still varies significantly by hospital.

01:00
Interviewer: What are the main barriers?

01:05
Dr. Carter: Funding is important, but I would say training capacity is just as important. You can buy a system, but if you cannot train enough surgeons and theatre staff, adoption stalls.

02:02
Interviewer: How important is ROI?

02:07
Dr. Carter: It matters, but the discussion is not always purely financial. Hospitals also consider patient outcomes, length of stay, surgeon recruitment and whether the technology improves their clinical position.

03:03
Interviewer: So would you say economics are less important in the UK?

03:10
Dr. Carter: I would say economics and clinical strategy are balanced. I would not say finance alone decides the purchase.

04:01
Interviewer: What is your outlook for the next three to five years?

04:06
Dr. Carter: I am quite positive. I think adoption could accelerate if training expands and systems become more cost competitive. I could see procedure growth above 15 percent annually in some areas.

05:00
Interviewer: What about purchase timelines?

05:04
Dr. Carter: Around six to nine months can happen if funding is already available. If the trust has to wait for a new capital cycle, it can take much longer.

06:00
Interviewer: Any final thought?

06:04
Dr. Carter: The key point is that adoption is not just about buying the machine. Hospitals need enough trained people and enough procedure volume to make the programme sustainable.`;

export function parseTranscriptText(
  id: string,
  rawText: string
): Transcript {
  const lines = rawText.split(/\r?\n/);

  let expert = "";
  let role = "";
  let market = "";

  // -------------------------------------------------------------------------
  // Parse transcript header metadata
  // -------------------------------------------------------------------------

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^Expert:/i.test(line)) {
      const inlineValue = line.replace(/^Expert:/i, "").trim();

      if (inlineValue) {
        expert = inlineValue;
      } else if (lines[i + 1]) {
        expert = lines[i + 1].trim();
      }

      continue;
    }

    if (/^Role:/i.test(line)) {
      const inlineValue = line.replace(/^Role:/i, "").trim();

      if (inlineValue) {
        role = inlineValue;
      } else if (lines[i + 1]) {
        role = lines[i + 1].trim();
      }

      continue;
    }

    if (/^Market:/i.test(line)) {
      const inlineValue = line.replace(/^Market:/i, "").trim();

      if (inlineValue) {
        market = inlineValue;
      } else if (lines[i + 1]) {
        market = lines[i + 1].trim();
      }

      continue;
    }

    // Once timestamps begin, header parsing is complete.
    if (/^\d{2}:\d{2}$/.test(line)) {
      break;
    }
  }

  // -------------------------------------------------------------------------
  // Fallback metadata
  // -------------------------------------------------------------------------

  if (!expert) {
    const normalizedId = id.toLowerCase();

    if (
      normalizedId.includes("france") ||
      normalizedId.includes("transcript_1")
    ) {
      expert = "Dr. Jean Martin";
      role = "Head of Urology";
      market = "France";
    } else if (
      normalizedId.includes("germany") ||
      normalizedId.includes("transcript_2")
    ) {
      expert = "Anna Keller";
      role = "Former Hospital Procurement Director";
      market = "Germany";
    } else if (
      normalizedId.includes("uk") ||
      normalizedId.includes("united_kingdom") ||
      normalizedId.includes("transcript_3")
    ) {
      expert = "Dr. Emily Carter";
      role = "Consultant Urologist";
      market = "United Kingdom";
    }
  }

  // -------------------------------------------------------------------------
  // Parse timestamped transcript segments
  // -------------------------------------------------------------------------

  const segments: TranscriptSegment[] = [];

  const timestampRegex =
    /(?:^|\n)(\d{2}:\d{2})\s*\n?([^:\n]+):\s*([\s\S]*?)(?=(?:\n\d{2}:\d{2}\s*\n|$))/g;

  let match: RegExpExecArray | null = null;
  let segmentIndex = 0;

  while ((match = timestampRegex.exec(rawText)) !== null) {
    const timestamp = match[1].trim();
    const speaker = match[2].trim();
    const text = match[3]
      .trim()
      .replace(/\s+/g, " ");

    if (!timestamp || !speaker || !text) {
      continue;
    }

    const isExpert =
      !speaker.toLowerCase().includes("interviewer");

    segments.push({
      id: `${id}_seg_${segmentIndex++}`,
      transcriptId: id,
      expert,
      role,
      market,
      speaker,
      isExpert,
      timestamp,
      text,
    });
  }

  return {
    id,
    expert,
    role,
    market,
    rawText,
    segments,
  };
}

// ---------------------------------------------------------------------------
// Default Hasamex case-study transcripts
// ---------------------------------------------------------------------------

export const INITIAL_TRANSCRIPTS: Transcript[] = [
  parseTranscriptText(
    "transcript_1_france",
    RAW_TRANSCRIPT_1
  ),
  parseTranscriptText(
    "transcript_2_germany",
    RAW_TRANSCRIPT_2
  ),
  parseTranscriptText(
    "transcript_3_uk",
    RAW_TRANSCRIPT_3
  ),
];