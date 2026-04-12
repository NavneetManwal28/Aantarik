"use client";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = ["About", "How It Works", "Wisdom", "Journey", "Join"];

const MYTHIC_CARDS = [
  {
    deity: "Arjuna",
    source: "Bhagavad Gita",
    quote: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being.",
    lesson: "Your pain is not permanent. You are beyond it.",
    emoji: "🏹",
  },
  {
    deity: "Nachiketa",
    source: "Katha Upanishad",
    quote: "The wise man who knows the Self as bodiless within the bodies, as unchanging among changing things — grieves no more.",
    lesson: "Clarity comes from turning inward, not outward.",
    emoji: "🔥",
  },
  {
    deity: "Hanuman",
    source: "Valmiki Ramayana",
    quote: "You have no idea how powerful you are. When the time comes, you will know.",
    lesson: "Doubt is the only obstacle between you and your potential.",
    emoji: "🌿",
  },
  {
    deity: "Draupadi",
    source: "Mahabharata",
    quote: "She did not break. She bent, she burned, and then she became unbreakable.",
    lesson: "Struggle is not your enemy — it is your forge.",
    emoji: "🪔",
  },
];

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Speak Freely",
    desc: "Tell Ananda what weighs on your heart. No judgment. No filters. Just you.",
    icon: "💬",
  },
  {
    number: "02",
    title: "Find the Pattern",
    desc: "Ananda reveals the recurring threads in your thoughts — the ones you couldn't see alone.",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Receive Ancient Wisdom",
    desc: "Stories from the Gita, Upanishads, and epics, reframed for your exact situation.",
    icon: "📿",
  },
  {
    number: "04",
    title: "Walk Your Path",
    desc: "Daily micro-practices rooted in dharma — small shifts that lead to deep transformation.",
    icon: "🪶",
  },
];

const PAIN_POINTS = [
  { label: "Career confusion", icon: "💼" },
  { label: "Relationship pain", icon: "💔" },
  { label: "Family pressure", icon: "🏠" },
  { label: "Lost sense of self", icon: "🌀" },
  { label: "Anxiety & overthinking", icon: "🌊" },
  { label: "Quarter-life crisis", icon: "⏳" },
];

const TESTIMONIALS = [
  {
    name: "Rohan M., 27",
    city: "Bengaluru",
    text: "I was on the verge of quitting my job and had no one to talk to. Ananda helped me understand my fear wasn't about work — it was about my father's expectations. One conversation changed everything.",
  },
  {
    name: "Priya S., 31",
    city: "Mumbai",
    text: "I've tried journaling apps. Nothing stuck. But when Ananda linked my burnout to a story from the Mahabharata, it hit differently. It felt like my grandmother was talking to me.",
  },
  {
    name: "Aryan T., 24",
    city: "Delhi",
    text: "Three months of anxiety in one late-night session. Ananda didn't give me generic tips — it gave me a mirror. I finally saw what I was actually afraid of.",
  },
];

