/**
 * Utilities for cleaning, sanitizing, and safely rendering Markdown
 * and verbatim quotes in the Expert Insights UI.
 *
 * Strictly UI-only presentation formatting:
 * - Does NOT alter underlying transcript data
 * - Preserves verbatim source quote text exactly
 * - Strips raw escape characters (e.g. \" -> ")
 * - Cleans stray Markdown (* *, ---, unmatched **, unmatched quotes)
 */

/**
 * Removes raw backslash escapes from LLM text output while preserving valid content.
 */
export function unescapeMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\\/g, "\\");
}

/**
 * Cleans stray Markdown artifacts such as:
 * - `* *` (stray bullet asterisks)
 * - Raw `---` dividers (normalized for clean hr rendering)
 * - Unmatched `**` (balances odd bold tags)
 * - Unmatched quotation marks
 */
export function sanitizeMarkdown(rawText: string): string {
  if (!rawText) return "";

  let cleaned = unescapeMarkdown(rawText);

  // 1. Clean stray '* *' or '*  *' or '* * *'
  cleaned = cleaned.replace(/(?:^|\s)\*\s+\*(?:\s+\*)?(?:\s|$)/gm, " ");

  // 2. Process line by line to balance unmatched bold tags and quotes
  const lines = cleaned.split("\n");
  const processedLines: string[] = [];

  for (let line of lines) {
    let l = line.trimEnd();

    // Normalize horizontal dividers if surrounded by space
    if (/^[-*_]{3,}$/.test(l.trim())) {
      processedLines.push("---");
      continue;
    }

    // Balance unmatched ** in this line
    const boldMatches = l.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
      // Odd number of ** on this line, append closing ** at the end of the line
      l = `${l}**`;
    }

    // Balance unmatched single * if any (e.g., stray single asterisks that aren't bullets)
    // If a line begins with '* ' it's a bullet, keep it.
    // If there is an odd number of non-bullet '*' characters, remove stray '*'
    if (!l.trim().startsWith("* ") && !l.trim().startsWith("- ") && !l.trim().startsWith("• ")) {
      const singleAsterisks = (l.match(/(?<!\*)\*(?!\*)/g) || []).length;
      if (singleAsterisks % 2 !== 0) {
        // Strip trailing or leading lone asterisk
        l = l.replace(/(?<!\*)\*(?!\*)$/, "").replace(/^(?<!\*)\*(?!\*)/, "");
      }
    }

    // Balance unmatched straight quotation marks in this line
    const quoteCount = (l.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      // If line has unmatched quotes, close the quote at the end
      l = `${l}"`;
    }

    processedLines.push(l);
  }

  return processedLines.join("\n");
}

/**
 * Prepares a source quote for clean presentation.
 * Preserves all verbatim text while stripping redundant outer quotes
 * and unescaping raw characters.
 */
export function cleanQuoteText(quote: string): string {
  if (!quote) return "";

  let cleaned = unescapeMarkdown(quote).trim();

  // Strip accidental outer quotes if already wrapped
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith('“') && cleaned.endsWith('”'))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Remove stray markdown artifacts if any
  cleaned = cleaned.replace(/(?:^|\s)\*\s+\*(?:\s|$)/g, " ");

  // Balance any unmatched bold
  const boldCount = (cleaned.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    cleaned = `${cleaned}**`;
  }

  // Balance unmatched quotation marks inside the quote
  const quoteCount = (cleaned.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    cleaned = `${cleaned}"`;
  }

  return cleaned;
}
