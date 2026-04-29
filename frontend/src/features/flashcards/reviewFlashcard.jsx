import React, { useState, useEffect, useCallback } from "react";
import { Inbox, RotateCcw, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ReviewFlashcard({
  onAgain = () => {},
  onHard = () => {},
  onGood = () => {},
  onEasy = () => {},
}) {
  const { id } = useParams();
  const allCards = useSelector((state) => state.Flashcards);
  const flashcards = allCards.filter((card) => card.noteId === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const moveToNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setDone(true);
    }
    setFlipped(false);
  }, [currentIndex, flashcards.length]);

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setDone(false);
  };

  if (!flashcards.length) {
    return (
      <EmptyState
        title="No cards to review"
        subtitle="You're all caught up! Come back later for more."
      />
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2
              className="w-9 h-9 text-green-500"
              strokeWidth={1.8}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            All caught up!
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            You've reviewed all {flashcards.length} card
            {flashcards.length !== 1 ? "s" : ""} in this set.
          </p>
          <button
            onClick={restart}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl
                       text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Review Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = (currentIndex / flashcards.length) * 100;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="relative mb-6" style={{ perspective: "1000px" }}>
        <div
          role="button"
          aria-label={flipped ? "Show question" : "Reveal answer"}
          onClick={() => setFlipped((f) => !f)}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            width: "100%",
            height: "256px",
            cursor: "pointer",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 rounded-xl p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              Question
            </h3>
            <p className="text-lg font-semibold text-gray-900 leading-snug text-center">
              {currentCard.question}
            </p>
            <span className="text-xs text-gray-400 mt-5 flex items-center gap-1.5">
              Click or press
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500 font-mono text-xs">
                Space
              </kbd>
              to reveal
            </span>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 rounded-xl p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-3">
              Answer
            </h3>
            <p className="text-base text-gray-800 leading-relaxed text-center">
              {currentCard.answer}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          transition: "opacity 0.25s ease, transform 0.25s ease",
          opacity: flipped ? 1 : 0,
          transform: flipped ? "translateY(0)" : "translateY(6px)",
          pointerEvents: flipped ? "auto" : "none",
        }}
      >
        {/* Keyboard hint */}
        <p className="text-center text-xs text-gray-400 mb-3">
          How well did you recall it? Press{" "}
          {["1", "2", "3", "4"].map((k) => (
            <kbd
              key={k}
              className="mx-0.5 px-1 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-xs"
            >
              {k}
            </kbd>
          ))}{" "}
          to rate
        </p>

        <button
          onClick={() => {
            onAgain();
            moveToNext();
          }}
          className="w-full flex items-center justify-between px-5 py-3 mb-3 rounded-xl
                     bg-red-50 text-red-600 font-semibold text-sm
                     hover:bg-red-100 active:scale-[0.98] transition-all duration-150"
        >
          <span className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white border border-red-200 rounded text-xs font-mono text-red-400">
              1
            </kbd>
            AGAIN
          </span>
          <span className="text-red-300 text-xs font-medium">&lt; 1 min</span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "HARD",
              key: "2",
              interval: "2d",
              fn: onHard,
              base: "bg-orange-50 text-orange-700 hover:bg-orange-100",
              badge: "border-orange-200 text-orange-400",
              sub: "text-orange-400",
            },
            {
              label: "GOOD",
              key: "3",
              interval: "4d",
              fn: onGood,
              base: "bg-blue-50 text-blue-700 hover:bg-blue-100",
              badge: "border-blue-200 text-blue-400",
              sub: "text-blue-400",
            },
            {
              label: "EASY",
              key: "4",
              interval: "7d",
              fn: onEasy,
              base: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
              badge: "border-emerald-200 text-emerald-400",
              sub: "text-emerald-400",
            },
          ].map(({ label, key, interval, fn, base, badge, sub }) => (
            <button
              key={label}
              onClick={() => {
                fn();
                moveToNext();
              }}
              className={`flex flex-col items-center justify-center px-3 py-3 rounded-xl
                         ${base} font-semibold text-sm
                         active:scale-95 transition-all duration-150`}
            >
              <span className="flex items-center gap-1 mb-0.5">
                <kbd
                  className={`px-1 py-0.5 bg-white border rounded text-xs font-mono ${badge}`}
                >
                  {key}
                </kbd>
                {label}
              </span>
              <span className={`text-xs mt-0.5 ${sub}`}>{interval}</span>
            </button>
          ))}
        </div>
      </div>

      {!flipped && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Rating options will appear after you reveal the answer
        </p>
      )}
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-gray-600 mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
