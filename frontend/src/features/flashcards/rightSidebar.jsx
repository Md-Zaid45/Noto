import React, { useState, useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { addFlashcard, addFlashcards } from "./flashcardSlice";
import { createFlashcardAsync } from "./flashcardThunks";
import { apiFetch } from "../../commons/apifetch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { Bot, Send, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "../../hooks/use-toast";

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
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      if (data.success && data.newFlashcards?.length) {
        dispatch(
          addFlashcards({
            flashcards: data.newFlashcards,
          }),
        );
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
      setGenerating(false);
    }
  };

  return (
    <aside
      className={`h-full overflow-hidden flex-shrink-0 bg-[#f7f8f7] dark:bg-stone-950 border-l border-[#E8E6E1] dark:border-stone-800 transition-all duration-200 ease-in-out ${
        rightPanelOpen ? "w-[300px] opacity-100" : "w-0 opacity-0 border-l-0"
      }`}
    >
      <div className="w-full h-full flex flex-col">
        {/* Tab Switcher */}
        <div className="flex items-end h-[38px] border-b border-[#E8E6E1] dark:border-stone-800 px-3 shrink-0 gap-3">
          <Button
            variant="ghost"
            className={`px-2 py-1.5 !h-auto text-[12px] font-medium !rounded-none ${
              activeTab === "cards"
                ? "!text-[#059669] border-b-2 border-[#34d399]"
                : "!text-[#9B9A96] dark:!text-stone-400 hover:!text-[#059669] dark:hover:!text-emerald-400"
            }`}
            onClick={() => setActiveTab("cards")}
          >
            Cards
          </Button>
          {activeView === "notes" && (
            <Button
              variant="ghost"
              className={`px-2 py-1.5 !h-auto text-[12px] font-medium !rounded-none ${
                activeTab === "chat"
                  ? "!text-[#059669] border-b-2 border-[#34d399]"
                  : "!text-[#9B9A96] dark:!text-stone-400 hover:!text-[#059669] dark:hover:!text-emerald-400"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              AI Chat
            </Button>
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
                  <Card className="flex-1 !bg-[#F1EFE8] dark:!bg-stone-800 !border-none">
                    <CardContent className="p-[10px_12px] text-center">
                      <div className="text-[22px] font-medium text-[#1C1B22] dark:text-stone-100">
                        {counts.total}
                      </div>
                      <div className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mt-1">
                        TOTAL
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 !bg-[#F1EFE8] dark:!bg-stone-800 !border-none">
                    <CardContent className="p-[10px_12px] text-center">
                      <div
                        className={`text-[22px] font-medium ${counts.due > 0 ? "text-[#059669]" : "text-[#1C1B22] dark:text-stone-100"}`}
                      >
                        {counts.due}
                      </div>
                      <div className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mt-1">
                        DUE
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            <div className="border-t border-[#E8E6E1] dark:border-stone-800" />

            <section>
              <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#A8A7A2] dark:text-stone-500 mb-2">
                New Flashcard
              </div>
              <div>
                <Label className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mb-1 block">
                  Question
                </Label>
                <Input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter question..."
                  className="!text-[12.5px] !rounded-lg"
                />
              </div>
              <div className="mt-2">
                <Label className="text-[11px] text-[#A8A7A2] dark:text-stone-500 uppercase mb-1 block">
                  Answer
                </Label>
                <Textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Enter answer"
                  rows={3}
                  className="!text-[12.5px] !rounded-lg resize-none h-[56px]"
                />
              </div>
              <Button
                onClick={handleCreateCard}
                className="w-full mt-2 !bg-[#059669] !text-white hover:!bg-[#047857]"
              >
                + Create card
              </Button>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[22px] w-[22px] !border-[0.5px] !border-[#E2E0DC] dark:!border-stone-700 !rounded-[5px]"
                      onClick={() =>
                        setGenerateCount(Math.max(1, generateCount - 1))
                      }
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-[13px] font-medium text-[#1C1B22] dark:text-stone-100 min-w-[16px] text-center">
                      {generateCount}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[22px] w-[22px] !border-[0.5px] !border-[#E2E0DC] dark:!border-stone-700 !rounded-[5px]"
                      onClick={() =>
                        setGenerateCount(Math.min(50, generateCount + 1))
                      }
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 !border-[#6ee7b7] !text-[#059669] hover:!bg-[#ecfdf5] dark:hover:!bg-emerald-950/30"
                  onClick={handleGenerateCards}
                  disabled={generating}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  {generating ? "Generating..." : "Generate flashcards"}
                </Button>
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
    try {
      const res = await apiFetch(`/ai/ask/${id}`, {
        method: "POST",
        body: {
          query: inputValue,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      const aiMessage = {
        id: Date.now() + 1,
        text: data.payload?.answer || data.message || "No response received.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    activeView === "notes" && (
      <div className="flex-1 flex flex-col w-full overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`${
                  msg.sender === "user"
                    ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 rounded-2xl rounded-br-md px-3.5 py-2.5 shadow-sm"
                    : "bg-gray-200 dark:bg-stone-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md px-3.5 py-2.5"
                } text-[13px] leading-relaxed max-w-[92%]`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-gray-100 dark:bg-stone-800 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 p-3 bg-white dark:bg-stone-950 border-t border-gray-200 dark:border-stone-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className={`flex-1 flex items-center rounded-2xl px-3.5 py-1 transition-all ${isLoading ? 'bg-gray-50 dark:bg-stone-900' : 'bg-gray-200 dark:bg-stone-800 focus-within:ring-2 focus-within:ring-gray-300 dark:focus-within:ring-stone-600 focus-within:bg-white dark:focus-within:bg-stone-700'}`}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "Waiting for response…" : "Ask me anything…"}
                disabled={isLoading}
                className={`flex-1 min-w-0 bg-transparent text-[13px] outline-none py-1.5 ${isLoading ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500' : 'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'}`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex-shrink-0 ml-1 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isLoading ? 'bg-gray-200 dark:bg-stone-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'}`}
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-2">
            AI may produce inaccurate information
          </p>
        </div>
      </div>
    )
  );
}
