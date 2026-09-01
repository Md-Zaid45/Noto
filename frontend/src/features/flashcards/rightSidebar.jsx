import React, { useState, useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { addFlashcard, addFlashcards } from "./flashcardSlice";
import { createFlashcardAsync } from "./flashcardThunks";
import { apiFetch } from "../../commons/apifetch";

export default function RightSidebar({
  rightPanelOpen,
  setRightPanelOpen,
  view,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname } = useLocation();
  const activeView = pathname.split("/")[2] || "";
  const [activeTab, setActiveTab] = useState("cards");

  useEffect(() => {
    if (activeTab === "chat" && !(activeView === "notes")) {
      setActiveTab("cards");
    }
  }, [activeView]);
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(5);
  const allFlashcards = useSelector((state) => state.Flashcards.cards);

  const noteFlashcards = useMemo(() => {
    if (!id) return [];
    return allFlashcards.filter((card) => card.noteId === id);
  }, [allFlashcards, id]);

  const counts = useMemo(() => {
    const now = new Date();
    return {
      total: noteFlashcards.length,
      due: noteFlashcards.filter((card) => {
        if (!card.nextReview) return true;
        return new Date(card.nextReview) <= now;
      }).length,
    };
  }, [noteFlashcards]);

  const handleCreateCard = () => {
    if (!question.trim()) return;
    const newCard = {
      noteId: id,
      question: question.trim(),
      answer: answerText,
    };
    dispatch(addFlashcard(newCard));
    dispatch(createFlashcardAsync(newCard));
    setQuestion("");
    setAnswerText("");
  };

  const handleGenerateCards = async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const res = await apiFetch(`/ai/flashcards/${id}`, {
        method: "POST",
        body: { count: generateCount },
      });
      const data = await res.json();
      if (data.success && data.newFlashcards?.length) {
        dispatch(
          addFlashcards({
            flashcards: data.newFlashcards,
          }),
        );
      }
    } catch (err) {
      console.error("Failed to generate flashcards", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <aside
      className={`h-full overflow-hidden flex-shrink-0 bg-[#f7f8f7] dark:bg-stone-950 border-l border-[#E8E6E1] dark:border-stone-800 transition-all duration-200 ease-in-out ${
        rightPanelOpen ? "w-[220px] opacity-100" : "w-0 opacity-0 border-l-0"
      }`}
    >
      <div className="w-[220px] h-full flex flex-col">
        {/* Tab Switcher */}
        <div className="flex items-end h-[38px] border-b border-[#E8E6E1] dark:border-stone-800 px-3 shrink-0 gap-3">
          <button
            onClick={() => setActiveTab("cards")}
            className={`px-2 py-1.5 text-[12px] font-medium transition-all duration-150 w-fit ${
              activeTab === "cards"
                ? "text-[#059669] border-b-2 border-[#34d399]"
                : "text-[#9B9A96] dark:text-stone-400 hover:text-[#059669] dark:hover:text-emerald-400"
            }`}
          >
            Cards
          </button>
          {activeView === "notes" && (
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2 py-1.5 text-[12px] font-medium transition-all duration-150 w-fit ${
                activeTab === "chat"
                  ? "text-[#059669] border-b-2 border-[#34d399]"
                  : "text-[#9B9A96] dark:text-stone-400 hover:text-[#059669] dark:hover:text-emerald-400"
              }`}
            >
              AI Chat
            </button>
          )}
        </div>

        {/* Cards Tab Content */}
        {activeTab === "cards" && (
          <div className="flex-1 overflow-y-auto p-[14px_12px] space-y-[14px]">
            {id && (
              <section>
                <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#A8A7A2] dark:text-stone-500 mb-2">
                  STATS
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#F1EFE8] dark:bg-stone-800 rounded-lg p-[10px_12px] text-center">
                    <div className="text-[22px] font-medium text-[#1C1B22] dark:text-stone-100">
                      {counts.total}
                    </div>
                    <div className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mt-1">
                      TOTAL
                    </div>
                  </div>
                  <div className="flex-1 bg-[#F1EFE8] dark:bg-stone-800 rounded-lg p-[10px_12px] text-center">
                    <div
                      className={`text-[22px] font-medium ${counts.due > 0 ? "text-[#059669]" : "text-[#1C1B22] dark:text-stone-100"}`}
                    >
                      {counts.due}
                    </div>
                    <div className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mt-1">
                      DUE
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="border-t border-[#E8E6E1] dark:border-stone-800" />

            <section>
              <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#A8A7A2] dark:text-stone-500 mb-2">
                New Flashcard
              </div>
              <div>
                <label className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mb-1 block">
                  Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter question..."
                  className="w-full px-[10px] py-[7px] text-[12.5px] border-[0.5px] border-[#E2E0DC] dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-[#1C1B22] dark:text-stone-100 placeholder-[#C4C3BE] dark:placeholder-stone-600 focus:border-[#6ee7b7] dark:focus:border-emerald-500 focus:ring-2 focus:ring-[#ecfdf5] dark:focus:ring-emerald-950/30 focus:ring-offset-0 transition-all duration-150 outline-none"
                />
              </div>
              <div className="mt-2">
                <label className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mb-1 block">
                  Answer
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Enter answer"
                  rows={3}
                  className="w-full px-[10px] py-[7px] text-[12.5px] border-[0.5px] border-[#E2E0DC] dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-[#1C1B22] dark:text-stone-100 placeholder-[#C4C3BE] dark:placeholder-stone-600 focus:border-[#6ee7b7] dark:focus:border-emerald-500 focus:ring-2 focus:ring-[#ecfdf5] dark:focus:ring-emerald-950/30 focus:ring-offset-0 transition-all duration-150 outline-none resize-none h-[56px]"
                />
              </div>
              <button
                onClick={handleCreateCard}
                className="w-full h-[34px] mt-2 bg-[#059669] text-white text-[13px] font-medium rounded-lg hover:bg-[#047857] transition-all duration-150 active:scale-[0.97] cursor-pointer border-none"
              >
                + Create card
              </button>
            </section>

            <div className="border-t border-[#E8E6E1] dark:border-stone-800" />

            {id && (
              <section>
                <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#A8A7A2] dark:text-stone-500 mb-2">
                  Generate with AI
                </div>
                <div className="flex items-center">
                  <span className="text-[12.5px] text-[#4A4947] dark:text-stone-300 flex-1">
                    Cards to generate
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setGenerateCount(Math.max(1, generateCount - 1))
                      }
                      className="w-[22px] h-[22px] flex items-center justify-center border-[0.5px] border-[#E2E0DC] dark:border-stone-700 rounded-[5px] text-[14px] text-[#6B6A65] dark:text-stone-400 hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400 transition-all duration-150 active:scale-[0.97]"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px" }}
                      >
                        remove
                      </span>
                    </button>
                    <span className="text-[13px] font-medium text-[#1C1B22] dark:text-stone-100 min-w-[16px] text-center">
                      {generateCount}
                    </span>
                    <button
                      onClick={() =>
                        setGenerateCount(Math.min(50, generateCount + 1))
                      }
                      className="w-[22px] h-[22px] flex items-center justify-center border-[0.5px] border-[#E2E0DC] dark:border-stone-700 rounded-[5px] text-[14px] text-[#6B6A65] dark:text-stone-400 hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400 transition-all duration-150 active:scale-[0.97]"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px" }}
                      >
                        add
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleGenerateCards}
                  disabled={generating}
                  className="w-full h-[34px] mt-2 bg-transparent border-[0.5px] border-[#6ee7b7] text-[#059669] text-[13px] font-medium rounded-lg hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 transition-all duration-150 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? "Generating..." : "✦ Generate flashcards"}
                </button>
              </section>
            )}
          </div>
        )}

        {/* AI Chat Tab Content */}
        {activeTab === "chat" && (activeView === "notes") && <AiChatPanel />}
      </div>
    </aside>
  );
}

function AiChatPanel() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const activeView = pathname.split("/")[2] || "";
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const note = useSelector((state) =>
    state.NotesContent.find((note) => note.id === id),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    const res = await apiFetch(`/ai/ask/${id}`, {
      method: "POST",
      body: {
        query: inputValue,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    const aiMessage = {
      id: Date.now() + 1,
      text: data.paylaod.answer,
      sender: "ai",
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    activeView === "notes" && (
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-[26px] h-[26px] rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0 mr-[7px] mt-0.5">
                  <span
                    className="material-symbols-outlined text-[13px] text-[#059669]"
                    style={{ fontSize: "13px" }}
                  >
                    auto_awesome
                  </span>
                </div>
              )}
              <div
                className={`${
                  msg.sender === "ai"
                    ? "bg-[#ecfdf5] text-[#064e3b] rounded-[10px] p-[9px_11px] max-w-[90%]"
                    : "bg-[#059669] text-white rounded-[10px] p-[9px_11px] max-w-[90%]"
                } text-[12.5px] leading-relaxed`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex">
              <div className="w-[26px] h-[26px] rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0 mr-[7px] mt-0.5">
                <span
                  className="material-symbols-outlined text-[13px] text-[#059669]"
                  style={{ fontSize: "13px" }}
                >
                  auto_awesome
                </span>
              </div>
              <div className="bg-[#ecfdf5] text-[#064e3b] rounded-[10px] p-[9px_11px] text-[12.5px]">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex-shrink-0 border-t border-[#E8E6E1] dark:border-stone-800 p-[10px_12px] bg-[#FAFAF9] dark:bg-stone-950"
        >
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything…"
              disabled={isLoading}
              className="flex-1 min-w-0 px-[10px] py-[6px] border-[0.5px] border-[#E2E0DC] dark:border-stone-700 rounded-full bg-white dark:bg-stone-900 text-[#1C1B22] dark:text-stone-100 text-[12.5px] placeholder-[#C4C3BE] dark:placeholder-stone-600 focus:border-[#6ee7b7] dark:focus:border-emerald-500 focus:ring-0 outline-none transition-all duration-150"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-[28px] h-[28px] rounded-full bg-[#059669] flex items-center justify-center text-white cursor-pointer hover:bg-[#047857] transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed border-none"
              aria-label="Send message"
            >
              <span
                className="material-symbols-outlined text-[13px]"
                style={{ fontSize: "13px" }}
              >
                arrow_upward
              </span>
            </button>
          </div>
        </form>
        <p className="flex-shrink-0 text-[10px] text-[#A8A7A2] dark:text-stone-500 text-center pb-2">
          AI may produce inaccurate information
        </p>
      </div>
    )
  );
}
