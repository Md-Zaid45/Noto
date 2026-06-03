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

export function HeaderCounts({ totalCards, activeCards, dueCards, reviewedCards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Daily Reviewed */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
            Daily Reviewed
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold">{reviewedCards}</span>
            <span className="text-gray-400 text-sm">/ {totalCards}</span>
          </div>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg text-[#6366F1]">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Remaining Cards */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Remaining Cards
            </p>
            <span className="text-[10px] font-extrabold bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
              Due Today
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">{dueCards}</p>
        </div>
        <div className="p-2 bg-red-50 rounded-lg text-red-500">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Study Streak */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Study Streak
            </p>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">12 Days</p>
        </div>
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
          <Flame className="w-5 h-5" />
        </div>
      </div>

      {/* Accuracy Rate */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Accuracy Rate
            </p>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded tracking-wide">
              +2.4% ↗
            </span>
          </div>
          <p className="text-2xl font-bold mt-2">88.5%</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg text-[#6366F1]">
          <Percent className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function Doughnut({ activeCards, masteredCards, learningCards, newCards }) {
  return (
    <>
      <div className="bg-white p-6 rounded-2xl border flex-1 border-gray-100 shadow-sm flex flex-col justify-between">
        <h2 className="font-bold text-gray-800 mb-4">Card Mastery</h2>

        <div className="relative flex justify-center items-center my-2">
          {/* Simplistic pure CSS/SVG Donut representing 184 Mastered, 92 Learning, 66 New */}
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="transparent"
            />
            {/* Mastered Segment (Purple) */}
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#6366F1"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray="402"
              strokeDashoffset="185"
            />
            {/* Learning Segment (Teal) */}
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#0D9488"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray="402"
              strokeDashoffset="293"
              className="transform rotate-[195deg] origin-[80px_80px]"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-extrabold text-gray-800">{activeCards}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Total Cards
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />{" "}
              Mastered
            </div>
            <span className="font-bold text-gray-700">{masteredCards}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />{" "}
              Learning
            </div>
            <span className="font-bold text-gray-700">{learningCards}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> New
            </div>
            <span className="font-bold text-gray-700">{newCards}</span>
          </div>
        </div>
      </div>
    </>
  );
}
