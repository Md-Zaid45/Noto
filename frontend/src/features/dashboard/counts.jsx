import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Zap,
  CheckCircle,
  Clock,
  Percent,
  Flame,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export function HeaderCounts({ totalCards, activeCards, dueCards, reviewedCards, streak, accuracy }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-[#6b7280] dark:text-stone-400 tracking-wider uppercase">Daily Reviewed</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-[#111827] dark:text-stone-100">{reviewedCards}</span>
            <span className="text-[#9ca3af] dark:text-stone-500 text-sm">/ {totalCards}</span>
          </div>
        </div>
        <div className="p-2 bg-[#d1fae5] dark:bg-emerald-950/30 rounded-lg text-[#1a5c3a] dark:text-emerald-300">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-[#6b7280] dark:text-stone-400 tracking-wider uppercase">Remaining Cards</p>
            <span className="text-[10px] font-extrabold bg-[#fef2f2] text-[#ef4444] px-1.5 py-0.5 rounded uppercase tracking-wide">Due Today</span>
          </div>
          <p className="text-2xl font-bold text-[#111827] dark:text-stone-100 mt-2">{dueCards}</p>
        </div>
        <div className="p-2 bg-[#fef2f2] rounded-lg text-[#ef4444]">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-[#6b7280] dark:text-stone-400 tracking-wider uppercase">Study Streak</p>
            {streak > 0 && (
              <span className="text-[10px] font-extrabold bg-[#d1fae5] dark:bg-emerald-950/30 text-[#166534] dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wide">Active</span>
            )}
          </div>
          <p className="text-2xl font-bold text-[#111827] dark:text-stone-100 mt-2">{streak} {streak === 1 ? "Day" : "Days"}</p>
        </div>
        <div className="p-2 bg-[#d1fae5] dark:bg-emerald-950/30 rounded-lg text-[#1a5c3a] dark:text-emerald-300">
          <Flame className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-[#6b7280] dark:text-stone-400 tracking-wider uppercase">Accuracy Rate</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-stone-100 mt-2">{accuracy}%</p>
        </div>
        <div className="p-2 bg-[#d1fae5] dark:bg-emerald-950/30 rounded-lg text-[#1a5c3a] dark:text-emerald-300">
          <Percent className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function Doughnut({ activeCards, masteredCards, learningCards, newCards }) {
  return (
    <>
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border flex-1 border-[#e5e7eb] flex flex-col justify-between">
        <h2 className="font-bold text-[#111827] dark:text-stone-100 mb-4">Card Mastery</h2>

        <div className="relative flex justify-center items-center my-2">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#1a5c3a"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray="402"
              strokeDashoffset="185"
            />
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#6ee7b7"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray="402"
              strokeDashoffset="293"
              className="transform rotate-[195deg] origin-[80px_80px] dark:stroke-emerald-500"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-extrabold text-[#111827] dark:text-stone-100">{activeCards}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#6b7280] dark:text-stone-400">
              Total Cards
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a5c3a]" />{" "}
              Mastered
            </div>
            <span className="font-bold text-[#111827] dark:text-stone-100">{masteredCards}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7] dark:bg-emerald-500" />{" "}
              Learning
            </div>
            <span className="font-bold text-[#111827] dark:text-stone-100">{learningCards}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#6b7280] dark:text-stone-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" /> New
            </div>
            <span className="font-bold text-[#111827] dark:text-stone-100">{newCards}</span>
          </div>
        </div>
      </div>
    </>
  );
}
