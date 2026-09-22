import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import {
  INITIAL_TRANSCRIPTS,
  INTERVIEW_QUESTIONS,
  PROJECT_METADATA,
  parseTranscriptText,
  Transcript,
  TranscriptSegment,
} from "./server/data";

import {
  retrieveRelevantSegments,
  detectQueryScope,
} from "./server/retrieval";

import { validateQuote } from "./server/validation";

import {
  analyzeIndividualExpert,
  analyzeCrossExpert,
  answerQuestionAcrossTranscripts,
} from "./server/gemini";

async function startServer() {
  const app = express();

  // Render provides PORT in production.
  // 3000 is used locally when PORT is not provided.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "10mb" }));

  // -------------------------------------------------------------------------
  // In-memory transcript store
  // -------------------------------------------------------------------------

  let currentTranscripts: Transcript[] = [...INITIAL_TRANSCRIPTS];

  const getAllSegments = (): TranscriptSegment[] => {
    return currentTranscripts.flatMap((transcript) => transcript.segments);
  };

  // -------------------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------------------

  // Health check
  app.get("/api/health", (_req, res) => {
    const geminiConfigured = Boolean(
      process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    );

    res.json({
      status: "ok",
      service: "expert-insights-ai",
      geminiConfigured,
      transcriptsCount: currentTranscripts.length,
      segmentsCount: getAllSegments().length,
      environment: process.env.NODE_ENV || "development",
    });
  });

  // -------------------------------------------------------------------------
  // Interview Guide
  // -------------------------------------------------------------------------

  const sendGuide = (
    _req: express.Request,
    res: express.Response
  ) => {
    res.json({
      metadata: PROJECT_METADATA,
      questions: INTERVIEW_QUESTIONS,
      rawQuestions: INTERVIEW_QUESTIONS.map((q) => q.question),
    });
  };

  app.get("/api/interview-guide", sendGuide);
  app.get("/api/guide", sendGuide);

  // -------------------------------------------------------------------------
  // Transcripts
  // -------------------------------------------------------------------------

  app.get("/api/transcripts", (_req, res) => {
    res.json({
      transcripts: currentTranscripts,
      totalSegments: getAllSegments().length,
    });
  });

  // Reset transcripts to the original case-study dataset
  app.post("/api/transcripts/reset", (_req, res) => {
    currentTranscripts = [...INITIAL_TRANSCRIPTS];

    res.json({
      success: true,
      transcripts: currentTranscripts,
      totalSegments: getAllSegments().length,
    });
  });

  // Upload / add transcript
  app.post("/api/transcripts/upload", (req, res) => {
    try {
      const { id, text, expert, role, market } = req.body;

      if (!text || typeof text !== "string") {
        return res
          .status(400)
          .json({ error: "Transcript text is required." });
      }

      const generatedId = id || `custom_transcript_${Date.now()}`;

      const parsed = parseTranscriptText(generatedId, text);

      if (expert) {
        parsed.expert = expert;
      }

      if (role) {
        parsed.role = role;
      }

      if (market) {
        parsed.market = market;
      }

      // Keep segment metadata synchronized with transcript metadata.
      parsed.segments = parsed.segments.map((segment) => ({
        ...segment,
        expert: parsed.expert,
        role: parsed.role,
        market: parsed.market,
      }));

      // Replace existing transcript with the same ID,
      // otherwise add it to the in-memory collection.
      const existingIndex = currentTranscripts.findIndex(
        (transcript) => transcript.id === parsed.id
      );

      if (existingIndex >= 0) {
        currentTranscripts[existingIndex] = parsed;
      } else {
        currentTranscripts.push(parsed);
      }

      res.json({
        success: true,
        transcript: parsed,
        totalTranscripts: currentTranscripts.length,
      });
    } catch (error: unknown) {
      console.error("Upload parsing error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to parse transcript.";

      res.status(500).json({
        error: message,
      });
    }
  });

  // -------------------------------------------------------------------------
  // Retrieval
  // -------------------------------------------------------------------------

  app.post("/api/retrieval", (req, res) => {
    try {
      const { query, topK = 6, expert } = req.body;

      if (!query || typeof query !== "string") {
        return res
          .status(400)
          .json({ error: "Query string is required." });
      }

      const segments = getAllSegments();

      const results = retrieveRelevantSegments(
        query,
        segments,
        topK,
        expert
      );

      res.json({
        query,
        count: results.length,
        results,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Retrieval error.";

      res.status(500).json({
        error: message,
      });
    }
  });

  // -------------------------------------------------------------------------
  // Individual Expert Analysis
  // -------------------------------------------------------------------------

  app.post("/api/analyze/individual", async (req, res) => {
    try {
      const expert = (
        req.body.expert ||
        req.body.expertName ||
        ""
      ).trim();

      const question = (req.body.question || "").trim();

      if (!expert || !question) {
        return res.status(400).json({
          error: "Expert and Question are required.",
        });
      }

      const segments = getAllSegments();

      const analysis = await analyzeIndividualExpert(
        expert,
        question,
        segments
      );

      res.json(analysis);
    } catch (error: unknown) {
      console.warn(
        "Individual analysis notice:",
        error instanceof Error ? error.message : error
      );

      const message =
        error instanceof Error ? error.message : "Analysis failed.";

      res.status(500).json({
        error: message,
      });
    }
  });

  // -------------------------------------------------------------------------
  // Cross-Expert Analysis
  // -------------------------------------------------------------------------

  app.post("/api/analyze/cross-expert", async (req, res) => {
    try {
      const { question } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({
          error: "Question is required.",
        });
      }

      const segments = getAllSegments();

      const analysis = await analyzeCrossExpert(
        question,
        segments
      );

      res.json(analysis);
    } catch (error: unknown) {
      console.warn(
        "Cross-expert analysis notice:",
        error instanceof Error ? error.message : error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Cross-expert analysis failed.";

      res.status(500).json({
        error: message,
      });
    }
  });

  // -------------------------------------------------------------------------
  // Cross-Transcript Grounded Q&A
  // -------------------------------------------------------------------------

  const handleChat = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const rawQuery = req.body.query || req.body.question;

      const query =
        typeof rawQuery === "string"
          ? rawQuery.trim()
          : "";

      if (!query) {
        return res.status(400).json({
          error: "Query or question is required.",
        });
      }

      const allSegments = getAllSegments();

      // Detect country/expert scope before retrieval.
      const scope = detectQueryScope(query);

      // Retrieve only the most relevant evidence.
      const retrieved = retrieveRelevantSegments(
        query,
        allSegments,
        6,
        scope
      );

      const retrievedSegments = retrieved.map(
        (result) => result.segment
      );

      // Gemini receives the retrieved evidence for grounded synthesis.
      const response =
        await answerQuestionAcrossTranscripts(
          query,
          retrievedSegments,
          allSegments,
          scope
        );

      res.json({
        ...response,

        retrievedInfo: retrieved.map((result) => ({
          id: result.segment.id,
          expert: result.segment.expert,
          market: result.segment.market,
          timestamp: result.segment.timestamp,
          score: result.score,
          matchedKeywords: result.matchedKeywords,
        })),
      });
    } catch (error: unknown) {
      console.warn(
        "Chat notice:",
        error instanceof Error ? error.message : error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to answer question.";

      res.status(500).json({
        error: message,
      });
    }
  };

  // Support both endpoint names.
  app.post("/api/chat", handleChat);
  app.post("/api/ask", handleChat);

  // -------------------------------------------------------------------------
  // Quote Validation
  // -------------------------------------------------------------------------

  app.post("/api/validate-quote", (req, res) => {
    try {
      const {
        quote,
        timestamp,
        expert,
      } = req.body;

      const allSegments = getAllSegments();

      const result = validateQuote(
        quote,
        timestamp,
        expert,
        allSegments
      );

      res.json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Validation failed.";

      res.status(500).json({
        error: message,
      });
    }
  });

  // -------------------------------------------------------------------------
  // FRONTEND SERVING
  // -------------------------------------------------------------------------

  const isProduction =
    process.env.NODE_ENV === "production";

  if (!isProduction) {
    // Development mode:
    // Express runs together with the Vite development server.
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    // Production mode:
    // Serve the compiled Vite application from /dist.
    const distPath = path.resolve(process.cwd(), "dist");

    app.use(express.static(distPath));

    // SPA fallback.
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // -------------------------------------------------------------------------
  // START SERVER
  // -------------------------------------------------------------------------

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Expert Insights AI server running on port ${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Failed to start Expert Insights AI server:",
    error
  );

  process.exit(1);
});