import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-stone-800 px-3 py-2 rounded-xl shadow-lg shadow-black/5 border border-[#e5e7eb] dark:border-stone-700">
      <p className="text-[11px] font-semibold text-[#6b7280] dark:text-stone-400 mb-0.5">{data.fullDate}</p>
      <p className="text-sm font-bold text-[#1a5c3a] dark:text-emerald-400">{data.volume} cards</p>
    </div>
  );
}

export function FutureScheduledCards({ futureCards }) {
  const chartData = useMemo(() => {
    if (!futureCards?.length) return [];
    const next14 = futureCards.slice(0, 14);
    return next14.map((d) => {
      const date = new Date(d._id);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { date: label, volume: d.count, fullDate: d._id };
    });
  }, [futureCards]);

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-[#111827] dark:text-stone-100">Future Scheduled Cards</h2>
          <p className="text-xs text-[#9ca3af] dark:text-stone-500 mt-0.5">Projected review volume for the next 14 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#6b7280] dark:text-stone-400">
            <span className="w-3 h-3 bg-[#6ee7b7] dark:bg-emerald-500 rounded-sm" /> Projected Volume
          </div>
          <span className="text-xs bg-white dark:bg-stone-900 border border-[#d1d5db] dark:border-stone-700 rounded-lg px-2.5 py-1 text-[#374151] dark:text-stone-300 font-medium">
            Next 14 Days
          </span>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#A1A1AA", fontSize: 10, fontWeight: 500 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F4F4F5" }} />
            <Bar dataKey="volume" fill="#1a5c3a" opacity={0.85} radius={[3, 3, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
