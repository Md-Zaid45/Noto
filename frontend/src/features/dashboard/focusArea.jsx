import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';

export default function FocusAreas() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-gray-800 mb-4">Focus Areas</h2>

        <div className="space-y-4">
          {/* Organic Chem */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-600">Organic Chemistry</span>
              <span className="text-gray-400">82%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>

          {/* Legal Ethics */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-600">Legal Ethics</span>
              <span className="text-gray-400">45%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full"
                style={{ width: "45%" }}
              />
            </div>
          </div>

          {/* Data Structures */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-600">Data Structures</span>
              <span className="text-gray-400">94%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full"
                style={{ width: "94%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 text-center text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
        View Detailed Breakdown
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
