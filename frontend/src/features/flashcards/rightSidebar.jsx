import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addFlashcard, createFlashcardAsync } from "./flashcardSlice";

export default function RightSidebar({ ExpandRightbar }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");

  const handleCreateCard = () => {
    if (!question.trim()) return;
    const newCard = {
      noteId: id,
      question: question.trim(),
      answer: answerText,
    };
    dispatch(addFlashcard(newCard))
    dispatch(createFlashcardAsync(newCard))
    setQuestion("");
    setAnswerText("");
  };

  return (
    <div
      className={`
        h-full overflow-y-auto bg-zinc-50 border-l border-gray-200 shadow-emerald-200
        transition-all duration-300 ease-in-out flex-shrink-0 rounded-xl outline-zinc-300 outline-1 mt-0.5
        ${ExpandRightbar ? "w-60 opacity-100" : "w-0 opacity-0 overflow-hidden pointer-events-none"}
      `}
    >
      <div className="p-3 space-y-4 text-slate-600 text-[14px]">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-800">New Flashcard</h2>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question..."
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Answer</label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Enter answer"
              rows={3}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
            />
          </div>

          <button
            onClick={handleCreateCard}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors"
          >
            <span>+</span> Create Card
          </button>
        </section>

        <hr className="border-gray-200" />

      </div>
    </div>
  );
}