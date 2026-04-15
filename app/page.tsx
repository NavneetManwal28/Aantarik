"use client";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

interface MythologyCard {
  id: string;
  character: string;
  source: string;
  event: string;
  card_title: string;
  card_story: string;
  card_connect: string;
  teaching: string;
  _generated?: boolean;
}

interface WrapCard {
  summary: string;
  question_to_sit_with: string;
  mythology_title: string | null;
}

interface CrossSessionMemory {
  summary: string;
  themes: string[];
  keywords: string[];
  lastIntent: string;
  sessionCount: number;
  updatedAt: string;
}

interface ReflectionReport {
  patterns: string[];
  core_tension: string;
  emotional_trend: string;
  dominant_theme: string;
  reflection_summary: string;
  next_question: string;
}

interface ProgressInsights {
  session_count: number;
  recurring_theme: string;
  recent_emotional_trend: string;
  progress_summary: string;
}

interface Message {
  role: "user" | "bot";
  text: string;
  meta?: {
    intent?: string;
    severity?: string;
    mode?: string;
    mythology_card?: MythologyCard | null;
    session_summary?: string | null;
    reflection?: string | null;
    wrap_card?: WrapCard | null;
    cross_session_memory?: CrossSessionMemory | null;
    contextual_question?: string | null;
    reflection_report?: ReflectionReport | null;
    progress_insights?: ProgressInsights | null;
  };
  typing?: boolean;
}

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

const CONVERSATION_STARTERS = [
  "I've been feeling stuck lately",
  "Something happened at work",
  "I'm not sure what I'm feeling",
  "I keep overthinking everything",
  "Things feel heavier than usual",
  "I don't know where I'm headed",
];

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED STORY CONTENT
// ─────────────────────────────────────────────────────────────────────────────

function StoryPanelContent({
  card,
  onClose,
  scrollRef,
}: {
  card: MythologyCard;
  onClose: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const paragraphs = card.card_story.split(/\n\n+/).filter(Boolean);

  return (
    <div className="flex flex-col flex-1 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-sm">✦</span>
          <span className="text-[11px] tracking-widest text-purple-300/50 uppercase">
            {card.source}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full
            bg-white/5 hover:bg-white/10
            text-white/30 hover:text-white/70
            text-xl leading-none transition-all duration-200"
          aria-label="Close story panel"
        >
          ✕
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-10 py-10 space-y-10"
        key={card.card_title}
        style={{ scrollbarWidth: "none" }}
      >
        <p className="text-[11px] tracking-widest text-purple-400/60 uppercase">
          {card.character}
        </p>
        <h2 className="text-3xl font-semibold text-white leading-tight tracking-tight -mt-4">
          {card.card_title}
        </h2>
        <div className="h-px bg-white/8 w-16" />
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] text-white/70 leading-[1.95] font-light">{p}</p>
          ))}
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/50 px-6 py-5 space-y-2">
          <p className="text-[10px] tracking-widest text-purple-400/60 uppercase">How this connects</p>
          <p className="text-[14px] text-purple-100/80 leading-relaxed italic">{card.card_connect}</p>
        </div>
        <div className="pt-2 border-t border-white/5 space-y-2">
          <span className="text-purple-400/40 text-3xl leading-none block">&quot;</span>
          <p className="text-[15px] text-white/40 italic leading-[1.95] -mt-2">{card.teaching}</p>
        </div>
        <div className="mt-6 text-sm text-white/40 italic">What part of this felt closest to you?</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DESKTOP STORY PANEL
// ─────────────────────────────────────────────────────────────────────────────

