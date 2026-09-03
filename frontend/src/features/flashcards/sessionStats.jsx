import React from "react";

/*
  SessionComplete — Noto (light mode)
  ------------------------------------------------------------
  Shown after a user finishes all due cards in a deck's study session.
  Pass in the session result object; this component is purely presentational.

  sessionResult shape:
  {
    deckTitle: string,
    cardsReviewed: number,
    sessionTimeSec: number,
    breakdown: { again: number, hard: number, good: number, easy: number }, // percentages, sum ~100
    nextReviewLabel: string, // e.g. "Tomorrow, 09:00 AM"
  }
*/

const BREAKDOWN_CONFIG = [
  { key: "again", label: "Again", color: "bg-red-400 dark:bg-red-500" },
  { key: "hard", label: "Hard", color: "bg-amber-400 dark:bg-amber-500" },
  { key: "good", label: "Good", color: "bg-emerald-400 dark:bg-emerald-500" },
  { key: "easy", label: "Easy", color: "bg-teal-400 dark:bg-teal-500" },
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SessionComplete({
  sessionResult = {
    deckTitle: "System design fundamentals",
    cardsReviewed: 48,
    sessionTimeSec: 765,
    breakdown: { again: 8, hard: 12, good: 60, easy: 20 },
    nextReviewLabel: "Tomorrow, 09:00 AM",
  },
  onBackToOverview,
  onStudyAnother,
}) {
  const { deckTitle, cardsReviewed, sessionTimeSec, breakdown, nextReviewLabel } =
    sessionResult;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-stone-950 flex items-center justify-center p-7">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-5">
          <i className="ti ti-check text-2xl text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>

        <h2 className="text-lg font-medium text-slate-900 dark:text-stone-100">Session complete</h2>
        <p className="text-[13px] text-slate-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          Excellent focus today. Your knowledge of{" "}
          <span className="text-slate-700 dark:text-stone-300">{deckTitle}</span> is solidifying.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <div className="rounded-2xl bg-slate-50 dark:bg-stone-800 px-4 py-3.5">
            <p className="text-[11px] text-slate-400 dark:text-stone-500 mb-1">Cards reviewed</p>
            <p className="text-xl font-medium text-slate-900 dark:text-stone-100">{cardsReviewed}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-stone-800 px-4 py-3.5">
            <p className="text-[11px] text-slate-400 dark:text-stone-500 mb-1">Session time</p>
            <p className="text-xl font-medium text-slate-900 dark:text-stone-100">
              {formatTime(sessionTimeSec)}
            </p>
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-stone-500 mb-2">
            <span>Performance breakdown</span>
            <span>High retention</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex w-full bg-slate-100 dark:bg-stone-800">
            {BREAKDOWN_CONFIG.map((b) => (
              <div
                key={b.key}
                className={b.color}
                style={{ width: `${breakdown[b.key]}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {BREAKDOWN_CONFIG.map((b) => (
              <div key={b.key} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                <span className="text-[11px] text-slate-500 dark:text-stone-400">
                  {b.label} {breakdown[b.key]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-6 rounded-2xl bg-slate-50 dark:bg-stone-800 px-4 py-3 flex items-center gap-2 text-[12px] text-slate-600 dark:text-stone-400">
          <i className="ti ti-calendar text-slate-400 dark:text-stone-500" aria-hidden="true" />
          Next review:{" "}
          <span className="font-medium text-slate-800 dark:text-stone-200">{nextReviewLabel}</span>
        </div>

        <div className="w-full mt-6 flex gap-3">
          <button
            onClick={onBackToOverview}
            className="flex-1 text-[13px] font-medium rounded-xl border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 py-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 transition-colors"
          >
            Back to overview
          </button>
          <button
            onClick={onStudyAnother}
            className="flex-1 text-[13px] font-medium rounded-xl bg-slate-900 dark:bg-stone-950 text-white py-2.5 hover:bg-slate-700 dark:hover:bg-stone-800 transition-colors"
          >
            Study another deck
          </button>
        </div>
      </div>
    </div>
  );
}