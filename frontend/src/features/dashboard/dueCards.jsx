import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export default function DueCards({ decks }) {
  const allDue = (decks || []).filter((d) => d.dueCards > 0);
  const due = allDue.slice(0, 4);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (noteId) => {
    navigate(`/home/cards/${noteId}`);
  };

  return (
    <>
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#111827] dark:text-stone-100">Due for Review</h2>
            {allDue.length > 0 && (
              <span className="text-[10px] font-extrabold bg-[#fef2f2] text-[#ef4444] px-1.5 py-0.5 rounded uppercase tracking-wide">
                Urgent
              </span>
            )}
          </div>

          <div className="space-y-3">
            {due.length > 0 ? due.map((d) => (
              <div
                key={d.noteId}
                onClick={() => handleNavigate(d.noteId)}
                className="p-3.5 bg-[#f9fafb] dark:bg-stone-800 rounded-xl border border-[#e5e7eb] dark:border-stone-800 cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-stone-700 transition-colors"
              >
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

        {allDue.length >4 && (
          <button
            onClick={() => setOpen(true)}
            className="w-full mt-4 text-center text-xs font-semibold text-[#6b7280] dark:text-stone-400 border border-[#d1d5db] dark:border-stone-700 rounded-xl py-2.5 bg-white dark:bg-stone-900 hover:bg-[#f9fafb] dark:hover:bg-stone-800 transition-colors"
          >
            View More ({allDue.length - 4} more)
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Due for Review</DialogTitle>
            <DialogDescription>{allDue.length} deck{allDue.length !== 1 ? 's' : ''} with cards due today</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {allDue.map((d) => (
              <div
                key={d.noteId}
                onClick={() => { handleNavigate(d.noteId); setOpen(false); }}
                className="p-3.5 bg-[#f9fafb] dark:bg-stone-800 rounded-xl border border-[#e5e7eb] dark:border-stone-700 cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-stone-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-[#111827] dark:text-stone-100">{d.name}</h3>
                  <span className="text-xs font-semibold text-[#1a5c3a] dark:text-emerald-300">{d.dueCards} Cards</span>
                </div>
                <p className="text-xs text-[#9ca3af] dark:text-stone-500 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due today
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
