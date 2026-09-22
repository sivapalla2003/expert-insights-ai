import React, { useState } from "react";
import { Split, CheckCircle2, AlertTriangle, HelpCircle, MapPin, Clock, Quote } from "lucide-react";
import { cleanQuoteText } from "../utils/textFormatting";

interface DisagreementItem {
  id: string;
  topic: string;
  category: "Material difference" | "Different emphasis" | "Broad agreement";
  overview: string;
  perspectives: {
    expert: string;
    role: string;
    market: string;
    timestamp: string;
    stance: string;
    quote: string;
  }[];
}

export const DISAGREEMENTS_DATA: DisagreementItem[] = [
  {
    id: "role-of-economics",
    topic: "Role of Economics vs Clinical Strategy in Purchasing",
    category: "Material difference",
    overview:
      "A clear structural divergence exists between German procurement governance (where the financial/TCO case is decisive) and the UK NHS model (where economics and clinical strategy are balanced alongside length of stay and surgeon recruitment).",
    perspectives: [
      {
        expert: "Anna Keller",
        role: "Former Hospital Procurement Director",
        market: "Germany",
        timestamp: "02:08",
        stance: "The economic case is decisive for approval. A strong clinical case helps, but finance decides.",
        quote:
          "We look at total cost of ownership, expected procedure volume, maintenance, service contracts and training requirements. A strong clinical case helps, but the economic case decides whether it gets approved.",
      },
      {
        expert: "Dr. Emily Carter",
        role: "Consultant Urologist",
        market: "United Kingdom",
        timestamp: "03:10",
        stance: "Economics and clinical strategy are balanced; finance alone does not dictate the purchase decision.",
        quote:
          "I would say economics and clinical strategy are balanced. I would not say finance alone decides the purchase.",
      },
      {
        expert: "Dr. Jean Martin",
        role: "Head of Urology",
        market: "France",
        timestamp: "04:08",
        stance: "Clinical outcomes are necessary but not enough; finance demands proof the system will pay for itself.",
        quote:
          "Clinical outcomes are necessary, but they are not enough on their own. If two systems offer similar outcomes, the hospital will look hard at economics and utilisation.",
      },
    ],
  },
  {
    id: "growth-rate-expectations",
    topic: "3–5 Year Procedure Growth Rate Forecasts",
    category: "Material difference",
    overview:
      "The experts present distinct numerical growth forecasts. Keller explicitly dampens expectations for Germany to high single/low double digits, whereas Martin and Carter project that volume increases can exceed 15% or 20% in stronger centres and specific regional hubs.",
    perspectives: [
      {
        expert: "Anna Keller",
        role: "Former Hospital Procurement Director",
        market: "Germany",
        timestamp: "05:08",
        stance: "Constrained to high single digits or low double digits; explicitly rejects 20% across the market.",
        quote:
          "I would expect continued growth, but probably closer to high single digits or low double digits in procedure volumes rather than something like 20 percent across the whole market.",
      },
      {
        expert: "Dr. Jean Martin",
        role: "Head of Urology",
        market: "France",
        timestamp: "05:07",
        stance: "Forecasts maybe 15 to 20 percent more procedures annually in stronger centres.",
        quote:
          "I expect adoption to continue increasing, probably steadily rather than explosively. I would expect maybe 15 to 20 percent more procedures annually in some of the stronger centres, but smaller hospitals will remain slower.",
      },
      {
        expert: "Dr. Emily Carter",
        role: "Consultant Urologist",
        market: "United Kingdom",
        timestamp: "04:06",
        stance: "Projects procedure growth could accelerate above 15 percent annually in some areas.",
        quote:
          "I am quite positive. I think adoption could accelerate if training expands and systems become more cost competitive. I could see procedure growth above 15 percent annually in some areas.",
      },
    ],
  },
  {
    id: "training-personnel-scope",
    topic: "Scope of Training: Surgeons vs Complete Theatre Staff",
    category: "Different emphasis",
    overview:
      "All experts agree training is vital to avoid single-surgeon failure modes. However, Dr. Carter elevates theatre nursing and technical support staff training to an equal level with surgeons, whereas Martin and Keller focus heavily on having multiple surgeons trained for machine utilization.",
    perspectives: [
      {
        expert: "Dr. Emily Carter",
        role: "Consultant Urologist",
        market: "United Kingdom",
        timestamp: "01:05",
        stance: "Places equal weight on training surgeons AND theatre staff; lack of theatre staff readiness stalls adoption.",
        quote:
          "Funding is important, but I would say training capacity is just as important. You can buy a system, but if you cannot train enough surgeons and theatre staff, adoption stalls.",
      },
      {
        expert: "Dr. Jean Martin",
        role: "Head of Urology",
        market: "France",
        timestamp: "03:10",
        stance: "Emphasizes multi-surgeon training so utilization is high enough to sustain economics in year one.",
        quote:
          "Training matters, especially in the first year. If only one surgeon can use the system, the economics become difficult. Hospitals want several surgeons trained so utilisation is high enough.",
      },
      {
        expert: "Anna Keller",
        role: "Former Hospital Procurement Director",
        market: "Germany",
        timestamp: "03:05",
        stance: "Operationally vital that more than one surgeon is comfortable using it to preserve the business case.",
        quote:
          "Very important operationally. If the hospital buys a system but only one surgeon is comfortable using it, utilisation will be poor. That weakens the business case.",
      },
    ],
  },
  {
    id: "purchasing-bottleneck",
    topic: "Primary Bottleneck in Decision Timelines",
    category: "Different emphasis",
    overview:
      "German timeline duration (9–18 months) is driven by alignment among four institutional stakeholders (procurement, clinical leadership, finance, management), whereas in the UK, duration (6–9 months) is gated by whether NHS funding is pre-allocated or waiting on capital rounds.",
    perspectives: [
      {
        expert: "Anna Keller",
        role: "Former Hospital Procurement Director",
        market: "Germany",
        timestamp: "06:05",
        stance: "9 to 18 months; internal alignment across procurement, clinical, finance, and management.",
        quote:
          "Nine to eighteen months is common. Procurement, clinical leadership, finance and management all need to align, so it can move slowly.",
      },
      {
        expert: "Dr. Emily Carter",
        role: "Consultant Urologist",
        market: "United Kingdom",
        timestamp: "05:04",
        stance: "6 to 9 months if capital is secured; much longer if waiting for the next NHS funding cycle.",
        quote:
          "Around six to nine months can happen if funding is already available. If the trust has to wait for a new capital cycle, it can take much longer.",
      },
      {
        expert: "Dr. Jean Martin",
        role: "Head of Urology",
        market: "France",
        timestamp: "06:08",
        stance: "6 to 12 months once serious; can roll into subsequent annual budget cycles.",
        quote:
          "Six to twelve months is realistic once the hospital becomes serious. It can be longer if the capital committee pushes the purchase into the next budget cycle.",
      },
    ],
  },
];

