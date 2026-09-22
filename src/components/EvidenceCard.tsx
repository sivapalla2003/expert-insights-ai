import React, { useState } from "react";
import { ValidatedQuote } from "../types";
import { CheckCircle2, AlertTriangle, Quote, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { cleanQuoteText } from "../utils/textFormatting";

interface EvidenceCardProps {
  evidence: ValidatedQuote;
  compact?: boolean;
}

const LONG_QUOTE_THRESHOLD = 200;

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, compact = false }) => {
  const [showFullSource, setShowFullSource] = useState(false);
  
  const cleanQuote = cleanQuoteText(evidence.quote);
  const isLong = cleanQuote.length > LONG_QUOTE_THRESHOLD;
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(!compact);

  const isVerified = evidence.isValidated && evidence.validationStatus === "verified";
  const isFuzzy = evidence.isValidated && evidence.validationStatus === "fuzzy_matched";

  const displayedQuote = isLong && !isQuoteExpanded
    ? `${cleanQuote.slice(0, LONG_QUOTE_THRESHOLD)}...`
    : cleanQuote;

  return (
    <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-3.5 transition-all hover:bg-slate-50 hover:border-slate-300">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            {evidence.expert}
          </span>
          <span className="text-slate-400">·</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
            <MapPin className="w-3 h-3 text-slate-500" />
            {evidence.market}
          </span>
          <span className="text-slate-400">·</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-semibold">
            <Clock className="w-3 h-3 text-indigo-600" />
            {evidence.timestamp}
          </span>
        </div>

        {/* Validation Status Badge */}
        <div className="flex items-center">
          {isVerified && (
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium"
              title="Verified 100% against source transcript text"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Quote
            </span>
          )}
          {isFuzzy && (
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium"
              title="Grounded directly to verified transcript excerpt"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              Source Grounded
            </span>
          )}
          {!evidence.isValidated && (
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium"
              title="Quote could not be verbatim-validated against the source transcript"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Unverified
            </span>
          )}
        </div>
      </div>

      {/* Quote Display */}
      <div className="relative pl-3 border-l-2 border-indigo-400 my-1">
        <Quote className="w-3.5 h-3.5 text-indigo-400 mb-1" />
        <p className="text-sm font-serif italic text-slate-800 leading-relaxed break-words">
          “{displayedQuote}”
        </p>

        {isLong && (
          <div className="mt-1">
            <button
              onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
            >
              <span>{isQuoteExpanded ? "Show less" : "Show more"}</span>
              {isQuoteExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {evidence.warningMessage && (
        <p className="text-xs text-amber-700 mt-2 font-mono bg-amber-50 p-1.5 rounded border border-amber-200">
          ⚠️ {evidence.warningMessage}
        </p>
      )}

      {/* Verbatim Source Accordion if available */}
      {evidence.verbatimText && evidence.verbatimText !== evidence.quote && !compact && (
        <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs">
          <button
            onClick={() => setShowFullSource(!showFullSource)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <span>{showFullSource ? "Hide source context" : "Show verbatim source segment"}</span>
            {showFullSource ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showFullSource && (
            <div className="mt-1.5 p-2 bg-white rounded border border-slate-200 text-slate-600 leading-normal font-mono text-[11px] break-words">
              {cleanQuoteText(evidence.verbatimText)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
