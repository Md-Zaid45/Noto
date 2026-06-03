import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, CheckCircle, Clock, Percent, Flame, AlertCircle, ChevronRight } from 'lucide-react';
const weeklyActivityData = [
  { day: "MON", hours: 1.5 },
  { day: "TUE", hours: 2.3 },
  { day: "WED", hours: 1.2 },
  { day: "THU", hours: 3.0 },
  { day: "FRI", hours: 2.1 },
  { day: "SAT", hours: 0.8 },
  { day: "SUN", hours: 2.5 },
];
export function PastActivity(){
  return <>
            {/* Weekly Study Activity */}
            <div className="bg-white flex-4 p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
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
    
       </>
}