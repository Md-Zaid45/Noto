import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';
export function FutureScheduledCards({ futureScheduledCards }) {
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-gray-800">Future Scheduled Cards</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Projected review volume for the next 14 days
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 bg-[#6366F1] rounded-sm" /> Projected
            Volume
          </div>
          <span className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-gray-500 font-medium">
            Next 14 Days
          </span>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={futureScheduledCards}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 500 }}
            />
            <Tooltip cursor={{ fill: "#F9FAFB" }} />
            <Bar
              dataKey="volume"
              fill="#6366F1"
              opacity={0.85}
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
