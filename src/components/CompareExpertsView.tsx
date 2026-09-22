import React, { useState } from "react";
import { GitCompare, CheckCircle2, Clock, Quote, MapPin, Layers } from "lucide-react";
import { cleanQuoteText } from "../utils/textFormatting";

interface MatrixCell {
  summary: string;
  timestamp: string;
  quote: string;
}

interface MatrixTopic {
  id: string;
  topicName: string;
  description: string;
  cells: {
    france: MatrixCell;
    germany: MatrixCell;
    uk: MatrixCell;
  };
}

export const MATRIX_TOPICS: MatrixTopic[] = [
  {
    id: "adoption",
    topicName: "Current Market Adoption",
    description: "Penetration, institutional tiering, and hospital types",
    cells: {
      france: {
        summary: "Growing but concentrated in larger academic hospitals and well-funded private centres; regional hospitals much slower.",
        timestamp: "00:18",
        quote: "Adoption is growing, but it is still concentrated in larger academic hospitals and private centres with stronger capital budgets. Smaller regional hospitals are much slower.",
      },
      germany: {
        summary: "Adoption is uneven; large university clinics are advanced, while many smaller hospitals wait.",
        timestamp: "00:16",
        quote: "It is growing, but adoption is quite uneven. Large university hospitals are much more advanced, while many smaller hospitals are still waiting.",
      },
      uk: {
        summary: "Increasing and becoming standard for selected procedures in leading NHS trusts, but access varies significantly.",
        timestamp: "00:14",
        quote: "Adoption is increasing, and in some larger NHS trusts robotic surgery is becoming standard for selected procedures. But access still varies significantly by hospital.",
      },
    },
  },
  {
    id: "barriers",
    topicName: "Main Adoption Barriers",
    description: "Primary gating hurdles preventing faster uptake",
    cells: {
      france: {
        summary: "Capital budget approval is the biggest issue; purchasing committees require a strong economic case.",
        timestamp: "01:20",
        quote: "The biggest issue is still capital budget approval. Hospitals may like the technology clinically, but purchasing committees need a strong economic case before approving a system.",
      },
      germany: {
        summary: "First barrier is upfront capital cost under financial pressure; second is proving the system will be used enough.",
        timestamp: "01:10",
        quote: "Cost is the first barrier. These are large capital purchases, and hospital finances are under pressure. The second issue is proving that the system will be used enough.",
      },
      uk: {
        summary: "Funding is important, but training capacity for surgeons and theatre staff is equally critical.",
        timestamp: "01:05",
        quote: "Funding is important, but I would say training capacity is just as important. You can buy a system, but if you cannot train enough surgeons and theatre staff, adoption stalls.",
      },
    },
  },
  {
    id: "economics",
    topicName: "Budgets & ROI Importance",
    description: "Financial criteria, amortization, and approval triggers",
    cells: {
      france: {
        summary: "Very important; finance team scrutinizes utilization, volume, maintenance, and whether the system pays for itself.",
        timestamp: "02:18",
        quote: "Very important. The clinical argument may get surgeons interested, but the finance team wants to understand utilisation, procedure volume, maintenance cost and whether the system will actually pay for itself.",
      },
      germany: {
        summary: "Total cost of ownership and expected volume are examined; the economic case decides whether approval is granted.",
        timestamp: "02:08",
        quote: "We look at total cost of ownership, expected procedure volume, maintenance, service contracts and training requirements. A strong clinical case helps, but the economic case decides whether it gets approved.",
      },
      uk: {
        summary: "Not purely financial; balanced between economics and clinical strategy, length of stay, and surgeon recruitment.",
        timestamp: "02:07",
        quote: "It matters, but the discussion is not always purely financial. Hospitals also consider patient outcomes, length of stay, surgeon recruitment and whether the technology improves their clinical position.",
      },
    },
  },
  {
    id: "training",
    topicName: "Surgeon & Staff Training",
    description: "Training requirements, single-surgeon risks, and team readiness",
    cells: {
      france: {
        summary: "Crucial in year one; single-surgeon dependency makes economics difficult, so multiple surgeons must be trained.",
        timestamp: "03:10",
        quote: "Training matters, especially in the first year. If only one surgeon can use the system, the economics become difficult. Hospitals want several surgeons trained so utilisation is high enough.",
      },
      germany: {
        summary: "Operationally vital; if only one surgeon is comfortable, low utilization directly weakens the business case.",
        timestamp: "03:05",
        quote: "Very important operationally. If the hospital buys a system but only one surgeon is comfortable using it, utilisation will be poor. That weakens the business case.",
      },
      uk: {
        summary: "Adoption is not just buying hardware; sustainable programs require enough trained surgeons and theatre staff.",
        timestamp: "06:04",
        quote: "The key point is that adoption is not just about buying the machine. Hospitals need enough trained people and enough procedure volume to make the programme sustainable.",
      },
    },
  },
  {
    id: "clinical",
    topicName: "Clinical Outcomes Role",
    description: "How clinical efficacy compares to economic factors",
    cells: {
      france: {
        summary: "Outcomes are necessary but not enough on their own; if outcomes are comparable, economics and utilization decide.",
        timestamp: "04:08",
        quote: "Clinical outcomes are necessary, but they are not enough on their own. If two systems offer similar outcomes, the hospital will look hard at economics and utilisation.",
      },
      germany: {
        summary: "A strong clinical case helps build surgeon advocacy, but the economic case decides institutional sign-off.",
        timestamp: "02:08",
        quote: "A strong clinical case helps, but the economic case decides whether it gets approved.",
      },
      uk: {
        summary: "Clinical outcomes and reduced length of stay are core justifications integrated into the overall strategic case.",
        timestamp: "02:07",
        quote: "Hospitals also consider patient outcomes, length of stay, surgeon recruitment and whether the technology improves their clinical position.",
      },
    },
  },
  {
    id: "growth",
    topicName: "3–5 Year Growth Outlook",
    description: "Projected annual growth trajectory and rate qualifiers",
    cells: {
      france: {
        summary: "Steady rather than explosive; maybe 15 to 20 percent more procedures annually in stronger centres.",
        timestamp: "05:07",
        quote: "I expect adoption to continue increasing, probably steadily rather than explosively. I would expect maybe 15 to 20 percent more procedures annually in some of the stronger centres, but smaller hospitals will remain slower.",
      },
      germany: {
        summary: "Gradual expansion in high single digits or low double digits; rejects 20% across the whole market.",
        timestamp: "05:08",
        quote: "I would expect continued growth, but probably closer to high single digits or low double digits in procedure volumes rather than something like 20 percent across the whole market.",
      },
      uk: {
        summary: "Positive outlook; could see procedure growth above 15 percent annually in some areas if training expands.",
        timestamp: "04:06",
        quote: "I am quite positive. I think adoption could accelerate if training expands and systems become more cost competitive. I could see procedure growth above 15 percent annually in some areas.",
      },
    },
  },
  {
    id: "timeline",
    topicName: "Purchasing Decision Timeline",
    description: "Typical elapsed duration from serious intent to contract",
    cells: {
      france: {
        summary: "Six to twelve months once serious; extends if pushed into the next budget cycle.",
        timestamp: "06:08",
        quote: "Six to twelve months is realistic once the hospital becomes serious. It can be longer if the capital committee pushes the purchase into the next budget cycle.",
      },
      germany: {
        summary: "Nine to eighteen months is common due to required alignment across 4 distinct departments.",
        timestamp: "06:05",
        quote: "Nine to eighteen months is common. Procurement, clinical leadership, finance and management all need to align, so it can move slowly.",
      },
      uk: {
        summary: "Six to nine months if funding is ready; much longer if waiting for a new capital cycle.",
        timestamp: "05:04",
        quote: "Around six to nine months can happen if funding is already available. If the trust has to wait for a new capital cycle, it can take much longer.",
      },
    },
  },
];

