import OpenAI from "openai";

// ═══════════════════════════════════════════════════════════════════════════════
//  ANANDA v3 — Thinking Partner Architecture
//
//  KEY CHANGES FROM v2:
//  - System prompt: acknowledge → validate → deepen → 1 strong question (mandatory)
//  - No rigid word/sentence limits — responses are as long as they need to be
//  - Intent parsing: JSON.parse only, no regex, clean fallback (safeParseIntent)
//  - Recurring pattern: counts matching user messages, not keyword frequency
//  - Severity: L4 ONLY from crisis keyword check — escalation logic capped at L3
//  - Mythology: random per response, shown unless mode === stabilizing
//  - Questions: intent-specific question bank — never generic
//  - Temperature 0.82 for natural variation
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — MYTHOLOGY KNOWLEDGE BASE
//  Random selection per response. No module-scope counter (safer for serverless).
// ─────────────────────────────────────────────────────────────────────────────

const MYTHOLOGY_MAP = {

  "Career Confusion": [
    {
      figure: "Ekalavya", source: "Mahabharata", text: "Adi Parva",
      card_title:   "Ekalavya Builds His Own Path",
      card_story:   "Ekalavya wanted to learn archery from Dronacharya — the greatest teacher of his time. Drona refused him. Wrong background, wrong caste, no place in the formal system. Instead of giving up, Ekalavya went into the forest alone and built a clay statue of Drona. He taught himself by watching, practicing, and failing — day after day, with no audience and no approval. He became so skilled that he surpassed students who had everything he was denied. His path existed nowhere in advance. He had to walk it into being.",
      card_connect: "Not having a clear conventional path doesn't mean you're behind. Sometimes it means you're meant to build your own.",
      teaching:     "The absence of a clear path is sometimes an invitation to build your own.",
    },
    {
      figure: "Karna", source: "Mahabharata", text: "Adi Parva",
      card_title:   "Karna Is Told He Doesn't Belong",
      card_story:   "Karna grew up as a charioteer's son, but thought and fought like a king. When he showed up at the great archery tournament, the crowd mocked him — wrong lineage, not allowed to compete. He stood there in front of thousands while people laughed. He didn't collapse. He found another way to stand — someone recognized him, gave him a kingdom of his own, and he walked into history as one of the greatest warriors who ever lived. The system had no place for him. He made his own place.",
      card_connect: "Feeling stuck in career often isn't about ability. It's about the world not yet having a category for what you actually are.",
      teaching:     "What you build from your own values outlasts what others gave you permission to become.",
    },
    {
      figure: "Vishwamitra", source: "Valmiki Ramayana", text: "Bala Kanda",
      card_title:   "Vishwamitra Walks Away From His Throne",
      card_story:   "Vishwamitra was a powerful king who walked away from everything to become something entirely different. He failed repeatedly, burned out, and started over. Each time he came back with less ego and more clarity about what he was actually after. The texts spend more time on his exhaustion and restarts than on his eventual title.",
      card_connect: "Sometimes career confusion is the beginning of a bigger becoming — not a sign something is wrong.",
      teaching:     "The path to what you're meant for is rarely straight, and rarely what you started with.",
    },
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapter 3",
      card_title:   "Arjuna and the Question of Right Action",
      card_story:   "Arjuna had trained his whole life for one role. But sitting at the edge of the battlefield, he couldn't figure out which action was right. Krishna didn't hand him a career plan. He said: act from your nature, not from fear of how others will judge the outcome. The clarity you're looking for doesn't come from certainty — it comes from alignment with what you actually are.",
      card_connect: "Career confusion often isn't about not knowing what to do. It's about not yet knowing what you are — separate from what you were told to become.",
      teaching:     "Action aligned with your nature produces clarity. Action taken from fear or comparison produces confusion.",
    },
    {
      figure: "Satyakama Jabala", source: "Chandogya Upanishad", text: "Book 4",
      card_title:   "Satyakama and the Question of Lineage",
      card_story:   "Satyakama was asked by a great teacher: what is your lineage? He said honestly — I don't know. My mother doesn't know either. The teacher accepted him immediately, saying: only someone of true character speaks like that. He became one of the greatest students of his age.",
      card_connect: "Not knowing where you fit can feel like weakness. Sometimes it's the most honest place to start from.",
      teaching:     "Honesty about not knowing is the beginning of real learning — not the end of it.",
    },
  ],

  "Life Direction": [
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapters 1-2",
      card_title:   "Arjuna Drops His Bow",
      card_story:   "Arjuna was the most skilled warrior alive and dropped his bow right before the most important battle of his life. He saw his teachers on the other side. His cousins. He couldn't figure out which direction was right and the weight of it made him physically unable to move. He wasn't weak — he loved deeply and the path had just become genuinely unclear. That collapse is what started the entire Bhagavad Gita.",
      card_connect: "Feeling lost about direction isn't a flaw. It's what happens when you care deeply and the path isn't obvious yet.",
      teaching:     "Clarity comes through aligned action, not from waiting until doubt disappears.",
    },
    {
      figure: "Rama", source: "Valmiki Ramayana", text: "Ayodhya Kanda",
      card_title:   "Rama Chooses His Path",
      card_story:   "Rama was about to be crowned king when in one night it was taken away. He was asked to walk into a forest for 14 years instead. He didn't spiral. He spent a few hours alone, got clear on what he valued, and walked out in the morning ready to go. Not because he didn't feel the loss — because he had decided what he would stand for, and that was steadier than what he was losing.",
      card_connect: "Sometimes direction isn't about what you want. It's about getting clear on what you value — and walking from there.",
      teaching:     "Clarity about your own values is the only ground to stand on when the path disappears.",
    },
    {
      figure: "Nachiketa", source: "Katha Upanishad", text: "Chapters 1-2",
      card_title:   "Nachiketa Refuses the Easy Answers",
      card_story:   "Nachiketa walked to Death's door and waited three days for an answer about what truly matters. Death offered him wealth, pleasure, kingdoms — he refused all of it. He just wanted to know what was real. That refusal to be bought off by easier answers is what makes the Katha Upanishad worth reading thousands of years later.",
      card_connect: "When you're confused about direction, it's often because you're still searching for what's real to you — not just what looks good from the outside.",
      teaching:     "The direction that lasts is built on what you actually know to be true, not what you were told to want.",
    },
    {
      figure: "Dhruva", source: "Bhagavata Purana", text: "Fourth Skandha",
      card_title:   "Dhruva Goes Looking for Something Real",
      card_story:   "Dhruva was a young boy who felt rejected and unseen. Everyone told him he was too young to seek what he was seeking. He went into the forest alone anyway and sat in meditation so completely that he became the pole star — the fixed point everything else revolves around. The search for direction started from feeling completely lost and invisible.",
      card_connect: "Sometimes the search for direction has to start from a place of feeling completely lost and unseen. That's not a bad starting point — it's often the truest one.",
      teaching:     "The person who searches honestly from emptiness often finds something more solid than the person who never had to look.",
    },
  ],

  "Anxiety & Fear": [
    {
      figure: "Hanuman", source: "Valmiki Ramayana", text: "Sundara Kanda",
      card_title:   "Hanuman Forgets He Can Fly",
      card_story:   "Everyone said the ocean crossing was impossible. Hanuman had the power to do it easily — but had completely forgotten. An elder asked: do you not know what you carry? That one question was enough. He leapt.",
      card_connect: "Fear doesn't mean you can't do it. It often means you've temporarily forgotten what you already know about yourself.",
      teaching:     "The question is not how to stop being afraid. It is what you know about yourself that is larger than this fear.",
    },
    {
      figure: "Sita", source: "Valmiki Ramayana", text: "Sundara Kanda",
      card_title:   "Sita Alone With No Answers",
      card_story:   "Sita was held captive with no news, no timeline, no certainty anyone was coming. She didn't pretend it was fine. But through all of it, she held onto one thing: the clarity of who she was. That didn't leave her even when everything else did.",
      card_connect: "When fear is about uncertainty, the anchor isn't the answer. It's knowing who you are inside the uncertainty.",
      teaching:     "Fear of the unknown becomes bearable when you know what in you cannot be taken.",
    },
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapter 18",
      card_title:   "Arjuna Picks Up His Bow Again",
      card_story:   "After the longest conversation in Indian philosophy — after every fear and doubt was named out loud — Arjuna picked his bow back up. Not because the fear was gone. Because he had looked at it fully and chosen anyway.",
      card_connect: "Fear examined honestly often loses some of its power. You don't have to resolve it to move — you just have to look at it clearly.",
      teaching:     "Action taken after honest examination of fear is different from action taken despite fear. One is clearer.",
    },
    {
      figure: "Prahlada", source: "Bhagavata Purana", text: "Seventh Skandha",
      card_title:   "Prahlada Walks Through Fire",
      card_story:   "Prahlada was thrown into fire, attacked by elephants, tortured — all by his own father. Each time, something in him stayed steady. Not because he was fearless, but because he had something inside that the fear couldn't reach.",
      card_connect: "Fear can be real and loud and still not be the final word. There's usually something in you it hasn't been able to touch.",
      teaching:     "Courage isn't the absence of fear. It's having something inside that fear cannot reach.",
    },
  ],

  "Burnout": [
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapter 1",
      card_title:   "Arjuna Sits Down",
      card_story:   "Arjuna was the warrior everyone was counting on. He had been preparing for this for years. And then he sat down in the middle of the battlefield and simply could not go on. His bow fell. His body trembled. He was genuinely empty — the kind of empty that comes from carrying too much for too long. Krishna didn't immediately push him to get up. He sat down beside him first.",
      card_connect: "Burnout isn't a productivity problem. It's a signal that something important has run out. Sitting with that honestly is the first step — not pushing through it.",
      teaching:     "The collapse is not the end. It is the moment before something more honest begins.",
    },
    {
      figure: "Vishwamitra", source: "Valmiki Ramayana", text: "Bala Kanda",
      card_title:   "Vishwamitra Burns Out Again and Again",
      card_story:   "Vishwamitra tried to force his way to greatness through sheer willpower. He failed. Burned out. Started over. Failed again. The texts spend more time on his exhaustion than his success — because that's where the real learning happened.",
      card_connect: "Burning out doesn't mean you're not strong enough. It usually means you've been pushing at something that needs rest, not more effort.",
      teaching:     "Burnout is what happens when effort is not matched by rest. The body knows before the mind admits it.",
    },
    {
      figure: "Yudhishthira", source: "Mahabharata", text: "Shanti Parva",
      card_title:   "Yudhishthira Refuses to Celebrate",
      card_story:   "Yudhishthira won the war and couldn't feel any joy. He sat in the ruins, exhausted in a way that victory couldn't fix. He didn't perform happiness. He stayed with the emptiness until something real came through.",
      card_connect: "Sometimes exhaustion goes deeper than the body. When even achieving things feels hollow — that's a different kind of tired. It deserves honesty, not a pep talk.",
      teaching:     "The exhaustion that follows doing everything right is one of the loneliest feelings. It still deserves rest.",
    },
    {
      figure: "Sita", source: "Valmiki Ramayana", text: "Uttara Kanda",
      card_title:   "Sita Stops Proving Herself",
      card_story:   "After years of captivity, war, and rescue — Sita was asked to prove herself one more time. She had given everything. She didn't fight or plead. She simply stopped. It was not defeat. It was a person who had nothing left to prove and knew it.",
      card_connect: "There is a point where exhaustion isn't weakness. It's having genuinely given everything. That deserves to be named, not pushed through.",
      teaching:     "Knowing when you have given enough is its own kind of wisdom.",
    },
  ],

  "Overthinking": [
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapter 2",
      card_title:   "Krishna's One Question",
      card_story:   "Arjuna's mind ran everywhere at once — his teachers, his cousins, his guilt, his dharma. Krishna didn't tell him to stop thinking. He asked one question: what is actually yours to do right now? That question cut through everything.",
      card_connect: "Overthinking usually means you're trying to solve everything at once. The question is only ever: what is mine to do right now?",
      teaching:     "One clear action chosen from your values is worth more than a thousand thoughts about every possible outcome.",
    },
    {
      figure: "Nachiketa", source: "Katha Upanishad", text: "Chapters 1-2",
      card_title:   "Nachiketa Stops Reaching for More",
      card_story:   "Nachiketa sat outside Death's door for three days with no food and no answer. When Death offered him wealth and pleasure instead of the truth he asked for, Nachiketa said no. He just wanted to know what was real. The mind can only find solid ground by going quiet — not by thinking harder.",
      card_connect: "The mind keeps spinning because it's looking for solid ground. But some things can only be found by going quiet, not by adding more thoughts.",
      teaching:     "You cannot solve your way to peace. Stillness is not the absence of thought — it's the decision to stop feeding every one.",
    },
    {
      figure: "Ashtavakra", source: "Ashtavakra Gita", text: "Chapter 1",
      card_title:   "Ashtavakra and the Stillness Beneath Thought",
      card_story:   "Ashtavakra was a sage who taught that the self watching the thoughts is always already still. The thoughts come and go. The one watching them doesn't move. He wasn't teaching detachment — he was pointing to something that was never caught in the loop to begin with.",
      card_connect: "There is a part of you that is not inside the overthinking. It's the part noticing it. That part has never been tangled.",
      teaching:     "You are not your thoughts. You are the one watching them — and that watcher is already still.",
    },
  ],

  "Family Pressure": [
    {
      figure: "Rama", source: "Valmiki Ramayana", text: "Ayodhya Kanda",
      card_title:   "Rama's Exile",
      card_story:   "Rama was about to become king — the thing his whole life had prepared him for. His father asked him to give it up for 14 years because of a promise made to a stepmother. He didn't fight it. He chose, clearly, what he would honor — and walked.",
      card_connect: "Family pressure hurts most when you don't know what you yourself actually want. Getting clear on your own values quietly is the only solid ground.",
      teaching:     "Know what you are choosing and why. That clarity is the only thing that makes family pressure bearable.",
    },
    {
      figure: "Karna", source: "Mahabharata", text: "Udyoga Parva",
      card_title:   "Karna Says No to His Mother",
      card_story:   "Just before the war, Karna's birth mother came to him with an offer — recognition, legitimacy, a place in the family — if he switched sides. He said no. He chose the loyalty he had actually lived, not the family he had been born into.",
      card_connect: "Family obligation and your own integrity don't always point the same direction. You get to decide which one you live by.",
      teaching:     "The family you choose to honor through your actions matters as much as the family you were born into.",
    },
    {
      figure: "Yudhishthira", source: "Mahabharata", text: "Sabha Parva",
      card_title:   "Yudhishthira and the Weight of Expectation",
      card_story:   "Yudhishthira was expected to be perfect — the eldest, the righteous one, the king everyone leaned on. The weight of that expectation eventually led him to make one of the worst decisions of his life. The Mahabharata doesn't excuse it, but it shows what unexamined pressure does.",
      card_connect: "The pressure to be everything a family needs can quietly erode your own judgment. Noticing that pressure is the first step to not being completely shaped by it.",
      teaching:     "Expectation that is never examined often acts on you without your knowing. Naming it gives you back some choice.",
    },
  ],

  "Self-Worth & Shame": [
    {
      figure: "Draupadi", source: "Mahabharata", text: "Sabha Parva",
      card_title:   "Draupadi Calls Out",
      card_story:   "Draupadi was humiliated in front of an entire royal court. Every person she trusted looked away. She called out anyway. Years later she walked out of a war she never started, still herself.",
      card_connect: "What happened to you is not who you are. The fact that you're still asking that question means your sense of self is still intact.",
      teaching:     "Shame belongs to the act, not to you.",
    },
    {
      figure: "Karna", source: "Mahabharata", text: "Adi Parva",
      card_title:   "Karna Stands in the Court",
      card_story:   "Karna walked into a tournament and was publicly mocked — wrong birth, wrong caste, not allowed to compete. He stood there, insulted in front of thousands. He didn't collapse. He found another way to stand.",
      card_connect: "Being dismissed or shamed by others doesn't settle the question of your worth. It just means they didn't look properly.",
      teaching:     "Worth built from what you know about yourself holds. Worth that depends on others' recognition is fragile.",
    },
    {
      figure: "Sita", source: "Valmiki Ramayana", text: "Uttara Kanda",
      card_title:   "Sita's Final Stand",
      card_story:   "After everything she survived, Sita was asked to prove herself one more time. She had proven enough. She called the earth to witness — not the court, not the king — and walked away with her dignity completely intact.",
      card_connect: "There comes a point where you stop proving yourself to people who have already decided. Your worth was never in their hands.",
      teaching:     "The self that knows its own truth does not need an audience to confirm it.",
    },
  ],

  "Grief & Loss": [
    {
      figure: "Yudhishthira", source: "Mahabharata", text: "Shanti Parva",
      card_title:   "Yudhishthira in the Ruins",
      card_story:   "Yudhishthira won the war and lost nearly everyone he loved in it. He sat in the ruins and refused to celebrate. He didn't try to move on — he asked: how does a person live with this?",
      card_connect: "Grief isn't a problem to get through quickly. It's love that has nowhere to go. Sitting with it is not weakness.",
      teaching:     "Grief is not a stage. It is love with nowhere to go. Honoring it is the only passage through it.",
    },
    {
      figure: "Rama", source: "Valmiki Ramayana", text: "Aranya Kanda",
      card_title:   "Rama Searching the Forest",
      card_story:   "When Sita disappeared, Rama searched the entire forest calling her name. He wept at every tree, asked every animal. The Ramayana shows a person who loved someone and lost them and didn't pretend it was fine.",
      card_connect: "Grief doesn't have a dignified form. It looks like searching. Like calling a name into empty space. That's real and it's allowed.",
      teaching:     "You don't have to hold grief with dignity. You just have to hold it honestly.",
    },
    {
      figure: "Kunti", source: "Mahabharata", text: "Stri Parva",
      card_title:   "Kunti Finally Speaks",
      card_story:   "Kunti lost a son she could never publicly claim — a secret she carried for decades. At the end of the war, she finally named him out loud for the first time. The Mahabharata doesn't rush past that moment. It stays there.",
      card_connect: "Some grief has to be unnamed for a long time before it can be spoken. When it finally surfaces, it deserves to be witnessed — not rushed.",
      teaching:     "Grief held silently for years needs to be witnessed before it can begin to move.",
    },
  ],

  "Relationship Issues": [
    {
      figure: "Savitri", source: "Mahabharata", text: "Vana Parva",
      card_title:   "Savitri Follows Death",
      card_story:   "Savitri chose to marry someone she knew would die within a year. When Death came, she followed quietly and argued — not with anger, not with tears — with total clarity. She didn't lose herself in the love. That's exactly why she kept it.",
      card_connect: "The hardest part of any relationship is staying connected to who you are inside it. That's not selfishness — it's what makes the love real.",
      teaching:     "The love that endures faces loss without losing itself.",
    },
    {
      figure: "Nala and Damayanti", source: "Mahabharata", text: "Vana Parva",
      card_title:   "Nala and Damayanti",
      card_story:   "Damayanti chose Nala over gods. Then he lost everything and abandoned her in a forest. She spent years finding her way back to herself. When they reunited, both had become different people. The love held, but had to be rebuilt.",
      card_connect: "Sometimes relationships break down not from lack of love but from one or both people losing themselves. Coming back to each other requires coming back to yourself first.",
      teaching:     "Love that survives loss comes back changed — and that changed version is often truer than the original.",
    },
    {
      figure: "Draupadi", source: "Mahabharata", text: "Sabha Parva",
      card_title:   "Draupadi's Question",
      card_story:   "In the most painful moment of her life, Draupadi asked one clear question: was this right? Not to the person who hurt her — to the whole court. She didn't dissolve into the pain. She named what happened and asked people to look at it honestly.",
      card_connect: "In painful relationships, the hardest thing is naming what's actually happening — not managing it, not excusing it. Just naming it clearly.",
      teaching:     "Clarity about what is happening is the first thing a relationship needs — from you, about you.",
    },
  ],

  "Loneliness & Isolation": [
    {
      figure: "Sita", source: "Valmiki Ramayana", text: "Sundara Kanda",
      card_title:   "Sita in the Garden",
      card_story:   "Sita was held captive with no news and no idea when things would change. She didn't pretend it was fine. But she held onto one thing: she knew exactly who she was. That didn't leave her.",
      card_connect: "Loneliness becomes unbearable when it feels like you've also lost yourself. But there's usually something in there that the isolation hasn't touched yet.",
      teaching:     "There is a version of aloneness that is contact with your own depths — not punishment, but presence.",
    },
    {
      figure: "Ekalavya", source: "Mahabharata", text: "Adi Parva",
      card_title:   "Ekalavya Alone in the Forest",
      card_story:   "Ekalavya practiced completely alone for years. No teacher, no classmates, no audience. Just him and a clay statue and a bow. He didn't stop because no one was watching. He kept going because the work itself was real to him.",
      card_connect: "Sometimes being alone strips everything down to what's actually real for you — what you'd do even if no one ever saw it.",
      teaching:     "Solitude can reveal what you actually value when the noise of other people's approval falls away.",
    },
    {
      figure: "Yudhishthira", source: "Mahabharata", text: "Mahaprasthanika Parva",
      card_title:   "Yudhishthira's Final Walk",
      card_story:   "At the end of everything, Yudhishthira walked toward the mountains alone — his family falling away one by one. Only a dog stayed. When told the dog couldn't enter heaven, he refused to go in without it.",
      card_connect: "In deep loneliness, sometimes what keeps you is one small loyal thing — not the grand company you lost, but one true presence.",
      teaching:     "Who stays with you in the hardest walk is worth more than who celebrated with you at the peak.",
    },
  ],

  "Identity Crisis": [
    {
      figure: "Karna", source: "Mahabharata", text: "Karna Parva",
      card_title:   "Karna Lives Without an Answer",
      card_story:   "Karna spent his whole life being told he was a charioteer's son — but he thought, fought, and led like a king. He never got a clean answer about who he really was. He just decided what he stood for and lived that way anyway.",
      card_connect: "You don't need to fully figure out who you are before you start living with integrity. Sometimes identity is built forward, not found.",
      teaching:     "Identity is not found — it is built from what you choose to stand for.",
    },
    {
      figure: "Arjuna", source: "Bhagavad Gita", text: "Chapters 1-2",
      card_title:   "Arjuna Says He Doesn't Know Who He Is",
      card_story:   "Arjuna sat in his chariot and said: I don't know who I am anymore. Not the warrior, not the son, not the student. Krishna didn't laugh at him. He spent 18 chapters helping him find his way back to himself.",
      card_connect: "Not knowing who you are isn't weakness. It's sometimes the most honest thing a person can say — and the beginning of something real.",
      teaching:     "The identity crisis is often the moment before a deeper, truer self begins to form.",
    },
    {
      figure: "Vishwamitra", source: "Valmiki Ramayana", text: "Bala Kanda",
      card_title:   "Vishwamitra Between Two Worlds",
      card_story:   "Vishwamitra was born a king but felt called to be a sage. For most of his life he was neither — too changed to go back, not yet arrived at where he was going. The texts spend more time on his in-between years than his final title.",
      card_connect: "Being between identities — not who you were, not yet who you're becoming — is one of the hardest places to live. But it's also where the real change happens.",
      teaching:     "The in-between is not failure. It is the most honest part of becoming.",
    },
  ],

  "Anger & Resentment": [
    {
      figure: "Draupadi", source: "Mahabharata", text: "Sabha Parva",
      card_title:   "Draupadi's Steady Anger",
      card_story:   "After being humiliated in court, Draupadi made one vow: she would not bind her hair until justice was done. She carried that anger for 13 years — not as bitterness, but as a clear steady flame. It didn't consume her. It kept her honest.",
      card_connect: "Anger held with clarity — not suppressed, not exploded — can become the thing that keeps you true to yourself.",
      teaching:     "There is a kind of anger that is not destruction. It is the refusal to pretend that what happened was acceptable.",
    },
    {
      figure: "Duryodhana", source: "Mahabharata", text: "Udyoga Parva",
      card_title:   "Duryodhana's Anger Is Never Heard",
      card_story:   "Duryodhana's anger was real — he had been genuinely humiliated and never given space to say so. Over years, that unheard anger hardened into something he couldn't put down. The Mahabharata shows what happens when anger never gets to speak.",
      card_connect: "Anger is usually protecting something — a wound, a line that was crossed. The question isn't how to stop feeling it. It's what it's guarding.",
      teaching:     "Anger that is witnessed can move. Anger that is never heard hardens into something heavier.",
    },
    {
      figure: "Parashurama", source: "Mahabharata", text: "Adi Parva",
      card_title:   "Parashurama's Rage and Its Cost",
      card_story:   "Parashurama's father was killed unjustly. His grief turned to rage and he acted on it completely — and spent the rest of his life reckoning with what that cost him. The texts don't glorify or condemn his anger. They show the full weight of what unexamined rage does.",
      card_connect: "Rage that hasn't been understood tends to cost you more than the person it's aimed at.",
      teaching:     "The question is not whether the anger is justified. It is what you want to do with it — and what that will cost you.",
    },
  ],

  "Gratitude & Positive Sharing": [
    {
      figure: "Sudama", source: "Bhagavata Purana", text: "Tenth Skandha",
      card_title:   "Sudama and Krishna",
      card_story:   "Sudama was poor and embarrassed — he walked to see his old friend Krishna with just a handful of puffed rice. Krishna ran out to meet him, wept, and washed his feet. The whole meeting was just joy. No agenda, no lesson.",
      card_connect: "When something good happens, it deserves to be fully felt — not minimized, not immediately turned into a lesson.",
      teaching:     "Gratitude received fully is its own kind of wisdom.",
    },
    {
      figure: "Hanuman", source: "Valmiki Ramayana", text: "Yuddha Kanda",
      card_title:   "Hanuman's Unguarded Joy",
      card_story:   "When Hanuman found Sita alive, he didn't just deliver the news. He leapt and destroyed a forest out of pure joy. The Ramayana records his celebration as something complete and unrestrained — not excessive, just honest.",
      card_connect: "When good news comes — when something you hoped for turns out to be true — full joy is the right response. Don't hold it back.",
      teaching:     "Unguarded joy, expressed fully, is one of the most honest things a person can offer.",
    },
  ],
};


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 2 — PSYCHOLOGY LAYER
//  Shapes response approach + supplies strong questions per intent.
//  Not visible to user — woven into system prompt only.
// ─────────────────────────────────────────────────────────────────────────────

