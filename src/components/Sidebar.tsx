import React from "react";
import {
  LayoutDashboard,
  HelpCircle,
  Sparkles,
  GitCompare,
  Split,
  MessageSquareText,
  FileText,
  Workflow,
  CheckCircle,
  Activity,
  Stethoscope,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  geminiActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  geminiActive,
}) => {
  const navItems = [
    { id: "overview", label: "1. Overview", icon: LayoutDashboard },
    { id: "guide", label: "2. Interview Guide", icon: HelpCircle },
    { id: "themes", label: "3. Cross-Expert Themes", icon: Sparkles },
    { id: "disagreements", label: "4. Disagreements & Differences", icon: Split },
    { id: "compare", label: "5. Compare Experts", icon: GitCompare },
    { id: "chat", label: "6. Ask Across Transcripts", icon: MessageSquareText },
    { id: "data", label: "7. Data / Sources", icon: FileText },
    { id: "architecture", label: "8. About / Architecture", icon: Workflow },
    { id: "benchmark", label: "9. Verification Benchmark", icon: CheckCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-tight">
              Expert Insights AI
            </h1>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              Evidence-Grounded Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-slate-400 px-3 mb-1 tracking-wider">
          Case Study Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-indigo-400" : "text-slate-400"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Project Summary Card */}
      <div className="p-3 mx-3 mb-3 bg-slate-800/70 border border-slate-700/60 rounded-lg text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span>Scope: Robotic Surgery</span>
          <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
            Europe
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-slate-700/50">
          <div className="p-1 rounded bg-slate-900/50">
            <span className="block font-bold text-white text-sm">3</span>
            <span className="text-[10px] text-slate-400">Experts</span>
          </div>
          <div className="p-1 rounded bg-slate-900/50">
            <span className="block font-bold text-white text-sm">3</span>
            <span className="text-[10px] text-slate-400">Markets</span>
          </div>
          <div className="p-1 rounded bg-slate-900/50">
            <span className="block font-bold text-white text-sm">6</span>
            <span className="text-[10px] text-slate-400">Questions</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Gemini Flash
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            geminiActive ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"
          }`}>
            {geminiActive ? "API Ready" : "Verified Fallback"}
          </span>
        </div>
      </div>
    </aside>
  );
};