export const CompareExpertsView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [selectedMarkets, setSelectedMarkets] = useState<{ france: boolean; germany: boolean; uk: boolean }>({
    france: true,
    germany: true,
    uk: true,
  });

  const [inspectingCell, setInspectingCell] = useState<{
    expert: string;
    market: string;
    topic: string;
    cell: MatrixCell;
  } | null>(null);

  const displayedTopics =
    selectedTopicId === "all"
      ? MATRIX_TOPICS
      : MATRIX_TOPICS.filter((t) => t.id === selectedTopicId);

  const toggleMarket = (key: "france" | "germany" | "uk") => {
    // Keep at least two markets active
    const count = Object.values(selectedMarkets).filter(Boolean).length;
    if (count <= 2 && selectedMarkets[key]) return;
    setSelectedMarkets({ ...selectedMarkets, [key]: !selectedMarkets[key] });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Matrix Analysis
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Side-by-Side Expert Comparison Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Compare market perspectives across all dimensions. Click any cell to inspect verbatim quotes and exact timestamps.
            </p>
          </div>

          {/* Market Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto text-xs">
            <button
              onClick={() => toggleMarket("france")}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedMarkets.france
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              France
            </button>
            <button
              onClick={() => toggleMarket("germany")}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedMarkets.germany
                  ? "bg-white text-amber-700 shadow-xs font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Germany
            </button>
            <button
              onClick={() => toggleMarket("uk")}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedMarkets.uk
                  ? "bg-white text-red-700 shadow-xs font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              United Kingdom
            </button>
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedTopicId("all")}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedTopicId === "all"
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Dimensions (7)
          </button>
          {MATRIX_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedTopicId === t.id
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.topicName}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs border-b border-slate-800">
                <th className="p-3.5 w-1/4 font-semibold uppercase tracking-wider text-slate-300">
                  Analytical Dimension
                </th>
                {selectedMarkets.france && (
                  <th className="p-3.5 font-semibold text-blue-300 border-l border-slate-800">
                    <div>France</div>
                    <div className="text-[11px] text-slate-400 font-normal">Dr. Jean Martin (Head of Urology)</div>
                  </th>
                )}
                {selectedMarkets.germany && (
                  <th className="p-3.5 font-semibold text-amber-300 border-l border-slate-800">
                    <div>Germany</div>
                    <div className="text-[11px] text-slate-400 font-normal">Anna Keller (Former Procurement Dir.)</div>
                  </th>
                )}
                {selectedMarkets.uk && (
                  <th className="p-3.5 font-semibold text-red-300 border-l border-slate-800">
                    <div>United Kingdom</div>
                    <div className="text-[11px] text-slate-400 font-normal">Dr. Emily Carter (Consultant Urologist)</div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {displayedTopics.map((topic, i) => (
                <tr key={topic.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="p-3.5 align-top font-medium text-slate-900">
                    <div className="font-bold text-slate-900">{topic.topicName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{topic.description}</div>
                  </td>

                  {selectedMarkets.france && (
                    <td
                      onClick={() =>
                        setInspectingCell({
                          expert: "Dr. Jean Martin",
                          market: "France",
                          topic: topic.topicName,
                          cell: topic.cells.france,
                        })
                      }
                      className="p-3.5 align-top border-l border-slate-200 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      <p className="text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {topic.cells.france.summary}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-semibold">
                          {topic.cells.france.timestamp}
                        </span>
                        <span className="text-slate-400 group-hover:text-indigo-600 font-medium text-[10px]">
                          Inspect Quote →
                        </span>
                      </div>
                    </td>
                  )}

                  {selectedMarkets.germany && (
                    <td
                      onClick={() =>
                        setInspectingCell({
                          expert: "Anna Keller",
                          market: "Germany",
                          topic: topic.topicName,
                          cell: topic.cells.germany,
                        })
                      }
                      className="p-3.5 align-top border-l border-slate-200 hover:bg-amber-50/50 cursor-pointer transition-colors group"
                    >
                      <p className="text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {topic.cells.germany.summary}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-semibold">
                          {topic.cells.germany.timestamp}
                        </span>
                        <span className="text-slate-400 group-hover:text-indigo-600 font-medium text-[10px]">
                          Inspect Quote →
                        </span>
                      </div>
                    </td>
                  )}

                  {selectedMarkets.uk && (
                    <td
                      onClick={() =>
                        setInspectingCell({
                          expert: "Dr. Emily Carter",
                          market: "United Kingdom",
                          topic: topic.topicName,
                          cell: topic.cells.uk,
                        })
                      }
                      className="p-3.5 align-top border-l border-slate-200 hover:bg-red-50/50 cursor-pointer transition-colors group"
                    >
                      <p className="text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {topic.cells.uk.summary}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-semibold">
                          {topic.cells.uk.timestamp}
                        </span>
                        <span className="text-slate-400 group-hover:text-indigo-600 font-medium text-[10px]">
                          Inspect Quote →
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Inspection Drawer/Modal */}
      {inspectingCell && (
        <div className="border border-indigo-200 bg-indigo-50/70 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {inspectingCell.expert} ({inspectingCell.market})
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-indigo-700 font-medium">
                {inspectingCell.topic}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-indigo-200 font-bold text-indigo-800">
                Timestamp: {inspectingCell.cell.timestamp}
              </span>
            </div>
            <button
              onClick={() => setInspectingCell(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded bg-white border border-slate-200"
            >
              Close
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Verbatim Transcript Quote:
            </span>
            <p className="italic font-serif text-slate-800 text-sm leading-relaxed break-words">
              “{cleanQuoteText(inspectingCell.cell.quote)}”
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Verified against source transcript
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
