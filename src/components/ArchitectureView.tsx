import React from "react";
import {
  Workflow,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Database,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          System Design & Engineering Principles
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">
          Architecture, Methodology & Scaling Strategy
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Comprehensive explanation of the evidence-grounded ingestion pipeline, anti-hallucination enforcement, validation mechanics, and blueprint for scaling to 30+ transcripts.
        </p>
      </div>

      {/* 5-Step Pipeline Flow Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          End-to-End Evidence-First Processing Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-xs">Transcript Parsing</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Regex parses transcripts into discrete turns preserving metadata: timestamp, speaker, market, and clinical role.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-xs">Lexical Retrieval</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Domain-aware BM25 search with synonym expansion (e.g., ROI ↔ TCO, barriers ↔ budget). Weights expert turns 1.4x.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-xs">Gemini Flash Reasoning</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Executes under 14 strict negative constraints. Disallows outside knowledge and enforces qualifier preservation.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-slate-900 text-xs">Quote Validation</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Post-generation validator computes character and word overlaps against source transcript segments.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              5
            </span>
            <h3 className="font-bold text-slate-900 text-xs">Verified Output</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Emits structured UI cards displaying exact quotes, timestamp chips, confidence scores, and verbatim source diffs.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Why Gemini 3.8 Flash?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gemini delivers massive context capacity, low latency for real-time executive workflows, and near-perfect compliance with negative system prompts. Its native JSON mode guarantees strict schema adherences without brittle regex post-processing.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Why Metadata Preservation?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preserving timestamps, speaker roles, and market geographies prevents attribution drift. In high-stakes healthcare and investment diligence, answers must be directly audited against original audio recordings and transcripts.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Why Evidence-First?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Traditional LLM summaries introduce subtle cognitive distortions (e.g. converting "steady growth" into "rapid expansion"). Our evidence-first design treats verbatim quotes as immutable atomic truth, building synthesis around them.
          </p>
        </div>
      </div>

      {/* Hallucination Control Framework */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">
            14 Strict Anti-Hallucination Guardrails
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Implemented across server-side prompt engineering, deterministic fallbacks, and the post-generation validation layer:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">1. No Invention: </span>
            Never invent facts, statistics, quotations, or timestamps.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">2. Outside Knowledge Ban: </span>
            Never incorporate external web facts or general surgical knowledge.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">3. Insufficient Evidence Rule: </span>
            Explicitly return refusal when transcripts lack direct support.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">4. Synthesis vs Direct Evidence: </span>
            Visually separate high-level synthesis from verified verbatim quotes.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">5. Nuance & Qualifier Preservation: </span>
            Preserve restrictive conditions ('maybe 15 to 20%', 'if funding is available').
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">6. Verbatim Quote Exactness: </span>
            No alteration of words or ellipses within exact quotation marks.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">7. Single Timestamp Integrity: </span>
            Do not merge quotes from different timestamps into one artificial quotation.
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900">8. Strict Attribution: </span>
            Never attribute a French expert quote to the UK or German expert.
          </div>
        </div>
      </div>

      {/* Scaling to 30+ Transcripts Roadmap */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">
            Enterprise Roadmap: Scaling to 30+ Transcripts
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          While 3 transcripts fit cleanly into prompt context, scaling to 30–100 expert interviews requires architectural upgrades across retrieval, vectorization, reranking, and automated evaluation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 space-y-1.5">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
              1. Chunking Strategy
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Sliding-window segmentation respecting conversational turns. Each chunk inherits expert role, market, and timestamp spans.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 space-y-1.5">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
              2. Hybrid Vector Search
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Combine dense semantic embeddings (e.g., text-embedding-004) with sparse BM25 via Reciprocal Rank Fusion (RRF).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 space-y-1.5">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
              3. LLM Reranking
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Cross-encoder reranking filters top 50 candidates down to top 10 most relevant segments before passing to Gemini synthesis.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 space-y-1.5">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
              4. Eval Benchmark
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Automated evaluation pipeline measuring Precision@k, verbatim quote fidelity, and synthetic disagreement detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