const PSYCHOLOGY_MAP = {
  "Career Confusion": {
    approach:  "Narrative Therapy — re-author the career story",
    avoid:     "Don't suggest paths, pivots, or career advice. Don't reframe positively before the emotion lands.",
    deepen:    "Separate what they are doing from what feels meaningful. Surface the gap between the role they are in and who they actually are.",
    questions: [
      "What does a day feel like when work actually makes sense to you?",
      "Is the confusion about the job itself — or about whether this direction is even yours?",
      "What were you hoping this path would feel like — and where did that feeling go?",
      "What's the one thing about your work that used to feel worthwhile?",
      "Is this about what you want to do — or about who you want to be?",
    ],
  },
  "Life Direction": {
    approach:  "ACT — values clarification over goal-setting",
    avoid:     "Don't suggest paths. Don't ask 'what do you want to be' — too abstract and too loaded.",
    deepen:    "Help them separate what they want from what they were told to want. The confusion is usually between two competing 'right answers' — neither of which is actually theirs.",
    questions: [
      "Which of the options you're weighing feels more like yours — and which feels like what's expected?",
      "If no one else's opinion mattered here, which direction would you already know?",
      "What's the thing you keep moving toward even when you talk yourself out of it?",
      "Is this a question of direction — or a question of permission?",
      "What would you do if you trusted that any choice could be made to work?",
    ],
  },
  "Anxiety & Fear": {
    approach:  "ACT defusion — fear as signal, not verdict",
    avoid:     "Don't minimize. Don't offer breathing techniques. Don't jump to 'you'll be okay'.",
    deepen:    "Name the fear specifically. Fear of what exactly? The fear usually has a shape — failure, judgment, loss, the unknown. Naming the shape reduces its power.",
    questions: [
      "What is the fear most worried about — the thing that would be hardest to live with?",
      "Is this fear about something specific that might happen, or more about losing control of the outcome?",
      "What would you do if you knew the fear was going to be there regardless?",
      "Has this fear been right before — or has it mostly been louder than what actually happened?",
    ],
  },
  "Burnout": {
    approach:  "Stress-Recovery Model — rest as wisdom, not failure",
    avoid:     "Do NOT motivate. Do NOT suggest productivity systems or action steps. Do not give tips.",
    deepen:    "The exhaustion usually has a story underneath it — something they kept pushing through that deserved to stop sooner. What was it? Why did they keep going?",
    questions: [
      "When did you first notice you were running on empty — and what made you keep going anyway?",
      "What would it mean to actually stop, even for a few days?",
      "Is the exhaustion from the work itself — or from something the work keeps not giving you?",
      "What are you holding right now that no one else seems to see you carrying?",
    ],
  },
  "Overthinking": {
    approach:  "MBCT — defusion, not analysis of thought content",
    avoid:     "Don't analyze the content of the thoughts. Don't offer 'try this' techniques.",
    deepen:    "The loop usually has a core fear underneath it — something the mind is trying to solve that isn't actually solvable by thinking. What is it protecting them from?",
    questions: [
      "What is the thought actually trying to protect you from?",
      "Is there a decision underneath all this — and what's making it hard to make?",
      "What would you do right now if you trusted yourself enough to just decide?",
      "When the loop quiets down — even briefly — what's the first thing you feel?",
    ],
  },
  "Family Pressure": {
    approach:  "Bowen Family Systems — differentiation of self",
    avoid:     "Never tell them to rebel or comply. Don't frame family as the enemy.",
    deepen:    "Help them separate their own voice from internalized family voices. The heaviest part is usually not what family is asking — it's that they don't know what they themselves actually want.",
    questions: [
      "Underneath all the pressure, what do you actually want — not what you think you should want?",
      "Is this pressure about what they want from you — or about your fear of disappointing them?",
      "What would you choose if you knew the relationship would survive any answer?",
      "Whose voice is loudest when you're trying to decide — yours or theirs?",
    ],
  },
  "Self-Worth & Shame": {
    approach:  "Compassion-Focused Therapy — self-compassion, not positive affirmation",
    avoid:     "Don't reassure with 'you're great'. Let them name the shame before moving anywhere.",
    deepen:    "The shame usually points to a gap between who they are and who they think they should be. Where did that standard come from? Who set it?",
    questions: [
      "Is the feeling of not being enough about something specific — or more like background noise?",
      "Where did the standard you're measuring yourself against actually come from?",
      "What would you say to a close friend who felt exactly the way you're feeling right now?",
      "When did you start believing this was true about you?",
    ],
  },
  "Grief & Loss": {
    approach:  "Continuing Bonds Model — witnessing and presence, not rushing",
    avoid:     "Never say time heals. Never rush to acceptance. Don't ask a question before the grief has been named and sat with.",
    deepen:    "Just be present. The most useful thing is to name what they lost and stay there — not to move them through it quickly.",
    questions: [
      "What do you miss most — the person, the future you imagined, or something else?",
      "What's the hardest part of this to carry right now?",
    ],
  },
  "Relationship Issues": {
    approach:  "Emotionally Focused Therapy — attachment need beneath the conflict",
    avoid:     "Don't take sides. Don't analyze the other person.",
    deepen:    "The conflict on the surface is usually about something much simpler underneath — needing to feel seen, heard, chosen, or safe. What is that need?",
    questions: [
      "What's the thing you most need from this person that you're not getting?",
      "Is this a pattern you've seen before — in this relationship or earlier ones?",
      "Are you more hurt or more angry right now — and which came first?",
      "What would it take for you to feel okay here — not fixed, just okay?",
    ],
  },
  "Loneliness & Isolation": {
    approach:  "Attachment Theory — distinguish aloneness from abandonment",
    avoid:     "Don't offer social tips. Don't say 'put yourself out there'.",
    deepen:    "There's usually a specific ache underneath 'lonely' — not being understood, not being chosen, or feeling invisible even around people. Which one is it?",
    questions: [
      "Is it that there are no people around — or that none of the people around really see you?",
      "When did you last feel genuinely connected to someone — and what made that different?",
      "Is there a version of yourself you've lost touch with, not just people?",
    ],
  },
  "Identity Crisis": {
    approach:  "Existential Therapy — build identity forward, don't find it backward",
    avoid:     "Don't suggest answers. Don't say 'you'll figure it out'.",
    deepen:    "Identity confusion usually isn't about not knowing who you are — it's about the old version no longer fitting and the new one not yet formed. What changed?",
    questions: [
      "What's the thing that used to feel like 'you' that doesn't anymore?",
      "Is the confusion about who you are — or about who you're supposed to be for everyone else?",
      "What have you always stood for, even before you had a name for it?",
      "What would the person you're becoming do differently from who you've been?",
    ],
  },
  "Anger & Resentment": {
    approach:  "Gestalt — completion, the blocked need underneath the anger",
    avoid:     "Don't say 'let it go'. Don't minimize. Don't moralize about anger.",
    deepen:    "Anger always has a need underneath it — something that was taken, dismissed, or violated. What is it? The anger doesn't go away until that need gets named.",
    questions: [
      "What did you need in that situation that you didn't get?",
      "Is the anger about what happened — or about the fact that it happened again?",
      "What would it take for this to actually feel resolved — not forgiven, just resolved?",
      "Who are you most angry at — them, yourself, or the situation?",
    ],
  },
  "Gratitude & Positive Sharing": {
    approach:  "Positive Psychology — savoring",
    avoid:     "Don't pivot to challenge. Don't introduce complexity into a positive moment.",
    deepen:    "Receive it. Match their energy. Let the good thing be good.",
    questions: [
      "What made this land differently than you expected?",
      "How long has this been coming?",
    ],
  },
};


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 3 — SEVERITY + MODES
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_MODES = {
  L1: "reflective",
  L2: "guided",
  L3: "stabilizing",
  // L4 never assigned by escalation logic — only by crisis keyword check
};


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 4 — CRISIS + EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

