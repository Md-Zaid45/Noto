import React, { useState, useEffect, useCallback } from "react";
import { Inbox, RotateCcw, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiFetch } from "../../commons/apifetch";
import { useDispatch } from "react-redux";
import { addFlashcards } from "./flashcardSlice";
import Tabs from "../notes/editor/tabs";
const handleRating = async (rating,time,setTime, cardId) => {
  const now=new Date()
  setTime(now)
  const res = await apiFetch(`/flashcards/review/${cardId}`, {
    method: "PATCH",
    body: { score: rating ,timeSpent:now-time },
  });
  const data = await res.json();
};
export default function ReviewFlashcard() {
  const [time, setTime] = useState(new Date());
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!id) return;
    const fetchCards = async () => {
      const res = await apiFetch(`/flashcards/${id}`, { method: "GET" });
      const data = await res.json();
      dispatch(addFlashcards(data.payload));
    };
    fetchCards();
  }, [id]);

  const allCards = useSelector((state) => state.Flashcards.cards);
  const now = new Date();
  const flashcards = allCards.length
    ? allCards.filter(
        (card) =>
          card.noteId === id &&
          card.nextReview &&
          new Date(card.nextReview) <= now,
      )
    : [];

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
      <div className="flex flex-col h-full bg-white dark:bg-stone-900">
        <Tabs OpenTabs={[]} hideTabs={true} />
        <div className="flex-1 overflow-y-auto">
          <EmptyState
            title="No cards to review"
            subtitle="You're all caught up! Come back later for more."
          />
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-stone-900">
        <Tabs OpenTabs={[]} hideTabs={true} />
        <div className="flex-1 overflow-y-auto p-7">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2
                  className="w-9 h-9 text-green-500 dark:text-emerald-400"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-stone-300 mb-1">
                All caught up!
              </h3>
              <p className="text-sm text-gray-400 dark:text-stone-500 mb-6">
                You've reviewed all {flashcards.length} card
                {flashcards.length !== 1 ? "s" : ""} in this set.
              </p>
              <button
                onClick={restart}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Review Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = (currentIndex / flashcards.length) * 100;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900">
      <Tabs OpenTabs={[]} hideTabs={true} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-xl mx-auto">
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-400 dark:text-stone-500 mb-1.5">
              <span>
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-300"
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
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-8"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h3 className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-3">
                  Question
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-stone-100 leading-snug text-center">
                  {currentCard.question}
                </p>
                <span className="text-xs text-gray-400 dark:text-stone-500 mt-5 flex items-center gap-1.5">
                  Click or press
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded text-gray-500 dark:text-stone-400 font-mono text-xs">
                    Space
                  </kbd>
                  to reveal
                </span>
              </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h3 className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-3">
              Answer
            </h3>
            <p className="text-base text-gray-800 dark:text-stone-200 leading-relaxed text-center">
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
        <p className="text-center text-xs text-gray-400 dark:text-stone-500 mb-3">
          How well did you recall it? Press{" "}
          {["1", "2", "3", "4"].map((k) => (
            <kbd
              key={k}
              className="mx-0.5 px-1 py-0.5 bg-gray-100 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded font-mono text-xs"
            >
              {k}
            </kbd>
          ))}{" "}
          to rate
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Forgot it",
              key: "0",
              interval: "0m",
              base: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30",
              badge: "border-red-200 text-red-400 dark:border-red-950/30 dark:text-red-400",
              sub: "text-red-400 dark:text-red-400",
            },
            {
              label: "AGAIN",
              key: "1",
              interval: "10m",
              base: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30",
              badge: "border-red-200 text-red-400 dark:border-red-950/30 dark:text-red-400",
              sub: "text-red-100 dark:text-red-100",
            },
            {
              label: "HARD",
              key: "2",
              interval: "2d",
              base: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/30",
              badge: "border-orange-200 text-orange-400 dark:border-orange-950/30 dark:text-orange-400",
              sub: "text-orange-400 dark:text-orange-400",
            },
            {
              label: "GOOD",
              key: "3",
              interval: "4d",
              base: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50",
              badge: "border-emerald-200 text-emerald-400 dark:border-emerald-950/30 dark:text-emerald-400",
              sub: "text-emerald-400 dark:text-emerald-400",
            },
            {
              label: "EASY",
              key: "4",
              interval: "7d",
              base: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50",
              badge: "border-emerald-200 text-emerald-400 dark:border-emerald-950/30 dark:text-emerald-400",
              sub: "text-emerald-400 dark:text-emerald-400",
            },
            {
              label: "SKIP",
              key: "5",
              interval: "1d",
              base: "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700",
              badge: "border-gray-200 text-gray-400 dark:border-stone-700 dark:text-stone-500",
              sub: "text-gray-400 dark:text-stone-500",
            },
          ].map(({ label, key, interval, fn, base, badge, sub }) => (
            <button
              key={label}
              onClick={() => {
                handleRating(key,time, setTime, currentCard.id);
                moveToNext();
              }}
              className={`flex flex-col items-center justify-center px-3 py-3 rounded-xl
                         ${base} font-semibold text-sm
                         active:scale-95 transition-all duration-150`}
            >
              <span className="flex items-center gap-1 mb-0.5">
                <kbd
                  className={`px-1 py-0.5 bg-white dark:bg-stone-900 border rounded text-xs font-mono ${badge}`}
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
        <p className="text-center text-xs text-gray-400 dark:text-stone-500 mt-2">
          Rating options will appear after you reveal the answer
        </p>
      )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-stone-800">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-12 h-12 text-gray-300 dark:text-stone-600 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-stone-400 mb-1">{title}</h3>
        <p className="text-sm text-gray-400 dark:text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}