// Particle field component
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.2 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// Bot chat bubble
function BotBubble({ text, delay = 0 }: { text: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`bot-bubble transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="flex items-start gap-3">
        <div className="bot-avatar">🌸</div>
        <div className="bubble-text">
          <span className="text-amber-200/80 text-xs font-semibold tracking-widest uppercase mb-1 block">Ananda</span>
          <p className="text-white/90 text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((p) => (p + 1) % MYTHIC_CARDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --crimson: #7C1D2E;
          --crimson-deep: #4A0E1A;
          --ink: #080608;
          --paper: #0F0B10;
          --muted: rgba(255,255,255,0.45);
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'DM Sans', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          background: var(--ink);
          color: white;
          font-family: var(--sans);
          overflow-x: hidden;
        }

        /* Noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.6;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.4s ease;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        nav.scrolled {
          background: rgba(8,6,8,0.92);
          backdrop-filter: blur(20px);
          padding: 1rem 3rem;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .nav-logo {
          font-family: var(--serif);
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--gold);
          text-decoration: none;
        }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--gold-light); }
        .nav-cta {
          background: transparent;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-family: var(--sans);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.6rem 1.5rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .nav-cta:hover { background: var(--gold); color: var(--ink); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 8rem 5rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60vw;
          height: 80vh;
          background: radial-gradient(ellipse, rgba(124,29,46,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
        }

        .hero-eyebrow {
          font-family: var(--sans);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-eyebrow::before {
          content: '';
          width: 2rem;
          height: 1px;
          background: var(--gold);
          display: block;
        }

        .hero-title {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 6vw, 6rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.01em;
          color: white;
          margin-bottom: 1rem;
        }
        .hero-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .hero-tagline {
          font-family: var(--serif);
          font-size: 1.05rem;
          font-style: italic;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        .hero-sub {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          margin: 1.5rem 0 2.5rem;
        }

        .hero-btns { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          background: linear-gradient(135deg, var(--crimson), var(--crimson-deep));
          color: white;
          border: none;
          font-family: var(--sans);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,29,46,0.5); }

        .btn-ghost {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s;
          padding: 0;
        }
        .btn-ghost:hover { color: var(--gold-light); }

        /* BOT PANEL */
        .bot-panel {
          background: rgba(15,11,16,0.8);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 60px rgba(124,29,46,0.15), inset 0 1px 0 rgba(201,168,76,0.1);
        }
        .bot-panel::before {
          content: '';
          position: absolute;
          top: -1px; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .bot-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .bot-orb {
          width: 42px; height: 42px;
          background: radial-gradient(circle at 35% 35%, #E8C97A, var(--crimson));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 0 20px rgba(201,168,76,0.3);
          animation: pulse-orb 3s ease-in-out infinite;
        }
        @keyframes pulse-orb {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.3); }
          50% { box-shadow: 0 0 40px rgba(201,168,76,0.6); }
        }
        .bot-name-tag .name {
          font-family: var(--serif);
          font-size: 1.1rem;
          color: var(--gold-light);
          font-weight: 600;
        }
        .bot-name-tag .status {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.1rem;
        }
        .status-dot {
          width: 5px; height: 5px;
          background: #4ade80;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .bot-bubble {
          margin-bottom: 1rem;
        }
        .bot-avatar {
          width: 28px; height: 28px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .bubble-text {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px 12px 12px 12px;
          padding: 0.75rem 1rem;
          flex: 1;
        }

        .user-bubble {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.75rem;
          margin-bottom: 1rem;
        }
        .user-bubble-text {
          background: rgba(124,29,46,0.25);
          border: 1px solid rgba(124,29,46,0.3);
          border-radius: 12px 4px 12px 12px;
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.75);
          max-width: 80%;
        }

        .bot-input {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .bot-input input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 0.6rem 0.9rem;
          font-family: var(--sans);
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          outline: none;
        }
        .bot-input input::placeholder { color: rgba(255,255,255,0.2); }
        .bot-send {
          background: var(--crimson);
          border: none;
          border-radius: 6px;
          padding: 0.6rem 1rem;
          color: white;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .bot-send:hover { background: #9b2435; }

        /* DIVIDER */
        .om-divider {
          text-align: center;
          padding: 3rem 0;
          color: rgba(201,168,76,0.3);
          font-size: 1.5rem;
          letter-spacing: 1rem;
          position: relative;
        }
        .om-divider::before, .om-divider::after {
          content: '';
          position: absolute;
          top: 50%; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
        }

        /* SECTION STYLES */
        section { position: relative; }
        .section-label {
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .section-label::before {
          content: '';
          width: 1.5rem;
          height: 1px;
          background: var(--gold);
        }
        .section-title {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 300;
          line-height: 1.15;
          color: white;
        }
        .section-title em { font-style: italic; color: var(--gold-light); }

        /* PAIN POINTS */
        .pain-section {
          padding: 7rem 5rem;
          background: var(--paper);
          position: relative;
          overflow: hidden;
        }
        .pain-section::before {
          content: 'आन्तरिक';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--serif);
          font-size: 18vw;
          color: rgba(201,168,76,0.025);
          white-space: nowrap;
          pointer-events: none;
          font-weight: 300;
        }
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.08);
          margin-top: 3rem;
        }
        .pain-item {
          background: var(--paper);
          padding: 2rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: background 0.3s;
          cursor: default;
        }
        .pain-item:hover { background: rgba(124,29,46,0.15); }
        .pain-item .icon { font-size: 1.5rem; }
        .pain-item .label { font-size: 0.9rem; color: rgba(255,255,255,0.65); font-weight: 300; }

        /* JOURNEY STEPS */
        .journey-section {
          padding: 8rem 5rem;
          position: relative;
        }
        .journey-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 4rem;
          position: relative;
        }
        .journey-grid::before {
          content: '';
          position: absolute;
          top: 3.5rem;
          left: 12%;
          right: 12%;
          height: 1px;
          background: linear-gradient(90deg, var(--crimson), rgba(201,168,76,0.5), var(--crimson));
        }
        .journey-step {
          text-align: center;
          padding: 0 1.5rem;
          position: relative;
        }
        .step-icon-wrap {
          width: 70px; height: 70px;
          background: var(--ink);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1.75rem;
          position: relative;
          z-index: 1;
          transition: all 0.4s;
        }
        .journey-step:hover .step-icon-wrap {
          background: var(--crimson-deep);
          border-color: var(--gold);
          box-shadow: 0 0 30px rgba(201,168,76,0.2);
        }
        .step-num {
          font-family: var(--serif);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }
        .step-title {
          font-family: var(--serif);
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.75rem;
        }
        .step-desc {
          font-size: 0.82rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.45);
        }

        /* WISDOM CAROUSEL */
        .wisdom-section {
          padding: 8rem 5rem;
          background: linear-gradient(180deg, var(--ink) 0%, rgba(74,14,26,0.15) 50%, var(--ink) 100%);
          overflow: hidden;
        }
        .wisdom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          margin-top: 4rem;
        }
        .wisdom-card {
          position: relative;
          padding: 2.5rem;
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 4px;
          background: rgba(15,11,16,0.6);
          transition: all 0.5s ease;
        }
        .wisdom-card.active {
          border-color: rgba(201,168,76,0.35);
          box-shadow: 0 0 40px rgba(201,168,76,0.08);
        }
        .wisdom-card .deity-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .wisdom-card .source {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }
        .wisdom-card .deity-name {
          font-family: var(--serif);
          font-size: 1.8rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1.5rem;
        }
        .wisdom-card .quote-text {
          font-family: var(--serif);
          font-size: 1rem;
          font-style: italic;
          line-height: 1.8;
          color: rgba(255,255,255,0.65);
          margin-bottom: 1.5rem;
          border-left: 2px solid var(--gold);
          padding-left: 1.25rem;
        }
        .wisdom-card .lesson {
          font-size: 0.82rem;
          color: var(--gold-light);
          font-weight: 500;
        }

        .wisdom-tabs { display: flex; flex-direction: column; gap: 1rem; }
        .wisdom-tab {
          padding: 1.25rem 1.5rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .wisdom-tab.active {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.05);
        }
        .wisdom-tab:hover { border-color: rgba(201,168,76,0.2); }
        .wisdom-tab .tab-icon { font-size: 1.2rem; }
        .wisdom-tab .tab-name {
          font-family: var(--serif);
          font-size: 1rem;
          color: rgba(255,255,255,0.75);
          font-weight: 600;
        }
        .wisdom-tab.active .tab-name { color: var(--gold-light); }
        .wisdom-tab .tab-source {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
        }

        /* TESTIMONIALS */
        .testimonials-section {
          padding: 8rem 5rem;
          background: var(--paper);
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 4rem;
        }
        .testimonial-card {
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          background: rgba(255,255,255,0.02);
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::before {
          content: '"';
          position: absolute;
          top: -0.5rem;
          right: 1.5rem;
          font-family: var(--serif);
          font-size: 8rem;
          color: rgba(201,168,76,0.06);
          line-height: 1;
          pointer-events: none;
        }
        .testimonial-card:hover {
          border-color: rgba(201,168,76,0.2);
          background: rgba(124,29,46,0.08);
        }
        .testimonial-text {
          font-size: 0.88rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.6);
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .testimonial-meta .tname {
          font-family: var(--serif);
          font-size: 0.95rem;
          color: white;
          font-weight: 600;
        }
        .testimonial-meta .tcity {
          font-size: 0.72rem;
          color: var(--gold);
          letter-spacing: 0.1em;
        }

        /* CTA SECTION */
        .cta-section {
          padding: 10rem 5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          background: radial-gradient(ellipse, rgba(124,29,46,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          color: white;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        .cta-title em { font-style: italic; color: var(--gold-light); }
        .cta-sub {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.45);
          max-width: 500px;
          margin: 0 auto 3rem;
          line-height: 1.8;
        }
        .cta-form {
          display: flex;
          gap: 0.75rem;
          max-width: 420px;
          margin: 0 auto;
        }
        .cta-form input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 2px;
          padding: 0.9rem 1.25rem;
          font-family: var(--sans);
          font-size: 0.85rem;
          color: white;
          outline: none;
          transition: border-color 0.3s;
        }
        .cta-form input:focus { border-color: rgba(201,168,76,0.5); }
        .cta-form input::placeholder { color: rgba(255,255,255,0.25); }

        /* FOOTER */
        footer {
          padding: 3rem 5rem;
          border-top: 1px solid rgba(201,168,76,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        footer .logo {
          font-family: var(--serif);
          font-size: 1.2rem;
          color: var(--gold);
          letter-spacing: 0.1em;
        }
        footer .copy {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }
        footer .devanagari {
          font-size: 1rem;
          color: rgba(201,168,76,0.3);
          letter-spacing: 0.2em;
        }

        /* PARTICLES */
        .particle {
          position: absolute;
          background: var(--gold);
          border-radius: 50%;
          animation: float-particle linear infinite;
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }

        /* ANIMATIONS */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.8s ease forwards; }
        .delay-1 { animation-delay: 0.15s; opacity: 0; }
        .delay-2 { animation-delay: 0.3s; opacity: 0; }
        .delay-3 { animation-delay: 0.45s; opacity: 0; }
        .delay-4 { animation-delay: 0.6s; opacity: 0; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 7rem 2rem 4rem; gap: 3rem; }
          nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .pain-grid { grid-template-columns: 1fr 1fr; }
          .journey-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .journey-grid::before { display: none; }
          .wisdom-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .pain-section, .journey-section, .wisdom-section, .testimonials-section, .cta-section { padding: 5rem 2rem; }
          footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem; }
          .cta-form { flex-direction: column; }
        }
      `}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo">AANTARIK</a>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <button className="nav-cta">Begin Journey</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <Particles />
        <div>
          <div className="hero-eyebrow fade-up">Ancient wisdom. Modern healing.</div>
          <h1 className="hero-title fade-up delay-1">
            AANTARIK<br /><em>आन्तरिक</em>
          </h1>
          <p className="hero-tagline fade-up delay-2">Where the Gita meets your midnight crisis.</p>
          <p className="hero-sub fade-up delay-3">
            You are not broken. You are between chapters.<br />
            Let the wisdom of ten thousand years guide you back to yourself.
          </p>
          <div className="hero-btns fade-up delay-4">
            <button className="btn-primary">Start Your Journey →</button>
            <button className="btn-ghost">▶ &nbsp;See how it works</button>
          </div>
        </div>

        {/* BOT PANEL */}
        <div className="bot-panel fade-up delay-3">
          <div className="bot-header">
            <div className="bot-orb">🌸</div>
            <div className="bot-name-tag">
              <div className="name">Ananda</div>
              <div className="status">
                <div className="status-dot" />
                Ancient guide · Always present
              </div>
            </div>
          </div>

          <BotBubble
            text="Namaste. I am Ananda — your companion on the inner path. What weighs on your heart today?"
            delay={600}
          />

          <div className="user-bubble">
            <div className="user-bubble-text">I feel stuck. Like I'm failing at everything — career, relationships... all of it.</div>
          </div>

          <BotBubble
            text='In the Bhagavad Gita, Arjuna too stood paralyzed — not from weakness, but from love. Your confusion is not failure. It is the beginning of clarity.'
            delay={1200}
          />

          <BotBubble
            text="Tell me — when did you last feel truly yourself? Before the pressure started?"
            delay={2000}
          />

          <div className="bot-input">
            <input placeholder="Share what's on your mind..." />
            <button className="bot-send">↑</button>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="pain-section">
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="section-label">You are not alone</div>
          <h2 className="section-title">
            Life hits hardest<br />between <em>22 and 35.</em>
          </h2>
          <p style={{ marginTop: "1.5rem", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.9, maxWidth: "500px" }}>
            The gap between who you are and who you were supposed to be. AANTARIK was built for this exact silence.
          </p>
          <div className="pain-grid">
            {PAIN_POINTS.map((p) => (
              <div key={p.label} className="pain-item">
                <span className="icon">{p.icon}</span>
                <span className="label">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="om-divider">ॐ &nbsp;&nbsp;&nbsp; ॐ &nbsp;&nbsp;&nbsp; ॐ</div>

      {/* JOURNEY STEPS */}
      <section className="journey-section">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>How Ananda guides you</div>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              The <em>path inward</em><br />has four gates.
            </h2>
          </div>
          <div className="journey-grid">
            {JOURNEY_STEPS.map((s) => (
              <div key={s.number} className="journey-step">
                <div className="step-icon-wrap">{s.icon}</div>
                <div className="step-num">{s.number}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WISDOM CAROUSEL */}
      <section className="wisdom-section">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-label">Ancient wisdom, decoded</div>
          <h2 className="section-title">
            Every struggle has been<br /><em>lived before</em> — and survived.
          </h2>
          <div className="wisdom-grid">
            <div className={`wisdom-card active`}>
              <div className="deity-icon">{MYTHIC_CARDS[activeCard].emoji}</div>
              <div className="source">{MYTHIC_CARDS[activeCard].source}</div>
              <div className="deity-name">{MYTHIC_CARDS[activeCard].deity}</div>
              <p className="quote-text">"{MYTHIC_CARDS[activeCard].quote}"</p>
              <p className="lesson">✦ {MYTHIC_CARDS[activeCard].lesson}</p>
            </div>
            <div className="wisdom-tabs">
              {MYTHIC_CARDS.map((c, i) => (
                <div
                  key={c.deity}
                  className={`wisdom-tab ${activeCard === i ? "active" : ""}`}
                  onClick={() => setActiveCard(i)}
                >
                  <span className="tab-icon">{c.emoji}</span>
                  <div>
                    <div className="tab-name">{c.deity}</div>
                    <div className="tab-source">{c.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Real journeys</div>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              People who found their<br /><em>way back.</em>
            </h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-meta">
                  <div className="tname">{t.name}</div>
                  <div className="tcity">{t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Early access</div>
          <h2 className="cta-title">
            The Gita didn't say<br /><em>"give up."</em><br />Neither do we.
          </h2>
          <p className="cta-sub">
            Join the early access list. Be the first to speak with Ananda and begin your journey inward.
          </p>
          <div className="cta-form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn-primary">Join →</button>
          </div>
          <p style={{ marginTop: "1.25rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
            No spam. No generic advice. Only the path.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="logo">AANTARIK</div>
        <div className="devanagari">ॐ तत् सत्</div>
        <div className="copy">© 2025 AANTARIK · All rights reserved</div>
      </footer>
    </>
  );
}