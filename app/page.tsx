"use client";
import { useState, useRef, useEffect } from "react";

// ── CHANGE 1: Added mythology_card to meta type ──────────────────────────────
interface MythologyCard {
  figure: string;
  source: string;
  text: string;
  card_title: string;
  card_story: string;
  card_connect: string;
  teaching: string;
}

interface Message {
  role: "user" | "bot";
  text: string;
  meta?: {
    intent?: string;
    severity?: string;
    mode?: string;
    mythology_card?: MythologyCard | null;
  };
  typing?: boolean;
}

// ── CHANGE 2: Added HistoryEntry type for API call ───────────────────────────
interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "You don't have to filter anything here. What's been on your mind lately?",
    },
  ]);

  // ── CHANGE 3: Track conversation history for API ─────────────────────────
  const historyRef = useRef<HistoryEntry[]>([]);

  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── CHANGE 4: Track which mythology cards are expanded ───────────────────
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;

    // 1. Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    // 2. Add loader immediately
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "", typing: true }
    ]);

    setInputValue("");

    // Optional delay
    await new Promise((res) => setTimeout(res, 400));

    try {
      // ── CHANGE 5: Send history to API ──────────────────────────────────
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: historyRef.current,
        }),
      });

      const data = await res.json();

      // ── CHANGE 6: Update history after response ─────────────────────
      historyRef.current = [
        ...historyRef.current,
        { role: "user",      content: userMessage   },
        { role: "assistant", content: data.reply    },
      ];

      // 3. UPDATE last message (replace loader)
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "bot",
          text: "",
          meta: data.meta,
          typing: true
        };
        return newMessages;
      });

      let fullText = data.reply;
      let i = 0;

      const interval = setInterval(() => {
        i++;

        setMessages((prev) => {
          const newMessages = [...prev];
          const last = { ...newMessages[newMessages.length - 1] };

          last.text = fullText.slice(0, i);
          newMessages[newMessages.length - 1] = last;

          return newMessages;
        });

        if (i >= fullText.length) {
          clearInterval(interval);

          setMessages((prev) => {
            const newMessages = [...prev];
            const last = { ...newMessages[newMessages.length - 1] };

            last.typing = false;
            newMessages[newMessages.length - 1] = last;

            return newMessages;
          });
        }
      }, 15);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. I'm still here — try again.",
        },
      ]);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white flex flex-col items-center px-4">

      {/* HEADER (STATIC) */}
      <div className="w-full max-w-5xl flex justify-between items-center py-4 px-2 text-white text-xs tracking-widest uppercase">
        <div className="opacity-90 hover:opacity-100 transition">
          Soul
        </div>
        <div className="opacity-50">
          space to reflect
        </div>
      </div>

      {/* HERO (STATIC) */}
      <div className="w-full max-w-4xl text-center mb-2 space-y-2">

        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Solace
          </h1>
        </div>

        <p className="text-sm text-white/60">
          Speak freely. I'm here to listen.
        </p>

        <div className="text-[10px] tracking-widest text-white/20 uppercase">
          Soul
        </div>

      </div>

      {/* CHAT (ONLY THIS SCROLLS) */}
      <div className="w-full max-w-xl flex-1 flex flex-col justify-between bg-white/5 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_60px_rgba(168,85,247,0.08)] overflow-hidden">

        {/* Messages (SCROLL AREA) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col">

              {msg.role === "bot" ? (
                <div className="flex flex-col gap-2 max-w-[85%]">

                  {/* ── Bot reply bubble (unchanged) ── */}
                  <div className="bg-white/10 p-4 rounded-2xl text-[15px] leading-relaxed">

                    {msg.typing && msg.text === "" && (
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <span>Solace is thinking</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    )}

                    <div>{msg.text}</div>

                    {msg.meta && !msg.typing && (
                      <div className="mt-2 text-[10px] opacity-50 border-t border-white/10 pt-1">
                        {msg.meta.intent} · {msg.meta.severity} · {msg.meta.mode}
                      </div>
                    )}

                  </div>

                  {/* ── CHANGE 7: Mythology card rendered below reply bubble ── */}
                  {/* Only shown after typing is done and card data exists       */}
                  {!msg.typing && msg.meta?.mythology_card && (
                    <div className="rounded-2xl border border-purple-500/20 bg-purple-950/40 backdrop-blur-md overflow-hidden">

                      {/* Card header — always visible, tappable */}
                      <button
                        onClick={() =>
                          setExpandedCards((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left group"
                      >
                        <div className="flex items-center gap-2">
                          {/* Lotus / story icon */}
                          <span className="text-purple-300 text-sm">✦</span>
                          <span className="text-[12px] text-purple-200/80 tracking-wide">
                            A story that echoes this
                          </span>
                        </div>
                        <span className="text-purple-300/60 text-xs transition-transform duration-300"
                          style={{ transform: expandedCards[idx] ? "rotate(180deg)" : "rotate(0deg)" }}>
                          ▾
                        </span>
                      </button>

                      {/* Card body — expands on tap */}
                      {expandedCards[idx] && (
                        <div className="px-4 pb-4 space-y-3 border-t border-purple-500/10">

                          {/* Title + source */}
                          <div className="pt-3">
                            <p className="text-[13px] font-medium text-purple-100">
                              {msg.meta.mythology_card.card_title}
                            </p>
                            <p className="text-[10px] text-purple-300/50 mt-0.5 tracking-wide">
                              {msg.meta.mythology_card.text}
                            </p>
                          </div>

                          {/* The story */}
                          <p className="text-[13px] text-white/70 leading-relaxed">
                            {msg.meta.mythology_card.card_story}
                          </p>

                          {/* The connection — highlighted */}
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2">
                            <p className="text-[12px] text-purple-200/90 leading-relaxed italic">
                              {msg.meta.mythology_card.card_connect}
                            </p>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-purple-500/60 backdrop-blur-md p-3 rounded-2xl text-[15px] leading-relaxed self-end max-w-[80%]">
                  {msg.text}
                </div>
              )}

            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT (FIXED) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/10 flex gap-2"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Speak freely… nothing is too small"
            className="flex-1 bg-white/5 border border-white/20 rounded-full px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300"
          />

          <button
            type="submit"
            className="bg-purple-600 px-4 rounded-full text-sm"
          >
            →
          </button>
        </form>

      </div>

      {/* USP */}
      <div className="mt-4 text-center space-y-2 text-xs text-white/30">
        <p>Not advice. Understanding.</p>
        <p>Not answers. Clarity.</p>
        <p>Not noise. Space.</p>
      </div>

    </div>
  );
}
