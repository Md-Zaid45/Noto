import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addFlashcards } from "../features/flashcards/flashcardSlice";
import { apiFetch } from "../commons/apifetch";
import { useContext } from "react";
import { sidebarContext, viewContext } from "../home";
import { childrenIds } from "../features/navigation/sidebar/utils";
import Tabs from "../features/notes/editor/tabs";
import { toast } from "../hooks/use-toast";
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

  return (
    <div className="group w-[280px] h-[320px] rounded-2xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex flex-col shadow-sm hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-stone-900/50 hover:border-gray-300 dark:hover:border-stone-600 transition-all duration-200 overflow-hidden">
      <div className="flex-1 p-5 flex flex-col min-h-0">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-stone-800 flex items-center justify-center">
            <i className="ti ti-book text-gray-600 dark:text-gray-300 text-base" aria-hidden="true" />
          </div>
          {deck.dueToday > 0 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              {deck.dueToday} due
            </span>
          )}
        </div>

        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug mb-1 truncate">
          {deck.name}
        </h3>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {deck.totalCards} cards · {timeAgo(deck.lastStudied)}
        </p>

        {!isEmpty && (
          <div className="mt-auto">
            <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
              <span>Mastery</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{deck.mastery}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${deck.mastery}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-0 flex flex-col gap-2">
        {isEmpty ? (
          <button
            onClick={() => onGenerate(deck, count)}
            disabled={generating === deck.id}
            className="w-full text-[12px] font-medium rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 flex items-center justify-center gap-1.5 hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ti ti-sparkles text-[13px]" aria-hidden="true" />
            {generating === deck.id ? "Generating..." : "Generate cards"}
          </button>
        ) : (
          <>
            <button
              onClick={() => onStudy(deck)}
              className="w-full text-[12px] font-medium rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              Study now
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => onGenerate(deck, count)}
                disabled={generating === deck.id}
                className="flex-1 text-[12px] font-medium rounded-xl bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 py-2 hover:bg-gray-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {generating === deck.id ? "..." : "Generate"}
              </button>
              <button
                onClick={() => onQuiz(deck)}
                className="flex-1 text-[12px] font-medium rounded-xl bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 py-2 hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors"
              >
                Quiz
              </button>
              <button
                onClick={() => onManage(deck)}
                className="flex-1 text-[12px] font-medium rounded-xl bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 py-2 hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors"
              >
                Manage
              </button>
            </div>
          </>
        )}
      </div>
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
      <h2 className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-4">{title}</h2>
      <div className="ml-16 flex flex-wrap gap-4">
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
    try {
      const res = await apiFetch(`/flashcards/${noteId}`, { method: "GET" });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch flashcards");
      }
      dispatch(addFlashcards(data.payload));
      navigate(`../cards/review/${noteId}`);
    } catch (err) {
      console.error("Failed to fetch flashcards for review:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load flashcards. Please try again.",
      });
    }
  };

  const handleGenerate = async (deck, count = 5) => {
    const noteId = deck.id || deck._id;
    setGenerating(noteId);
    try {
      const res = await apiFetch(`/ai/flashcards/${noteId}`, {
        method: "POST",
        body: { count },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      if (data.success && data.newFlashcards?.length) {
        dispatch(addFlashcards({ flashcards: data.newFlashcards }));
      } else {
        throw new Error(data.message || "No flashcards generated");
      }
    } catch (err) {
      console.error("Failed to generate flashcards", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to generate flashcards. Please try again.",
      });
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
    <div className="flex flex-col  h-full bg-white dark:bg-stone-900">
      <Tabs OpenTabs={[]} hideTabs={true} />
      <div className="flex-1  bg-stone-50 dark:bg-stone-950 p-7 overflow-y-auto">
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
    </div>
  );
}