export const DisagreementsView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filtered =
    filterCategory === "All"
      ? DISAGREEMENTS_DATA
      : DISAGREEMENTS_DATA.filter((d) => d.category === filterCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Comparative Analysis
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Cross-Expert Disagreements & Divergences
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Differentiates genuine material disagreements from nuanced differences in emphasis. Rigorously prevents manufactured conflict.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs self-start sm:self-auto">
            {["All", "Material difference", "Different emphasis"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterCategory === cat
                    ? "bg-white text-indigo-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disagreements List */}
      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const isMaterial = item.category === "Material difference";
          const badgeClass = isMaterial
            ? "bg-amber-100 text-amber-900 border-amber-300"
            : "bg-blue-100 text-blue-900 border-blue-300";

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{item.topic}</h2>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1 self-start sm:self-auto ${badgeClass}`}
                >
                  {isMaterial ? <AlertTriangle className="w-3 h-3 text-amber-700" /> : <Split className="w-3 h-3 text-blue-700" />}
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.overview}
              </p>

              {/* Expert Positions Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {item.perspectives.map((persp, pIdx) => {
                  const countryBadge =
                    persp.market === "France"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : persp.market === "Germany"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-red-50 text-red-800 border-red-200";

                  return (
                    <div
                      key={pIdx}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-slate-200/80">
                          <span className="font-bold text-slate-900 text-xs">
                            {persp.expert}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${countryBadge}`}
                          >
                            {persp.market}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-indigo-950 bg-indigo-50/60 p-2 rounded border border-indigo-100 mb-2.5">
                          <span className="font-semibold block text-indigo-900 text-[10px] uppercase">
                            Expert Position:
                          </span>
                          {persp.stance}
                        </div>

                        <div className="pl-2 border-l-2 border-slate-400 text-xs italic font-serif text-slate-700 leading-relaxed break-words">
                          “{cleanQuoteText(persp.quote)}”
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {persp.timestamp}
                        </span>
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
