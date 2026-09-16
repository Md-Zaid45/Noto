import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ChevronRight, Sparkles, Trash2, Send, Bot } from "lucide-react";
import { useSelector } from "react-redux";
import { apiFetch } from "../../commons/apifetch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "../../hooks/use-toast";

export default function AiChatSidebar() {
  const {pathname} = useLocation()
  const activeView = pathname.split("/")[2] || "";
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text:
        "Hello! I'm your AI assistant. How can I help you today?" +
        `${id ? " (Note " + id + ")" : ""}`,
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

  useEffect(() => {
    const fetchData = async () => {};
  }, []);
  useEffect(() => {
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

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setMessages([
        {
          id: Date.now(),
          text: "Hello! Chat cleared. How can I help you now?",
          sender: "ai",
        },
      ]);
    }
  };

  return (
    <>
      {isOpen && activeView==='notes' && (
        <div
          className="fixed inset-0 bg-stone-900/20 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-[#FAFAF9] dark:bg-stone-950 border-l border-[#E8E6E1] dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "w-full sm:w-[400px] translate-x-0" : "w-[400px] translate-x-full"}`}
      >
        <div className="h-[38px] border-b border-[#E8E6E1] dark:border-stone-800 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
            <span className="text-[12.5px] font-medium text-[#1C1B22] dark:text-stone-100">
              AI Assistant
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-[28px] w-[28px] !text-[#6B6A65] dark:!text-stone-400 hover:!text-[#059669] dark:hover:!text-emerald-400 hover:!bg-[#ecfdf5] dark:hover:!bg-emerald-950/30"
              onClick={clearChat}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-[28px] w-[28px] !text-[#6B6A65] dark:!text-stone-400 hover:!text-[#059669] dark:hover:!text-emerald-400 hover:!bg-[#ecfdf5] dark:hover:!bg-emerald-950/30"
              onClick={() => setIsOpen(false)}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#FAFAF9] dark:bg-stone-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-[26px] h-[26px] rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0 mr-[7px] mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
                </div>
              )}
              <div
                className={`${
                  msg.sender === "ai"
                    ? "bg-[#ecfdf5] text-[#064e3b] dark:text-emerald-200 rounded-[10px] p-[9px_11px] max-w-[90%]"
                    : "bg-[#059669] dark:bg-emerald-600 text-white rounded-[10px] p-[9px_11px] max-w-[90%]"
                } text-[12.5px] leading-relaxed`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex">
              <div className="w-[26px] h-[26px] rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0 mr-[7px] mt-0.5">
                <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
              </div>
              <div className="bg-[#ecfdf5] text-[#064e3b] dark:text-emerald-200 rounded-[10px] p-[9px_11px] text-[12.5px]">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] dark:bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] dark:bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#059669] dark:bg-emerald-600 rounded-full animate-bounce"
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
          className="border-t border-[#E8E6E1] dark:border-stone-800 p-[10px_12px] bg-[#FAFAF9] dark:bg-stone-950"
        >
          <div className="flex items-center gap-1.5">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything…"
              disabled={isLoading}
              className="flex-1 !rounded-full !py-[6px] !px-[10px] !text-[12.5px] !border-[0.5px] !border-[#E2E0DC] dark:!border-stone-700"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="w-[28px] h-[28px] !rounded-full !bg-[#059669] !text-white hover:!bg-[#047857] dark:!bg-emerald-600 dark:hover:!bg-emerald-700"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-[10px] text-[#A8A7A2] dark:text-stone-500 text-center pt-2">
            AI may produce inaccurate information
          </p>
        </form>
      </div>
    </>
  );
}
