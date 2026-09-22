import React from "react";
import { sanitizeMarkdown } from "../utils/textFormatting";

interface SanitizedMarkdownAnswerProps {
  content: string;
  className?: string;
}

/**
 * Safely parses and renders synthesized markdown content into clean React elements.
 * Prevents raw Markdown artifacts like stray * *, unmatched **, raw ---, and escape chars.
 */
export const SanitizedMarkdownAnswer: React.FC<SanitizedMarkdownAnswerProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  const sanitized = sanitizeMarkdown(content);
  const blocks = sanitized.split(/\n\n+/);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Horizontal divider
        if (trimmed === "---") {
          return <hr key={blockIdx} className="my-3 border-t border-slate-200" />;
        }

        // 2. Section Heading (### or ## or #)
        if (/^#{1,3}\s+/.test(trimmed)) {
          const headingText = trimmed.replace(/^#{1,3}\s+/, "");
          return (
            <h4
              key={blockIdx}
              className="text-xs font-bold uppercase tracking-wider text-slate-900 pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5"
            >
              {renderInline(headingText)}
            </h4>
          );
        }

        // 3. List of items (bullet points or numbered)
        const lines = trimmed.split("\n");
        const isList = lines.every((line) =>
          /^\s*(?:[•\-*]|\d+\.)\s+/.test(line.trim()) || line.trim() === ""
        );

        if (isList) {
          return (
            <ul key={blockIdx} className="space-y-2 my-1 pl-1">
              {lines.map((line, lineIdx) => {
                const itemMatch = line.trim().match(/^\s*(?:[•\-*]|\d+\.)\s+(.*)$/);
                if (!itemMatch) return null;
                const itemContent = itemMatch[1];

                return (
                  <li key={lineIdx} className="flex items-start gap-2 text-slate-800 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span className="flex-1">{renderInline(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 4. Mixed lines within a block (e.g. intro text followed by bullet points)
        const hasListItems = lines.some((l) => /^\s*(?:[•\-*]|\d+\.)\s+/.test(l.trim()));
        if (hasListItems) {
          return (
            <div key={blockIdx} className="space-y-2">
              {lines.map((line, lineIdx) => {
                const itemMatch = line.trim().match(/^\s*(?:[•\-*]|\d+\.)\s+(.*)$/);
                if (itemMatch) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 text-slate-800 text-sm leading-relaxed pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                      <span className="flex-1">{renderInline(itemMatch[1])}</span>
                    </div>
                  );
                }

                if (line.trim() === "---") {
                  return <hr key={lineIdx} className="my-2 border-t border-slate-200" />;
                }

                if (line.trim().length === 0) return null;

                return (
                  <p key={lineIdx} className="text-sm text-slate-800 leading-relaxed font-sans">
                    {renderInline(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // 5. Standard paragraph
        return (
          <p key={blockIdx} className="text-sm text-slate-800 leading-relaxed font-sans">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Safely parses inline markdown (bolding, quotes) into React nodes.
 */
function renderInline(text: string): React.ReactNode {
  // Regex to match **bold** segments
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderTextWithQuotes(text.substring(lastIndex, match.index), `txt-${lastIndex}`));
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-slate-900">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(renderTextWithQuotes(text.substring(lastIndex), `txt-${lastIndex}`));
  }

  return parts;
}

/**
 * Renders text while converting quotation marks to clean typography.
 */
function renderTextWithQuotes(text: string, keyPrefix: string): React.ReactNode {
  // Replace quotes with styled text or return cleanly
  // If there are quoted phrases e.g. "some quote", render them cleanly
  const quoteRegex = /"([^"]+)"/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = quoteRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={`${keyPrefix}-q-${match.index}`} className="font-serif italic text-slate-900">
        “{match[1]}”
      </span>
    );
    lastIndex = quoteRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <React.Fragment key={keyPrefix}>{parts}</React.Fragment>;
}