function StoryPanel({ card, onClose }: { card: MythologyCard | null; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (card && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [card?.card_title]);
  if (!card) return null;
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <StoryPanelContent card={card} onClose={onClose} scrollRef={scrollRef} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MOBILE BOTTOM SHEET
// ─────────────────────────────────────────────────────────────────────────────

function MobileBottomSheet({ card, onClose }: { card: MythologyCard | null; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (card && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [card?.card_title]);
  useEffect(() => {
    document.body.style.overflow = card ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [card]);
  if (!card) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#0d0d1a] border-t border-white/10 rounded-t-3xl flex flex-col" style={{ maxHeight: "85vh" }}>
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="flex flex-col overflow-hidden flex-1 min-h-0">
          <StoryPanelContent card={card} onClose={onClose} scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SESSION MEMORY BANNER
// ─────────────────────────────────────────────────────────────────────────────

function SessionMemoryBanner({ summary }: { summary: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const bullets = summary.split("\n").filter(l => l.trim().startsWith("–"));
  return (
    <div className="mx-1 mb-2 rounded-2xl border border-purple-500/15 bg-purple-950/25 overflow-hidden">
      <button onClick={() => setCollapsed(p => !p)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <span className="text-purple-400/60 text-xs">◈</span>
          <span className="text-[11px] tracking-widest uppercase text-purple-400/50">What we&apos;ve been exploring</span>
        </div>
        <span className="text-white/20 text-xs transition-transform duration-200" style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {bullets.map((b, i) => (<p key={i} className="text-[13px] text-white/40 leading-relaxed font-light">{b}</p>))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  WRAP CARD MESSAGE
// ─────────────────────────────────────────────────────────────────────────────

function WrapCardMessage({ wrap }: { wrap: WrapCard }) {
  return (
    <div className="max-w-[85%] rounded-3xl border border-purple-500/20 bg-purple-950/30 overflow-hidden mt-2">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
        <span className="text-purple-400/60 text-sm">✦</span>
        <span className="text-[10px] tracking-widest uppercase text-purple-400/50">Until next time</span>
      </div>
      <div className="px-5 py-5 space-y-5">
        <p className="text-[15px] text-white/60 leading-[1.9] font-light">{wrap.summary}</p>
        {wrap.mythology_title && (
          <div className="flex items-start gap-2">
            <span className="text-purple-400/40 text-xs mt-0.5 shrink-0">✦</span>
            <p className="text-[13px] text-purple-300/40 italic leading-relaxed">Story carried: {wrap.mythology_title}</p>
          </div>
        )}
        <div className="h-px bg-white/5" />
        <div className="space-y-1.5">
          <p className="text-[10px] tracking-widest uppercase text-purple-400/40">A question to sit with</p>
          <p className="text-[15px] text-white/70 leading-[1.85] italic">{wrap.question_to_sit_with}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  REFLECTION REPORT CARD
// ─────────────────────────────────────────────────────────────────────────────

function ReflectionReportCard({ report }: { report: ReflectionReport }) {
  return (
    <div className="max-w-[92%] rounded-3xl border border-purple-500/20 bg-purple-950/20 overflow-hidden mt-4 transition-all duration-500 opacity-100">
      <div className="px-6 py-5 border-b border-white/5 flex items-center gap-2">
        <span className="text-purple-400/60">✦</span>
        <span className="text-[11px] tracking-widest uppercase text-purple-400/50">Something I&apos;m noticing…</span>
      </div>
      <div className="px-5 py-5 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">Patterns I&apos;m noticing</p>
          {report.patterns?.length > 0 && (<p className="text-[14px] text-white/60 leading-[1.9]">{report.patterns.slice(0, 3).join(". ")}.</p>)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">Underlying tension</p>
          <p className="text-[15px] text-white/70 leading-[1.9] italic">{report.core_tension}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">Emotional pattern</p>
          <p className="text-[14px] text-white/60">{report.emotional_trend}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">Dominant theme</p>
          <p className="text-[14px] text-purple-300/70">{report.dominant_theme}</p>
          {report.dominant_theme && (<p className="text-[13px] text-purple-300/40 italic mt-2">This connects with the theme you&apos;ve been exploring: {report.dominant_theme}</p>)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">What this might mean</p>
          <p className="text-[15px] text-white/70 leading-[1.9]">{report.reflection_summary}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-purple-400/40 mb-2">A question to sit with</p>
          <p className="text-[15px] text-white/80 italic leading-[1.9]">{report.next_question}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  WELCOME BACK BANNER
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeBackBanner({ memory, onDismiss }: { memory: CrossSessionMemory; onDismiss: () => void }) {
  return (
    <div className="mx-1 mb-3 rounded-2xl border border-purple-500/15 bg-purple-950/20 overflow-hidden">
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-purple-400/50 text-xs">◈</span>
            <span className="text-[11px] tracking-widest uppercase text-purple-400/40">
              Welcome back{memory.sessionCount > 1 ? ` — session ${memory.sessionCount + 1}` : ""}
            </span>
          </div>
          <button onClick={onDismiss} className="text-white/15 hover:text-white/40 text-sm leading-none transition-colors" aria-label="Dismiss">×</button>
        </div>
        {memory.summary && <p className="text-[13px] text-white/35 leading-relaxed font-light">{memory.summary}</p>}
        {memory.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {memory.keywords.slice(0, 5).map((kw, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full border border-purple-500/10 bg-purple-950/30 text-[11px] text-purple-300/30">{kw}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROGRESS CARD
// ─────────────────────────────────────────────────────────────────────────────

function ProgressCard({ progress }: { progress: ProgressInsights }) {
  return (
    <div className="max-w-[92%] rounded-3xl border border-purple-500/20 bg-purple-950/20 mt-4 px-5 py-5 space-y-5 transition-all duration-500 opacity-100">
      <div className="text-[11px] tracking-widest uppercase text-purple-400/50">Your journey over time</div>
      <p className="text-[14px] text-white/60 leading-[1.9]">You&apos;ve returned {progress.session_count} time{progress.session_count !== 1 ? "s" : ""}</p>
      {progress.recurring_theme && <p className="text-[14px] text-purple-300/70 leading-[1.9]">Theme that keeps showing up: {progress.recurring_theme}</p>}
      {progress.recent_emotional_trend && <p className="text-[14px] text-white/60 leading-[1.9]">Recently: {progress.recent_emotional_trend}</p>}
      {progress.progress_summary && <p className="text-[15px] text-white/70 italic leading-[1.9]">{progress.progress_summary}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "You don't have to filter anything here. What's been on your mind lately?" },
  ]);

  const historyRef = useRef<HistoryEntry[]>([]);
  const recentMythIdsRef = useRef<string[]>([]);
  const recentMythCharsRef = useRef<string[]>([]);
  const intentHistoryRef = useRef<string[]>([]);
  const reportAlreadyShownRef = useRef<boolean>(false);

  const userIdRef = useRef<string>("");
  useEffect(() => {
    let id = localStorage.getItem("solace_user_id");
    if (!id) {
      id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem("solace_user_id", id);
    }
    userIdRef.current = id;
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [openStory, setOpenStory] = useState<MythologyCard | null>(null);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [crossSessionMemory, setCrossSessionMemory] = useState<CrossSessionMemory | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [visibleReportIds, setVisibleReportIds] = useState<Set<number>>(new Set());

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStoryClick = (card: MythologyCard) => {
    setOpenStory(prev => prev?.id === card.id ? null : card);
  };

  const handleStarterClick = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      (document.getElementById("chat-input") as HTMLInputElement | null)?.focus();
    }, 50);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setMessages(prev => [...prev, { role: "bot", text: "", typing: true }]);
    setInputValue("");

    await new Promise(r => setTimeout(r, 400));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: historyRef.current,
          recent_myth_ids: recentMythIdsRef.current,
          recent_myth_chars: recentMythCharsRef.current,
          user_id: userIdRef.current,
          intent_history: intentHistoryRef.current,
          report_already_shown: reportAlreadyShownRef.current,
        }),
      });

      const data = await res.json();

      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply },
      ];

      if (data.meta?.session_summary) setSessionSummary(data.meta.session_summary);

      if (data.meta?.cross_session_memory && !crossSessionMemory) {
        setCrossSessionMemory(data.meta.cross_session_memory);
        if (data.meta.cross_session_memory.sessionCount > 0) setShowWelcomeBack(true);
      }

      if (data.meta?.reflection) {
        setMessages(prev => {
          const updated = [...prev];
          const typingSlot = updated[updated.length - 1];
          return [
            ...updated.slice(0, -1),
            { role: "bot" as const, text: data.meta.reflection as string, typing: false },
            typingSlot,
          ];
        });
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", text: "", meta: data.meta, typing: true };
        return updated;
      });

      const fullText = data.reply;
      let i = 0;

      const interval = setInterval(() => {
        i++;
        setMessages(prev => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.text = fullText.slice(0, i);
          updated[updated.length - 1] = last;
          return updated;
        });

        if (i >= fullText.length) {
          clearInterval(interval);

          setMessages(prev => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            last.typing = false;
            updated[updated.length - 1] = last;
            return updated;
          });

          const newCard = data.meta?.mythology_card;
          if (newCard?.id) recentMythIdsRef.current = [newCard.id, ...recentMythIdsRef.current].slice(0, 3);
          if (newCard?.character) recentMythCharsRef.current = [newCard.character, ...recentMythCharsRef.current].slice(0, 3);

          if (data.meta?.intent) intentHistoryRef.current = [...intentHistoryRef.current, data.meta.intent];

          if (data.meta?.reflection_report) {
            reportAlreadyShownRef.current = true;
            setMessages(prev => {
              const botMsgIdx = prev.length - 1;
              setTimeout(() => {
                setVisibleReportIds(ids => new Set(ids).add(botMsgIdx));
                setTimeout(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
                setTimeout(() => {
                  setMessages(current => [
                    ...current,
                    { role: "bot" as const, text: data.meta.reflection_report!.next_question, typing: false },
                  ]);
                }, 1000);
              }, 800);
              return prev;
            });
          }
        }
      }, 15);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Something went wrong. I'm still here — try again." }]);
    }
  };

  const welcomeText = crossSessionMemory?.summary
    ? `Good to have you back. Last time you were working through something around ${crossSessionMemory.lastIntent?.toLowerCase() || "a lot"}. What's been on your mind since?`
    : "You don't have to filter anything here. What's been on your mind lately?";

  useEffect(() => {
    if (crossSessionMemory?.summary && messages.length === 1 && messages[0].role === "bot") {
      setMessages([{ role: "bot", text: welcomeText }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossSessionMemory]);

  const isFirstLoad = messages.length === 1 && messages[0].role === "bot";

  // ─────────────────────────────────────────────────────────────────────────
  //  GEMINI-STYLE HOME SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (isFirstLoad) {
    return (
      <div className="h-screen overflow-hidden bg-black text-white flex flex-col">

        {/* Top bar — larger Solace + Space to reflect */}
        <div className="w-full flex justify-between items-center py-3 px-6 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-lg font-semibold tracking-tight">Solace</span>
          </div>
          <div className="text-sm text-white/40 tracking-widest uppercase">space to reflect</div>
        </div>

        {/* Center area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-[680px] space-y-10">

            {/* Greeting — "Hello there" white, heading smaller */}
            <div className="space-y-2">
              <p className="text-lg text-white font-light">Hello there</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white/90 leading-tight">
                Where should we start?
              </h1>
            </div>

            {/* Input bar — send button: black circle, white arrow */}
            <form
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <input
                id="chat-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Talk to Solace"
                className="w-full bg-white/[0.06] border border-white/10 rounded-full
                  pl-6 pr-14 py-5 text-[16px]
                  placeholder:text-white/25
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white/[0.08]
                  transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-white/10 hover:bg-white/20
                  text-white text-sm transition-all duration-200 hover:scale-105"
              >
                →
              </button>
            </form>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {crossSessionMemory?.lastIntent && (
                <button
                  onClick={() => handleStarterClick(
                    `I've been thinking more about the ${crossSessionMemory.lastIntent.toLowerCase()} stuff`
                  )}
                  className="px-5 py-2.5 rounded-full
                    bg-white/[0.06] border border-white/[0.08]
                    text-[14px] text-purple-300/60
                    hover:bg-white/[0.1] hover:text-purple-200 hover:border-purple-500/30
                    transition-all duration-200"
                >
                  ↩ Continue from last time
                </button>
              )}
              {CONVERSATION_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleStarterClick(starter)}
                  className="px-5 py-2.5 rounded-full
                    bg-white/[0.06] border border-white/[0.08]
                    text-[14px] text-white/45
                    hover:bg-white/[0.1] hover:text-white/75 hover:border-white/15
                    transition-all duration-200"
                >
                  {starter}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 text-center pb-5 text-[10px] text-white/15">
          Not advice. Not answers. Space.
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  CHAT VIEW
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col">

      {/* Top bar */}
      <div className="w-full flex justify-between items-center py-3 px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold tracking-tight">Solace</span>
        </div>
        <div className="text-xs text-white/30 tracking-widest uppercase">space to reflect</div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Chat */}
        <div
          className={`
            flex flex-col overflow-hidden transition-all duration-300 ease-in-out
            ${openStory ? "w-1/2" : "w-full"}
          `}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[768px] mx-auto px-6 py-8 space-y-8">

              {showWelcomeBack && crossSessionMemory && (
                <WelcomeBackBanner memory={crossSessionMemory} onDismiss={() => setShowWelcomeBack(false)} />
              )}

              {messages.length >= 6 && sessionSummary && <SessionMemoryBanner summary={sessionSummary} />}

              {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-col">
                  {msg.role === "bot" ? (
                    <div className="flex flex-col gap-2 max-w-[85%]">

                      {msg.meta?.reflection && !msg.typing && (
                        <div className="px-5 py-4 rounded-3xl border border-purple-500/15 bg-purple-950/20 text-[14px] text-purple-200/60 leading-[1.85] italic font-light mb-1">
                          {msg.meta.reflection}
                        </div>
                      )}

                      <div className="bg-white/[0.04] px-5 py-4 rounded-3xl text-[16px] leading-[1.9] tracking-[0.01em]">
                        {msg.typing && msg.text === "" && (
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <span>Solace is thinking</span>
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse [animation-delay:0.3s]" />
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse [animation-delay:0.6s]" />
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

                      {!msg.typing && msg.meta?.wrap_card && <WrapCardMessage wrap={msg.meta.wrap_card} />}

                      {!msg.typing && msg.meta?.reflection_report != null && visibleReportIds.has(idx) && (
                        <>
                          <div className="my-6 flex justify-center">
                            <div className="text-[11px] text-white/30 tracking-widest uppercase">A moment of reflection</div>
                          </div>
                          <div className="text-center text-[12px] text-white/30 italic mb-2">You&apos;ve shared something important here</div>
                          <ReflectionReportCard report={msg.meta.reflection_report} />
                        </>
                      )}

                      {!msg.typing && msg.meta?.progress_insights != null &&
                        msg.meta.progress_insights.session_count >= 2 &&
                        visibleReportIds.has(idx) && (
                        <ProgressCard progress={msg.meta.progress_insights} />
                      )}

                      {!msg.typing && msg.meta?.mythology_card && (
                        <button
                          onClick={() => handleStoryClick(msg.meta!.mythology_card!)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-3xl text-left
                            border transition-all duration-200 hover:scale-[1.02]
                            ${openStory?.id === msg.meta.mythology_card.id
                              ? "border-purple-400/50 bg-purple-500/20 text-purple-200"
                              : "border-purple-500/15 bg-purple-950/30 text-purple-300/70 hover:border-purple-400/40 hover:bg-purple-950/50 hover:text-purple-200"
                            }
                          `}
                        >
                          <span className="text-sm shrink-0">✦</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] tracking-widest uppercase text-purple-400/60 mb-0.5">This reminds me of something…</span>
                            <span className="text-[13px] font-medium truncate">{msg.meta.mythology_card.card_title}</span>
                          </div>
                          <span
                            className="ml-auto text-xs shrink-0 transition-transform duration-200"
                            style={{ transform: openStory?.id === msg.meta.mythology_card.id ? "translateX(2px)" : "none" }}
                          >
                            →
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-4 rounded-3xl text-[16px] leading-[1.9] tracking-[0.01em] self-end max-w-[80%] shadow-lg shadow-purple-500/25">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input pinned to bottom */}
          <div className="shrink-0 border-t border-white/5 bg-black">
            <form
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              className="max-w-[768px] mx-auto px-6 py-4 relative"
            >
              <input
                id="chat-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Speak freely… nothing is too small"
                className="w-full bg-white/[0.06] border border-white/10 rounded-full pl-6 pr-14 py-4 text-[15px] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white/[0.08] transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-9 top-1/2 -translate-y-1/2
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-white/10 hover:bg-white/20
                  text-white text-sm transition-all duration-200 hover:scale-105"
              >
                →
              </button>
            </form>
            <div className="text-center pb-3 text-[10px] text-white/20">Not advice. Not answers. Space.</div>
          </div>
        </div>

        {/* RIGHT: Story panel — 50% width (desktop only) */}
        <div
          className={`
            hidden md:flex flex-col
            border-l border-white/5 bg-[#0c0c18]
            transition-all duration-300 ease-in-out overflow-hidden
            ${openStory ? "w-1/2 opacity-100" : "w-0 opacity-0"}
          `}
        >
          <StoryPanel card={openStory} onClose={() => setOpenStory(null)} />
        </div>
      </div>

      <MobileBottomSheet card={openStory} onClose={() => setOpenStory(null)} />
    </div>
  );
}
