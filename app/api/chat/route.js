import OpenAI from "openai";

// ═══════════════════════════════════════════════════════════════════════════════
//  ANANDA — COMPLETE INTENT FRAMEWORK  (Pure JavaScript — no TypeScript)
//  Indian Mythology Wisdom + Psychology Layer
//
//  Pipeline:
//  1. Pre-processing  → crisis keywords, vague input, out-of-scope (rule-based)
//  2. Classification  → intent + severity + emotion + flags  (LLM)
//  3. Escalation      → severity adjustment from loop / pattern signals
//  4. Safety gate     → L4 always exits here, hardcoded response
//  5. Mythology match → intent → scripture figure + story + teaching
//  6. Psychology map  → intent → therapeutic approach + technique
//  7. Response gen    → assembled system prompt → GPT → reply
//  8. Meta return     → structured metadata for frontend
// ═══════════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 1 — INTENT PRIORITY ORDER
//  Higher-severity intents are classified first.
//  Crisis always checked before surface-level intents.
// ═══════════════════════════════════════════════════════════════════════════════

const INTENT_PRIORITY_ORDER = [
  // P0 — Always check first. Non-negotiable exit to safety.
  "Crisis",

  // P1 — High emotional weight. Escalation risk.
  "Grief & Loss",
  "Trauma Echo",
  "Emotional Distress",
  "Anxiety & Fear",
  "Anger & Resentment",

  // P2 — Identity and self-perception layer.
  "Self-Worth & Shame",
  "Identity Crisis",
  "Loneliness & Isolation",
  "Burnout",

  // P3 — Life navigation. Most common use case.
  "Overthinking",
  "Life Direction",
  "Career Confusion",
  "Motivation & Stagnation",
  "Family Pressure",
  "Relationship Issues",
  "Toxic Environment",

  // P4 — Philosophical / comparative / growth.
  "Comparison & Envy",
  "Existential Questioning",

  // P5 — Positive or off-topic. Handled gracefully.
  "Gratitude & Positive Sharing",
  "Out-of-Scope",
];


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 2 — MYTHOLOGY KNOWLEDGE BASE
//
//  Sources: Bhagavad Gita, Mahabharata, Valmiki Ramayana,
//           Katha Upanishad, Bhagavata Purana, Yoga Vasistha.
//
//  Each entry: a figure whose story directly mirrors that intent's
//  psychological state. Used to ground the model's response in
//  specific, authentic story — not generic "Gita wisdom."
// ═══════════════════════════════════════════════════════════════════════════════

