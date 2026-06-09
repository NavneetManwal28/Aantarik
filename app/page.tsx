"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ── Interactive Eye-Following Component ──
function EyeFollower({ color = "#1c1917", size = 80 }: { color?: string; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupils, setPupils] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxD = size * 0.1;
    const calcPupil = (cx: number, cy: number) => {
      const dx = e.clientX - (rect.left + cx);
      const dy = e.clientY - (rect.top + cy);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamp = Math.min(dist, maxD) / (dist || 1);
      return { x: dx * clamp, y: dy * clamp };
    };
    const lp = calcPupil(size * 0.26, size * 0.32);
    const rp = calcPupil(size * 0.74, size * 0.32);
    setPupils({ lx: lp.x, ly: lp.y, rx: rp.x, ry: rp.y });
  }, [size]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const s = size;
  const pr = s * 0.08;

  // Rounded triangle paths — left tilts left, right tilts right
  const leftEye = `M${s*0.26},${s*0.06} C${s*0.38},${s*0.06} ${s*0.46},${s*0.2} ${s*0.46},${s*0.34} C${s*0.46},${s*0.48} ${s*0.38},${s*0.62} ${s*0.26},${s*0.62} C${s*0.14},${s*0.62} ${s*0.06},${s*0.48} ${s*0.06},${s*0.34} C${s*0.06},${s*0.2} ${s*0.12},${s*0.06} ${s*0.26},${s*0.06}Z`;
  const rightEye = `M${s*0.74},${s*0.06} C${s*0.88},${s*0.06} ${s*0.94},${s*0.2} ${s*0.94},${s*0.34} C${s*0.94},${s*0.48} ${s*0.86},${s*0.62} ${s*0.74},${s*0.62} C${s*0.62},${s*0.62} ${s*0.54},${s*0.48} ${s*0.54},${s*0.34} C${s*0.54},${s*0.2} ${s*0.62},${s*0.06} ${s*0.74},${s*0.06}Z`;

  return (
    <div ref={containerRef} style={{ width: s, height: s * 0.65 }} className="pointer-events-none">
      <svg viewBox={`0 0 ${s} ${s * 0.65}`} width={s} height={s * 0.65}>
        {/* Left eye — square */}
        <rect x={s * 0.06} y={s * 0.06} width={s * 0.4} height={s * 0.52} fill="#e4eef6" stroke={color} strokeWidth="0.6" strokeOpacity="0.1" />
        <circle cx={s * 0.26 + pupils.lx} cy={s * 0.32 + pupils.ly} r={pr} fill={color} />

        {/* Right eye — square */}
        <rect x={s * 0.54} y={s * 0.06} width={s * 0.4} height={s * 0.52} fill="#e4eef6" stroke={color} strokeWidth="0.6" strokeOpacity="0.1" />
        <circle cx={s * 0.74 + pupils.rx} cy={s * 0.32 + pupils.ry} r={pr} fill={color} />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SOLACE — Story-first emotional reflection platform
//  Flow: Emotion → Story Discovery → Reading → Reflection → Chat
// ═══════════════════════════════════════════════════════════════

// ── Types ──
interface Story { id: string; title: string; hook: string; source: string; tradition: string; character: string; body: string; connect: string; teaching: string; themes: string[]; readMin: number; }
interface Collection { id: string; title: string; subtitle: string; intro: string; accent: string; accentLight: string; stories: Story[]; }
interface Message { role: "user" | "bot"; text: string; typing?: boolean; }
type View = "home" | "collection" | "story" | "chat";

// ── Mood System ──
const MOODS = [
  { value: "heavy", label: "Heavy", collections: ["heavy", "alone", "grief"] },
  { value: "restless", label: "Restless", collections: ["noise", "proving", "starting-over"] },
  { value: "hopeful", label: "Hopeful", collections: ["starting-over", "proving", "identity"] },
  { value: "tender", label: "Tender", collections: ["love", "grief", "alone"] },
  { value: "lost", label: "Lost", collections: ["identity", "noise", "starting-over"] },
  { value: "calm", label: "Calm", collections: ["identity", "love", "starting-over"] },
];

// ── Collection Icons (abstract SVG blobs) ──
function ColIcon({ id, size = 28 }: { id: string; size?: number }) {
  const colors: Record<string, string> = {
    heavy: "#8b7e74", proving: "#b8976e", "starting-over": "#7d9b8a", love: "#b07d7d",
    alone: "#7d93a8", noise: "#6b8f9e", identity: "#8b82a8", grief: "#8a8078",
  };
  const c = colors[id] || "#8b7e74";
  const icons: Record<string, React.ReactNode> = {
    heavy: <svg viewBox="0 0 48 36" width={size} height={size*0.75}><path d="M12 28c-5 0-9-3-9-8s4-8 9-8c1-5 6-10 12-10s11 5 12 10c5 0 9 3 9 8s-4 8-9 8z" fill={c}/></svg>,
    proving: <svg viewBox="0 0 40 44" width={size*0.85} height={size}><path d="M20 40c0-12-10-14-14-22C3 12 8 4 16 6c6 1 4 10 4 10s8-14 14-8c4 4-2 10-6 12-4 2 0 10-8 20z" fill={c}/></svg>,
    "starting-over": <svg viewBox="0 0 48 32" width={size} height={size*0.67}><path d="M6 28c0-10 8-20 18-20s18 10 18 20" fill={c}/><circle cx="24" cy="14" r="5" fill={c} opacity="0.4"/></svg>,
    love: <svg viewBox="0 0 44 40" width={size} height={size*0.9}><path d="M22 36c-2-2-18-12-18-22C4 8 8 4 14 4c4 0 6 2 8 5 2-3 4-5 8-5 6 0 10 4 10 10 0 10-16 20-18 22z" fill={c}/></svg>,
    alone: <svg viewBox="0 0 40 44" width={size*0.85} height={size}><path d="M28 4C16 6 8 16 8 28c0 8 6 12 12 12 10 0 18-8 18-20S34 2 28 4z" fill={c}/></svg>,
    noise: <svg viewBox="0 0 52 28" width={size*1.1} height={size*0.6}><path d="M4 18c4-8 8-14 14-14s8 6 12 6 8-6 14-6c4 0 6 4 6 8s-2 8-6 10c-6 2-10-2-14-2s-8 4-14 4C8 24 4 22 4 18z" fill={c}/></svg>,
    identity: <svg viewBox="0 0 48 40" width={size} height={size*0.83}><path d="M24 20c-4-6-14-18-18-14s0 14 6 18c4 2 8 0 12-4z" fill={c} opacity="0.6"/><path d="M24 20c4-6 14-18 18-14s0 14-6 18c-4 2-8 0-12-4z" fill={c}/></svg>,
    grief: <svg viewBox="0 0 40 44" width={size*0.85} height={size}><path d="M20 4c8 4 16 14 14 24-2 8-8 12-14 12S8 36 6 28C4 18 12 8 20 4z" fill={c}/><path d="M20 8c0 12-4 22-6 30" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/></svg>,
  };
  return <span className="inline-flex items-center">{icons[id] || null}</span>;
}

// ═══════════════════════════════════════════════════════════════
//  STORY DATA
// ═══════════════════════════════════════════════════════════════

const COLLECTIONS: Collection[] = [
  {
    id: "heavy", title: "When everything feels heavy", subtitle: "Weight & endurance",
    intro: "Some days the weight doesn't come from one thing. It comes from everything at once.",
    accent: "#8b7e74", accentLight: "#e8e2db",
    stories: [
      { id: "arjuna-collapse", title: "Arjuna Sits Down", hook: "The warrior everyone counted on simply could not go on.", source: "Bhagavad Gita", tradition: "Indian Epic", character: "Arjuna", readMin: 5, body: "Arjuna was the warrior everyone was counting on. He had been preparing for this for years. And then he sat down in the middle of the battlefield and simply could not go on. His bow fell. His body trembled. He was genuinely empty — the kind of empty that comes from carrying too much for too long.\n\nKrishna didn't immediately push him to get up. He sat down beside him first. Before any philosophy, before any grand teaching — he just stayed. The entire Bhagavad Gita begins not with wisdom, but with someone who has completely run out.", connect: "Burnout isn't a productivity problem. It's a signal that something important has run out.", teaching: "The collapse is not the end. It is the moment before something more honest begins.", themes: ["burnout", "exhaustion", "collapse"] },
      { id: "sisyphus-rock", title: "Sisyphus and the Rock", hook: "Condemned to push forever. Camus asked: what if he was happy?", source: "Greek Myth / Camus", tradition: "Greek Philosophy", character: "Sisyphus", readMin: 5, body: "The gods condemned Sisyphus to roll a boulder up a mountain, only to watch it roll back down, forever. They thought this was the worst punishment imaginable — effort without end.\n\nCenturies later, Camus saw something different. He wrote: we must imagine Sisyphus happy. Not because the work got easier. But because in the moment he turns around and walks back down — he owns the walk. The punishment fails the moment he chooses the effort instead of just enduring it.", connect: "When life feels like the same weight over and over, the question isn't how to escape the loop. It's whether you can find something in the rhythm that is yours.", teaching: "What you choose to see during the climb matters.", themes: ["repetition", "meaning", "endurance"] },
      { id: "frankl-choice", title: "Frankl's Last Freedom", hook: "Everything was taken. One thing remained — his response.", source: "Man's Search for Meaning", tradition: "Modern Philosophy", character: "Viktor Frankl", readMin: 6, body: "Viktor Frankl survived four concentration camps. His wife, parents, brother — all killed. His life's work destroyed.\n\nInside the camp, he noticed: the people who survived longest were those who found something to live for. He wrote that between what happens to you and how you respond, there is a space. In that space is your freedom.", connect: "Somewhere inside the weight, there's a small space that still belongs to you.", teaching: "Between what happens and how you respond, there is a space. That space is yours.", themes: ["suffering", "meaning", "freedom"] },
      { id: "shiva-withdraw", title: "Shiva Disappears", hook: "When the world got too loud, even a god needed silence.", source: "Puranas", tradition: "Indian Mythology", character: "Shiva", readMin: 4, body: "When the world got too loud, Shiva retreated into the mountains and went silent. He simply withdrew into meditation so deep that the world had to figure out how to function without him.\n\nThe texts don't frame this as escape. They frame it as a god who understood that stillness is its own kind of power.", connect: "Stepping back isn't failure. It's sometimes the most honest response to having given everything.", teaching: "Rest is not absence. It is the condition that makes return possible.", themes: ["withdrawal", "rest", "silence"] },
      { id: "zen-farmer", title: "The Farmer's \"We'll See\"", hook: "Good luck, bad luck — who can say?", source: "Zen Parable", tradition: "Zen Buddhism", character: "The Farmer", readMin: 4, body: "A farmer's horse ran away. His neighbours said: terrible luck. The farmer said: we'll see. The horse came back with three wild horses. Wonderful luck. We'll see. His son broke his leg. Terrible luck. We'll see. The army came to conscript young men. His son was spared.\n\nThe farmer isn't being wise — he's being accurate. He doesn't know whether what happened is good or bad, because the story isn't over.", connect: "Part of the weight is the certainty that things are bad. What if you're in the middle of a story you can't see the end of?", teaching: "The story isn't over.", themes: ["uncertainty", "patience", "perspective"] },
    ],
  },
  {
    id: "proving", title: "Proving yourself", subtitle: "Worth & recognition",
    intro: "The exhaustion of being good at something and having no one notice.",
    accent: "#b8976e", accentLight: "#efe6d6",
    stories: [
      { id: "karna-rejection", title: "Karna Doesn't Belong", hook: "Talent of a king, birth certificate of a servant.", source: "Mahabharata", tradition: "Indian Epic", character: "Karna", readMin: 6, body: "The tournament at Hastinapura was the event of a generation. Every prince of the Kuru dynasty would demonstrate the martial skills they had spent years perfecting under Dronacharya, the greatest weapons teacher in the known world. The arena was packed — kings, ministers, citizens, all gathered to witness the future rulers of their civilization display their abilities.\n\nArjuna, the third Pandava prince, was the star. His archery was so precise it seemed choreographed by the gods themselves. He split targets mid-air. He summoned celestial weapons. The crowd roared. His teacher beamed. The future seemed settled: Arjuna was the finest warrior of his age.\n\nThen a young man walked in through the competitor's gate. No one had invited him. He was tall, broad-shouldered, wearing golden earrings that caught the light. Without asking permission, he replicated every single feat Arjuna had just performed. Every arrow. Every technique. Some he did better.\n\nThe arena went silent. Then Kripacharya, the tournament's master of ceremonies, stood and asked the question that would define this young man's entire life: Who are you? What is your lineage? This tournament is for princes. Only a king's son may challenge a prince.\n\nThe young man was Karna. And he was not a prince. He was the adopted son of Adhiratha, a charioteer — a man who drove other people's chariots for a living. In the rigid social hierarchy of ancient India, this was not a minor technicality. It was a wall.\n\nThe crowd laughed. Some of the princes sneered. Bhima, one of the Pandavas, openly mocked him: go back to your chariot and your whip. This is not your place.\n\nKarna stood in that arena — his skill undeniable, his talent visible to every person present — and was told that none of it mattered because of who his father was. The system had already decided who he could become, and he wasn't on the list.\n\nWhat happened next has been debated for three thousand years. Duryodhana, the eldest Kaurava prince, stood up and crowned Karna king of Anga on the spot. It was a political move — Duryodhana wanted Karna's loyalty against the Pandavas. But for Karna, it was the first time anyone with power had looked at what he could do rather than where he came from.\n\nKarna's loyalty to Duryodhana would eventually cost him everything. He fought on the wrong side of the great war. He was killed by Arjuna. Only after his death did the truth emerge: Karna was actually Kunti's firstborn son, making him the eldest Pandava. The system that had rejected him had been wrong about the most basic fact of his identity.\n\nThe Mahabharata spends more time inside Karna's inner life than almost any other character. It treats his story not as a tragedy of circumstance, but as a question the text never fully resolves: what do you do when you are genuinely talented, and the world has decided you don't count?", connect: "Feeling stuck often isn't about ability. It's about the world not yet having a category for what you actually are. The talent is real. The system just hasn't caught up.", teaching: "What you build from your own values outlasts what others gave you permission to become.", themes: ["rejection", "identity", "self-made"] },
      { id: "cassandra-truth", title: "Cassandra Speaks", hook: "She could see the future. No one believed her.", source: "Greek Myth", tradition: "Greek Mythology", character: "Cassandra", readMin: 6, body: "Cassandra was a princess of Troy, daughter of King Priam. She was beautiful enough that Apollo, the god of prophecy himself, fell in love with her. He offered her a gift: the ability to see the future. She accepted. But when she refused to become his lover in return, Apollo added a curse. She would keep the gift of prophecy. She would see everything that was coming. But no one would ever believe a word she said.\n\nThink about what that actually means. Cassandra could see Troy's destruction — the wooden horse, the fire, the slaughter — years before it happened. She knew exactly how and when the city would fall. She knew which decisions would lead to which catastrophes. And she told people. She told them clearly, specifically, urgently.\n\nThey looked at her with pity. They looked at her with irritation. They called her mad. They walked away. Every time.\n\nWhen Paris brought Helen to Troy, Cassandra screamed that it would mean the end of everything. They ignored her. When the Greeks left a giant wooden horse outside the gates, she begged them not to bring it inside. They ignored her. She clawed at the wood. She tried to set it on fire. Guards pulled her away.\n\nThat night, Greek soldiers climbed out of the horse and opened the gates. Troy burned exactly as Cassandra had described, on exactly the night she had predicted, in exactly the way she had warned about.\n\nThe cruelty of Cassandra's curse was not that she was wrong. The cruelty was that she was right — completely, precisely, undeniably right — and it made no difference. She had the truth. She had the clarity. She had the courage to speak. The world simply was not structured to hear her.\n\nCassandra survived the fall of Troy. She was taken as a captive by Agamemnon, the Greek commander. She told him he would be murdered by his wife when he returned home. He laughed. He was murdered by his wife when he returned home.\n\nThe Greeks gave her story a word that still carries her name: a Cassandra is someone who speaks truth that will not be believed. The myth has survived for three thousand years because the pattern it describes has never stopped happening — in workplaces, in families, in institutions. The person who sees clearly, speaks clearly, and watches the room decide they would rather not know.", connect: "If you've ever known something clearly and watched people dismiss it — the pain isn't being wrong. It's being right before the room is ready to hear it.", teaching: "Being seen is not the same as being right. Sometimes you have to hold truth alone until the world catches up.", themes: ["being-ignored", "truth", "frustration"] },
      { id: "epictetus-slave", title: "Epictetus Begins in Chains", hook: "Born a slave. Became one of history's greatest minds.", source: "Discourses", tradition: "Stoic Philosophy", character: "Epictetus", readMin: 6, body: "Epictetus was born around 50 AD in Hierapolis, a city in what is now Turkey. He was born into slavery. His name was not even a name — Epictetus means acquired. He was a thing to be owned.\n\nHis master was Epaphroditus, a wealthy freedman who served in Nero's administration. The historical sources disagree on the details of what happened to Epictetus's leg. One account says Epaphroditus twisted it deliberately. Another says it was broken through neglect. Either way, Epictetus walked with a permanent limp for the rest of his life — a daily physical reminder of what it meant to be property.\n\nAt some point, Epaphroditus allowed his slave to attend lectures by the Stoic philosopher Musonius Rufus. This was not generosity — educated slaves were more valuable. But something happened in those lectures that Epaphroditus had not anticipated. Epictetus didn't just learn philosophy. He found inside it the one thing that slavery had taken from him: freedom.\n\nNot physical freedom. Not yet. Something more radical. Epictetus began to develop an idea that would reshape Western thought: the distinction between what is up to us and what is not up to us. Your body can be chained. Your circumstances can be controlled by others. Your reputation, your possessions, your physical safety — none of these are fully in your power. But your judgments, your choices, your responses — these are yours. Always. Even in chains.\n\nWhen Epictetus eventually gained his freedom — probably after Nero's death in 68 AD — he began teaching. He never wrote anything down. His student Arrian recorded his lectures, which became the Discourses and the Handbook, two of the foundational texts of Stoic philosophy.\n\nHis school in Nicopolis became one of the most respected in the Roman world. Senators, military commanders, and eventually Emperor Hadrian himself came to listen to a former slave with a broken leg explain what freedom actually means.\n\nEpictetus never softened his message to make it comfortable. He told his wealthy students: you are more enslaved than I ever was, because you are enslaved to things you could lose. Your status, your comfort, your reputation — any of these could be taken from you tomorrow. I already lost everything. And I found that what remains is enough.\n\nHe lived simply until his death around 135 AD. He adopted a friend's child who would otherwise have been abandoned. He owned almost nothing. He had proven his central thesis with his entire life: that a person's worth has nothing to do with where they start.", connect: "When the world tells you what you're worth based on where you started — remember that the people who changed how we think about being human often began from the lowest position imaginable.", teaching: "External circumstances are the starting point, not the verdict. What you do with them is the measure.", themes: ["worth", "status", "overcoming"] },
      { id: "ekalavya-path", title: "Ekalavya Builds His Own Path", hook: "Refused by the greatest teacher, he surpassed every student.", source: "Mahabharata", tradition: "Indian Epic", character: "Ekalavya", readMin: 6, body: "Dronacharya was the most sought-after weapons teacher in ancient India. Kings sent their sons to him. Princes competed for his attention. To study under Drona was to have your future guaranteed — his students went on to rule kingdoms and command armies.\n\nEkalavya was the son of a tribal chief in the forests outside the kingdom. He was not a prince. He was not from the right caste. But he wanted to learn archery, and he wanted to learn from the best. So he walked to Drona's ashram and asked to be admitted.\n\nDrona looked at him and said no. The refusal was not personal — it was structural. Drona had promised the Kuru princes, particularly Arjuna, that he would make them the finest archers in the world. Accepting a talented outsider who might surpass them would break that promise. The system required that certain people be kept out so certain other people could feel exceptional.\n\nWhat Ekalavya did next is one of the most remarkable acts of self-determination in any mythology. He went into the forest, gathered clay, and built a statue of Dronacharya. He placed it under a tree. And then he began to teach himself.\n\nEvery day, he woke before dawn. He practised in front of the clay statue as if Drona were watching. He observed animals — how birds tracked movement, how predators aimed. He studied the physics of the bow through thousands of repetitions. He had no curriculum. No feedback. No classmates to measure against. No one telling him he was improving. Just the statue and the forest and the daily decision to show up again.\n\nMonths became years. Ekalavya became extraordinary.\n\nOne day, the Kuru princes came hunting in his forest. A dog wandered near Ekalavya's practice ground and began barking. Without looking up, Ekalavya shot seven arrows into the dog's mouth — not harming it, but filling its mouth so completely that it could not bark. The arrows were placed so precisely that the dog could close its mouth around them without a single wound.\n\nThe princes found the dog and were stunned. This level of skill surpassed anything they had achieved. They tracked down the archer and found Ekalavya practising alone in a clearing, his clay statue watching silently.\n\nWhen Drona heard about it, he went to the forest himself. He saw Ekalavya's skill and realised that this self-taught boy had surpassed Arjuna. The promise was broken — not by Drona, but by talent that refused to be contained by the system that excluded it.\n\nWhat Drona did next is the most debated moment in the story. He asked for Ekalavya's right thumb as guru dakshina — the traditional gift to a teacher. Ekalavya cut it off without hesitation. He could never shoot the same way again.\n\nThe Mahabharata doesn't resolve whether this was just. But it preserves something more important: the image of a young man in a forest, teaching himself to be extraordinary, with nothing but a clay statue and his own refusal to accept that the absence of permission meant the absence of possibility.", connect: "Not having a conventional path doesn't mean you're behind. Sometimes the path doesn't exist yet because you're the one who needs to build it.", teaching: "The absence of a clear path is sometimes an invitation to build your own. The statue was clay. The skill was real.", themes: ["self-made", "discipline", "alternative-path"] },
      { id: "sita-refusal", title: "Sita Stops Proving Herself", hook: "After giving everything, she refused one more test.", source: "Ramayana", tradition: "Indian Epic", character: "Sita", readMin: 6, body: "Sita was the wife of Rama, the prince of Ayodhya. When Rama was exiled to the forest for fourteen years, Sita chose to go with him. She didn't have to. As a princess, she could have stayed in the palace, waited in comfort, maintained her status. She chose the forest, the danger, and the uncertainty — because she chose him.\n\nIn the forest, she was kidnapped by Ravana, the king of Lanka. She was held captive for months. She refused Ravana completely — his wealth, his power, his threats. She sat in his garden under an Ashoka tree and waited, certain that Rama would come.\n\nRama did come. He fought an epic war to rescue her. Armies clashed. Cities burned. Heroes died. When it was over and Sita stood before him, free at last, Rama said something that has troubled readers for three thousand years: he asked her to prove that she had remained pure during her captivity.\n\nSita walked into fire. The fire did not burn her. The god of fire himself carried her out, testifying to her purity. She had proven herself in the most dramatic way possible. The matter was settled.\n\nExcept it wasn't. Years later, after they had returned to Ayodhya, after Rama had been crowned king, after Sita was pregnant with their twins — the people began to talk. A washerman questioned his own wife's fidelity and used Sita as an example: I am not like Rama, who takes back a wife who lived in another man's house. The gossip reached Rama. And Rama, despite knowing the truth, despite the fire, despite everything — asked Sita to undergo another test.\n\nThis time, Sita refused.\n\nShe did not argue. She did not weep. She did not rage, though she had every right to. She stood in front of the assembled court and made a single request: she asked the earth to take her back. If she had been pure and faithful, let the ground open and receive her.\n\nThe earth opened. Sita descended. The ground closed above her.\n\nThe Ramayana does not frame this as defeat. It frames it as the most powerful act of self-knowledge in the entire epic. Sita had given everything — her comfort, her safety, her years, her dignity. She had walked through literal fire. And when she was asked to do it again, she made a decision that reverberates across millennia: enough.\n\nNot with anger. Not with bitterness. With the quiet clarity of someone who knows exactly what she has given and knows that the person asking for more will never stop asking.\n\nShe didn't leave because she was broken. She left because she was complete. There was nothing more to prove, and she was the only one who knew it.", connect: "There comes a point where continuing to prove yourself is the wrong move. Not every demand for proof deserves an answer. Sometimes the most powerful thing you can do is stop performing and let your own knowing be enough.", teaching: "Walking away from people who keep moving the standard isn't giving up. It's recognising that the test was never going to end.", themes: ["dignity", "enough", "self-worth"] },
    ],
  },
  {
    id: "starting-over", title: "Starting over again", subtitle: "Reinvention & becoming",
    intro: "Starting over is rarely clean. You carry the old version of yourself for a while.",
    accent: "#7d9b8a", accentLight: "#dcebe2",
    stories: [
      { id: "vishwamitra-shift", title: "Vishwamitra Walks Away", hook: "A king who left everything — failed, tried, failed again.", source: "Ramayana", tradition: "Indian Epic", character: "Vishwamitra", readMin: 6, body: "Vishwamitra was not born a sage. He was born a king — a Kshatriya warrior-king of the Chandravanshi dynasty, ruler of a prosperous kingdom, commander of armies. He had everything the ancient world considered success: power, wealth, status, military might.\n\nThen he met Vasishtha.\n\nVasishtha was a Brahmarishi — the highest classification of sage. He lived simply in a forest ashram with a divine cow named Nandini who could produce anything its owner desired. Vishwamitra, travelling with his army, stopped at the ashram expecting hospitality. Vasishtha's cow produced a feast for the entire army — thousands of soldiers fed from nothing.\n\nVishwamitra wanted the cow. Vasishtha refused. Vishwamitra sent his army to take it by force. Vasishtha, a thin old man in simple clothes, defeated the entire army with spiritual power alone. Not a single soldier could touch him.\n\nSomething broke open in Vishwamitra that day. Not his pride — his understanding. He had spent his life believing that power came from armies, wealth, and kingdoms. In one afternoon, a quiet man in a forest proved that there was a kind of power his entire world had not prepared him for.\n\nVishwamitra left. He abdicated his throne, gave up his kingdom, walked into the forest, and began the process of becoming something entirely different from what he had been.\n\nThe texts are honest about what happened next: he failed. Repeatedly. Spectacularly. He would spend years in intense meditation, build enormous spiritual reserves, and then lose them in a single moment of anger or desire. Once, he created an entire alternate universe out of frustrated ego. Another time, he fell in love with the celestial nymph Menaka and spent years in domestic life, losing decades of progress.\n\nEach time, he started over. Each time, with less ego and more clarity about what he was actually pursuing. The Ramayana and the Puranas spend far more time on Vishwamitra's failures than on his eventual success, because the texts understood that the failures were the teaching.\n\nAfter centuries of effort — yes, the myth operates on mythological timescales — Vasishtha himself finally acknowledged Vishwamitra as a Brahmarishi. The man who had once tried to take by force what he wanted had spent lifetimes learning to earn it through transformation.\n\nThe detail that makes the story remarkable is not the ending. It is the number of times Vishwamitra restarted. He did not begin again once. He began again dozens of times, each time from a place of having lost what he had built. And each restart was not a return to zero — it was a return to zero with the knowledge of everything he had learned from the previous attempt.", connect: "Confusion about what comes next might not be a dead end. It might be the beginning of a becoming that requires more restarts than you expected. The path to what you're meant for is almost never the first path you walk.", teaching: "The path is rarely straight, and rarely what you started with. But every restart carries what the last attempt taught you.", themes: ["reinvention", "failure", "persistence"] },
      { id: "phoenix-rebirth", title: "The Phoenix Burns", hook: "It didn't survive the fire. It became the fire.", source: "Egyptian / Greek Myth", tradition: "Mythology", character: "The Phoenix", readMin: 5, body: "The Phoenix appears in the mythologies of Egypt, Greece, China, and Persia — cultures separated by thousands of miles and centuries of time, all independently arriving at the same image: a magnificent bird that dies in fire and is reborn from its own ashes.\n\nThe Egyptian version is the oldest. The Bennu bird was associated with the sun god Ra and the flooding of the Nile — the annual destruction that made the soil fertile again. The Greeks called it the Phoenix and gave it the details that have survived: a bird of extraordinary beauty with feathers of gold and scarlet, living for five hundred years before its time comes.\n\nWhat makes the myth remarkable is how the Phoenix dies. It does not flee. It does not fight. When it senses that its current life has reached its limit, it gathers aromatic branches — cinnamon, myrrh, frankincense — and builds its own funeral pyre. Then it sits on the pyre, faces the rising sun, and ignites.\n\nThe fire is complete. There is no partial burning, no controlled demolition, no saving the good parts while discarding the rest. The Phoenix burns entirely. The creature that existed — its memories, its body, its accumulated centuries of experience — is reduced to ash.\n\nAnd then, from inside the ash, something moves. A small worm, or in some tellings, a small bird. It grows rapidly, feeds on the remains of what came before, and within days has become a new Phoenix — fully formed, fully alive, fully itself. But not the same self. The myth is explicit about this: the new Phoenix is not the old one repaired. It is not the old one with fresh feathers. It is a genuinely new being, carrying the essence of what came before but expressed in a form that did not exist until the burning.\n\nThe myth has survived for four thousand years because the pattern it describes is one of the deepest truths about change: some transformations cannot happen gradually. Some new versions of you can only exist on the other side of a complete ending. The person you become after a devastating loss, a failed marriage, a career collapse, a total reimagining of your life — that person could not have been reached by incremental improvement. They required the fire.\n\nThis does not make the fire good. The myth does not celebrate the burning. It simply observes that some beginnings are only possible after complete endings — and that the ash is not the obstacle to what comes next. It is the material.", connect: "If something in your life has burned down completely — a relationship, a career, an identity — the myth says: the ending might be real. The loss might be total. And what comes after might be something that could not have existed without the fire.", teaching: "Some beginnings require complete endings. The ash is not the obstacle — it is the material from which the next version is built.", themes: ["transformation", "endings", "renewal"] },
      { id: "rumi-guest", title: "Rumi's Guest House", hook: "Every emotion is a visitor. What if you let them all in?", source: "Masnavi", tradition: "Sufi Poetry", character: "Rumi", readMin: 6, body: "Jalal ad-Din Muhammad Rumi was a respected Islamic scholar and jurist in thirteenth-century Konya, in what is now Turkey. He came from a long line of theologians. He taught at a prestigious madrasa. He had students, status, a clear place in the intellectual hierarchy of his world. He was, by all external measures, a man who had figured out his life.\n\nThen, in 1244, he met a wandering mystic named Shams of Tabriz.\n\nShams was everything Rumi was not: wild, unpredictable, uninterested in institutional religion, contemptuous of scholarly pretension. Their meeting is described differently in different sources, but the essential story is the same: Shams asked Rumi a question so penetrating that Rumi's entire intellectual framework collapsed. The scholar who had spent his life building systems of thought found himself standing in the rubble of everything he thought he knew.\n\nWhat followed was one of the most intense and transformative friendships in literary history. Rumi and Shams spent months in conversation, day and night, to the confusion and resentment of Rumi's students and family. Rumi stopped teaching. He stopped being the person everyone expected him to be. He began writing poetry — not the scholarly verse expected of a theologian, but ecstatic, raw, wildly beautiful poetry about love, loss, longing, and the experience of being completely undone.\n\nThen Shams disappeared. Possibly murdered by Rumi's jealous students. Possibly simply vanished, as wandering mystics do. Rumi was devastated. He searched for Shams for years, travelling to Damascus multiple times.\n\nHe never found him. But from that grief came one of the greatest bodies of poetry in human history — over sixty-five thousand verses, including the Masnavi, which has been called the Quran of Persia.\n\nAmong those verses is a short poem called The Guest House. Rumi writes that being human is like running a guest house. Every morning a new arrival — joy, depression, meanness, a moment of awareness. He says: welcome them all. Invite them in. Even the dark visitors. Even the ones that sweep your house empty of its furniture.\n\nThis is not positive thinking. This is not saying that pain is secretly good. Rumi lost the most important person in his life and never recovered. What he is saying is something harder: that fighting the arrival of difficult feelings takes more energy than letting them pass through. That the guest house does not collapse because a rough visitor shows up. That some of the visitors who seem most destructive are actually clearing space for something that couldn't arrive while the house was full.", connect: "Starting over often means sitting with feelings you've been resisting — grief, confusion, fear, anger. Rumi says: they are visitors, not permanent residents. And some of them are clearing space for what comes next.", teaching: "The feeling you're resisting might be the one that's trying to clear space for what comes next.", themes: ["acceptance", "emotions", "letting-go"] },
      { id: "ganesha-new", title: "Ganesha Is Made New", hook: "His head was taken. What replaced it made him stronger.", source: "Puranas", tradition: "Indian Mythology", character: "Ganesha", readMin: 5, body: "The story of Ganesha's creation varies across the Puranas, but the core narrative is remarkably consistent. Parvati, the wife of Shiva, wanted a guardian. In some versions, she was lonely. In others, she wanted someone who was entirely hers — not shared with Shiva's followers or devotees. She took turmeric paste — some texts say sandalwood — moulded it into the form of a boy, and breathed life into him. She named him Ganesha and told him: guard this door. Let no one pass.\n\nShiva returned home. He did not know about the boy. He found a stranger blocking his entrance and refusing to move. Shiva is not a god known for his patience in such moments. A confrontation escalated. Ganesha held his ground — he had been given one instruction, and he followed it completely. Shiva, in a fury, cut off his head.\n\nWhen Parvati discovered what had happened, her grief shook the cosmos. The texts describe her rage as a force that threatened to unmake creation itself. Shiva, realising the magnitude of what he had done, promised to restore the boy. He sent his followers to bring back the head of the first living being they found facing north. They found an elephant.\n\nShiva placed the elephant's head on the boy's body and restored him to life. But here is the part the texts emphasise: Ganesha did not come back as who he was before. He did not return to being the simple guardian made of turmeric paste. He became something new — something more powerful, more significant, more beloved than anything Parvati had originally created.\n\nShiva declared him the leader of his followers. He became the god of beginnings, the remover of obstacles, the deity invoked before any new endeavour. In modern Hinduism, Ganesha is arguably the most widely worshipped god — his image appears at the entrance of homes, businesses, temples, and ceremonies. Every beginning starts with him.\n\nThe myth does not minimise the violence of what happened. The beheading was real. The loss was real. The boy who existed before the transformation was genuinely gone. But the Puranas frame the entire event not as tragedy but as the necessary mechanism of becoming. The Ganesha who existed after the elephant head was not a damaged version of the original. He was the version that was always meant to exist — and he could only be reached through a rupture that felt, in the moment, like complete destruction.", connect: "When something fundamental about your identity has been broken or replaced — by circumstance, by crisis, by someone else's decision — the myth suggests that the version of you that emerges might not be a damaged version. It might be the version that was always coming.", teaching: "What you were before a rupture is not necessarily what you're meant to keep being. The new form might be the one that was always intended.", themes: ["identity", "change", "becoming"] },
      { id: "empty-cup", title: "The Empty Cup", hook: "You can't fill a cup that's already full.", source: "Zen Parable", tradition: "Zen Buddhism", character: "Nan-in", readMin: 5, body: "Nan-in was a Japanese Zen master who lived during the Meiji era, a period when Japan was modernising rapidly and Western academic traditions were flooding into the country. He received many visitors — professors, politicians, intellectuals — who came to learn about Zen, usually as an intellectual exercise. They wanted to add Zen to their collection of things they understood.\n\nOne afternoon, a university professor arrived. He was distinguished, well-published, and clearly accustomed to being the smartest person in any room. He sat down and immediately began talking — about Eastern philosophy, about meditation, about what he had read, about his theories regarding the nature of consciousness.\n\nNan-in listened quietly. After several minutes, he suggested tea. The professor agreed, still talking. Nan-in began to pour.\n\nHe filled the cup. The professor continued talking. Nan-in kept pouring. Tea reached the brim. Nan-in kept pouring. Tea spilled over the sides, across the table, onto the professor's lap.\n\nThe professor jumped up. What are you doing? The cup is full! No more will go in!\n\nNan-in set down the teapot and said: like this cup, you are full of your own opinions and speculations. How can I show you Zen unless you first empty your cup?\n\nThe story is usually told as a lesson about humility, and it is. But there is a deeper layer that applies specifically to the experience of starting over. When you begin again — after a career change, after a relationship ends, after a belief system collapses — the hardest part is not acquiring new knowledge. The hardest part is setting down what you already know.\n\nYour expertise, your identity, your hard-won understanding of how things work — these are not nothing. You earned them. But they are taking up space. And some of what needs to arrive next cannot fit into a cup that is already full of the last version of your life.\n\nNan-in's point is not that knowledge is worthless. His point is that the posture of knowing — the certainty, the fullness, the I already understand this — actively prevents learning. To start over genuinely, you have to be willing to feel the discomfort of not knowing. To sit with the emptiness that comes before new understanding arrives.\n\nThe cup must be emptied. Not because what was in it was bad. But because what comes next needs the space.", connect: "Starting over doesn't just mean changing circumstances. It means being willing to not know things you thought you knew — to empty a cup that took years to fill.", teaching: "The hardest part of beginning again is putting down what you already carry. The cup must be emptied — not because what was in it was wrong, but because what comes next needs the room.", themes: ["humility", "emptying", "learning"] },
    ],
  },
  {
    id: "love", title: "Love that costs something", subtitle: "Devotion & sacrifice",
    intro: "The stories that last aren't where love was easy. They're where it cost something real.",
    accent: "#b07d7d", accentLight: "#eddce1",
    stories: [
      { id: "savitri-death", title: "Savitri Follows Death", hook: "Her husband died. She argued him back from death itself.", source: "Mahabharata", tradition: "Indian Epic", character: "Savitri", readMin: 6, body: "Savitri was the daughter of King Ashvapati. She was brilliant, beautiful, and so independently minded that no man dared approach her father for her hand. Eventually the king told her: choose your own husband. She travelled the kingdoms and chose Satyavan — a prince living in exile in the forest with his blind, deposed father.\n\nThe sage Narada warned her: Satyavan is noble and good, but he has exactly one year to live. Marry anyone else. Savitri said: I have chosen once. I will not choose again. She married him knowing the expiration date.\n\nFor a year, she lived in the forest. She served Satyavan's parents. She loved her husband with the specific tenderness of someone counting days. She said nothing about the prophecy. She carried the knowledge alone.\n\nOn the day Satyavan was fated to die, she insisted on accompanying him into the forest to gather wood. He collapsed mid-swing of his axe. And then Yama appeared — the god of death himself, dark and enormous, carrying the noose with which he extracts souls from bodies.\n\nYama bound Satyavan's soul and began walking south, toward the realm of the dead. What Savitri did next is without parallel in Indian mythology: she followed. Not screaming. Not begging. She simply walked behind death, step for step, and began to talk.\n\nShe spoke about dharma — about duty, righteousness, and the nature of devotion. She spoke so precisely, so clearly, with such depth of understanding, that Yama was impressed. He offered her boons — anything except her husband's life. She asked for her father-in-law's sight to be restored. Granted. She asked for his kingdom to be returned. Granted. She asked for her own father to have sons. Granted.\n\nThen she asked for a final boon: that she herself would be the mother of Satyavan's children. Yama granted it without thinking — and then realised. She could not bear Satyavan's children if Satyavan was dead. He had been outwitted by the precision of her love.\n\nYama laughed, released Satyavan's soul, and said: in all the ages of the world, I have never met anyone like you. Satyavan woke in the forest as if from a nap. They walked home together.\n\nThe Mahabharata frames this not as a miracle or a fairy tale. It frames it as what happens when someone chooses with absolute clarity and then refuses every substitute. Savitri did not fight death with weapons or magic. She fought with the one thing she had: the completeness of her commitment and the precision of her mind.", connect: "The relationships that last are usually the ones where someone chose deliberately — not by default, not by convenience, but with full knowledge of the cost.", teaching: "Love chosen fully, with eyes open to the cost, is fundamentally different from love that simply happened.", themes: ["devotion", "persistence", "choosing"] },
      { id: "orpheus-eurydice", title: "Orpheus Looks Back", hook: "He went to the underworld for her. He failed at the last step.", source: "Greek Myth", tradition: "Greek Mythology", character: "Orpheus", readMin: 6, body: "Orpheus was the greatest musician who ever lived. When he played his lyre, rivers paused mid-flow. Trees uprooted themselves and walked closer. Wild animals lay down beside each other. The entire natural world stopped to listen.\n\nHe married Eurydice, a nymph, and for a brief time they were completely happy. Then, on a walk through a meadow, Eurydice stepped on a snake. It bit her. She died almost instantly. Orpheus held her body and played a lament so sorrowful that the gods themselves wept.\n\nBut Orpheus did not accept her death. He took his lyre and walked to the entrance of the underworld — a cave at the edge of the known world where the living are not meant to go. He walked past Cerberus, the three-headed dog, playing music that put all three heads to sleep. He crossed the river Styx. He walked through the fields of the dead.\n\nWhen he reached Hades and Persephone, the king and queen of the dead, he played. He sang about love and loss and the cruelty of a world that gives you something perfect and then takes it away. Persephone began to cry. Hades, who had not felt emotion in millennia, felt something move in his chest.\n\nThey agreed to release Eurydice. One condition: Orpheus must walk out of the underworld with Eurydice following behind him. He must not look back until they are both standing in sunlight. If he looks back, she returns to the dead forever.\n\nOrpheus began the walk. He could hear his own footsteps on the stone. He could hear nothing behind him. Was she there? Was this a trick? The silence pressed against him. Each step forward was an act of trust with no evidence to support it.\n\nHe walked through the darkness. He climbed toward the light. He could see the entrance ahead — daylight, the living world, the end of the nightmare. He stepped into the sun.\n\nAnd he turned.\n\nEurydice was still in shadow. One step behind. One step from life. Their eyes met. She reached for him. And she was pulled back, dissolving into darkness, gone forever.\n\nThe myth never explains why he looked. Was it doubt? Was it love so desperate it couldn't wait one more second? Was it the simple human inability to trust what you cannot verify? Every interpretation reveals something about the person interpreting it.\n\nOrpheus spent the rest of his life wandering, playing songs of loss so beautiful that they became the foundation of every love song, every elegy, every piece of music ever written about missing someone who is not coming back.", connect: "Love sometimes asks you to trust without checking — to walk forward without proof that the person you love is still behind you. That is the hardest thing love ever asks. And the moments where you need to keep walking are the moments that determine everything.", teaching: "Walking forward without looking back takes more strength than holding on. Sometimes love requires you to trust what you cannot verify.", themes: ["trust", "loss", "doubt"] },
      { id: "rumi-wound", title: "Rumi and the Wound", hook: "The crack isn't the problem. It's where light enters.", source: "Sufi Poetry", tradition: "Sufi Tradition", character: "Rumi", readMin: 6, body: "Before the wound, Rumi was a respected scholar. He taught Islamic jurisprudence in Konya. He had students, a family, a position. His life was orderly, productive, and — though he would not have admitted it — somewhat contained.\n\nThen Shams of Tabriz arrived and pulled a thread that unravelled everything. Their friendship was so intense, so all-consuming, that Rumi's students grew jealous and his family grew concerned. This was not normal behaviour for a distinguished professor. He was neglecting his duties. He was spending all his time with a wandering mystic who had no credentials, no institution, no respect for social conventions.\n\nWhen Shams disappeared — most likely murdered by Rumi's own students — Rumi's grief was total. He searched for Shams for years. He travelled to Damascus repeatedly. He called out to him in the streets. He was, by any clinical measure, devastated.\n\nFrom that devastation came sixty-five thousand verses of poetry. From the wound came the Masnavi, six volumes of spiritual teaching that have been compared to the Quran in their depth. From the loss came some of the most profound writing about love, longing, and the nature of connection in any language, in any century.\n\nRumi wrote: the wound is the place where the light enters you. This is not metaphor. This is a description of his own experience. Before Shams, Rumi was full — full of knowledge, full of certainty, full of his own competence. The wound emptied him. And in the emptiness, something far larger than scholarly knowledge poured in.\n\nThe line has become one of the most quoted in all of literature, and it is frequently misunderstood. People take it to mean that pain is secretly good, or that suffering has a purpose, or that everything happens for a reason. Rumi is not saying any of that. He is saying something more specific and more honest: that the places where you have been broken open are the places where you have the most capacity. Not because the breaking was good. But because the breaking created space.\n\nA heart that has never been wounded is also a heart that has never been fully open. A person who has never lost something important is also a person who has never loved with the kind of intensity that makes loss possible. The wound and the capacity are the same opening, seen from different sides.", connect: "The parts of love that hurt you are not separate from the parts that changed you. They are often the same experience, viewed from different moments in time.", teaching: "The wound is not proof that love failed. It is proof that love reached deep enough to change something permanently.", themes: ["pain", "growth", "vulnerability"] },
      { id: "lakshman-line", title: "Lakshman Draws the Line", hook: "He couldn't stay. So he left the best protection he could.", source: "Ramayana", tradition: "Indian Epic", character: "Lakshman", readMin: 5, body: "Lakshman was Rama's younger brother. When Rama was exiled to the forest for fourteen years, Lakshman went with him. When Rama's wife Sita was taken, Lakshman fought beside him. He was the constant — the person who showed up for every crisis without being asked, who gave up his own comfort without making it about himself.\n\nDuring their time in the forest, a moment came when Lakshman had to leave Sita alone. Rama was chasing what appeared to be a golden deer — actually a demon in disguise — and called for help. Lakshman was torn. His brother needed him. But leaving Sita unprotected felt wrong.\n\nSita insisted he go. She questioned his loyalty to Rama. The accusation stung — loyalty was the core of everything Lakshman was. He decided to leave.\n\nBut before he went, he took a stick and drew a line in the dirt around the hut where Sita stood. He told her: do not cross this line. As long as you stay inside it, nothing can harm you. The line will protect you.\n\nThis moment — the Lakshman Rekha, as it has been known for centuries — is one of the most debated in the Ramayana. Was it overprotective? Was it controlling? Was it the last act of a person who knew he couldn't be there and tried to leave something in his place?\n\nThe Ramayana treats it with tenderness, not authority. Lakshman was not drawing a boundary to control Sita. He was drawing a boundary because he was about to be absent, and this was the most concrete, physical expression of care he could manage in the time he had. He couldn't stay. He couldn't take her with him. He couldn't guarantee safety. So he drew a line and poured every ounce of protective intention he had into it.\n\nThe tragedy, of course, is that Sita crossed the line. The demon Ravana tricked her into stepping over it, and she was taken. The boundary failed. But the act of drawing it — the impulse to protect what matters even when you know you can't be there — has survived as one of the most recognisable images in Indian culture.\n\nEvery person who has ever set a boundary in a relationship recognises Lakshman's gesture. You cannot control what happens after you leave. But you can make the most specific, honest attempt to protect what you care about before you go.", connect: "Setting a boundary isn't always about saying no. Sometimes it's the most specific way of saying: I care about this, I can't be here to protect it, and this is the best I can do.", teaching: "Boundaries are a form of care, not a form of withdrawal. They are what you leave behind when you have to go.", themes: ["boundaries", "care", "protection"] },
      { id: "nala-return", title: "Nala and the Long Way Back", hook: "He lost everything — including her. Returning took years.", source: "Mahabharata", tradition: "Indian Epic", character: "Nala", readMin: 6, body: "Nala was the king of Nishadha — handsome, just, skilled in horses, and deeply in love with his wife Damayanti. Their love story was famous: Damayanti had chosen Nala at her swayamvara over the gods themselves. Even Indra, Agni, Varuna, and Yama had come to compete for her hand, and she chose the mortal king because of the quality of his heart.\n\nThen Kali, the demon of the age, entered Nala's body. Not as possession in the dramatic sense — more like a slow corruption. Kali found a single moment of ritual impurity and slipped in through the crack. Under Kali's influence, Nala developed an obsession with gambling. He wagered his wealth. His kingdom. Everything.\n\nHe lost it all. The king who had once been the envy of every court in India wandered into the forest with nothing — stripped of crown, wealth, and status. Damayanti went with him. But Nala, consumed by shame and Kali's influence, could not bear for her to see him like this. One night while she slept, he took half of her garment for clothing, left the other half covering her, and walked away into the darkness.\n\nHe wandered for years. He was bitten by a serpent whose venom transformed his appearance — he became unrecognisable, a stooped, dark-skinned man named Bahuka. He found work as a charioteer for another king, driving horses for someone else instead of commanding armies.\n\nDamayanti searched for him. She sent messengers across every kingdom. She never stopped believing he was alive. Eventually she devised a test: she announced a second swayamvara, knowing that Nala — wherever he was, whatever he looked like — would come. No man who truly loved his wife could stay away while she chose another husband.\n\nNala came. He came as Bahuka the charioteer, unrecognisable, stooped, broken. But Damayanti recognised him — not by appearance but by the way he drove the chariot, with the specific skill that was uniquely his.\n\nThe reunion was not instant or clean. Nala had to explain why he left. Damayanti had to decide whether to forgive. The serpent's venom was reversed. Kali was expelled. The kingdom was eventually won back in a final game of dice.\n\nBut the Mahabharata is careful about what it emphasises. The story is not about the reunion. It is about the years between the leaving and the return — the years when Nala had to learn who he was without a crown, without beauty, without the identity that had defined him. He could not return to Damayanti as the broken man who left. He had to become someone who could stand beside her again. That becoming took years, and it could not be rushed.", connect: "Some relationship pain isn't about what went wrong between two people. It's about what one or both people still need to become before the relationship can hold them again.", teaching: "The work of returning to someone often requires first returning to yourself. That work cannot be skipped or hurried.", themes: ["separation", "rebuilding", "patience"] },
    ],
  },
  {
    id: "alone", title: "Carrying it alone", subtitle: "Loneliness & invisible strength",
    intro: "The loneliness of no one seeing what you're actually going through.",
    accent: "#7d93a8", accentLight: "#dce5ef",
    stories: [
      { id: "ekalavya-alone", title: "Ekalavya Practises Alone", hook: "No teacher, no audience. He showed up every day.", source: "Mahabharata", tradition: "Indian Epic", character: "Ekalavya", readMin: 4, body: "No teacher, no classmates, no one watching. He practised every day in the forest.\n\nThe Mahabharata frames this as a different kind of strength — the kind that builds when there's no one to perform for.", connect: "Sometimes what happens when no one is watching can't happen any other way.", teaching: "Some growth only comes in the absence of an audience.", themes: ["isolation", "discipline", "self-reliance"] },
      { id: "atlas-sky", title: "Atlas Holds the Sky", hook: "He can't put it down. He holds it anyway.", source: "Greek Myth", tradition: "Greek Mythology", character: "Atlas", readMin: 4, body: "Atlas holds up the sky for eternity. He can't rest. He can't ask someone else.\n\nAnyone who's been the person holding everything together recognises him immediately.", connect: "If you're the person everyone leans on and no one checks on — this is yours.", teaching: "Carrying something no one sees doesn't mean you're carrying nothing.", themes: ["burden", "invisible-strength", "responsibility"] },
      { id: "urmila-wait", title: "Urmila's Silent Years", hook: "Fourteen years alone. The epic barely mentions her.", source: "Ramayana", tradition: "Indian Epic", character: "Urmila", readMin: 4, body: "Lakshman went to the forest. Urmila stayed behind. Fourteen years. The Ramayana barely mentions her.\n\nHer sacrifice was completely invisible — and she made it anyway.", connect: "Some of the loneliest positions are where even the loneliness goes unnoticed.", teaching: "Carrying something alone is hardest when no one knows.", themes: ["invisible-sacrifice", "waiting", "unseen"] },
      { id: "aurelius-night", title: "Marcus Aurelius Writes at Night", hook: "The most powerful man alive — and no one to be honest with.", source: "Meditations", tradition: "Stoic Philosophy", character: "Marcus Aurelius", readMin: 5, body: "Emperor of Rome. At night, alone, he wrote reminders to himself — stay kind, stay honest. Not for publication.\n\nThe private notes of a man who had everything and still needed to talk himself through each day.", connect: "Loneliness sometimes comes from having no one you can be honest with.", teaching: "The work of staying honest with yourself is almost always done alone.", themes: ["solitude", "honesty", "inner-work"] },
      { id: "mustard-seed", title: "Every House Has Known This", hook: "She carried her dead child door to door.", source: "Buddhist Parable", tradition: "Buddhism", character: "Kisa Gotami", readMin: 5, body: "Her child died. She went house to house looking for medicine. The Buddha said: bring a mustard seed from a house where no one has died.\n\nEvery family had their own loss. The loneliness of her grief shifted.", connect: "Part of what makes it bearable is realising every house carries something.", teaching: "You are not the only one carrying this.", themes: ["grief", "shared-suffering", "connection"] },
    ],
  },
  {
    id: "noise", title: "The noise inside your head", subtitle: "Overthinking & quiet",
    intro: "The mind is excellent at generating thoughts. Less good at knowing when to stop.",
    accent: "#6b8f9e", accentLight: "#d7e7eb",
    stories: [
      { id: "krishna-question", title: "Krishna's One Question", hook: "Arjuna's mind ran everywhere. Krishna asked only one thing.", source: "Bhagavad Gita", tradition: "Indian Epic", character: "Krishna", readMin: 4, body: "Arjuna's mind ran everywhere — guilt, dharma, consequences.\n\nKrishna asked: what is actually yours to do right now? That cut through everything.", connect: "Overthinking means you're trying to solve everything at once.", teaching: "One clear action is worth more than a thousand thoughts about every outcome.", themes: ["clarity", "action", "present-moment"] },
      { id: "seneca-time", title: "Seneca on Wasted Time", hook: "Life isn't short. We waste too much of it.", source: "On the Shortness of Life", tradition: "Stoic Philosophy", character: "Seneca", readMin: 4, body: "It's not that we have a short time to live, but that we waste a great deal of it.\n\nThe overthinking mind lives in places that don't exist yet or don't exist anymore.", connect: "The present is the only place where anything can actually change.", teaching: "Anxiety lives in the future. Regret in the past. You can only act now.", themes: ["time", "worry", "present-moment"] },
      { id: "chop-wood", title: "Chop Wood, Carry Water", hook: "Before and after enlightenment — the same. But different.", source: "Zen Saying", tradition: "Zen Buddhism", character: "Zen Tradition", readMin: 3, body: "What did you do before enlightenment? Chopped wood, carried water. After? Same.\n\nWhat changed? Before, I chopped wood thinking about water. Now I chop wood when I chop wood.", connect: "The noise is about being in one place while your mind is in another.", teaching: "Doing one thing while thinking about another is the root of most mental noise.", themes: ["presence", "simplicity", "mindfulness"] },
      { id: "hanuman-fly", title: "Hanuman Forgets He Can Fly", hook: "He had the power. He'd just forgotten.", source: "Ramayana", tradition: "Indian Epic", character: "Hanuman", readMin: 4, body: "Everyone said the ocean crossing was impossible. Hanuman had the power — but had forgotten. An elder asked: do you not know what you carry?\n\nThat was enough. He leapt.", connect: "Fear often means you've temporarily forgotten what you know about yourself.", teaching: "What you know about yourself is larger than this fear.", themes: ["self-doubt", "forgotten-strength", "capability"] },
      { id: "ashtavakra-watch", title: "Ashtavakra and the Watcher", hook: "The one watching the thoughts has never been tangled.", source: "Ashtavakra Gita", tradition: "Indian Philosophy", character: "Ashtavakra", readMin: 4, body: "Scholars laughed at his bent body. He laughed back — at people who thought skin and bone were the measure.\n\nHis teaching: you are not your thoughts. You are the one watching them.", connect: "There's a part of you not inside the overthinking. It's the part noticing it.", teaching: "You are the one watching — and that watcher is already still.", themes: ["awareness", "detachment", "stillness"] },
    ],
  },
  {
    id: "identity", title: "Who am I becoming?", subtitle: "Becoming yourself",
    intro: "The hardest question isn't what should I do. It's who am I.",
    accent: "#8b82a8", accentLight: "#e3dcf2",
    stories: [
      { id: "karna-between", title: "Karna Between Two Worlds", hook: "Known by everyone, claimed by no one.", source: "Mahabharata", tradition: "Indian Epic", character: "Karna", readMin: 4, body: "Too noble for servants, too low-born for warriors, too loyal to switch sides.\n\nThe Mahabharata doesn't resolve it. But what it respects is that he chose what he stood for.", connect: "Not knowing where you belong might be an accurate description.", teaching: "Identity comes from deciding what you will stand for regardless.", themes: ["belonging", "between-worlds", "choice"] },
      { id: "theseus-ship", title: "The Ship of Theseus", hook: "If you replace every part, is it still the same?", source: "Greek Paradox", tradition: "Greek Philosophy", character: "Theseus", readMin: 4, body: "They preserved Theseus's ship. Over the years, they replaced every plank. Is it still the same ship?\n\nYour beliefs shift. Your relationships change. At what point are you still the person you were five years ago?", connect: "If you've changed so much you barely recognise yourself — that might just be accurate.", teaching: "Changing completely doesn't mean losing yourself.", themes: ["change", "continuity", "self"] },
      { id: "shiva-outside", title: "Shiva Outside Every Category", hook: "Ascetic who marries. Destroyer who protects.", source: "Puranas", tradition: "Indian Mythology", character: "Shiva", readMin: 4, body: "An ascetic who marries. A destroyer who protects. Stillness and wild dancing.\n\nThe texts don't resolve the contradiction — they celebrate it.", connect: "Not fitting any category might be the most honest description of who you are.", teaching: "The problem is usually the world's categories, not the person.", themes: ["contradiction", "multiplicity", "freedom"] },
      { id: "zhuangzi-butterfly", title: "Zhuangzi and the Butterfly", hook: "Am I a man dreaming I'm a butterfly, or a butterfly dreaming?", source: "Zhuangzi", tradition: "Taoist Philosophy", character: "Zhuangzi", readMin: 3, body: "He dreamed he was a butterfly — happy, unaware of being Zhuangzi. When he woke, he couldn't tell which was real.\n\nHe didn't resolve it. He let it stay open.", connect: "Feeling like different versions of yourself isn't fragmentation. It might be honesty.", teaching: "Identity shifting is not a problem to solve.", themes: ["fluidity", "dreams", "self-knowledge"] },
      { id: "meera-walks", title: "Meera Walks Out", hook: "A queen who chose devotion over everything society offered.", source: "Bhakti Tradition", tradition: "Indian Devotional", character: "Meera", readMin: 4, body: "A queen who sang devotional songs in the street. Her family was humiliated. The court tried to stop her.\n\nShe walked away from a life that looked complete from the outside because it was empty inside.", connect: "Direction that's genuinely yours often looks irresponsible to others.", teaching: "The life that looks wrong from outside can be exactly right from inside.", themes: ["authenticity", "unconventional", "inner-voice"] },
    ],
  },
  {
    id: "grief", title: "When someone is gone", subtitle: "Loss & what remains",
    intro: "Grief doesn't follow a schedule. These stories don't try to fix that.",
    accent: "#8a8078", accentLight: "#e4dfda",
    stories: [
      { id: "rama-searches", title: "Rama Searches", hook: "A god wept openly. The epic didn't call it weakness.", source: "Ramayana", tradition: "Indian Epic", character: "Rama", readMin: 4, body: "When Sita was taken, Rama wept openly. He spoke to trees and rivers asking if they'd seen her.\n\nThe Ramayana treats it as what love looks like when something is genuinely lost.", connect: "Grief that is visible isn't a breakdown. It's honesty.", teaching: "The person who grieves openly is often the more honest one.", themes: ["grief", "openness", "love"] },
      { id: "kunti-late", title: "Kunti Tells the Truth Too Late", hook: "She knew. She said nothing for decades.", source: "Mahabharata", tradition: "Indian Epic", character: "Kunti", readMin: 5, body: "Kunti knew Karna was her son. Said nothing for decades. Watched him be humiliated and killed.\n\nAt his funeral she revealed the truth. The grief wasn't only for his death — it was for all the years before.", connect: "Some grief comes from the time that passed before you said what needed to be said.", teaching: "The grief of what went unsaid is often heavier than the grief of loss.", themes: ["regret", "silence", "too-late"] },
      { id: "orpheus-back", title: "Orpheus Looks Back", hook: "He almost brought her back. Almost.", source: "Greek Myth", tradition: "Greek Mythology", character: "Orpheus", readMin: 4, body: "He was given one chance: lead her out, don't look back.\n\nHe looked back. She vanished. After, he wandered playing songs of loss that became the foundation of all music about grief.", connect: "The urge to look back is not weakness. It's love.", teaching: "Grief that becomes art doesn't betray the loss. It honours it.", themes: ["loss", "permanence", "creating"] },
      { id: "bhima-feels", title: "Bhima Feels Everything", hook: "The strongest brother. The one who cried the most.", source: "Mahabharata", tradition: "Indian Epic", character: "Bhima", readMin: 4, body: "The strongest Pandava and the most openly emotional. He wept. He raged. He carried grief in his body.\n\nThe Mahabharata never treats this as weakness.", connect: "Feeling things fully is what happens when you've actually invested.", teaching: "The person who feels deeply is not weaker. They are more present.", themes: ["feeling", "strength", "tenderness"] },
      { id: "kisa-gotami", title: "Every House Has Known This", hook: "She went door to door. Every family had their own loss.", source: "Buddhist Parable", tradition: "Buddhism", character: "Kisa Gotami", readMin: 5, body: "Her child died. She went house to house. The Buddha said: bring a mustard seed from a house where no one has died.\n\nEvery family had their story. The isolation of her grief shifted.", connect: "The loneliest thing about grief is thinking you're the only one.", teaching: "Grief shared doesn't weigh less. But it becomes something you can carry.", themes: ["shared-grief", "universality", "connection"] },
    ],
  },
];

// ── Recommendation Engine ──
function getStoryForMood(mood: string | null, readH: string[]): { story: Story; col: Collection } | null {
  const priorityCols = MOODS.find(m => m.value === mood)?.collections || [];
  const ordered = priorityCols.length
    ? [...COLLECTIONS].sort((a, b) => { const ai = priorityCols.indexOf(a.id), bi = priorityCols.indexOf(b.id); if (ai !== -1 && bi !== -1) return ai - bi; if (ai !== -1) return -1; if (bi !== -1) return 1; return 0; })
    : COLLECTIONS;
  for (const col of ordered) { const unread = col.stories.find(s => !readH.includes(s.id)); if (unread) return { story: unread, col }; }
  return { story: COLLECTIONS[0].stories[0], col: COLLECTIONS[0] };
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selCol, setSelCol] = useState<Collection | null>(null);
  const [selStory, setSelStory] = useState<Story | null>(null);
  const [chatCtx, setChatCtx] = useState<Story | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [readH, setReadH] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [userName, setUserName] = useState("there");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const stScroll = useRef<HTMLDivElement>(null);

  useEffect(() => { try { const r = localStorage.getItem("solace_r"); if (r) setReadH(JSON.parse(r)); const n = localStorage.getItem("solace_n"); if (n) setUserName(n); } catch {} }, []);
  useEffect(() => { if (readH.length) localStorage.setItem("solace_r", JSON.stringify(readH)); }, [readH]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (stScroll.current) stScroll.current.scrollTop = 0; }, [selStory?.id]);

  const pickMood = (v: string) => setMood(prev => prev === v ? null : v);
  const saveName = (n: string) => { setUserName(n); localStorage.setItem("solace_n", n); };
  const openCol = (c: Collection) => { setSelCol(c); setView("collection"); };
  const openStory = (s: Story, c?: Collection) => { setSelStory(s); if (c) setSelCol(c); setView("story"); if (!readH.includes(s.id)) setReadH(p => [...p, s.id]); };
  const openChat = (s: Story) => { setChatCtx(s); setMsgs([{ role: "bot", text: `You just read "${s.title}." What part felt closest to what you're going through?` }]); setView("chat"); };
  const goHome = () => { setView("home"); setSelCol(null); setSelStory(null); };
  const goBack = () => { if (selCol && view === "story") { setView("collection"); setSelStory(null); } else goHome(); };

  const send = async () => {
    if (!input.trim()) return;
    const msg = input; setInput("");
    setMsgs(p => [...p, { role: "user", text: msg }, { role: "bot", text: "", typing: true }]);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, history: msgs.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })), story_context: chatCtx ? { title: chatCtx.title, character: chatCtx.character, source: chatCtx.source, tradition: chatCtx.tradition, connect: chatCtx.connect, teaching: chatCtx.teaching } : null }) });
      const data = await res.json(); const full = data.reply || "Tell me more.";
      let i = 0;
      const iv = setInterval(() => { i += 2; setMsgs(p => { const u = [...p]; const l = { ...u[u.length-1] }; l.text = full.slice(0, i); if (i >= full.length) l.typing = false; u[u.length-1] = l; return u; }); if (i >= full.length) clearInterval(iv); }, 12);
    } catch { setMsgs(p => { const u = [...p]; u[u.length-1] = { role: "bot", text: "Something went wrong.", typing: false }; return u; }); }
  };

  const rec = getStoryForMood(mood, readH);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const sortedCols = mood ? (() => { const pri = MOODS.find(m => m.value === mood)?.collections || []; return [...COLLECTIONS].sort((a, b) => { const ai = pri.indexOf(a.id), bi = pri.indexOf(b.id); if (ai !== -1 && bi !== -1) return ai - bi; if (ai !== -1) return -1; if (bi !== -1) return 1; return 0; }); })() : COLLECTIONS;

  // ── Mood tint colors for active state ──
  const moodTints: Record<string, { bg: string; border: string; text: string }> = {
    heavy: { bg: "#ece8e4", border: "#8b7e74", text: "#5c5147" },
    restless: { bg: "#ece6ea", border: "#9a8c98", text: "#6b5d68" },
    hopeful: { bg: "#e4ece8", border: "#7d9b8a", text: "#4d6b5a" },
    tender: { bg: "#ece4e6", border: "#b07d7d", text: "#7a5252" },
    lost: { bg: "#e8e4f0", border: "#8b82a8", text: "#5c5478" },
    calm: { bg: "#e4e8f0", border: "#7d93a8", text: "#4d6178" },
  };

  // ── Header ──
  const Header = ({ back }: { back?: boolean }) => (
    <div className="w-full flex items-center px-5 md:px-8 h-14 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <button onClick={goHome} className="flex items-center gap-2.5">
        {back && <span className="mr-0.5" style={{ color: "var(--text-muted)" }}>←</span>}
        <div className="w-3.5 h-3.5 rounded-sm rotate-45" style={{ background: "var(--text-primary)" }}>
          <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--bg-primary)" }} /></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] font-semibold tracking-tight leading-none">Solace</span>
        </div>
      </button>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  //  HOME — 100vh immersive hero (polished)
  // ═════════════════════════════════════════════════════════════
  if (view === "home") return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Header />

      <div className="flex-1 flex flex-col overflow-auto md:overflow-hidden">
        <div className="max-w-[960px] w-full mx-auto px-5 md:px-8 flex flex-col flex-1">

          {/* ── Greeting + Mood ── */}
          <div className="pt-5 md:pt-7 pb-4 md:pb-5 shrink-0 animate-fadeIn">
            <h1 className="text-[1.3rem] md:text-[1.45rem] font-semibold tracking-tight leading-snug" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {greeting},{" "}
              {userName === "there"
                ? <span onClick={() => { const n = prompt("What should Solace call you?"); if (n?.trim()) saveName(n.trim()); }} className="cursor-pointer" style={{ borderBottom: "1px dashed var(--text-muted)" }}>friend</span>
                : userName}
            </h1>
            <p className="text-[13px] mt-1.5 mb-4" style={{ color: "var(--text-secondary)", letterSpacing: "0.005em" }}>How are you feeling right now?</p>

            {/* Mood pills — calm, intentional interactions */}
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map(m => {
                const isActive = mood === m.value;
                const tint = moodTints[m.value] || moodTints.calm;
                return (
                  <button key={m.value} onClick={() => pickMood(m.value)}
                    className="px-3.5 py-[6px] rounded-full text-[11.5px] font-medium"
                    style={{
                      background: isActive ? tint.bg : "transparent",
                      color: isActive ? tint.text : "var(--text-muted)",
                      border: `1px solid ${isActive ? tint.border : "var(--border-default)"}`,
                      boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                      transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Two-column hero ── */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 pb-3 md:pb-4">

            {/* LEFT: Featured Story */}
            {rec && (
              <div className="md:col-span-5 flex" key={rec.story.id}>
                <div className="animate-storyReveal flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: "var(--bg-elevated)", boxShadow: "0 1px 3px rgba(28,25,23,0.05), 0 4px 16px rgba(28,25,23,0.04)", border: "1px solid var(--border-subtle)" }}>
                  {/* Accent */}
                  <div className="h-[2px] shrink-0" style={{ background: rec.col.accent }} />

                  <div className="flex-1 flex flex-col justify-between p-5 md:p-6 overflow-hidden">
                    <div>
                      {/* Emotional context */}
                      <p className="text-[9.5px] tracking-[0.15em] uppercase font-medium mb-5" style={{ color: rec.col.accent, letterSpacing: "0.15em" }}>
                        {mood ? `— For when you feel ${mood}` : `— Today's story`}
                      </p>

                      {/* Title */}
                      <h2 className="text-[1.3rem] md:text-[1.4rem] font-semibold leading-snug mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {rec.story.title}
                      </h2>

                      {/* Hook */}
                      <p className="text-[13.5px] leading-[1.75] mb-4" style={{ color: "var(--text-body)" }}>
                        {rec.story.hook}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{rec.story.source}</span>
                        <span className="text-[8px]" style={{ color: "var(--text-muted)" }}>·</span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{rec.story.readMin} min read</span>
                      </div>

                      {/* Why this story — refined divider */}
                      <div className="py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <p className="text-[8.5px] tracking-[0.14em] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Why this story</p>
                        <p className="text-[12px] italic leading-[1.65]" style={{ color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{rec.story.connect}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-3">
                      <button onClick={() => openStory(rec.story, rec.col)}
                        className="px-5 py-2.5 rounded-xl text-[12.5px] font-semibold"
                        style={{
                          background: "var(--cta-primary)",
                          color: "#ffffff",
                          transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                          boxShadow: "0 1px 3px rgba(68,105,93,0.2)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 3px 8px rgba(68,105,93,0.25)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(68,105,93,0.2)"; }}
                      >
                        Read this story →
                      </button>
                      {mood && (
                        <p className="text-[9px] mt-2.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                          <span className="w-[3px] h-[3px] rounded-full inline-block" style={{ background: rec.col.accent }} />
                          Chosen for you
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT: Collections */}
            <div className="md:col-span-7 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2.5 shrink-0">
                <p className="text-[10.5px] tracking-[0.04em]" style={{ color: "var(--text-muted)" }}>
                  {mood ? "Stories for you" : "Explore collections"}
                </p>
                <div className="hidden md:block"><EyeFollower color="var(--text-muted)" size={50} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1 min-h-0" style={{ gridAutoRows: "1fr" }}>
                {sortedCols.map((c, i) => (
                  <button key={c.id} onClick={() => openCol(c)}
                    className="animate-fadeIn text-left rounded-2xl p-3 md:p-3.5 flex flex-col cursor-pointer"
                    style={{
                      background: c.accentLight,
                      border: `1px solid ${c.accent}15`,
                      animationDelay: `${(i+1)*0.02}s`,
                      transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = c.accent + "30"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = c.accent + "15"; }}
                  >
                    <div className="mb-2 shrink-0"><ColIcon id={c.id} size={16} /></div>
                    <p className="text-[11px] font-semibold leading-snug" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{c.title}</p>
                    <p className="text-[9px] mt-0.5 leading-[1.45]" style={{ color: "var(--text-secondary)" }}>{c.subtitle}</p>
                    <p className="text-[8.5px] mt-auto pt-1.5 italic leading-[1.45]" style={{ color: c.accent, opacity: 0.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{c.intro.split(".")[0]}.</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 text-center pb-3 text-[9px] tracking-[0.06em]" style={{ color: "var(--text-muted)" }}>Not advice. Not answers. Space.</div>
        </div>
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  //  COLLECTION — A carefully assembled shelf
  // ═════════════════════════════════════════════════════════════
  if (view === "collection" && selCol) {
    const totalMin = selCol.stories.reduce((a, s) => a + s.readMin, 0);
    const themeWords = selCol.stories.flatMap(s => s.themes).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(", ");

    return (
      <div className="h-screen overflow-hidden flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <Header back />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[728px] mx-auto px-5 md:px-6 py-8">

            {/* ── Collection Hero ── */}
            <div className="animate-fadeIn rounded-2xl p-6 md:p-7 mb-6" style={{ background: selCol.accentLight }}>
              <div className="mb-4"><ColIcon id={selCol.id} size={32} /></div>

              {/* Category label */}
              <p className="text-[10px] tracking-[0.14em] uppercase font-medium mb-2" style={{ color: selCol.accent }}>{selCol.id.replace("-", " ")}</p>

              {/* Title */}
              <h2 className="text-[1.4rem] font-semibold tracking-tight leading-snug mb-3" style={{ color: "var(--text-primary)" }}>{selCol.title}</h2>

              {/* Extended intro */}
              <p className="text-[14px] leading-[1.75] mb-5" style={{ color: "var(--text-body)" }}>{selCol.intro}</p>

              {/* Meta row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{selCol.stories.length} Stories</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>·</span>
                <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{totalMin} min total</span>
              </div>

              {/* Emotional descriptor */}
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>For moments of:</span>
                <span className="text-[10.5px] italic" style={{ color: selCol.accent }}>{themeWords}</span>
              </div>
            </div>

            {/* ── Story List ── */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{selCol.stories.length} stories</p>
              <EyeFollower color={selCol.accent} size={50} />
            </div>
            <div className="space-y-2.5">
              {selCol.stories.map((s, i) => {
                const isFirst = i === 0 && !readH.includes(s.id);
                const isRead = readH.includes(s.id);
                return (
                  <div key={s.id} className="animate-slideIn" style={{ animationDelay: `${(i+1)*0.04}s` }}>
                    {/* Recommended starting point label */}
                    {isFirst && (
                      <p className="text-[9.5px] tracking-[0.1em] uppercase font-medium mb-1.5 ml-1" style={{ color: selCol.accent }}>
                        ✦ Recommended starting point
                      </p>
                    )}
                    <button onClick={() => openStory(s)}
                      className="w-full text-left rounded-xl px-5 py-4 transition-all hover:shadow-md group"
                      style={{
                        background: "var(--bg-elevated)",
                        border: isFirst ? `1.5px solid ${selCol.accent}40` : "1px solid var(--border-subtle)",
                        boxShadow: isFirst ? "0 2px 12px rgba(0,0,0,0.05)" : "var(--shadow-sm)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 rounded-full shrink-0 self-stretch group-hover:opacity-100 transition-opacity" style={{ background: selCol.accent, opacity: isFirst ? 0.8 : 0.35, minHeight: "100%" }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</p>
                            {isRead && <span className="text-[8.5px] px-1.5 py-0.5 rounded-full shrink-0" style={{ color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>read</span>}
                          </div>
                          {/* Emotional hook — the pull */}
                          <p className="text-[13px] leading-[1.65] mb-2" style={{ color: "var(--text-body)" }}>{s.hook}</p>
                          {/* Meta */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.tradition}</span>
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>·</span>
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.readMin} min</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════
  //  STORY READING — Letter, not article
  // ═════════════════════════════════════════════════════════════
  if (view === "story" && selStory) {
    const paras = selStory.body.split(/\n\n+/).filter(Boolean);
    const cs = selCol?.stories || []; const idx = cs.findIndex(s => s.id === selStory.id);
    const next = idx >= 0 && idx < cs.length - 1 ? cs[idx + 1] : null;
    return (
      <div className="h-screen overflow-hidden flex flex-col" style={{ background: "var(--bg-secondary)" }}>
        <Header back />
        <div ref={stScroll} className="flex-1 overflow-y-auto">
          <div className="max-w-[728px] mx-auto px-4 md:px-6 py-6 md:py-8">

            {/* ── Story Surface ── */}
            <div className="rounded-2xl p-6 md:p-9" style={{ background: "var(--bg-story)", boxShadow: "var(--shadow-card)" }}>

              {/* Header — quiet, metadata-first */}
              <div className="animate-fadeIn mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ background: selCol?.accent, opacity: 0.5 }} />
                  <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "var(--text-muted)" }}>{selStory.tradition}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>·</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{selStory.source}</span>
                  <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>{selStory.readMin} min</span>
                </div>
                <p className="text-[10px] tracking-[0.12em] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>{selStory.character}</p>
                <h2 className="text-[1.4rem] md:text-[1.6rem] font-semibold tracking-tight leading-snug" style={{ color: "var(--text-primary)" }}>{selStory.title}</h2>
              </div>

              {/* Divider */}
              <div className="w-10 h-px mb-8" style={{ background: "var(--border-default)" }} />

              {/* Story body — generous breathing room */}
              <div className="space-y-6 mb-10">
                {paras.map((p, i) => (
                  <p key={i} className="text-[17px] leading-[2] font-light tracking-[0.005em] animate-fadeIn" style={{ animationDelay: `${(i+1)*0.07}s`, color: "var(--text-body)" }}>{p}</p>
                ))}
              </div>

              {/* ── Sacred: How This Connects ── */}
              <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
                {/* Top rule */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
                  <span className="text-[9px] tracking-[0.18em] uppercase font-medium shrink-0" style={{ color: selCol?.accent }}>How this connects to you</span>
                  <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
                </div>

                {/* The insight — centered, spacious */}
                <div className="px-2 md:px-6 py-4 text-center">
                  <p className="text-[16.5px] leading-[1.85] italic" style={{ color: "var(--text-primary)" }}>{selStory.connect}</p>
                </div>

                {/* Bottom rule */}
                <div className="h-px" style={{ background: "var(--border-default)" }} />
              </div>

              {/* Teaching — the quiet takeaway */}
              <div className="mt-8 animate-fadeIn flex gap-3" style={{ animationDelay: "0.35s" }}>
                <div className="w-[3px] rounded-full shrink-0" style={{ background: selCol?.accent, opacity: 0.3 }} />
                <p className="text-[15px] italic leading-[1.85]" style={{ color: "var(--text-secondary)" }}>{selStory.teaching}</p>
              </div>
            </div>

            {/* ── Reflection Transition ── */}
            <div className="mt-8 mb-6 text-center animate-fadeIn" style={{ animationDelay: "0.45s" }}>
              <p className="text-[13px] italic mb-1" style={{ color: "var(--text-secondary)" }}>Take a moment.</p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>What part of this stayed with you?</p>
            </div>

            {/* ── End-of-Story Experience ── */}
            <div className="space-y-2.5 animate-fadeIn" style={{ animationDelay: "0.5s" }}>

              {/* Reflect with Solace */}
              <button onClick={() => openChat(selStory)} className="w-full py-4 px-5 rounded-2xl text-[14px] font-medium text-left flex items-center gap-4 transition-all duration-200 hover:scale-[1.01]" style={{ background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", color: "#f5f5f4", boxShadow: "0 4px 16px rgba(28,25,23,0.12)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>✦</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Reflect on this with Solace</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(245,245,244,0.4)" }}>AI conversation about this story</p>
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
              </button>

              {/* Next story */}
              {next && (
                <button onClick={() => openStory(next)} className="w-full py-3.5 px-5 rounded-2xl text-[14px] font-medium text-left flex items-center gap-4 transition-all duration-200 hover:shadow-md" style={{ background: "#fdf8ef", border: "1.5px solid #f0e6d0", color: "var(--text-primary)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#f5eddb" }}>
                    <span className="text-[12px]" style={{ color: "#b8976e" }}>✦</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Continue reading</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{next.title} — {next.tradition}</p>
                  </div>
                  <span style={{ color: "#d4c4a8" }}>→</span>
                </button>
              )}

              {/* Back */}
              <button onClick={goBack} className="w-full py-2.5 text-center text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                ← Back to collection
              </button>
            </div>

            <div className="h-8" />
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════
  //  CHAT — Post-story reflection conversation
  // ═════════════════════════════════════════════════════════════
  if (view === "chat") {
    return (
      <div className="h-screen overflow-hidden flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <Header back />
        {chatCtx && (
          <div className="px-5 md:px-8 py-2.5" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="max-w-[540px] mx-auto flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--cta-primary)", opacity: 0.4 }} />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Reflecting on: <em style={{ color: "var(--text-secondary)" }}>{chatCtx.title}</em></span>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[540px] mx-auto px-5 md:px-8 py-6 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" ? (
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
                    {m.typing && !m.text ? (
                      <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>Thinking
                        <div className="flex gap-1">{[0,.3,.6].map(d=><div key={d} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--text-muted)", animationDelay: `${d}s` }}/>)}</div>
                      </div>
                    ) : <p className="text-[14px] leading-[1.85] font-light" style={{ color: "var(--text-body)" }}>{m.text}</p>}
                  </div>
                ) : (
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-[14px] leading-[1.85]" style={{ color: "var(--text-primary)" }}>{m.text}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        </div>
        <div className="shrink-0" style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-subtle)" }}>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="max-w-[540px] mx-auto px-5 md:px-8 py-3">
            <div className="relative rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(28,25,23,0.04) 0%, rgba(28,25,23,0.02) 100%)", border: "1px solid var(--border-default)", boxShadow: "0 0 0 3px rgba(28,25,23,0.02)" }}>
              <div className="flex items-center gap-2 pl-4">
                <span className="text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>✦</span>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Share what's on your mind…" className="flex-1 bg-transparent py-3.5 pr-4 text-[14px] font-light focus:outline-none" style={{ color: "var(--text-primary)" }} />
                <button type="submit" className="mr-2 w-8 h-8 rounded-xl flex items-center justify-center text-[13px] shrink-0 transition-all hover:scale-105" style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}>→</button>
              </div>
            </div>
            <p className="text-center text-[10px] mt-2 mb-1" style={{ color: "var(--text-muted)" }}>Solace reflects, it doesn't advise</p>
          </form>
        </div>
      </div>
    );
  }
  return null;
}
