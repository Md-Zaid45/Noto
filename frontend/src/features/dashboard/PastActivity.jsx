import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-stone-800 px-3 py-2 rounded-xl shadow-lg shadow-black/5 border border-[#e5e7eb] dark:border-stone-700">
      <p className="text-[11px] font-semibold text-[#6b7280] dark:text-stone-400 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#1a5c3a] dark:text-emerald-400">{payload[0].value} min</p>
    </div>
  );
}

export function PastActivity({ weeklyActivity }) {
  const chartData = useMemo(() => {
    if (!weeklyActivity?.length) return [];
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = weeklyActivity.find((w) => w._id === key);
      last7.push({
        day: DAY_NAMES[d.getDay()],
        minutes: found ? parseFloat((found.count / 60000).toFixed(1)) : 0,
      });
    }
    return last7;
  }, [weeklyActivity]);

  const maxMinutes = useMemo(() => Math.max(...chartData.map((d) => d.minutes), 1), [chartData]);
  const yMax = Math.ceil(maxMinutes * 1.2);

  return (
    <div className="bg-white dark:bg-stone-900 flex-4 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-[#111827] dark:text-stone-100">Weekly Study Activity</h2>
        <select className="text-xs border border-[#d1d5db] dark:border-stone-700 rounded-lg p-1.5 text-[#374151] dark:text-stone-300 bg-white dark:bg-stone-900 outline-none">
          <option>Last 7 Days</option>
        </select>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11 }} domain={[0, yMax]} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F4F4F5' }} />
            <Bar dataKey="minutes" fill="#1a5c3a" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}