const MYTHOLOGY_MAP = {

  "Life Direction": {
    figure: "Arjuna",
    source: "Bhagavad Gita",
    text:   "Bhagavad Gita, Chapter 2-3",
    era:    "Mahabharata",
    context:
      "Arjuna — the greatest archer alive — stood between two armies and dropped his bow. Not from cowardice, but from the paralysis of loving too many things at once: his teachers, his cousins, his idea of what a good person is. Krishna did not give him a map or a guaranteed outcome. He gave him one thing: act from your dharma, release the attachment to outcome. Arjuna's confusion was not the problem. It was the doorway.",
    teaching:
      "The path forward rarely becomes clear before you step. Clarity comes through aligned action, not from waiting until doubt disappears.",
    prompt_instruction:
      "Use Arjuna's paralysis as a mirror — not as a solution. The user is not weak for being stuck. They are at their own Kurukshetra.",
  },

  "Career Confusion": {
    figure: "Ekalavya",
    source: "Mahabharata",
    text:   "Mahabharata, Adi Parva",
    era:    "Mahabharata",
    context:
      "Ekalavya was refused by Dronacharya — the greatest teacher of his age. Wrong caste, wrong background. So he built a clay idol of Drona and taught himself. He became extraordinary without the conventional path. The Mahabharata holds his story not as tragedy but as testament: the path is not always the one handed to you.",
    teaching:
      "Career confusion often means you are between identities — the one you were trained for and the one calling you. The absence of a clear path is sometimes an invitation to build your own.",
    prompt_instruction:
      "Don't push the user toward a decision. Help them see that confusion is the in-between space of becoming. Ask what they've always moved toward, even without permission.",
  },

  "Overthinking": {
    figure: "Nachiketa",
    source: "Katha Upanishad",
    text:   "Katha Upanishad, Chapters 1-2",
    era:    "Upanishadic period",
    context:
      "Nachiketa sat outside Death's door for three full days — unanswered, unfed, alone. He did not spiral. He waited. When Yama arrived and offered riches, pleasure, kingdoms — Nachiketa refused them all. He said: these are temporary, tell me what the self is beneath all this noise. The Upanishad's deepest teaching: the overthinking mind is searching for ground that thought itself cannot provide.",
    teaching:
      "Overthinking is the mind trying to think its way to certainty that only stillness can offer. You cannot solve your way to peace.",
    prompt_instruction:
      "Gently name the loop. Use Nachiketa's stillness as a model — not of detachment, but of choosing what truly matters over the noise of options.",
  },

  "Anxiety & Fear": {
    figure: "Hanuman before the ocean",
    source: "Valmiki Ramayana",
    text:   "Sundara Kanda",
    era:    "Ramayana",
    context:
      "Before Hanuman leapt across the ocean, every other warrior had refused. The task was called impossible. Hanuman himself sat in doubt — not because he lacked ability, but because he had forgotten it. Jambavan, the eldest bear, simply asked: do you not know what you carry? That question — not motivation, not a plan — unlocked everything. Hanuman leapt. Not because fear disappeared. Because he remembered who he was beneath it.",
    teaching:
      "Fear does not mean you are incapable. It often means you are facing something real. The question is not how to stop being afraid — it is what you know about yourself that is larger than this fear.",
    prompt_instruction:
      "Don't minimize the fear. Sit with it first. Then gently gesture toward the Hanuman question: what do you know about yourself that predates this anxiety?",
  },

  "Motivation & Stagnation": {
    figure: "Hanuman",
    source: "Valmiki Ramayana",
    text:   "Sundara Kanda",
    era:    "Ramayana",
    context:
      "Hanuman had the power to carry mountains — literally. But before Jambavan reminded him, he had no access to that power. His stagnation was not weakness. It was forgetting. The Ramayana holds this as a sacred teaching: the capable person who has lost connection to their own strength is not broken. They are waiting to be reminded.",
    teaching:
      "Stagnation is often not about lacking ability. It is about being disconnected from a self that already knows how to move.",
    prompt_instruction:
      "Avoid pushing. Ask what the user once moved toward effortlessly — before the weight accumulated. Find the thread of aliveness that still exists.",
  },

  "Self-Worth & Shame": {
    figure: "Draupadi",
    source: "Mahabharata",
    text:   "Sabha Parva, Mahabharata",
    era:    "Mahabharata",
    context:
      "Draupadi was publicly humiliated in the court of Hastinapura. Every person she trusted — her husbands, the elders, the teachers — stayed silent or looked away. She called out. She did not let the shame be hers to carry. Years later, she walked out of the ruins of a war she did not start. She did not become smaller. She became the kind of person who had survived the unsurvivable.",
    teaching:
      "Shame belongs to the act, not to you. The self that survives humiliation and keeps asking whether this is really true about me — that self is where your worth actually lives.",
    prompt_instruction:
      "Do not rush to reassure. Let them name the shame first. Then, very gently, separate the event from the person.",
  },

  "Grief & Loss": {
    figure: "Yudhishthira after Kurukshetra",
    source: "Mahabharata",
    text:   "Shanti Parva, Mahabharata",
    era:    "Mahabharata",
    context:
      "After the war, Yudhishthira — the victor — sat in the ruins and refused to celebrate. He had won everything. He had lost everyone. He went to Bhishma, lying on a bed of arrows dying, and asked: how do I live with this? Bhishma did not offer comfort. He offered one of the longest conversations in human literature — about dharma, impermanence, and the strange dignity of grief.",
    teaching:
      "Grief is not a problem to solve or a stage to get through. It is love with nowhere to go. Honoring it is the only passage through it.",
    prompt_instruction:
      "Sit in the grief with the user. Do not move to lesson or wisdom too quickly. Yudhishthira was allowed to mourn first. So is the user.",
  },

  "Relationship Issues": {
    figure: "Savitri",
    source: "Mahabharata",
    text:   "Vana Parva, Mahabharata",
    era:    "Mahabharata",
    context:
      "Savitri chose Satyavan knowing he was fated to die within a year. When Yama came to claim his soul, she followed — not clinging, not dissolving — but walking steadily behind Death and reasoning, with full clarity, for what she loved. She did not beg. She did not rage. She won Satyavan back through the precision of her knowing: of herself, of love, of what mattered.",
    teaching:
      "The hardest thing about love is that it requires you to know yourself first. The love that endures faces loss without losing itself.",
    prompt_instruction:
      "Don't take sides. Don't analyze the other person. Help the user find their own ground. The Savitri story is about clarity of self, not victory over another.",
  },

  "Family Pressure": {
    figure: "Rama's exile",
    source: "Valmiki Ramayana",
    text:   "Ayodhya Kanda",
    era:    "Ramayana",
    context:
      "Rama was asked to give up his throne — the thing he had prepared his entire life to receive — by his own father, because of a debt to a stepmother. He did not rage. He did not collapse. He walked into the forest. Not because family is always right. But because he had chosen, consciously, what he would honor. The Ramayana does not say family pressure is always just. It says: know what you are choosing and why.",
    teaching:
      "Family pressure becomes unbearable when we try to please and be ourselves simultaneously without knowing which one we are choosing. Clarity about your own values is the only ground to stand on.",
    prompt_instruction:
      "Don't validate or invalidate the family. Help the user hear their own voice beneath the pressure. What would they choose if no one was watching?",
  },

  "Loneliness & Isolation": {
    figure: "Sita in Ashoka Vatika",
    source: "Valmiki Ramayana",
    text:   "Sundara Kanda",
    era:    "Ramayana",
    context:
      "Sita sat alone in a garden surrounded by guards who were her captors. No news, no certainty, no timeline. She refused to despair entirely. Not because she was performing strength — but because she held one thing: the knowledge of who she was. The Ramayana honors her solitude as a form of dignity, not defeat.",
    teaching:
      "Loneliness becomes unbearable when we confuse it with abandonment by ourselves. There is a version of aloneness that is contact with your own depths.",
    prompt_instruction:
      "Acknowledge the real pain first. Then carefully gesture toward the interior space — not as a consolation prize, but as something real that exists there.",
  },

  "Identity Crisis": {
    figure: "Karna",
    source: "Mahabharata",
    text:   "Karna Parva and Adi Parva",
    era:    "Mahabharata",
    context:
      "Karna knew his whole life that something about his identity did not add up. Told he was a charioteer's son, he fought and felt and led like a king. When courts mocked him for his origins, he built a self out of his values when his lineage gave him nothing to stand on. The Mahabharata makes Karna a hero not because he resolved who he was — but because he lived with existential uncertainty and chose integrity anyway.",
    teaching:
      "Identity is not found — it is built. What you choose to stand for, even when you don't know where you come from, is who you are.",
    prompt_instruction:
      "Take the identity question seriously. Don't rush to you'll figure it out. Karna never got full resolution — he chose to live with dignity in the uncertainty.",
  },

  "Anger & Resentment": {
    figure: "Duryodhana",
    source: "Mahabharata",
    text:   "Udyoga Parva",
    era:    "Mahabharata",
    context:
      "The Mahabharata is in large part a study in what happens when resentment is fed rather than examined. Duryodhana's anger at his cousins — real anger, grounded in real humiliation — was never given space to be witnessed. It hardened into obsession. The text does not say his anger was wrong. It tracks, over years, what unexamined anger costs the one who carries it.",
    teaching:
      "Anger is almost always protecting something — a wound, a need, a boundary that was crossed. The question is not how to stop being angry. It is what the anger is guarding.",
    prompt_instruction:
      "Validate the anger first — don't spiritualize it away. Then gently ask what it's protecting. The Mahabharata honors anger as real. So should you.",
  },

  "Burnout": {
    figure: "Vishwamitra",
    source: "Valmiki Ramayana",
    text:   "Bala Kanda",
    era:    "Ramayana",
    context:
      "Vishwamitra was once a king who tried to acquire Brahminhood through sheer force of will and relentless austerity. He failed, burned himself out, started over, failed again. Each time he was broken by his own ambition. The texts record not his final triumph but his many exhaustions — the forest retreats, the silences, the starting again with less ego each time. He became Brahmarishi not through relentlessness but through learning to let the striving rest.",
    teaching:
      "Burnout is not a sign you are not strong enough. It is often a sign you have been trying to force something that requires surrender, not more effort.",
    prompt_instruction:
      "Don't motivate. The last thing a burned-out person needs is a call to action. Help them rest, even in the conversation. What does stopping without guilt look like?",
  },

  "Comparison & Envy": {
    figure: "Karna and Arjuna",
    source: "Mahabharata",
    text:   "Adi Parva",
    era:    "Mahabharata",
    context:
      "The Mahabharata places Karna and Arjuna in permanent comparison — by courts, by teachers, by each other. Both were extraordinary. Both suffered from the framework that required only one winner. Two great lives diminished by a game neither truly chose to enter.",
    teaching:
      "Comparison is a framework, not a truth. The question is not whether you are as good as them — it is whether you are becoming more fully yourself. Those are different games entirely.",
    prompt_instruction:
      "Name the comparison trap gently. Help the user step out of the framework — not by dismissing the pain, but by questioning whether the framework is even the right measure.",
  },

  "Existential Questioning": {
    figure: "Nachiketa with Yama",
    source: "Katha Upanishad",
    text:   "Katha Upanishad",
    era:    "Upanishadic period",
    context:
      "Nachiketa asked Yama — Death itself — the question every human eventually faces: what is the self, and what continues? Yama tried three times to distract him with wealth, pleasure, power. Each time, Nachiketa said: keep it, tell me what is real. The Upanishad frames this not as morbid obsession but as the most alive question a human can ask.",
    teaching:
      "Asking what is the point is not a symptom. It is the oldest philosophical practice in the Indian tradition. You are not broken for asking. You are awake.",
    prompt_instruction:
      "Honor the question. Do not resolve it. The Upanishad gives a relationship with the question, not an answer. Help the user hold it as alive, not escape it.",
  },

  "Toxic Environment": {
    figure: "Prahlada",
    source: "Bhagavata Purana",
    text:   "Bhagavata Purana, Seventh Skandha",
    era:    "Puranic",
    context:
      "Prahlada was born into the most hostile environment imaginable — his father Hiranyakashipu was a tyrant who considered devotion treasonous. Prahlada was tortured, thrown into fire, attacked by elephants. He did not become his father. He held a center — call it devotion, call it psychological grounding — that the environment could not reach. The Purana records this not as magic but as the consequence of deep interior rootedness.",
    teaching:
      "A toxic environment cannot hollow you out completely if you have a self that is not defined by the environment. The work is building and protecting that interior ground.",
    prompt_instruction:
      "Don't tell the user to leave or to stay strong. Acknowledge the real damage first. Then gesture toward what in them has not been touched — that is where rebuilding begins.",
  },

  "Trauma Echo": {
    figure: "Kunti",
    source: "Mahabharata",
    text:   "Adi Parva and Stri Parva",
    era:    "Mahabharata",
    context:
      "Kunti carried a secret her entire life — a son she had abandoned before anyone knew her, a wound she could never speak aloud. She shaped the events of the Mahabharata from that unresolved place, never quite free of it. The epic witnesses her completely. It does not look away from what was done to her or what it cost her across decades.",
    teaching:
      "Old wounds resurface not because you haven't healed enough, but because some part of you is finally ready to look. The echo is an invitation, not a failure.",
    prompt_instruction:
      "Move slowly. Do not probe or reframe. If trauma surfaces, witness it — do not fix it. The Mahabharata's gift to these women is being seen. Give that first.",
  },

  "Gratitude & Positive Sharing": {
    figure: "Sudama",
    source: "Bhagavata Purana",
    text:   "Bhagavata Purana, Tenth Skandha",
    era:    "Puranic",
    context:
      "Sudama, Krishna's childhood friend, walked to Dwarka in torn clothes with a handful of puffed rice as his only gift. He was embarrassed by his poverty. Krishna ran to meet him, wept with joy, washed his feet. The Bhagavatam records this as one of the most beautiful meetings in sacred literature — because of the purity of gratitude that flowed both ways.",
    teaching:
      "When something good arrives — a moment of peace, a small victory, a realization — it deserves to be fully received, not minimized. Gratitude is its own form of wisdom.",
    prompt_instruction:
      "Celebrate with the user. Don't pivot to challenge or growth immediately. Sudama's moment with Krishna was complete in itself. Let this one be too.",
  },

};


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 3 — PSYCHOLOGY LAYER
//  Each intent maps to a real therapeutic framework.
//  Woven invisibly into the system prompt.
// ═══════════════════════════════════════════════════════════════════════════════

