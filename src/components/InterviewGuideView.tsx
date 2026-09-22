import React, { useState, useEffect } from "react";
import { InterviewQuestion, CrossExpertAnalysisResponse, IndividualAnalysisResponse, Transcript } from "../types";
import { EvidenceCard } from "./EvidenceCard";
import { SanitizedMarkdownAnswer } from "./SanitizedMarkdownAnswer";
import {
  Users,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  Split,
  ChevronRight,
} from "lucide-react";

interface InterviewGuideViewProps {
  questions: InterviewQuestion[];
  transcripts: Transcript[];
  initialQuestionId?: number;
  geminiActive?: boolean;
}

const FALLBACK_QUESTION: InterviewQuestion = {
  id: 2,
  shortTitle: "Barriers to Adoption",
  topic: "barriers",
  question: "What are the main barriers to adoption?",
};

export const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({
  questions = [],
  transcripts = [],
  initialQuestionId = 2,
  geminiActive = false,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(initialQuestionId);
  const [mode, setMode] = useState<"all" | "individual">("all");
  const [selectedExpert, setSelectedExpert] = useState<string>("Dr. Jean Martin");

  const [crossAnalysis, setCrossAnalysis] = useState<CrossExpertAnalysisResponse | null>(null);
  const [individualAnalysis, setIndividualAnalysis] = useState<IndividualAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const safeQuestions = questions && questions.length > 0 ? questions : [FALLBACK_QUESTION];
  const currentQuestion =
    safeQuestions.find((q) => q.id === selectedQuestionId) || safeQuestions[0] || FALLBACK_QUESTION;

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "all") {
        const res = await fetch("/api/analyze/cross-expert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: currentQuestion.question }),
        });
        if (!res.ok) throw new Error("Failed to load cross-expert analysis");
        const data = await res.json();
        setCrossAnalysis(data);
      } else {
        const res = await fetch("/api/analyze/individual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expert: selectedExpert,
            question: currentQuestion.question,
          }),
        });
        if (!res.ok) throw new Error("Failed to load individual expert analysis");
        const data = await res.json();
        setIndividualAnalysis(data);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while analyzing the transcript.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [selectedQuestionId, mode, selectedExpert]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Research Protocol
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Interview Guide Analysis
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze the 6 standardized European Robotic Surgery interview questions with direct transcript grounding.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "all"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Analyze All Experts
            </button>
            <button
              onClick={() => setMode("individual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "individual"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Analyze Individual Expert
            </button>
          </div>
        </div>

        {/* Questions Selector Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {questions.map((q) => {
            const isSelected = q.id === selectedQuestionId;
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-xs"
                    : "bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {q.id}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {q.shortTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {q.question}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gemini Configuration Status Banner */}
      {!geminiActive && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Gemini API key is not configured. Add <code className="px-1 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[11px]">GEMINI_API_KEY</code> to enable live AI analysis. Operating in verified deterministic ground-truth mode.</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Deterministic Engine
          </span>
        </div>
      )}

      {/* Question Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center font-bold text-sm text-indigo-300 flex-shrink-0 mt-0.5">
            Q{currentQuestion.id}
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold">
              Selected Interview Guide Question
            </span>
            <h2 className="text-sm md:text-base font-semibold text-slate-100 mt-0.5">
              "{currentQuestion.question}"
            </h2>
          </div>
        </div>

        {mode === "individual" && (
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {transcripts.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedExpert(t.expert)}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedExpert === t.expert
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t.expert.replace("Dr. ", "")} ({t.market})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            Grounded Analysis in Progress...
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Retrieving transcript segments & validating verbatim quotes...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">Analysis Failed: </span>
            {error}
          </div>
        </div>
      )}

      {/* Analysis Results Container */}
      {!loading && !error && (
        <>
          {mode === "all" && crossAnalysis && (
            <div className="space-y-6">
              {/* Overall Synthesis */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Overall Synthesis Across All Markets
                  </h3>
                </div>
                <div className="pt-1">
                  <SanitizedMarkdownAnswer content={crossAnalysis.overallSynthesis} />
                </div>
              </div>

              {/* Expert Perspectives Grid */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Individual Expert Perspectives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crossAnalysis.expertPerspectives.map((persp) => {
                    const countryBadgeColor =
                      persp.market === "France"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : persp.market === "Germany"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-red-100 text-red-800 border-red-200";

                    return (
                      <div
                        key={persp.expert}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                            <div>
                              <div className="font-bold text-slate-900 text-xs">
                                {persp.expert}
                              </div>
                              <div className="text-[11px] text-slate-500">{persp.role}</div>
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${countryBadgeColor}`}
                            >
                              {persp.market}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed mt-2 font-medium">
                            {persp.summary}
                          </p>
                        </div>

                        {/* Evidence for this expert */}
                        {persp.evidence && persp.evidence.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            {persp.evidence.map((ev, idx) => (
                              <EvidenceCard key={idx} evidence={ev} compact={true} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Common Themes & Disagreements side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common Themes */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Common Themes Identified
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {crossAnalysis.commonThemes.map((th, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-xs">{th.theme}</span>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            {th.experts.length} Experts Agree
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{th.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differences & Disagreements */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Split className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Differences & Perspectives Divergence
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {crossAnalysis.differences.map((diff, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-xs">{diff.topic}</span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                              diff.category === "Material difference"
                                ? "bg-amber-100 border-amber-300 text-amber-900"
                                : "bg-blue-50 border-blue-200 text-blue-800"
                            }`}
                          >
                            {diff.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{diff.description}</p>
                        {diff.perspectives && diff.perspectives.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-1">
                            {diff.perspectives.map((p, pIdx) => (
                              <div key={pIdx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                                <span className="font-semibold text-slate-900 min-w-16">
                                  {p.expert}:
                                </span>
                                <span>{p.stance}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complete Supporting Evidence Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Complete Supporting Evidence & Source Citations
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {crossAnalysis.evidenceList.length} verified citations
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {crossAnalysis.evidenceList.map((ev, i) => (
                    <EvidenceCard key={i} evidence={ev} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Expert Analysis Mode */}
          {mode === "individual" && individualAnalysis && (
            <div className="space-y-6">
              {/* Expert Profile & Answer Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {individualAnalysis.expert}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {individualAnalysis.role} —{" "}
                      <span className="font-semibold text-slate-700">
                        {individualAnalysis.market}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                      Grounded Extract
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Synthesized Grounded Answer
                  </h4>
                  <div className="pt-1">
                    <SanitizedMarkdownAnswer content={individualAnalysis.answer} />
                  </div>
                </div>

                {/* Qualifiers Identified */}
                {individualAnalysis.qualifiersIdentified &&
                  individualAnalysis.qualifiersIdentified.length > 0 && (
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3">
                      <span className="text-xs font-bold text-indigo-900 block mb-1">
                        Preserved Qualifiers & Nuances:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {individualAnalysis.qualifiersIdentified.map((q, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 bg-white border border-indigo-200 text-indigo-800 rounded font-mono"
                          >
                            "{q}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Supporting Evidence for Individual */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Direct Transcript Evidence
                </h3>
                <div className="space-y-3">
                  {individualAnalysis.evidence.map((ev, i) => (
                    <EvidenceCard key={i} evidence={ev} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
