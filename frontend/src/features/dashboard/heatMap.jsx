import { useMemo } from 'react';

function getLevel(val) {
  if (val === 0) return 0;
  if (val <= 2) return 1;
  if (val <= 5) return 2;
  if (val <= 10) return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-[#e5e7eb]",
  "bg-[#bbf7d0]",
  "bg-[#34d399]",
  "bg-[#059669]",
  "bg-[#1a5c3a]",
];

export default function HeatMap({ dailyActivity }) {
  const grid = useMemo(() => {
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = dailyActivity?.find((a) => a._id === key);
      cells.push(found ? found.count : 0);
    }
    return cells;
  }, [dailyActivity]);

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex flex-col justify-between items-center">
      <div className="w-full text-left">
        <h2 className="font-bold text-[#111827] dark:text-stone-100 mb-4">Consistency Map</h2>
      </div>

      <div className="grid grid-cols-7 gap-1.5 w-full max-w-[210px] my-auto">
        {grid.map((val, idx) => (
          <div key={idx} className={`aspect-square w-full rounded-[3px] ${LEVEL_COLORS[getLevel(val)]}`} />
        ))}
      </div>

      <div className="flex justify-between items-center w-full max-w-[210px] text-[10px] font-bold text-[#6b7280] dark:text-stone-400 uppercase tracking-wider mt-4">
        <span>Less</span>
        <div className="flex gap-1">
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-[1px] ${c}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
