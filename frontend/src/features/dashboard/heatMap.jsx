import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';
const consistencyData = [
  1, 1, 3, 4, 4, 1, 2, 3, 4, 1, 2, 3, 1, 3, 4, 3, 4, 3, 2, 1, 2, 4, 4, 2, 3, 2,
  4, 4,
];
export default function HeatMap() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between items-center">
      <div className="w-full text-left">
        <h2 className="font-bold text-gray-800 mb-4">Consistency Map</h2>
      </div>

      <div className="grid grid-cols-7 gap-1.5 w-full max-w-[210px] my-auto">
        {consistencyData.map((val, idx) => {
          let bgClass = "bg-gray-100";
          if (val === 2) bgClass = "bg-indigo-200";
          if (val === 3) bgClass = "bg-[#818CF8]";
          if (val === 4) bgClass = "bg-[#6366F1]";
          return (
            <div
              key={idx}
              className={`aspect-square w-full rounded-[3px] ${bgClass}`}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center w-full max-w-[210px] text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4">
        <span>Less</span>
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-100" />
          <span className="w-2.5 h-2.5 rounded-[1px] bg-indigo-200" />
          <span className="w-2.5 h-2.5 rounded-[1px] bg-[#818CF8]" />
          <span className="w-2.5 h-2.5 rounded-[1px] bg-[#6366F1]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
