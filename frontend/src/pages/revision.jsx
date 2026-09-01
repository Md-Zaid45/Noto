import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addFlashcards } from "../features/flashcards/flashcardSlice";
import { apiFetch } from "../commons/apifetch";
import { useContext } from "react";
import { sidebarContext, viewContext } from "../home";
import { childrenIds } from "../features/navigation/sidebar/utils";
/*
  Cards Page — Noto (light mode)
  ------------------------------------------------------------
  Architecture:
  - Sidebar stays hierarchical (folders > notes) — not rendered here,
    assume it lives in a parent layout and passes `selectedScope` down.
  - Main panel is ALWAYS a flat grid of "decks" (a deck = a note with cards).
  - selectedScope can be: null (nothing selected), { type: 'note', id },
    or { type: 'folder', id }. Folder selection flattens every note
    under it (any depth) into the same grid — no nested drill-down.
  - When selectedScope is null, we show two curated rows instead of
    one global list: "Continue studying" (due today, sorted by due count)
    and "Recently practiced" (last studied, deduped against the first row).
*/

const MOCK_DECKS = [
  {
    id: "n1",

    title: "Advanced organic chemistry",
    description: "Functional groups, reaction mechanisms, and nomenclature.",
    folderId: "f1",
    folderPath: ["Chemistry", "Reactions"],
    totalCards: 342,
    dueToday: 12,
    mastery: 82,
    lastStudied: "2025-06-20T10:00:00Z",
    icon: "ti-flask",
    color: "purple",
  },
  {
    id: "n2",
    title: "History of jazz",
    description: "From New Orleans roots to modern experimental fusion.",
    folderId: "f2",
    folderPath: ["Music"],
    totalCards: 128,
    dueToday: 18,
    mastery: 45,
    lastStudied: "2025-06-19T10:00:00Z",
    icon: "ti-music",
    color: "coral",
  },
  {
    id: "n3",
    title: "Quantum mechanics",
    description: "0 cards found. Let Noto's AI synthesize your class notes.",
    folderId: "f1",
    folderPath: ["Physics"],
    totalCards: 0,
    dueToday: 0,
    mastery: 0,
    lastStudied: null,
    icon: "ti-atom",
    color: "teal",
  },
  {
    id: "n4",
    title: "German B2 vocabulary",
    description: "Essential nouns, separable verbs, and common idioms.",
    folderId: "f3",
    //   folderPath: ["Languages"],
    totalCards: 850,
    dueToday: 0,
    mastery: 91,
    lastStudied: "2025-06-17T10:00:00Z",
    // icon: "ti-language",
    // color: "pink",
  },
];

const STATS = {
  totalCards: 1248,
  dueToday: 42,
  mastered: 68,
  streak: 14,
};

const COLOR_MAP = {
  purple: "bg-emerald-50 text-emerald-600",
  coral: "bg-orange-50 text-orange-600",
  teal: "bg-teal-50 text-teal-600",
  pink: "bg-pink-50 text-pink-600",
};

