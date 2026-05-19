import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';

// --- MOCK DATA FOR THE BAR CHARTS ---
const weeklyActivityData = [
  { day: 'MON', hours: 1.5 },
  { day: 'TUE', hours: 2.3 },
  { day: 'WED', hours: 1.2 },
  { day: 'THU', hours: 3.0 },
  { day: 'FRI', hours: 2.1 },
  { day: 'SAT', hours: 0.8 },
  { day: 'SUN', hours: 2.5 },
];

const futureScheduledData = Array.from({ length: 14 }, (_, i) => ({
  day: `D+${i + 1}`,
  volume: Math.floor(Math.random() * 60) + 20
}));

// Consistency Map Mock Matrix (7x4 grid represented as flat array)
const consistencyData = [
  1, 1, 3, 4, 4, 1, 2,
  3, 4, 1, 2, 3, 1, 3,
  4, 3, 4, 3, 2, 1, 2,
  4, 4, 2, 3, 2, 4, 4
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good evening, Alex</h1>
            <p className="text-sm text-gray-500 mt-1">
              You've reached <span className="text-[#6366F1] font-semibold">88.5% accuracy</span> this week. Keep the momentum!
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#076e45] hover:bg-[#148552] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm">
            <Zap className="w-4 h-4 fill-current" />
            Start Daily Review
          </button>
        </div>

        {/* --- TOP ROW STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Reviewed */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Daily Reviewed</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold">142</span>
                <span className="text-gray-400 text-sm">/ 200</span>
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
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Remaining Cards</p>
                <span className="text-[10px] font-extrabold bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wide">Due Today</span>
              </div>
              <p className="text-2xl font-bold mt-2">58</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Study Streak</p>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded uppercase tracking-wide">Active</span>
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
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Accuracy Rate</p>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded tracking-wide">+2.4% ↗</span>
              </div>
              <p className="text-2xl font-bold mt-2">88.5%</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-[#6366F1]">
              <Percent className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* --- MIDDLE ROW: WEEKLY ACTIVITY & CARD MASTERY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Study Activity */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800">Weekly Study Activity</h2>
              <select className="text-xs border border-gray-200 rounded-lg p-1.5 text-gray-500 bg-white outline-none">
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} />
                  <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card Mastery Donut Chart Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <h2 className="font-bold text-gray-800 mb-4">Card Mastery</h2>
            
            <div className="relative flex justify-center items-center my-2">
              {/* Simplistic pure CSS/SVG Donut representing 184 Mastered, 92 Learning, 66 New */}
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="64" stroke="#E5E7EB" strokeWidth="16" fill="transparent" />
                {/* Mastered Segment (Purple) */}
                <circle cx="80" cy="80" r="64" stroke="#6366F1" strokeWidth="16" fill="transparent" 
                        strokeDasharray="402" strokeDashoffset="185" />
                {/* Learning Segment (Teal) */}
                <circle cx="80" cy="80" r="64" stroke="#0D9488" strokeWidth="16" fill="transparent" 
                        strokeDasharray="402" strokeDashoffset="293" className="transform rotate-[195deg] origin-[80px_80px]" />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-extrabold text-gray-800">342</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Cards</p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" /> Mastered
                </div>
                <span className="font-bold text-gray-700">184</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" /> Learning
                </div>
                <span className="font-bold text-gray-700">92</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> New
                </div>
                <span className="font-bold text-gray-700">66</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FUTURE SCHEDULED CARDS --- */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-800">Future Scheduled Cards</h2>
              <p className="text-xs text-gray-400 mt-0.5">Projected review volume for the next 14 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 bg-[#6366F1] rounded-sm" /> Projected Volume
              </div>
              <span className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-gray-500 font-medium">Next 14 Days</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={futureScheduledData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} />
                <Bar dataKey="volume" fill="#6366F1" opacity={0.85} radius={[3, 3, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- BOTTOM ROW: REVIEW QUEUE, CONSISTENCY, FOCUS AREAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Due for Review */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">Due for Review</h2>
                <span className="text-[10px] font-extrabold bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wide">Urgent</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-700">Neuroanatomy 101</h3>
                    <span className="text-[11px] font-semibold text-[#6366F1]">40 Cards</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Next review: 2 hours
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-700">Advanced React Hooks</h3>
                    <span className="text-[11px] font-semibold text-[#6366F1]">18 Cards</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Next review: Today
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consistency Map Grid */}
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
                return <div key={idx} className={`aspect-square w-full rounded-[3px] ${bgClass}`} />;
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

          {/* Focus Areas */}
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
                    <div className="bg-[#6366F1] h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                {/* Legal Ethics */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-600">Legal Ethics</span>
                    <span className="text-gray-400">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6366F1] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                {/* Data Structures */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-600">Data Structures</span>
                    <span className="text-gray-400">94%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6366F1] h-full rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 text-center text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
              View Detailed Breakdown
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}