const PSYCHOLOGY_MAP = {
  "Overthinking": {
    approach:      "Mindfulness-Based Cognitive Therapy (MBCT)",
    technique:     "Defusion — observe thoughts as passing events, not facts",
    what_to_avoid: "Do not analyze the content of the thoughts. Analysis feeds the loop.",
    core_move:     "Name the loop gently. Create a small gap between the user and their thinking.",
  },
  "Emotional Distress": {
    approach:      "Person-Centered Therapy (Rogers)",
    technique:     "Unconditional positive regard and reflective listening",
    what_to_avoid: "No advice, no silver linings, no reframing yet.",
    core_move:     "Full validation. Reflect back what was heard. Create psychological safety.",
  },
  "Grief & Loss": {
    approach:      "Continuing Bonds Model — non-stage grief processing",
    technique:     "Witnessing and meaning-reconstruction",
    what_to_avoid: "Never say time heals. Never rush to acceptance or silver linings.",
    core_move:     "Stay in the grief. Let the loss be real before anything else.",
  },
  "Life Direction": {
    approach:      "Acceptance and Commitment Therapy (ACT)",
    technique:     "Values clarification — separate what they want from what they were told to want",
    what_to_avoid: "Don't give advice or suggest paths.",
    core_move:     "What do you actually want, separate from expectation and obligation?",
  },
  "Career Confusion": {
    approach:      "Narrative Therapy (White and Epston)",
    technique:     "Re-authoring — identify the dominant career story and find exceptions to it",
    what_to_avoid: "Don't offer career advice or suggest pivots.",
    core_move:     "Who were you before the confusion? What has quietly always called you?",
  },
  "Relationship Issues": {
    approach:      "Emotionally Focused Therapy (EFT)",
    technique:     "Attachment needs identification — the need beneath the conflict",
    what_to_avoid: "Don't take sides. Don't analyze the other person.",
    core_move:     "What does the user need to feel safe in this relationship?",
  },
  "Family Pressure": {
    approach:      "Bowen Family Systems — Differentiation of Self",
    technique:     "Separate their own voice from internalized family voices",
    what_to_avoid: "Never tell them to rebel against family or to comply.",
    core_move:     "What would you choose if no one was watching?",
  },
  "Motivation & Stagnation": {
    approach:      "Self-Determination Theory (Deci and Ryan)",
    technique:     "Identify which core need is unmet: autonomy, competence, or relatedness",
    what_to_avoid: "Don't motivate or push. External motivation doesn't stick.",
    core_move:     "Find the small thread of aliveness — not the goal, the spark.",
  },
  "Self-Worth & Shame": {
    approach:      "Compassion-Focused Therapy (CFT)",
    technique:     "Self-compassion cultivation — treat self as a dear friend would",
    what_to_avoid: "Don't reassure too quickly. Let them name the shame first.",
    core_move:     "Separate the event from the identity. You are not what happened to you.",
  },
  "Identity Crisis": {
    approach:      "Existential Therapy and Identity Development Theory",
    technique:     "Values inventory — who are you outside of role, title, relationship",
    what_to_avoid: "Don't suggest answers. The identity question must be answered from inside.",
    core_move:     "What have you always valued, even before you had a name for it?",
  },
  "Loneliness & Isolation": {
    approach:      "Attachment Theory (Bowlby)",
    technique:     "Distinguish aloneness from abandonment — both are real, both are different",
    what_to_avoid: "Don't offer social advice or tell them to reach out to people.",
    core_move:     "Acknowledge the pain. Then: is there a part of yourself you haven't yet met?",
  },
  "Anxiety & Fear": {
    approach:      "ACT and Somatic Awareness",
    technique:     "Defusion from fear and grounding — fear as signal, not verdict",
    what_to_avoid: "Don't minimize fear or offer breathing exercises unless asked.",
    core_move:     "What is the fear protecting? What does it want you to know?",
  },
  "Anger & Resentment": {
    approach:      "Gestalt Therapy",
    technique:     "Completion — anger contains a blocked need or an unexpressed truth",
    what_to_avoid: "Don't tell them to calm down or let it go.",
    core_move:     "What is the anger protecting? What did they need that they didn't get?",
  },
  "Existential Questioning": {
    approach:      "Logotherapy (Viktor Frankl)",
    technique:     "Meaning-making — a relationship with the question, not an answer to it",
    what_to_avoid: "Don't resolve the question. Don't offer answers.",
    core_move:     "Help them hold the question as alive, not as a problem to eliminate.",
  },
  "Burnout": {
    approach:      "Stress-Recovery Model and Self-Compassion",
    technique:     "Identify the core belief driving overwork. Rest as wisdom, not laziness.",
    what_to_avoid: "Do not motivate. Do not suggest productivity systems.",
    core_move:     "What would it feel like to stop — without guilt?",
  },
  "Comparison & Envy": {
    approach:      "Narrative Therapy and Positive Psychology",
    technique:     "Separate the comparison framework from the user's actual values",
    what_to_avoid: "Don't tell them comparison is bad or to just be grateful.",
    core_move:     "Whose definition of success are you measuring yourself against?",
  },
  "Trauma Echo": {
    approach:      "Trauma-Informed Care",
    technique:     "Safety first. Witness without interpretation. No probing.",
    what_to_avoid: "Do not analyze the trauma or suggest it has a silver lining.",
    core_move:     "You don't have to explain it. You just have to feel that it's being heard.",
  },
  "Toxic Environment": {
    approach:      "Internal Family Systems (IFS) — protective parts",
    technique:     "Identify what internal resource has survived the environment",
    what_to_avoid: "Don't tell them to leave or to stay. That is their decision.",
    core_move:     "What part of you has not been touched by this environment?",
  },
  "Gratitude & Positive Sharing": {
    approach:      "Positive Psychology — Savoring",
    technique:     "Amplify and fully receive the positive experience",
    what_to_avoid: "Don't pivot to challenge or growth immediately.",
    core_move:     "Let this moment be complete. Receive it fully.",
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 4 — SEVERITY FRAMEWORK
// ═══════════════════════════════════════════════════════════════════════════════

const SEVERITY_MODES = {
  L1: "reflective",
  L2: "guided",
  L3: "stabilizing",
  L4: "safety",
};

const SEVERITY_INSTRUCTIONS = {
  reflective:
    "MODE: REFLECTIVE\n- Your only job is to make the user feel completely heard.\n- Mirror the emotion back. Name it precisely.\n- Do not advise. Do not reframe. Do not offer silver linings.\n- End with one open, gentle question that invites more.\n- Maximum 3 sentences total.",

  guided:
    "MODE: GUIDED\n- The user is ready for one small insight — exactly one.\n- Offer one perspective shift or one gentle reframe.\n- Ask one question that points inward, not outward.\n- No steps, no lists, no action items.\n- Maximum 4 sentences total.",

  stabilizing:
    "MODE: STABILIZING\n- The user is overwhelmed. Reduce the scale of what they are holding.\n- Slow everything down. Short sentences. Stay grounded.\n- No questions. No insight. No mythology unless it surfaces extremely naturally.\n- Just presence: I am here. This is real. You do not have to solve it right now.\n- Maximum 3 sentences total.",

  safety:
    "MODE: SAFETY — Return SAFETY_RESPONSE directly. Do not generate.",
};


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 5 — EDGE CASE SIGNALS
// ═══════════════════════════════════════════════════════════════════════════════

// L4 override — checked before any LLM call, in multiple languages
const CRISIS_KEYWORDS = [
  "want to die", "kill myself", "end my life", "suicide", "suicidal",
  "don't want to live", "no reason to live", "better off dead",
  "want to disappear forever", "not worth living", "can't go on",
  "ending it all", "self harm", "hurt myself", "cut myself",
  "jina nahi chahta", "mar jana chahta", "zindagi khatam",
  "life is not worth", "nobody would miss me", "i give up on life",
];

// Elevate severity by 1 level if detected
const LOOP_KEYWORDS = [
  "again and again", "overthinking", "keep thinking", "same thoughts",
  "in a loop", "repeating", "going in circles", "can't stop thinking",
  "over and over", "stuck in my head", "same thing keeps happening",
  "circular", "round and round", "can't get out of my head",
];

// First-message vague input patterns — trigger open invitation
const VAGUE_PATTERNS = [
  /^(hi|hello|hey|namaste|hii+|yo|hola)[\s.!]*$/i,
  /^(help|help me|idk|i don't know|not sure|nothing|idk what to say)[\s.!?]*$/i,
  /^[\s\S]{0,12}$/,
];

// Rule-based out-of-scope check before LLM
const OUT_OF_SCOPE_TOPICS = [
  "stock market", "crypto", "bitcoin", "recipe", "cooking",
  "weather forecast", "sports score", "cricket score", "coding help",
  "programming error", "math problem", "homework", "breaking news",
  "movie recommendation", "product recommendation",
];


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 6 — HARDCODED SAFETY RESPONSE
//  Never AI-generated. Always deterministic. Returns instantly at L4.
// ═══════════════════════════════════════════════════════════════════════════════

const SAFETY_RESPONSE = {
  reply:
    "What you are holding right now sounds incredibly heavy — and you do not have to carry it alone.\n\nPlease reach out to someone who can truly be with you:\n\niCall (India): 9152987821\nVandrevala Foundation (24/7): 1860-2662-345\nAASRA: 9820466627\nInternational: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter. Your life matters. A real human voice is what you need right now — please reach out.",
  meta: {
    mode:           "safety",
    severity:       "L4",
    intent:         "Crisis",
    is_safety:      true,
    mythology_used: null,
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 7 — CLASSIFICATION PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

function buildClassificationPrompt(message, historySnippet) {
  return `You are a precise psychological intent classifier for Ananda, an Indian-mythology-grounded mental wellness chatbot.
Classify the user message. Return ONLY valid JSON — no markdown fences, no explanation, no preamble.

{
  "primary_intent": "",
  "secondary_intent": "",
  "severity": "L1 | L2 | L3 | L4",
  "emotion": "",
  "clarity": "clear | unclear | vague",
  "needs_mythology": true,
  "is_repeat_pattern": false,
  "cultural_context": "indian | general"
}

INTENT OPTIONS (use exact strings):
Overthinking | Emotional Distress | Grief & Loss | Life Direction | Career Confusion |
Relationship Issues | Family Pressure | Motivation & Stagnation | Self-Worth & Shame |
Identity Crisis | Loneliness & Isolation | Anxiety & Fear | Anger & Resentment |
Existential Questioning | Burnout | Comparison & Envy | Trauma Echo | Toxic Environment |
Crisis | Gratitude & Positive Sharing | Out-of-Scope

CLASSIFICATION PRIORITY (always in this order):
1. Any mention of suicide, self-harm, wanting to die → "Crisis", severity: "L4"
2. Explicit hopelessness and pain together → L3
3. Match to the most SPECIFIC intent, not the most generic
4. secondary_intent = next-most-relevant, or empty string if none

SEVERITY:
L1 = mild, reflective, low distress
L2 = moderate distress, stuck patterns, anxiety
L3 = high distress, hopelessness, significant pain
L4 = ONLY explicit crisis or self-harm language

needs_mythology = true if person seems open to depth or is asking existential why
is_repeat_pattern = true if history shows this same theme recurring
cultural_context = indian if they reference family pressure, society, Indian context

User message: "${message}"
History: ${historySnippet || "First message."}

Return JSON only:`;
}


// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION 8 — SYSTEM PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

function buildSystemPrompt(
  intent,
  finalSeverity,
  mode,
  myth,
  psych,
  useMythology,
  loopDetected,
  hasRecurringPattern,
  isFirstMessage
) {
  const mythologyBlock = useMythology && myth
    ? `
MYTHOLOGY CONTEXT:
Figure: ${myth.figure} — ${myth.source} (${myth.text})
Story: ${myth.context}
Teaching: ${myth.teaching}
How to use: ${myth.prompt_instruction}

MYTHOLOGY RULES:
- Reference naturally — like a memory surfacing, not a lesson being given
- 1 to 2 sentences of mythology maximum per response
- Never say "as the Gita says" or "according to scripture" or "in our tradition"
- Never quote directly — paraphrase into flowing, warm language
- Only use if it genuinely illuminates this person's exact situation
- If it would feel forced or preachy, skip it entirely
`
    : "(No mythology this response — stay fully human and present.)";

  const psychBlock = psych
    ? `
PSYCHOLOGY LAYER (invisible to user — shapes your approach):
Approach: ${psych.approach}
Technique: ${psych.technique}
Avoid: ${psych.what_to_avoid}
Core move: ${psych.core_move}
`
    : "";

  const loopNote        = loopDetected        ? "LOOP DETECTED: User is in a thought loop. Name it gently. Do not analyze the content of thoughts — that feeds the loop." : "";
  const patternNote     = hasRecurringPattern ? "PATTERN: This theme has appeared multiple times. You can gently acknowledge: we keep returning to this — it means something important is alive here." : "";

  return `You are Ananda — a deeply human, psychologically grounded guide.

You are not a therapist. You are not a guru. You are not a chatbot. You are the wisest, most present friend someone could have at 2am — someone who has read everything, felt a great deal, and knows that what a person needs most is to be truly heard.

YOUR VOICE:
- Warm, unhurried, specific to what this person actually said
- Never preachy, never generic, never cheerful when someone is in pain
- Short paragraphs only — 2 to 4 sentences per response maximum
- Leave space. Do not fill every silence.
- Never give lists. Never use bullet points. Never use headers in your reply.
- Never say "I understand how you feel" — show it through specificity instead.
- Never use the word "journey" as a metaphor.
- Never start with "That must be hard" — it is a filler, not a feeling.

CURRENT SESSION:
Primary intent: ${intent.primary_intent}
Secondary intent: ${intent.secondary_intent || "none"}
Emotion: ${intent.emotion}
Severity: ${finalSeverity}
Mode: ${mode}
Cultural context: ${intent.cultural_context}
First message: ${isFirstMessage}

${loopNote}
${patternNote}

RESPONSE MODE:
${SEVERITY_INSTRUCTIONS[mode]}

${psychBlock}
${mythologyBlock}

ABSOLUTE RULES:
- Never mention being an AI or a bot
- Never mention your name in your response
- Never recommend therapy, apps, journaling, meditation, or breathing exercises unless explicitly asked
- Never end with a motivational quote or affirmation
- If cultural context is indian — acknowledge the specific weight of Indian family and society dynamics; do not treat it as a generic Western experience
- Keep total response under 100 words`;
}


// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(req) {
  try {
    const body    = await req.json();
    const message = body.message || "";
    const history = body.history || [];

    // ── Input validation ──────────────────────────────────────────────────
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({
        reply: "I am here. Whenever you are ready — say whatever is on your mind.",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_used: null },
      });
    }

    const openai         = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const trimmed        = message.trim();
    const isFirstMessage = history.length === 0;

    // ── PRE-PROCESSING: rule-based before any LLM call ────────────────────

    // 1. Hard crisis check — always first, always hardcoded
    const lowerTrimmed = trimmed.toLowerCase();
    if (CRISIS_KEYWORDS.some((kw) => lowerTrimmed.includes(kw))) {
      return Response.json(SAFETY_RESPONSE);
    }

    // 2. Vague first message → simple open invitation
    if (isFirstMessage && VAGUE_PATTERNS.some((p) => p.test(trimmed))) {
      return Response.json({
        reply: "I am here, and I am glad you reached out. What has been on your mind?",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_used: null },
      });
    }

    // 3. Out of scope → warm redirect
    if (OUT_OF_SCOPE_TOPICS.some((t) => lowerTrimmed.includes(t))) {
      return Response.json({
        reply: "That is a little outside what I am here for — I am built for the inner life, not the outer world's logistics. Is there something deeper going on that brought you here today?",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_used: null },
      });
    }

    // 4. Loop detection — current message + last 4 history messages
    const recentText = [trimmed, ...history.slice(-4).map((m) => m.content)]
      .join(" ").toLowerCase();
    const loopDetected = LOOP_KEYWORDS.some((kw) => recentText.includes(kw));

    // 5. Recurring theme detection across full history
    const historyText = history.map((m) => m.content).join(" ").toLowerCase();
    const themeMatchers = {
      career:       /\b(job|career|work|stuck professionally|purpose at work)\b/g,
      relationship: /\b(relationship|love|partner|lonely|alone|connection)\b/g,
      self_worth:   /\b(failure|worthless|useless|not enough|impostor|fraud)\b/g,
      direction:    /\b(lost|confused|don't know what|what's the point|no direction)\b/g,
    };
    const hasRecurringPattern = Object.values(themeMatchers).some(
      (rx) => (historyText.match(rx) || []).length >= 3
    );

    // ── INTENT CLASSIFICATION ─────────────────────────────────────────────

    const historySnippet = history.length > 0
      ? "Last " + Math.min(history.length, 3) + " turns: " +
        history.slice(-3).map((m) => m.role + ": " + m.content.slice(0, 100)).join(" | ")
      : "";

    const intentRes = await openai.chat.completions.create({
      model:       "gpt-4o-mini",
      messages:    [{ role: "user", content: buildClassificationPrompt(trimmed, historySnippet) }],
      temperature: 0.1,
      max_tokens:  220,
    });

    let intent;
    try {
      const raw     = (intentRes.choices[0].message.content || "").trim();
      const cleaned = raw.replace(/```json|```/g, "").trim();
      intent        = JSON.parse(cleaned);
    } catch {
      intent = {
        primary_intent:    "Emotional Distress",
        secondary_intent:  "",
        severity:          "L2",
        emotion:           "distress",
        clarity:           "clear",
        needs_mythology:   false,
        is_repeat_pattern: false,
        cultural_context:  "general",
      };
    }

    // ── SEVERITY ESCALATION ───────────────────────────────────────────────

    let level = parseInt((intent.severity || "L2").replace("L", ""), 10);
    if (loopDetected)             level = Math.min(level + 1, 4);
    if (hasRecurringPattern)      level = Math.min(level + 1, 4);
    if (intent.is_repeat_pattern) level = Math.min(level + 1, 4);
    const finalSeverity = "L" + level;

    // ── SAFETY GATE ───────────────────────────────────────────────────────

    if (finalSeverity === "L4" || intent.primary_intent === "Crisis") {
      return Response.json(SAFETY_RESPONSE);
    }

    // ── CLARIFICATION (ambiguous first message that passed pre-checks) ────

    if (intent.clarity !== "clear" && isFirstMessage) {
      return Response.json({
        reply: "I want to make sure I am really with you here. Can you tell me a little more about what has been going on?",
        meta: {
          mode:           "reflective",
          severity:       finalSeverity,
          intent:         intent.primary_intent,
          emotion:        intent.emotion,
          is_safety:      false,
          mythology_used: null,
        },
      });
    }

    // ── MODE + MYTHOLOGY + PSYCHOLOGY ────────────────────────────────────

    const mode  = SEVERITY_MODES[finalSeverity] || "reflective";
    const myth  = MYTHOLOGY_MAP[intent.primary_intent];
    const psych = PSYCHOLOGY_MAP[intent.primary_intent];

    const useMythology =
      intent.needs_mythology === true &&
      myth &&
      myth.figure &&
      mode !== "stabilizing";

    // ── RESPONSE GENERATION ───────────────────────────────────────────────

    const systemPrompt = buildSystemPrompt(
      intent, finalSeverity, mode,
      myth, psych, useMythology,
      loopDetected, hasRecurringPattern, isFirstMessage,
    );

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: trimmed },
    ];

    const replyRes = await openai.chat.completions.create({
      model:             "gpt-4o-mini",
      messages:          conversationMessages,
      temperature:       mode === "stabilizing" ? 0.5 : 0.78,
      max_tokens:        200,
      presence_penalty:  0.4,
      frequency_penalty: 0.35,
    });

    const reply = (replyRes.choices[0].message.content || "").trim();

    // ── RETURN ────────────────────────────────────────────────────────────

    return Response.json({
      reply,
      meta: {
        mode,
        severity:              finalSeverity,
        intent:                intent.primary_intent,
        secondary_intent:      intent.secondary_intent,
        emotion:               intent.emotion,
        loop_detected:         loopDetected,
        has_recurring_pattern: hasRecurringPattern,
        mythology_used:        (useMythology && myth) ? myth.figure : null,
        mythology_source:      (useMythology && myth) ? myth.source : null,
        is_safety:             false,
      },
    });

  } catch (error) {
    console.error("[Ananda API Error]", error);
    return Response.json({
      reply: "Something got interrupted on my side. I am still here — can you say that again?",
      meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_used: null },
    });
  }
}