function timeAgo(iso) {
  if (!iso) return "Never studied";
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function DeckCard({ deck, onStudy, onGenerate, onQuiz, onManage, generating }) {
  const isEmpty = deck.totalCards === 0;
  const [count, setCount] = useState(5);
  const colorClasses = COLOR_MAP[deck.color] || COLOR_MAP.purple;

  return (
    <div className="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 flex flex-col gap-4 shadow-sm shadow-emerald-500/5 hover:shadow-emerald-500/10 hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-150">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}>
          <i className={`ti text-lg`} aria-hidden="true" />
        </div>
        {deck.dueToday > 0 && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
            due
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[15px] font-medium text-stone-900 dark:text-stone-100 leading-snug">
          {deck.name}
        </h3>
        <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
          {deck.name}
        </p>
      </div>

      {isEmpty ? (
        <button
          onClick={() => onGenerate(deck, count)}
          disabled={generating === deck.id}
          className="mt-1 text-[13px] font-medium rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-2.5 flex items-center justify-center gap-1.5 hover:bg-stone-700 dark:hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i className="ti ti-sparkles text-sm" aria-hidden="true" />
          {generating === deck.id ? "Generating..." : "Generate cards"}
        </button>
      ) : (
        <>
          <div>
            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
              <span>Mastery</span>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                {deck.mastery}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${deck.mastery}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>{deck.totalCards} cards</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onStudy(deck)}
              className="text-[13px] font-medium rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors"
            >
              Study now
            </button>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-10 text-center text-[13px] py-2 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:bg-stone-800 dark:text-stone-100"
              />
              <button
                onClick={() => onGenerate(deck, count)}
                disabled={generating === deck.id}
                className="flex-1 text-[13px] font-medium rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating === deck.id ? "..." : "Generate"}
              </button>
              <button
                onClick={() => onQuiz(deck)}
                className="flex-1 text-[13px] font-medium rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                Quiz
              </button>
            </div>
            <button
              onClick={() => onManage(deck)}
              className="text-[13px] font-medium rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors"
            >
              Manage
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-4 flex-1 min-w-[140px] shadow-sm shadow-emerald-500/5">
      <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mb-2">
        <i className={`ti ${icon} text-[15px]`} aria-hidden="true" />
        <p className="text-[12px]">{label}</p>
      </div>
      <p className={`text-2xl font-medium ${accent || "text-stone-900 dark:text-stone-100"}`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, decks, onStudy, onGenerate, onQuiz, onManage, generating }) {
  if (decks.length === 0) return null;
  return (
    <div className="mb-9">
      <h2 className="text-[14px] font-medium text-stone-700 dark:text-stone-300 mb-3.5">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {decks.map((d) => (
          <DeckCard
            key={d.id}
            deck={d}
            onStudy={onStudy}
            onGenerate={onGenerate}
            onQuiz={onQuiz}
            onManage={onManage}
            generating={generating}
          />
        ))}
      </div>
    </div>
  );
}

export default function CardsPage({ decks = MOCK_DECKS }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(decks);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { Active } = useContext(sidebarContext);
  const folders = useSelector((state) => state.Folders);
  const notes = useSelector((state) => state.Notes);
  let folder = folders.find((folder) => folder.id === Active) || null;
  let childs = [];
  const note = notes.find(n=>n.id===id)
  if (folder) {
    const ids = childrenIds(folder.id, notes, folders);
    childs = notes.filter((note) => ids.includes(note.id));
  }
  else if(note) childs.push(note)
  console.log(childs, "childs");

  // useEffect(() => {
  //   const fechData = async () => {
  //     try {
  //       const res = await apiFetch(`/flashcards/`, {
  //         method: "GET",
  //       });
  //       const data = await res.json();
  //       setData(data);
  //     } catch {}
  //   };
  // }, [data]);
  // const scopedDecks = useMemo(() => {
  //   if (!selectedScope) return null;
  //   return data.filter((d) => d.id === selectedScope.id);

  //   return data;
  // }, [selectedScope, data]);

  const { continueStudying, recentlyPracticed } = useMemo(() => {
    const due = [...data]
      .filter((d) => d.dueToday > 0)
      .sort((a, b) => b.dueToday - a.dueToday);
    const dueIds = new Set(due.map((d) => d.id));
    const recent = [...data]
      .filter((d) => !dueIds.has(d.id) && d.lastStudied)
      .sort((a, b) => new Date(b.lastStudied) - new Date(a.lastStudied))
      .slice(0, 4);
    return { continueStudying: due, recentlyPracticed: recent };
  }, [data]);

  const [generating, setGenerating] = useState(null);

  const handleStudy = async (deck) => {
    const noteId = deck.id || deck._id;
    const res = await apiFetch(`/flashcards/${noteId}`, { method: "GET" });
    const data = await res.json();
    if (data.success === false) {
      console.error("Failed to fetch flashcards for review:", data.message);
      return;
    }
    dispatch(addFlashcards(data.payload));
    navigate(`../cards/review/${noteId}`);
  };

  const handleGenerate = async (deck, count = 5) => {
    const noteId = deck.id || deck._id;
    setGenerating(noteId);
    try {
      const res = await apiFetch(`/ai/flashcards/${noteId}`, {
        method: "POST",
        body: { count },
      });
      const data = await res.json();
      if (data.success && data.newFlashcards?.length) {
        dispatch(addFlashcards({ flashcards: data.newFlashcards }));
      }
    } catch (err) {
      console.error("Failed to generate flashcards", err);
    } finally {
      setGenerating(null);
    }
  };

  const handleQuiz = (deck) => {
    const noteId = deck.id || deck._id;
    navigate(`../quiz/${noteId}`);
  };

  const handleManage = (deck) => {
    const noteId = deck.id || deck._id;
    navigate(`../cards/manage/${noteId}`);
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-full p-7">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-medium text-stone-900 dark:text-stone-100">Flashcards</h1>
      </div>
      {childs.length ? (
        <Section
          title={"Deck"}
          decks={childs}
          onStudy={handleStudy}
          onGenerate={handleGenerate}
          onQuiz={handleQuiz}
          onManage={handleManage}
          generating={generating}
        />
      ) : (
        <>
          <Section
            title="Continue studying"
            decks={continueStudying}
            onStudy={handleStudy}
            onGenerate={handleGenerate}
            onQuiz={handleQuiz}
            onManage={handleManage}
            generating={generating}
          />
          <Section
            title="Recently practiced"
            decks={recentlyPracticed}
            onStudy={handleStudy}
            onGenerate={handleGenerate}
            onQuiz={handleQuiz}
            onManage={handleManage}
            generating={generating}
          />
          {continueStudying.length === 0 && recentlyPracticed.length === 0 && (
            <Section
              title="All decks"
              decks={data}
              onStudy={handleStudy}
              onGenerate={handleGenerate}
              onQuiz={handleQuiz}
              onManage={handleManage}
              generating={generating}
            />
          )}
        </>
      )}
    </div>
  );
}