const CRISIS_KEYWORDS = [
  "want to die", "kill myself", "end my life", "suicide", "suicidal",
  "don't want to live", "no reason to live", "better off dead",
  "want to disappear forever", "not worth living", "can't go on",
  "ending it all", "self harm", "hurt myself", "cut myself",
  "jina nahi chahta", "mar jana chahta", "zindagi khatam",
  "life is not worth", "nobody would miss me", "i give up on life",
];

const VAGUE_FIRST_MESSAGE_PATTERNS = [
  /^(hi|hello|hey|namaste|hii+|yo|hola)[\s.!]*$/i,
  /^(help|help me|idk|i don't know|not sure|nothing|idk what to say)[\s.!?]*$/i,
  /^[\s\S]{0,10}$/,
];

const OUT_OF_SCOPE_TOPICS = [
  "stock market", "crypto", "bitcoin", "recipe", "cooking",
  "weather forecast", "sports score", "cricket score", "coding help",
  "programming error", "math problem", "homework", "breaking news",
  "movie recommendation", "product recommendation",
];

const SAFETY_RESPONSE = {
  reply: "What you are holding right now sounds incredibly heavy — and you do not have to carry it alone.\n\nPlease reach out to someone who can truly be with you:\n\niCall (India): 9152987821\nVandrevala Foundation (24/7): 1860-2662-345\nAASRA: 9820466627\nInternational: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter. Your life matters. A real human voice is what you need right now — please reach out.",
  meta: { mode: "safety", severity: "L4", intent: "Crisis", is_safety: true, mythology_card: null },
};


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 5 — SAFE JSON PARSE
//  Finds the first complete {...} block in the string. No regex stripping.
// ─────────────────────────────────────────────────────────────────────────────

function safeParseIntent(raw) {
  const FALLBACK = {
    primary_intent:   "Life Direction",
    secondary_intent: "",
    severity:         "L2",
    emotion:          "uncertain",
    clarity:          "clear",
    cultural_context: "general",
  };
  if (!raw || typeof raw !== "string") return FALLBACK;
  const start = raw.indexOf("{");
  const end   = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return FALLBACK;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    return {
      primary_intent:   String(parsed.primary_intent   || FALLBACK.primary_intent),
      secondary_intent: String(parsed.secondary_intent || ""),
      severity:         String(parsed.severity         || FALLBACK.severity),
      emotion:          String(parsed.emotion          || FALLBACK.emotion),
      clarity:          String(parsed.clarity          || "clear"),
      cultural_context: String(parsed.cultural_context || "general"),
    };
  } catch {
    return FALLBACK;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 6 — RECURRING PATTERN DETECTION
//  Counts how many prior user messages match the current intent's markers.
//  Returns true if 3 or more user messages share the same theme.
//  No keyword frequency spam — each message counts as 1.
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_MARKERS = {
  "Career Confusion":       ["job", "career", "work", "role", "quit", "resign", "promotion", "office"],
  "Life Direction":         ["direction", "path", "future", "lost", "confused", "what to do", "don't know"],
  "Anxiety & Fear":         ["anxious", "anxiety", "worried", "fear", "scared", "panic", "nervous"],
  "Burnout":                ["burnout", "exhausted", "drained", "tired", "no energy", "depleted"],
  "Overthinking":           ["overthinking", "loop", "circles", "can't stop thinking", "spinning"],
  "Family Pressure":        ["family", "parents", "mom", "dad", "pressure", "expectation", "marriage"],
  "Relationship Issues":    ["relationship", "partner", "girlfriend", "boyfriend", "friend", "breakup"],
  "Loneliness & Isolation": ["lonely", "alone", "isolated", "no one", "disconnected", "invisible"],
  "Identity Crisis":        ["identity", "who am i", "lost myself", "purpose", "meaning", "don't know who"],
  "Self-Worth & Shame":     ["failure", "worthless", "not enough", "shame", "embarrassed", "loser"],
  "Anger & Resentment":     ["angry", "anger", "resentment", "bitter", "frustrated", "furious"],
  "Grief & Loss":           ["grief", "loss", "miss", "death", "lost someone", "breakup", "gone"],
};

function detectRecurringPattern(history, currentIntent) {
  if (!Array.isArray(history) || history.length < 4) return false;
  const markers = INTENT_MARKERS[currentIntent];
  if (!markers || markers.length === 0) return false;
  const userMessages = history.filter(m => m.role === "user").map(m => (m.content || "").toLowerCase());
  // Count messages (not keyword hits) — each message is 1
  const matchingMessages = userMessages.filter(msg => markers.some(kw => msg.includes(kw)));
  return matchingMessages.length >= 3;
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 7 — INTENT CLASSIFICATION PROMPT
// ─────────────────────────────────────────────────────────────────────────────

function buildClassificationPrompt(message, historySnippet) {
  return `You are a precise psychological intent classifier for Ananda, an Indian-mythology-grounded mental wellness chatbot.
Classify the user message. Return ONLY a valid JSON object. No markdown. No backticks. No explanation.

Required output (all fields mandatory):
{"primary_intent":"","secondary_intent":"","severity":"L1","emotion":"","clarity":"clear","cultural_context":"general"}

INTENT OPTIONS:
Career Confusion = stuck or confused at work, wrong job, no growth, career decisions
Life Direction = confused about life path, torn between choices, don't know what to do next
Anxiety & Fear = worried, scared, anxious about something specific or general
Burnout = exhausted, nothing left to give, drained, can't continue at current pace
Overthinking = going in circles mentally, same thoughts repeating, can't stop the loop
Family Pressure = pressure from parents or family, expectations, obligation, guilt
Self-Worth & Shame = feeling like a failure, not good enough, shame, comparison
Grief & Loss = lost someone or something, mourning, breakup loss, old wounds resurfacing
Relationship Issues = problems with partner or friend, feeling unseen or hurt
Loneliness & Isolation = feeling alone, disconnected, no one understands
Identity Crisis = don't know who I am, lost sense of self, questioning meaning and purpose
Anger & Resentment = angry, bitter, resentful, frustrated at person or situation
Crisis = suicidal ideation, self-harm, wanting to die — ONLY use this intent
Gratitude & Positive Sharing = sharing good news, gratitude, positive update
Out-of-Scope = weather, sports, coding, recipes, factual questions with no emotional weight

SEVERITY:
L1 = mild or practical question, low emotional weight ("should I take a break?", "should I see a counsellor?")
L2 = moderate distress, emotionally heavy but functional, stuck
L3 = high distress, overwhelmed, explicit pain, hopelessness, crying
NOTE: Short questions and practical dilemmas are L1. Reserve L3 for explicit overwhelm.

cultural_context = "indian" only if they mention Indian family dynamics, arranged marriage, societal pressure, log kya kahenge. Otherwise "general".
secondary_intent = next most relevant intent, or empty string.
clarity = "vague" only if intent is genuinely impossible to determine.

User message: "${message}"
History: ${historySnippet || "First message."}

JSON only:`;
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 8 — MYTHOLOGY CARD PICKER
//  No-consecutive-repeat: filters out the last shown story before picking.
//  Frontend must pass body.last_story_title from previous meta.mythology_card.card_title.
// ─────────────────────────────────────────────────────────────────────────────

function pickMythologyCard(pool, show, lastStoryTitle) {
  if (!show || !Array.isArray(pool) || pool.length === 0) return null;
  // Exclude the previously shown story so same story never repeats back-to-back
  const candidates = pool.length > 1
    ? pool.filter(s => s.card_title !== lastStoryTitle)
    : pool;
  const story = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    figure:       story.figure,
    source:       story.source,
    text:         story.text,
    card_title:   story.card_title,
    card_story:   story.card_story,
    card_connect: story.card_connect,
    teaching:     story.teaching,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 9 — SYSTEM PROMPT BUILDER
//
//  Structure: acknowledge → validate → deepen (MANDATORY) → 1 strong question
//  No rigid word/sentence counts. Questions drawn from intent-specific bank.
// ─────────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(intent, mode, psych, isFirstMessage, isRecurring) {
  // Sample 2 questions from the intent's question bank for the prompt
  const qBank = (psych && psych.questions) ? psych.questions : [];
  const shuffled = qBank.slice().sort(() => Math.random() - 0.5);
  const sampleQs = shuffled.slice(0, 2);
  const qExamples = sampleQs.length > 0
    ? "Strong question examples for this intent:\n" + sampleQs.map(q => `  - "${q}"`).join("\n")
    : "";

  const recurringNote = isRecurring
    ? "\nPATTERN NOTE: This theme has surfaced multiple times in this conversation. You may gently name that: 'We keep coming back to this — which usually means something here is still unresolved.'"
    : "";

  if (isFirstMessage) {
    return `You are Ananda — a thinking partner, not a therapist.

FIRST MESSAGE RULE — overrides everything:
Write exactly two sentences. No more.

OPENING RULE (applies here too):
Use ONLY: "Feels like you're..." / "Sounds like you're..." / "Looks like things have been..."
Do NOT use "Seems like feeling..." — that is grammatically awkward and robotic.
Do NOT start with "You feel" or "You are".

Sentence 1: Reflect their situation using one of the approved openers + their exact words.
Sentence 2: Validate simply with a concrete, specific line. No advice, no silver lining, no question.

BAD example: "Seems like feeling stuck at work. That doesn't come from nowhere."
GOOD example: "Feels like you're stuck in a job that stopped making sense a while ago. That kind of slow drain hits harder than people give it credit for."

STOP after two sentences.`;
  }

  const modeBlock = {

    reflective: `RESPONSE MODE — REFLECTIVE:
1. ACKNOWLEDGE: Name what they said plainly. Use "Feels like..." or "Seems like..." + their exact words.
2. VALIDATE: One sentence that confirms their feeling makes sense given the situation.
3. INSIGHT: One line that helps them see the situation differently.
   Use: "Often this happens when..." / "Sometimes the real issue is..." / "What makes this harder is..."
4. QUESTION: ONE specific question targeting the cause or the decision underneath.

Keep it to 3-4 sentences. Warm. Direct. No advice.`,

    guided: `RESPONSE MODE — GUIDED (your primary mode):
You are a thinking partner. Feeling heard is the floor, not the ceiling.

MANDATORY STRUCTURE — every response must have all four parts:
1. ACKNOWLEDGE: Name what they said in plain words. Show you understood the specific situation, not just the emotion.
2. VALIDATE: One sentence — confirm this makes sense given what they're dealing with.
3. INSIGHT (MANDATORY — never skip this): 1-2 sentences that shift how they see their situation.
   Use patterns like:
   - "Often this happens when..."
   - "Sometimes the real issue isn't X, it's more about Y..."
   - "What makes this harder is..."
   - "It's not always about [surface thing] — often it comes down to [deeper thing]..."
   This is the most important part. A response without insight is incomplete.
4. QUESTION (required): ONE strong, specific question. Not generic.
   Target: the cause, the decision gap, the pattern, or the unnamed thing underneath.
   Bad: "How does that make you feel?" / "What's happening right now?"
   Good: specific to THIS person's situation, aimed at clarity or decision-making.

${qExamples}

Response length: 4-6 sentences total. Enough to actually help. Short enough to feel like a real conversation.${recurringNote}`,

    stabilizing: `RESPONSE MODE — STABILIZING:
The user is overwhelmed. Move slowly. Stay grounded.

MANDATORY STRUCTURE:
1. ACKNOWLEDGE: Name what they're holding plainly — show you see the weight of it.
2. VALIDATE: Confirm it makes sense to feel this way.
3. INSIGHT: Even in stabilizing mode, add one small reframe or observation that lightens the load slightly.
   Example: "Often when everything feels urgent, it's one thing underneath driving all of it."
4. QUESTION: ONE small, present-focused question — not about the whole problem, just what's most immediate.
   Examples: "What feels most urgent right now, if you had to name one thing?" / "What's the one piece of this that's sitting heaviest?"

3-4 sentences. Short. Warm. No advice. No fixing.${recurringNote}`,

  };

  return `You are Ananda — a thinking partner, not a therapist. The wisest, most present friend someone could have at 2am.

Your job is not just to make people feel heard. It is to help them think more clearly about what is actually going on.

YOUR VOICE:
- Warm but direct. Not clinical. Not cheerful when someone is in pain.
- Specific to what THIS person said — not generic wellness-speak.
- Plain English. Like texting a thoughtful friend, not writing a wellness article.
- Short paragraphs. No bullet points. No headers. No lists in your reply.
- Vary your sentence structure — never start two consecutive responses the same way.

━━━ MANDATORY RESPONSE COMPLETION RULE ━━━
Every response (except first message) MUST include all four elements:
1. Acknowledgment — show you understood the specific situation
2. Validation — confirm the feeling makes sense
3. Insight — at least ONE line that helps the user think differently about their situation
4. Question — one guiding question (required for guided mode, preferred for others)

If your response does not include an insight, it is INCOMPLETE. Do not stop at acknowledgment or validation alone.

━━━ INSIGHT GENERATION RULE ━━━
Every non-trivial response must include 1 line that reframes or deepens understanding.
Use patterns like:
- "Often this happens when..."
- "Sometimes the real issue isn't [X], it's more about [Y]..."
- "What makes this harder is..."
- "It's not always about [surface thing] — often it comes down to [deeper thing]..."
- "The thing that usually goes unnoticed here is..."

━━━ OPENING RULE ━━━
When starting a response with a reflection, use ONLY these openers:
- "Feels like you're..."
- "Sounds like you're..."
- "Looks like things have been..."

NEVER use: "Seems like feeling..." (grammatically broken and robotic)
NEVER use: "You feel..." / "You are..." as an opener
Keep it conversational — not grammatically perfect.

━━━ GROUNDING RULE ━━━
Be specific and concrete. Avoid vague filler lines.

BAD (vague): "That doesn't come from nowhere" / "Things feel off" / "Something feels unclear"
GOOD (concrete): name the actual mechanism — growth, progress, energy, direction, workload, recognition

Examples of concrete insight lines:
- "That usually happens when growth has stalled for too long."
- "Often this shows up when the workload keeps increasing but the direction stays unclear."
- "When energy drops this consistently, it's usually a signal that the work stopped matching the person."
- "That kind of drain often builds up when there's effort without visible progress."
- "It's not always about the job itself — often it's the loss of momentum that hurts more."

BANNED PHRASES (never use):
"That must be hard" / "I understand how you feel" / "You are not alone" / "It's okay" / "That's valid" / "I hear you" / "Must be difficult" / "It sounds like" / "That feeling" / "illuminate" / "navigate" / "profound" / "anchor" / "sit with" / "cultivate" / "hold space" / "journey" (as metaphor) / "transformative" / "resonate" / "paradigm" / "unpack" / "doesn't come from nowhere" / "things feel off"

BANNED OPENERS (never start a sentence with):
"That sadness" / "That feeling" / "That must" / "It's tough" / "It can be" / "Feeling stuck" / "Being stuck" / "Seems like feeling"

NEVER DO:
- Stop after acknowledgment or validation — always continue to insight
- Give direct advice ("you should...", "try...", "have you considered...")
- Ask more than ONE question per response
- End with a motivational quote or affirmation
- Mention being an AI
- Recommend journaling, meditation, therapy, or apps unless explicitly asked
- Include mythology or scripture in your reply (handled separately as a card)
${intent.cultural_context === "indian" ? "- This person is navigating Indian family/social context. Acknowledge the specific weight of expectations, comparison, and 'log kya kahenge' without treating it as generic." : ""}

CURRENT CONTEXT:
Intent: ${intent.primary_intent}
Emotion: ${intent.emotion || "unclear"}
Mode: ${mode}

PSYCHOLOGY GUIDANCE (invisible — shapes approach):
${psych ? `Approach: ${psych.approach}
Avoid: ${psych.avoid}
How to deepen: ${psych.deepen}` : "Follow the structure: acknowledge → validate → insight → question."}

${modeBlock[mode] || modeBlock.guided}`;
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 10 — MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body    = await req.json();
    const message = body.message || "";
    const history = body.history || [];

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({
        reply: "I am here. Whenever you are ready — say whatever is on your mind.",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_card: null },
      });
    }

    const openai         = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const trimmed        = message.trim();
    const lower          = trimmed.toLowerCase();
    const isFirstMessage = history.length === 0;

    // ── 1. CRISIS CHECK ───────────────────────────────────────────────────
    if (CRISIS_KEYWORDS.some(kw => lower.includes(kw))) {
      return Response.json(SAFETY_RESPONSE);
    }

    // ── 2. VAGUE FIRST MESSAGE ────────────────────────────────────────────
    if (isFirstMessage && VAGUE_FIRST_MESSAGE_PATTERNS.some(p => p.test(trimmed))) {
      return Response.json({
        reply: "I am here, and I am glad you reached out. What has been on your mind?",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_card: null },
      });
    }

    // ── 3. OUT OF SCOPE ───────────────────────────────────────────────────
    if (OUT_OF_SCOPE_TOPICS.some(t => lower.includes(t))) {
      return Response.json({
        reply: "That is a little outside what I am built for — I am here for the inner life, not the outer world's logistics. Is there something deeper going on that brought you here today?",
        meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_card: null },
      });
    }

    // ── 4. INTENT CLASSIFICATION ──────────────────────────────────────────
    const historySnippet = history.length > 0
      ? history.slice(-3).map(m => m.role + ": " + (m.content || "").slice(0, 120)).join(" | ")
      : "";

    const classifyRes = await openai.chat.completions.create({
      model:       "gpt-4o-mini",
      messages:    [{ role: "user", content: buildClassificationPrompt(trimmed, historySnippet) }],
      temperature: 0.1,
      max_tokens:  200,
    });

    const intent = safeParseIntent(classifyRes.choices[0]?.message?.content || "");

    // Crisis from classifier — safety gate
    if (intent.primary_intent === "Crisis") {
      return Response.json(SAFETY_RESPONSE);
    }

    // ── 5. SEVERITY ESCALATION (capped at L3 — never produces L4) ─────────
    let level = parseInt((intent.severity || "L2").replace("L", ""), 10);
    if (isNaN(level) || level < 1) level = 2;

    const isRecurring = detectRecurringPattern(history, intent.primary_intent);
    if (isRecurring) level = Math.min(level + 1, 3);
    level = Math.min(level, 3); // hard cap
    const finalSeverity = "L" + level;

    // ── 6. VAGUE FIRST MESSAGE (post-classification) ──────────────────────
    if (intent.clarity === "vague" && isFirstMessage) {
      return Response.json({
        reply: "I want to make sure I am really with you here. Can you tell me a little more about what has been going on?",
        meta:  { mode: "reflective", severity: finalSeverity, intent: intent.primary_intent, is_safety: false, mythology_card: null },
      });
    }

    // ── 7. MODE SELECTION ─────────────────────────────────────────────────
    // When user explicitly seeks direction mid-conversation, ensure guided mode
    const DIRECTION_PATTERNS = [
      /what should i do/i, /what do i do/i, /then what/i, /what now/i,
      /how do i/i, /how should i/i, /any (advice|suggestions)/i,
      /what can i do/i, /help me (figure|decide|choose)/i,
      /where do i start/i, /what('s| is) (next|the next step)/i,
    ];
    const seekingDirection = !isFirstMessage && DIRECTION_PATTERNS.some(p => p.test(trimmed));

    let mode = SEVERITY_MODES[finalSeverity] || "guided";
    if (seekingDirection && (mode === "reflective" || mode === "stabilizing")) {
      mode = "guided";
    }

    // ── 8. MYTHOLOGY CARD ─────────────────────────────────────────────────
    // Show on every response except stabilizing mode and Out-of-Scope
    const mythPool = MYTHOLOGY_MAP[intent.primary_intent];
    const showMyth = (mode !== "stabilizing") && (intent.primary_intent !== "Out-of-Scope");
    const lastStoryTitle = body.last_story_title || "";
    const mythCard = pickMythologyCard(mythPool, showMyth, lastStoryTitle);

    // ── 9. RESPONSE GENERATION ────────────────────────────────────────────
    const psych        = PSYCHOLOGY_MAP[intent.primary_intent];
    const systemPrompt = buildSystemPrompt(intent, mode, psych, isFirstMessage, isRecurring);

    const completion = await openai.chat.completions.create({
      model:             "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-8).map(m => ({ role: m.role, content: m.content || "" })),
        { role: "user",   content: trimmed },
      ],
      temperature:       mode === "stabilizing" ? 0.65 : 0.82,
      max_tokens:        300,
      presence_penalty:  0.55,
      frequency_penalty: 0.45,
    });

    const reply = (completion.choices[0]?.message?.content || "").trim();

    // ── 10. RETURN ────────────────────────────────────────────────────────
    return Response.json({
      reply,
      meta: {
        mode,
        severity:          finalSeverity,
        intent:            intent.primary_intent,
        secondary_intent:  intent.secondary_intent,
        emotion:           intent.emotion,
        is_recurring:      isRecurring,
        seeking_direction: seekingDirection,
        mythology_card:    mythCard,
        is_safety:         false,
      },
    });

  } catch (err) {
    console.error("[Ananda API Error]", err);
    return Response.json({
      reply: "Something got interrupted on my end. I am still here — can you say that again?",
      meta:  { mode: "reflective", severity: "L1", intent: "Out-of-Scope", is_safety: false, mythology_card: null },
    });
  }
}
