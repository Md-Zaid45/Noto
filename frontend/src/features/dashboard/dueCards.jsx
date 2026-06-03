import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';

export default function DueCards({ dueCards }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Due for Review</h2>
          <span className="text-[10px] font-extrabold bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
            Urgent
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700">
                Neuroanatomy 101
              </h3>
              <span className="text-[11px] font-semibold text-[#6366F1]">
                40 Cards
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Next review: 2 hours
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700">
                Advanced React Hooks
              </h3>
              <span className="text-[11px] font-semibold text-[#6366F1]">
                18 Cards
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Next review: Today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
