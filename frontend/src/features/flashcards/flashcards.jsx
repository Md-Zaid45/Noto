import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addFlashcards } from "./flashcardSlice";
import { apiFetch } from "../../commons/apifetch";
import { useContext } from "react";
import { sidebarContext, viewContext } from "../../home";
import { childrenIds } from "../navigation/sidebar/utils";
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
  purple: "bg-violet-50 text-violet-600",
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

function DeckCard({ deck, onStudy, onGenerate }) {
  const isEmpty = deck.totalCards === 0;
  const colorClasses = COLOR_MAP[deck.color] || COLOR_MAP.purple;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center `}
        >
          <i className={`ti  text-lg`} aria-hidden="true" />
        </div>
        {deck.dueToday > 0 && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            due
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[15px] font-medium text-slate-900 leading-snug">
          {deck.name}
        </h3>
        <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
          {deck.name}
        </p>
      </div>

      {isEmpty ? (
        <button
          onClick={() => onGenerate(deck)}
          className="mt-1 text-[13px] font-medium rounded-xl bg-slate-900 text-white py-2.5 flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors"
        >
          <i className="ti ti-sparkles text-sm" aria-hidden="true" />
          Generate cards
        </button>
      ) : (
        <>
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Mastery</span>
              <span className="font-medium text-slate-700">
                {deck.mastery}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${deck.mastery}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            {/* <span>{timeAgo(deck.lastStudied)}</span> */}
            <span>{deck.totalCards} cards</span>
          </div>

          <button
            onClick={() => onStudy(deck)}
            className="text-[13px] font-medium rounded-xl border border-slate-200 text-slate-700 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Study now
          </button>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 flex-1 min-w-[140px] shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <i className={`ti ${icon} text-[15px]`} aria-hidden="true" />
        <p className="text-[12px]">{label}</p>
      </div>
      <p className={`text-2xl font-medium ${accent || "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, decks, onStudy, onGenerate }) {
  if (decks.length === 0) return null;
  return (
    <div className="mb-9">
      <h2 className="text-[14px] font-medium text-slate-700 mb-3.5">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {decks.map((d) => (
          <DeckCard
            key={d.id}
            deck={d}
            onStudy={onStudy}
            onGenerate={onGenerate}
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

  const handleStudy = async (deck) => {
    const res = await apiFetch(`/flashcards/${id}`, { method: "GET" });
    const data = await res.json();
    if (data.success === false) {
      console.error("Failed to fetch flashcards for review:", data.message);
      return;
    }
    dispatch(addFlashcards(data.payload));
    navigate(`../cards/review/${id}`);
    console.log("Fetched flashcards for review:", data);
  };
  const handleGenerate = (deck) => console.log("generate cards for", deck.id);

  return (
    <div className="bg-slate-50 min-h-full p-7">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-medium text-slate-900">Flashcards</h1>
        <button className="text-[13px] font-medium rounded-xl bg-slate-900 text-white px-4 py-2.5 flex items-center gap-1.5 hover:bg-slate-700 transition-colors">
          <i className="ti ti-plus text-sm" aria-hidden="true" />
          New card
        </button>
      </div>
      {childs.length ? (
        <Section
          title={"deck"}
          decks={childs}
          onStudy={handleStudy}
          onGenerate={handleGenerate}
        />
      ) : (
        <>
          <Section
            title="Continue studying"
            decks={continueStudying}
            onStudy={handleStudy}
            onGenerate={handleGenerate}
          />
          <Section
            title="Recently practiced"
            decks={recentlyPracticed}
            onStudy={handleStudy}
            onGenerate={handleGenerate}
          />
          {continueStudying.length === 0 && recentlyPracticed.length === 0 && (
            <Section
              title="All decks"
              decks={data}
              onStudy={handleStudy}
              onGenerate={handleGenerate}
            />
          )}
        </>
      )}
    </div>
  );
}
