import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Layers, Zap, Clock, Brain } from "lucide-react";
import { DashboardContext } from "../../pages/dashboard";

function formatTimeSpent(ms) {
  if (!ms) return "0m";
  const minutes = ms / 60000;
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = minutes / 60;
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${Math.floor(hours)}h ${mins}m` : `${Math.floor(hours)}h`;
}

function getHardness(hardness) {
  if (hardness > 500) return { label: "Hard", badge: "bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]", hoverBorder: "hover:border-[#fca5a5]", gaugeColor: "text-[#ef4444]" };
  if (hardness > 200) return { label: "Medium", badge: "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]", hoverBorder: "hover:border-[#fcd34d]", gaugeColor: "text-[#d97706]" };
  return { label: "Easy", badge: "bg-[#d1fae5] text-[#1a5c3a] border-[#a7f3d0]", hoverBorder: "hover:border-[#6ee7b7]", gaugeColor: "text-[#1a5c3a]" };
}

function getAccuracyMeta(accuracy) {
  if (accuracy >= 80) return { text: "High Mastery", color: "text-[#1a5c3a] dark:text-emerald-400" };
  if (accuracy >= 60) return { text: "Needs Review", color: "text-[#d97706] dark:text-amber-400" };
  return { text: "Due for review", color: "text-[#ef4444] dark:text-red-400" };
}

function timeAgo(date) {
  if (!date) return "Never";
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function AccuracyGauge({ accuracy, colorClass }) {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-[#e5e7eb] dark:text-stone-700"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className={`${colorClass} stroke-current transition-all duration-1000`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeDasharray={`${accuracy}, 100`}
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </svg>
    </div>
  );
}

export default function DeckStatsPage() {
  const { decks } = useContext(DashboardContext);
  const navigate = useNavigate();

  const sortedDecks = useMemo(() => {
    return (decks || [])
      .filter((d) => d.totalCards > 0)
      .sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0))
      .slice(0, 5);
  }, [decks]);

  const summary = useMemo(() => {
    const totalCards = sortedDecks.reduce((sum, d) => sum + d.totalCards, 0);
    const totalTime = sortedDecks.reduce((sum, d) => sum + (d.timeSpent || 0), 0);
    const avgAccuracy = sortedDecks.length > 0
      ? Math.round(sortedDecks.reduce((sum, d) => sum + (d.accuracy || 0), 0) / sortedDecks.length)
      : 0;
    return { totalCards, totalTime, avgAccuracy };
  }, [sortedDecks]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-5 border-b border-[#e5e7eb] dark:border-stone-800">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#111827] dark:text-stone-100 tracking-tight">
                Deck Statistics
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1fae5] dark:bg-emerald-950/30 text-[#1a5c3a] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c3a] dark:bg-emerald-400 animate-pulse" />
                Top 5 Decks
              </span>
            </div>
            <p className="text-sm text-[#9ca3af] dark:text-stone-500">
              Ranked by total study time and mastery performance
            </p>
          </div>
          <button
            onClick={() => navigate("/home/dashboard")}
            className="p-2 text-[#9ca3af] hover:text-[#111827] dark:hover:text-stone-200 hover:bg-[#f3f4f6] dark:hover:bg-stone-800 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#e5e7eb] dark:border-stone-800">
          <div className="bg-[#f9fafb] dark:bg-stone-800/50 rounded-xl p-3 border border-[#e5e7eb] dark:border-stone-700">
            <span className="text-[11px] font-semibold text-[#9ca3af] dark:text-stone-500 uppercase tracking-wider block mb-0.5">Total Cards</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#111827] dark:text-stone-100">{summary.totalCards}</span>
              <span className="text-xs text-[#9ca3af] dark:text-stone-500">cards</span>
            </div>
          </div>
          <div className="bg-[#f9fafb] dark:bg-stone-800/50 rounded-xl p-3 border border-[#e5e7eb] dark:border-stone-700">
            <span className="text-[11px] font-semibold text-[#9ca3af] dark:text-stone-500 uppercase tracking-wider block mb-0.5">Avg Accuracy</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#1a5c3a] dark:text-emerald-400">{summary.avgAccuracy}%</span>
            </div>
          </div>
          <div className="bg-[#f9fafb] dark:bg-stone-800/50 rounded-xl p-3 border border-[#e5e7eb] dark:border-stone-700">
            <span className="text-[11px] font-semibold text-[#9ca3af] dark:text-stone-500 uppercase tracking-wider block mb-0.5">Total Time</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#111827] dark:text-stone-100">{formatTimeSpent(summary.totalTime)}</span>
              <span className="text-xs text-[#9ca3af] dark:text-stone-500">logged</span>
            </div>
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-medium text-[#9ca3af] dark:text-stone-500">Sort view:</span>
          <div className="flex gap-1.5 bg-[#f3f4f6] dark:bg-stone-800 p-1 rounded-xl">
            <button className="px-3 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-stone-700 text-[#1a5c3a] dark:text-emerald-400 shadow-sm transition">
              Study Time
            </button>
            <button className="px-3 py-1 text-xs font-medium text-[#6b7280] dark:text-stone-400 hover:text-[#111827] dark:hover:text-stone-200 rounded-lg transition">
              Accuracy
            </button>
            <button className="px-3 py-1 text-xs font-medium text-[#6b7280] dark:text-stone-400 hover:text-[#111827] dark:hover:text-stone-200 rounded-lg transition">
              Retention
            </button>
          </div>
        </div>
      </div>

      {/* Deck Cards List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {sortedDecks.map((d, idx) => {
          const hardness = getHardness(d.hardness);
          const accuracyMeta = getAccuracyMeta(d.accuracy);
          return (
            <div
              key={d.noteId}
              className={`group relative bg-white dark:bg-stone-900 border border-[#e5e7eb] dark:border-stone-800 ${hardness.hoverBorder} rounded-2xl p-4 sm:p-5 transition duration-200 shadow-sm hover:shadow-md`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                {/* Left: Identity & Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f3f4f6] dark:bg-stone-800 text-[#6b7280] dark:text-stone-300 font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <h3 className="font-semibold text-[#111827] dark:text-stone-100 text-base sm:text-lg tracking-tight group-hover:text-[#1a5c3a] dark:group-hover:text-emerald-400 transition-colors">
                      {d.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${hardness.badge}`}>
                      {hardness.label}
                    </span>
                  </div>
                </div>
                {/* Right: Accuracy Gauge & Quick Action */}
                <div className="flex items-center gap-3 sm:self-center ml-9 sm:ml-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#111827] dark:text-stone-200">{d.accuracy}%</div>
                    <div className={`text-[11px] font-medium ${accuracyMeta.color}`}>{accuracyMeta.text}</div>
                  </div>
                  <AccuracyGauge accuracy={d.accuracy} colorClass={hardness.gaugeColor} />
                  <button
                    onClick={() => navigate(`/home/cards/${d.noteId}`)}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#111827] dark:bg-stone-700 group-hover:bg-[#1a5c3a] dark:group-hover:bg-emerald-600 rounded-xl transition duration-150 shadow-sm mr-2.5 ml-5"
                  >
                    Study
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Micro-Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-35 pt-3.5 mt-3.5 border-t border-[#f3f4f6] dark:border-stone-800 text-xs">
                <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
                  <Layers className="w-4 h-4 text-[#9ca3af] dark:text-stone-500" />
                  <span><strong className="text-[#111827] dark:text-stone-200 font-semibold">{d.totalCards}</strong> cards</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
                  <Zap className="w-4 h-4 text-[#d97706] dark:text-amber-400" />
                  <span><strong className="text-[#111827] dark:text-stone-200 font-semibold">{d.accuracy}%</strong> accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
                  <Clock className="w-4 h-4 text-[#9ca3af] dark:text-stone-500" />
                  <span><strong className="text-[#111827] dark:text-stone-200 font-semibold">{formatTimeSpent(d.timeSpent)}</strong> studied</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
                  <Brain className="w-4 h-4 text-[#1a5c3a] dark:text-emerald-400" />
                  <span>Reviewed <strong className="text-[#111827] dark:text-stone-200 font-semibold">{timeAgo(d.lastReviewed)}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
        {sortedDecks.length === 0 && (
          <p className="text-sm text-[#9ca3af] dark:text-stone-500 text-center py-8">No deck data available</p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#e5e7eb] dark:border-stone-800 flex items-center gap-2 text-xs text-[#9ca3af] dark:text-stone-500">
        <span className="w-2 h-2 rounded-full bg-[#1a5c3a] dark:bg-emerald-400" />
        <span>Spaced Repetition Algorithm is active</span>
      </div>
    </div>
  );
}
