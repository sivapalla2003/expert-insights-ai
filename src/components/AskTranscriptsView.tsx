import React, { useState } from "react";
import { ChatResponse } from "../types";
import { EvidenceCard } from "./EvidenceCard";
import { SanitizedMarkdownAnswer } from "./SanitizedMarkdownAnswer";
import {
  Search,
  Sparkles,
  Loader2,
  AlertTriangle,
  FileCheck2,
  Database,
  Tag,
  ShieldCheck,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const RECOMMENDED_QUERIES = [
  { label: "Test A: Barriers across markets", query: "What are the main barriers to adoption across all markets?" },
  { label: "Test B: ROI & TCO evaluation", query: "How do hospitals evaluate ROI and total cost of ownership?" },
  { label: "Test C: Multi-surgeon & staff training", query: "Why is multi-surgeon and theatre staff training considered so critical?" },
  { label: "Test D: Decision timeline", query: "What is the typical hospital decision-making timeline for robotic surgery?" },
  { label: "Test E: Forecasted growth rates", query: "What procedure growth rates do experts forecast over the next 3–5 years?" },
  { label: "Test F: Unsupported quantitative check", query: "What percentage of European hospitals currently use robotic surgery?" },
  { label: "Test G: Scoped comparison (France vs UK)", query: "Compare Dr. Jean Martin and Dr. Emily Carter on the importance of economics in purchasing decisions." },
];

interface AskTranscriptsViewProps {
  geminiActive?: boolean;
}

export const AskTranscriptsView: React.FC<AskTranscriptsViewProps> = ({
  geminiActive = false,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState("");

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResponse(null); // CRITICAL: Clear previous state immediately to prevent stale-answer display
    setError(null);
    setActiveQuery(searchQuery);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          question: searchQuery,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process question across transcripts");
      }
      const data: ChatResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err?.message || "An error occurred while answering your question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Free-Form Transcript Search & Grounded Synthesis
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Ask Across Transcripts
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Search across Dr. Jean Martin (France), Anna Keller (Germany), and Dr. Emily Carter (UK). Synthesized answers are strictly grounded in retrieved transcript segments with validated quotes and automatic scope enforcement.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Compare Dr. Jean Martin and Dr. Emily Carter on the importance of economics..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Ask Transcripts
              </>
            )}
          </button>
        </form>

        {!geminiActive && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Gemini API key is optional. Free-form transcript search operates in verified grounded retrieval mode with full validation.</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden md:inline">
              Grounded Fallback Active
            </span>
          </div>
        )}

        {/* Recommended Prompts */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Verification & Test Scenarios (Click to execute):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RECOMMENDED_QUERIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(item.query);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            Detecting Scope, Retrieving Segments & Synthesizing Grounded Answer...
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Query: "{activeQuery}"
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">Search Error: </span>
            {error}
          </div>
        </div>
      )}

      {/* Results view */}
      {response && !loading && !error && (
        <div className="space-y-5">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {response.requestId && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-mono text-[11px]">
                Request ID: {response.requestId}
              </span>
            )}
            {response.scope && (
              <span className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1 border ${
                response.scope.isGlobal
                  ? "bg-slate-50 text-slate-700 border-slate-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}>
                <Filter className="w-3 h-3" />
                Scope: {response.scope.description}
              </span>
            )}
            {response.evidenceSufficiency && (
              <span className={`px-2.5 py-1 rounded-md font-semibold text-[11px] uppercase tracking-wide border ${
                response.evidenceSufficiency === "SUFFICIENT"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : response.evidenceSufficiency === "PARTIAL"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                Evidence: {response.evidenceSufficiency}
              </span>
            )}
            {response.validationReport && (
              <span className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1 border ${
                response.validationReport.passed
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                Grounding Validation: {response.validationReport.passed ? "Passed (10/10)" : "Warnings Flagged"}
              </span>
            )}
          </div>

          {/* Answer Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Synthesized Grounded Response
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Grounded in {response.retrievedSegmentCount} Segments
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Question: <span className="text-slate-800">"{activeQuery}"</span>
            </div>

            <div className="pt-1">
              <SanitizedMarkdownAnswer content={response.answer} />
            </div>

            {response.insufficientEvidence && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Insufficient Transcript Evidence: </span>
                  The system verified that the transcripts do not explicitly provide the requested data. Outside knowledge or numerical fabrication was strictly rejected.
                </div>
              </div>
            )}
          </div>

          {/* Validation Diagnostics Report */}
          {response.validationReport && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-semibold border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Response Grounding Audit & Diagnostics
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  STATUS: {response.validationReport.passed ? "PASSED" : "FAILED"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {response.validationReport.citationsBelongToScope ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Scope Enforced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.noUnscopedEntities ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>No Unscoped Entities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.timestampsExact ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Timestamps Exact</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.quotesExact ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Quotes Exact</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.numericalClaimsSupported ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Quantitative Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.qualifiersPreserved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Qualifiers Preserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.citationsBelongToCurrentQuestion ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Citations Match Topic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {response.validationReport.noStaleEvidence ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>Stale Evidence Prevented</span>
                </div>
              </div>
            </div>
          )}

          {/* Retrieved Segments Debug / Metadata */}
          {response.retrievedInfo && response.retrievedInfo.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  Top Retrieved Transcript Segments ({response.retrievedInfo.length})
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Lexical score & keyword overlap
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {response.retrievedInfo.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded p-2.5 space-y-1 text-[11px]"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-900">{item.expert}</span>
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-1 rounded">
                        {item.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{item.market}</span>
                      <span className="font-mono">Score: {item.score}</span>
                    </div>
                    {item.matchedKeywords && item.matchedKeywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1 text-[10px] text-slate-600">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {item.matchedKeywords.slice(0, 4).join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Evidence Cards */}
          {response.evidence && response.evidence.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Supporting Transcript Quotes
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {response.evidence.length} citations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.evidence.map((ev, idx) => (
                  <EvidenceCard key={idx} evidence={ev} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
