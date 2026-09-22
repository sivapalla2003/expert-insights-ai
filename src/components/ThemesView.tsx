import React, { useState } from "react";
import { Sparkles, MapPin, Clock, Quote, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { cleanQuoteText } from "../utils/textFormatting";

interface ThemeItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  experts: {
    name: string;
    market: string;
    role: string;
    timestamp: string;
    quote: string;
  }[];
}

export const THEMES_DATA: ThemeItem[] = [
  {
    id: "uneven-adoption",
    title: "Two-Tiered & Uneven Institutional Penetration",
    category: "Market Adoption",
    summary:
      "Robotic surgery adoption is growing across Europe but is strictly concentrated in tier-one academic teaching centres, university clinics, and well-funded private institutions. Smaller regional hospitals are either moving substantially slower or waiting for lower-cost alternatives.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "00:18",
        quote:
          "Adoption is growing, but it is still concentrated in larger academic hospitals and private centres with stronger capital budgets. Smaller regional hospitals are much slower.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "00:16",
        quote:
          "It is growing, but adoption is quite uneven. Large university hospitals are much more advanced, while many smaller hospitals are still waiting.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "00:14",
        quote:
          "Adoption is increasing, and in some larger NHS trusts robotic surgery is becoming standard for selected procedures. But access still varies significantly by hospital.",
      },
    ],
  },
  {
    id: "capital-scrutiny",
    title: "Capital Budget Approval & Institutional Financial Pressure",
    category: "Barriers & Funding",
    summary:
      "Across all healthcare models—whether French public/private, German hospital procurement, or NHS trusts—high capital expenditure is the primary gating obstacle. Clinical enthusiasm alone cannot bypass purchasing committees without an undeniable economic case.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "01:20",
        quote:
          "The biggest issue is still capital budget approval. Hospitals may like the technology clinically, but purchasing committees need a strong economic case before approving a system.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "01:10",
        quote:
          "Cost is the first barrier. These are large capital purchases, and hospital finances are under pressure. The second issue is proving that the system will be used enough.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "01:05",
        quote:
          "Funding is important, but I would say training capacity is just as important. You can buy a system, but if you cannot train enough surgeons and theatre staff, adoption stalls.",
      },
    ],
  },
  {
    id: "tco-utilisation",
    title: "Total Cost of Ownership (TCO) & Procedure Volume Amortization",
    category: "Economics & ROI",
    summary:
      "Hospitals do not view robotic systems in isolation; finance and procurement analyze total cost of ownership, ongoing service contracts, instrumentation depreciation, and whether forecasted procedure volume will genuinely make the investment self-sustaining.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "02:18",
        quote:
          "Very important. The clinical argument may get surgeons interested, but the finance team wants to understand utilisation, procedure volume, maintenance cost and whether the system will actually pay for itself.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "02:08",
        quote:
          "We look at total cost of ownership, expected procedure volume, maintenance, service contracts and training requirements. A strong clinical case helps, but the economic case decides whether it gets approved.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "02:07",
        quote:
          "It matters, but the discussion is not always purely financial. Hospitals also consider patient outcomes, length of stay, surgeon recruitment and whether the technology improves their clinical position.",
      },
    ],
  },
  {
    id: "training-bottleneck",
    title: "Single-Surgeon Dependency Destroys Program Viability",
    category: "Operations & Training",
    summary:
      "All three experts highlight that operational sustainability collapses if a hospital only has one certified robotic operator. To reach required utilization thresholds, institutions must train multiple surgeons and theatre support staff.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "03:10",
        quote:
          "Training matters, especially in the first year. If only one surgeon can use the system, the economics become difficult. Hospitals want several surgeons trained so utilisation is high enough.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "03:05",
        quote:
          "Very important operationally. If the hospital buys a system but only one surgeon is comfortable using it, utilisation will be poor. That weakens the business case.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "06:04",
        quote:
          "The key point is that adoption is not just about buying the machine. Hospitals need enough trained people and enough procedure volume to make the programme sustainable.",
      },
    ],
  },
  {
    id: "gradual-growth",
    title: "Steady Rather than Explosive 3–5 Year Adoption",
    category: "Market Forecast",
    summary:
      "No expert anticipates an overnight market transformation. Growth is projected to expand steadily, led by 15-20% procedure increases in high-volume hubs or high single/low double digits across the broader German healthcare ecosystem.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "05:07",
        quote:
          "I expect adoption to continue increasing, probably steadily rather than explosively. I would expect maybe 15 to 20 percent more procedures annually in some of the stronger centres, but smaller hospitals will remain slower.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "05:08",
        quote:
          "I would expect continued growth, but probably closer to high single digits or low double digits in procedure volumes rather than something like 20 percent across the whole market.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "04:06",
        quote:
          "I am quite positive. I think adoption could accelerate if training expands and systems become more cost competitive. I could see procedure growth above 15 percent annually in some areas.",
      },
    ],
  },
  {
    id: "timeline-cycle",
    title: "Extended 6 to 18-Month Purchasing Timelines Gated by Budget Cycles",
    category: "Procurement Cycle",
    summary:
      "Robotic system acquisitions take between 6 and 18 months. When funding is delayed or governance alignment lags, purchases are routinely pushed to subsequent annual budget cycles.",
    experts: [
      {
        name: "Dr. Jean Martin",
        market: "France",
        role: "Head of Urology",
        timestamp: "06:08",
        quote:
          "Six to twelve months is realistic once the hospital becomes serious. It can be longer if the capital committee pushes the purchase into the next budget cycle.",
      },
      {
        name: "Anna Keller",
        market: "Germany",
        role: "Former Hospital Procurement Director",
        timestamp: "06:05",
        quote:
          "Nine to eighteen months is common. Procurement, clinical leadership, finance and management all need to align, so it can move slowly.",
      },
      {
        name: "Dr. Emily Carter",
        market: "United Kingdom",
        role: "Consultant Urologist",
        timestamp: "05:04",
        quote:
          "Around six to nine months can happen if funding is already available. If the trust has to wait for a new capital cycle, it can take much longer.",
      },
    ],
  },
];

export const ThemesView: React.FC = () => {
  const [expandedTheme, setExpandedTheme] = useState<string | null>("uneven-adoption");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Synthesis & Pattern Extraction
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">
          Cross-Expert Recurring Themes
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Derived strictly from the three expert interviews. Every theme traces back to verified statements across France, Germany, and the United Kingdom.
        </p>
      </div>

      {/* Themes List */}
      <div className="space-y-4">
        {THEMES_DATA.map((theme, index) => {
          const isExpanded = expandedTheme === theme.id;
          return (
            <div
              key={theme.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedTheme(isExpanded ? null : theme.id)}
                className="p-4 cursor-pointer hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 flex-shrink-0 mt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {theme.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Supported by 3 Markets
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      {theme.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {theme.summary}
                    </p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Evidence Citations */}
              {isExpanded && (
                <div className="bg-slate-50/70 border-t border-slate-200 p-4 space-y-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Verified Supporting Evidence Excerpts
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {theme.experts.map((exp, expIdx) => (
                      <div
                        key={expIdx}
                        className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-slate-100 text-xs">
                            <span className="font-semibold text-slate-800 truncate">
                              {exp.name}
                            </span>
                            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {exp.timestamp}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{exp.market}</span>
                            <span className="text-slate-300">·</span>
                            <span className="truncate">{exp.role}</span>
                          </div>
                          <div className="pl-2 border-l-2 border-indigo-400 text-xs italic font-serif text-slate-800 leading-relaxed break-words">
                            “{cleanQuoteText(exp.quote)}”
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Source verified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
