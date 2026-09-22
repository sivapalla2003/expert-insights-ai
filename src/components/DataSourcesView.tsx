import React, { useState } from "react";
import { Transcript } from "../types";
import { FileText, Search, UserCheck, Mic, Upload, CheckCircle2, Clock, Filter } from "lucide-react";

interface DataSourcesViewProps {
  transcripts: Transcript[];
  guideQuestions: string[];
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({
  transcripts,
  guideQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<string>(transcripts[0]?.id || "transcript_1_france");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [expertOnly, setExpertOnly] = useState<boolean>(false);

  const currentTranscript = transcripts.find((t) => t.id === activeTab);

  const filteredSegments = (currentTranscript?.segments || []).filter((seg) => {
    if (expertOnly && !seg.isExpert) return false;
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speaker.toLowerCase().includes(q) ||
      seg.timestamp.includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Data Transparency & Ground Truth
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">
          Transcript Corpus & Interview Guide
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Inspect the exact raw sources used for evidence retrieval. Filter by speaker, search by keyword, or verify timestamp boundaries.
        </p>

        {/* Source Switcher Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {transcripts.map((t) => {
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                <span>
                  {t.expert} ({t.market})
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {t.segments.length} seg
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setActiveTab("interview_guide")}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeTab === "interview_guide"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interview Guide</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "interview_guide" ? (
        /* Interview Guide View */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Robotic Surgery Market — Expert Interview Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Project Objective: Assess adoption of robotic surgery across European healthcare markets.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Core Standardized Questions:
            </h3>
            {guideQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 text-xs text-slate-800"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{q}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Transcript Viewer */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Transcript Metadata & Controls Bar */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">
                  {currentTranscript?.expert}
                </h2>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold text-[11px]">
                  {currentTranscript?.market}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Role: <span className="text-slate-700 font-medium">{currentTranscript?.role}</span>
              </p>
            </div>

            {/* Filter Search Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search transcript text..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => setExpertOnly(!expertOnly)}
                className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors flex items-center gap-1 ${
                  expertOnly
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Expert Only
              </button>

              <span className="text-slate-500 font-mono text-[11px]">
                {filteredSegments.length} of {currentTranscript?.segments.length} segments
              </span>
            </div>
          </div>

          {/* Transcript Segments List */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto p-4 space-y-3">
            {filteredSegments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No segments match the current search filters.
              </div>
            ) : (
              filteredSegments.map((seg) => {
                const isExpert = seg.isExpert;
                return (
                  <div
                    key={seg.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isExpert
                        ? "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
                        : "bg-slate-50/70 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        {isExpert ? (
                          <span className="inline-flex items-center gap-1 font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            <UserCheck className="w-3 h-3 text-indigo-600" />
                            {seg.speaker}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                            <Mic className="w-3 h-3 text-slate-500" />
                            {seg.speaker}
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {seg.timestamp}
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isExpert ? "text-slate-900 font-normal" : "text-slate-600 italic"
                      }`}
                    >
                      {seg.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
