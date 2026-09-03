import { ChevronRight } from 'lucide-react';

export default function FocusAreas({ decks }) {
  const items = (decks || []).filter((d) => d.totalCards > 0).slice(0, 5);

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-[#111827] dark:text-stone-100 mb-4">Focus Areas</h2>

        <div className="space-y-4">
          {items.length > 0 ? items.map((d) => (
            <div key={d.noteId}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#111827] dark:text-stone-100">{d.name}</span>
                <span className="text-[#6b7280] dark:text-stone-400">{d.mastery}%</span>
              </div>
              <div className="w-full bg-[#e5e7eb] dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${d.mastery}%`, backgroundColor: d.mastery >= 70 ? '#1a5c3a' : '#6ee7b7' }}
                />
              </div>
            </div>
          )) : (
            <p className="text-sm text-[#9ca3af] dark:text-stone-500 text-center py-4">No deck data available</p>
          )}
        </div>
      </div>

      <button className="w-full mt-6 text-center text-xs font-semibold text-[#6b7280] dark:text-stone-400 border border-[#d1d5db] dark:border-stone-700 rounded-xl py-2.5 bg-white dark:bg-stone-900 hover:bg-[#f9fafb] dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1">
        View Detailed Breakdown
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
