import React from "react";
import { Users, Globe2, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, FileSearch, Sparkles } from "lucide-react";
import { Transcript } from "../types";

interface OverviewViewProps {
  transcripts: Transcript[];
  onNavigate: (tab: string, questionId?: number) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  transcripts,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Hasamex AI Engineer Technical Case Study
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Expert Insights AI
            </h1>
            <p className="text-base text-slate-600 font-medium mt-0.5">
              European Robotic Surgery Market — Evidence-Grounded Analysis
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Analyze expert interviews, compare perspectives, and trace every insight back to transcript evidence. Built with Gemini, strict anti-hallucination protocols, and verbatim quote verification.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2">
            <button
              onClick={() => onNavigate("guide", 2)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo: Analyze Q2 Barriers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("chat")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
            >
              <FileSearch className="w-3.5 h-3.5" />
              Ask Across Transcripts
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">3</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Interviewed Experts
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Clinical & Procurement leaders</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">3</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              European Markets
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">France, Germany, United Kingdom</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">6</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
              Interview Guide Questions
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Adoption, Barriers, ROI, Timelines</div>
          </div>
        </div>
      </div>

      {/* Grounding Integrity Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold text-amber-950">Evidence-Grounded Principle: </span>
          All answers and synthesized themes are generated strictly from the provided transcripts. No outside world knowledge, invented statistics, or unsubstantiated quotations are permitted. Every major finding provides verified exact timestamps and verbatim citations.
        </div>
      </div>

      {/* The Three Interviewed Experts */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Target Transcripts & Expert Perspectives</span>
          <span className="text-xs font-normal text-slate-500">(100% transcript coverage)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transcripts.map((exp, idx) => {
            const countryBadgeColor =
              exp.market === "France"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : exp.market === "Germany"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-red-100 text-red-800 border-red-200";

            return (
              <div
                key={exp.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      Expert 0{idx + 1}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold border ${countryBadgeColor}`}
                    >
                      {exp.market}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{exp.expert}</h3>
                  <p className="text-xs text-slate-600 font-medium">{exp.role}</p>

                  <div className="mt-3 text-xs text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span>Segments parsed:</span>
                      <span className="font-mono font-medium text-slate-700">
                        {exp.segments.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expert statements:</span>
                      <span className="font-mono font-medium text-slate-700">
                        {exp.segments.filter((s) => s.isExpert).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timestamp range:</span>
                      <span className="font-mono font-medium text-slate-700">
                        {exp.segments[0]?.timestamp || "00:00"} -{" "}
                        {exp.segments[exp.segments.length - 1]?.timestamp || "06:08"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate("data")}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                  >
                    View raw transcript
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onNavigate("guide", 1)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-medium"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Demo Journey Walkthrough */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-2">
          Recommended Interview Demo Walkthrough (5-Minute Sequence)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <div
            onClick={() => onNavigate("guide", 2)}
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-indigo-600 block mb-1">Step 1</span>
            <span className="font-medium text-slate-800 block">Q2: Barriers</span>
            <span className="text-slate-500 text-[11px]">Compare all 3 experts with verified citations</span>
          </div>

          <div
            onClick={() => onNavigate("themes")}
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-indigo-600 block mb-1">Step 2</span>
            <span className="font-medium text-slate-800 block">Cross Themes</span>
            <span className="text-slate-500 text-[11px]">Examine synthesis on TCO and training hurdles</span>
          </div>

          <div
            onClick={() => onNavigate("disagreements")}
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-indigo-600 block mb-1">Step 3</span>
            <span className="font-medium text-slate-800 block">Divergence</span>
            <span className="text-slate-500 text-[11px]">Show where experts genuinely disagree vs different emphasis</span>
          </div>

          <div
            onClick={() => onNavigate("compare")}
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-indigo-600 block mb-1">Step 4</span>
            <span className="font-medium text-slate-800 block">Compare Matrix</span>
            <span className="text-slate-500 text-[11px]">Side-by-side France vs Germany vs UK</span>
          </div>

          <div
            onClick={() => onNavigate("chat")}
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-indigo-600 block mb-1">Step 5</span>
            <span className="font-medium text-slate-800 block">Ask Transcripts</span>
            <span className="text-slate-500 text-[11px]">Free-form grounded Q&A with quote verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
