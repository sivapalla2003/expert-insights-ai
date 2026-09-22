import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { OverviewView } from "./components/OverviewView";
import { InterviewGuideView } from "./components/InterviewGuideView";
import { ThemesView } from "./components/ThemesView";
import { DisagreementsView } from "./components/DisagreementsView";
import { CompareExpertsView } from "./components/CompareExpertsView";
import { AskTranscriptsView } from "./components/AskTranscriptsView";
import { DataSourcesView } from "./components/DataSourcesView";
import { ArchitectureView } from "./components/ArchitectureView";
import { BenchmarkView } from "./components/BenchmarkView";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DEFAULT_TRANSCRIPTS, DEFAULT_QUESTIONS } from "./data/defaultData";
import { Transcript, InterviewQuestion } from "./types";
import { Menu, X, ShieldCheck, AlertCircle } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [targetQuestionId, setTargetQuestionId] = useState<number>(2);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initialize with verified default case-study data so first paint never renders a blank screen
  const [transcripts, setTranscripts] = useState<Transcript[]>(DEFAULT_TRANSCRIPTS);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(DEFAULT_QUESTIONS);
  const [rawQuestions, setRawQuestions] = useState<string[]>(DEFAULT_QUESTIONS.map((q) => q.question));
  const [geminiActive, setGeminiActive] = useState<boolean>(false);

  useEffect(() => {
    async function initData() {
      try {
        const [transRes, guideRes, healthRes] = await Promise.all([
          fetch("/api/transcripts").catch(() => null),
          fetch("/api/interview-guide").catch(() => null),
          fetch("/api/health").catch(() => null),
        ]);

        if (transRes && transRes.ok) {
          const transData = await transRes.json().catch(() => null);
          const list = Array.isArray(transData)
            ? transData
            : Array.isArray(transData?.transcripts)
            ? transData.transcripts
            : null;
          if (list && list.length > 0) {
            setTranscripts(list);
          }
        }

        if (guideRes && guideRes.ok) {
          const guideData = await guideRes.json().catch(() => null);
          if (guideData && Array.isArray(guideData.questions) && guideData.questions.length > 0) {
            setQuestions(guideData.questions);
            setRawQuestions(
              guideData.rawQuestions || guideData.questions.map((q: any) => q.question)
            );
          }
        }

        if (healthRes && healthRes.ok) {
          const healthData = await healthRes.json().catch(() => null);
          if (healthData && typeof healthData.geminiConfigured === "boolean") {
            setGeminiActive(healthData.geminiConfigured);
          }
        }
      } catch (err) {
        console.warn("Background API sync note (using verified fallback):", err);
      }
    }
    initData();
  }, []);

  const handleNavigate = (tab: string, questionId?: number) => {
    if (questionId !== undefined) {
      setTargetQuestionId(questionId);
    }
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              setMobileMenuOpen(false);
            }}
            geminiActive={geminiActive}
          />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs">
            <div className="relative flex-1 max-w-xs w-full bg-slate-900">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar
                currentTab={currentTab}
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  setMobileMenuOpen(false);
                }}
                geminiActive={geminiActive}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Top Navbar */}
          <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm md:text-base tracking-tight">
                  European Robotic Surgery Market
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  Evidence Grounded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {!geminiActive ? (
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 font-medium text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Deterministic Mode (API Key Missing)</span>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gemini Flash Active</span>
                </div>
              )}
              <span className="hidden xl:inline text-slate-500 font-mono text-[11px]">
                France · Germany · UK
              </span>
            </div>
          </header>

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/90">
            {currentTab === "overview" && (
              <OverviewView
                transcripts={transcripts}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === "guide" && (
              <InterviewGuideView
                questions={questions}
                transcripts={transcripts}
                initialQuestionId={targetQuestionId}
                geminiActive={geminiActive}
              />
            )}

            {currentTab === "themes" && <ThemesView />}

            {currentTab === "disagreements" && <DisagreementsView />}

            {currentTab === "compare" && <CompareExpertsView />}

            {currentTab === "chat" && <AskTranscriptsView geminiActive={geminiActive} />}

            {currentTab === "data" && (
              <DataSourcesView
                transcripts={transcripts}
                guideQuestions={rawQuestions}
              />
            )}

            {currentTab === "architecture" && <ArchitectureView />}

            {currentTab === "benchmark" && <BenchmarkView />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
