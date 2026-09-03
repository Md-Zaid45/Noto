import { Clock } from 'lucide-react';

export default function DueCards({ decks }) {
  const due = (decks || []).filter((d) => d.dueCards > 0).slice(0, 5);

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#111827] dark:text-stone-100">Due for Review</h2>
          {due.length > 0 && (
            <span className="text-[10px] font-extrabold bg-[#fef2f2] text-[#ef4444] px-1.5 py-0.5 rounded uppercase tracking-wide">
              Urgent
            </span>
          )}
        </div>

        <div className="space-y-3">
          {due.length > 0 ? due.map((d) => (
            <div key={d.noteId} className="p-3.5 bg-[#f9fafb] dark:bg-stone-800 rounded-xl border border-[#e5e7eb] dark:border-stone-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-[#111827] dark:text-stone-100">{d.name}</h3>
                <span className="text-[11px] font-semibold text-[#1a5c3a] dark:text-emerald-300">{d.dueCards} Cards</span>
              </div>
              <p className="text-[11px] text-[#9ca3af] dark:text-stone-500 mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Due today
              </p>
            </div>
          )) : (
            <p className="text-sm text-[#9ca3af] dark:text-stone-500 text-center py-4">No cards due for review</p>
          )}
        </div>
      </div>
    </div>
  );
}
