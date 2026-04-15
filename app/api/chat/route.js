// ═══════════════════════════════════════════════════════════════════════════════
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — STORY EVENTS DATASET
// ─────────────────────────────────────────────────────────────────────────────

const STORY_EVENTS = [
  {
    id: "KARNA_REJECTION", character: "Karna", source: "Mahabharata", event: "Denied participation at archery tournament due to birth",
    themes: ["rejection", "identity", "injustice", "talent-unrecognised"],
    intents: ["Career Confusion", "Self-Worth & Shame"],
    card_title: "Karna Is Told He Doesn't Belong",
    card_story: "Karna grew up as a charioteer's son, but thought and fought like a king. When he showed up at the great archery tournament, the crowd mocked him — wrong lineage, not allowed to compete. He stood there in front of thousands while people laughed. He didn't collapse. He found another way to stand — someone recognised him, gave him a kingdom of his own, and he walked into history as one of the greatest warriors who ever lived. The system had no place for him. He made his own place.",
    card_connect: "Feeling stuck in career often isn't about ability. It's about the world not yet having a category for what you actually are.",
    teaching: "What you build from your own values outlasts what others gave you permission to become.",
  },
  {
    id: "EKALAVYA_TRAINING", character: "Ekalavya", source: "Mahabharata", event: "Learns archery alone in the forest after being refused by Drona",
    themes: ["self-made", "discipline", "rejection", "alternative-path"],
    intents: ["Career Confusion"],
    card_title: "Ekalavya Builds His Own Path",
    card_story: "Ekalavya wanted to learn archery from Dronacharya — the greatest teacher of his time. Drona refused him. Wrong background, wrong caste, no place in the formal system. Instead of giving up, Ekalavya went into the forest alone and built a clay statue of Drona. He taught himself by watching, practising, and failing — day after day, with no audience and no approval. He became so skilled that he surpassed students who had everything he was denied. His path existed nowhere in advance. He had to walk it into being.",
    card_connect: "Not having a clear conventional path doesn't mean you're behind. Sometimes it means you're meant to build your own.",
    teaching: "The absence of a clear path is sometimes an invitation to build your own.",
  },
  {
    id: "ARJUNA_DOUBT", character: "Arjuna", source: "Bhagavad Gita", event: "Drops bow before battle, paralysed by confusion and grief",
    themes: ["confusion", "dharma", "clarity-sought", "identity"],
    intents: ["Career Confusion", "Life Direction"],
    card_title: "Arjuna and the Question of Right Action",
    card_story: "Arjuna had trained his whole life for one role. But sitting at the edge of the battlefield, he couldn't figure out which action was right. Krishna didn't hand him a career plan. He said: act from your nature, not from fear of how others will judge the outcome. The clarity you're looking for doesn't come from certainty — it comes from alignment with what you actually are.",
    card_connect: "Career confusion often isn't about not knowing what to do. It's about not yet knowing what you are — separate from what you were told to become.",
    teaching: "Action aligned with your nature produces clarity. Action taken from fear or comparison produces confusion.",
  },
  {
    id: "VISHWAMITRA_SHIFT", character: "Vishwamitra", source: "Valmiki Ramayana", event: "Leaves kingship to pursue something entirely different",
    themes: ["reinvention", "transformation", "starting-over"],
    intents: ["Career Confusion"],
    card_title: "Vishwamitra Walks Away From His Throne",
    card_story: "Vishwamitra was a powerful king who walked away from everything to become something entirely different. He failed repeatedly, burned out, and started over. Each time he came back with less ego and more clarity about what he was actually after. The texts spend more time on his exhaustion and restarts than on his eventual title.",
    card_connect: "Sometimes career confusion is the beginning of a bigger becoming — not a sign something is wrong.",
    teaching: "The path to what you're meant for is rarely straight, and rarely what you started with.",
  },
  {
    id: "SATYAKAMA_TRUTH", character: "Satyakama Jabala", source: "Chandogya Upanishad", event: "Speaks truth about not knowing his lineage — and is accepted by the teacher",
    themes: ["honesty", "identity", "not-knowing", "authentic-start"],
    intents: ["Career Confusion", "Self-Worth & Shame"],
    card_title: "Satyakama and the Question of Lineage",
    card_story: "Satyakama was asked by a great teacher: what is your lineage? He said honestly — I don't know. My mother doesn't know either. The teacher accepted him immediately, saying: only someone of true character speaks like that. He became one of the greatest students of his age.",
    card_connect: "Not knowing where you fit can feel like weakness. Sometimes it's the most honest place to start from.",
    teaching: "Honesty about not knowing is the beginning of real learning — not the end of it.",
  },
  {
    id: "KARNA_OUTSIDER", character: "Karna", source: "Mahabharata", event: "Lives his whole life as an outsider despite exceptional talent",
    themes: ["identity", "injustice", "belonging", "talent-unrecognised"],
    intents: ["Career Confusion", "Identity Crisis"],
    card_title: "Karna Lives Outside Every Category",
    card_story: "Karna was a warrior who didn't fit any box the world had made. Too noble to be a servant, too low-born for the court, too loyal to change sides. The world kept trying to define him by what he lacked. He kept defining himself by what he chose to stand for. That gap — between how the world saw him and who he knew himself to be — was the central tension of his entire life.",
    card_connect: "Feeling like you don't fit the system isn't always a problem to fix. Sometimes it's a description of someone the system hasn't caught up with yet.",
    teaching: "Identity is not what the world assigns you. It is what you choose to stand for regardless.",
  },
  {
    id: "RAMA_EXILE", character: "Rama", source: "Valmiki Ramayana", event: "Accepts 14-year exile on the eve of coronation without bitterness",
    themes: ["values", "duty", "loss-accepted", "clarity-through-values"],
    intents: ["Life Direction"],
    card_title: "Rama Chooses His Path",
    card_story: "Rama was about to be crowned king when in one night it was taken away. He was asked to walk into a forest for 14 years instead. He didn't spiral. He spent a few hours alone, got clear on what he valued, and walked out in the morning ready to go. Not because he didn't feel the loss — because he had decided what he would stand for, and that was steadier than what he was losing.",
    card_connect: "Sometimes direction isn't about what you want. It's about getting clear on what you value — and walking from there.",
    teaching: "Clarity about your own values is the only ground to stand on when the path disappears.",
  },
  {
    id: "NACHIKETA_QUEST", character: "Nachiketa", source: "Katha Upanishad", event: "Seeks truth from Death itself, refusing all temptations offered",
    themes: ["purpose", "truth-seeking", "refusing-easy-answers"],
    intents: ["Life Direction", "Overthinking"],
    card_title: "Nachiketa Refuses the Easy Answers",
    card_story: "Nachiketa walked to Death's door and waited three days for an answer about what truly matters. Death offered him wealth, pleasure, kingdoms — he refused all of it. He just wanted to know what was real. That refusal to be bought off by easier answers is what makes the Katha Upanishad worth reading thousands of years later.",
    card_connect: "When you're confused about direction, it's often because you're still searching for what's real to you — not just what looks good from the outside.",
    teaching: "The direction that lasts is built on what you actually know to be true, not what you were told to want.",
  },
  {
    id: "DHRUVA_SEARCH", character: "Dhruva", source: "Bhagavata Purana", event: "Young boy meditates alone to find something solid after feeling rejected and unseen",
    themes: ["purpose", "self-directed", "invisible-to-visible"],
    intents: ["Life Direction"],
    card_title: "Dhruva Goes Looking for Something Real",
    card_story: "Dhruva was a young boy who felt rejected and unseen. Everyone told him he was too young to seek what he was seeking. He went into the forest alone anyway and sat in meditation so completely that he became the pole star — the fixed point everything else revolves around. The search for direction started from feeling completely lost and invisible.",
    card_connect: "Sometimes the search for direction has to start from a place of feeling completely lost and unseen. That's not a bad starting point — it's often the truest one.",
    teaching: "The person who searches honestly from emptiness often finds something more solid than the person who never had to look.",
  },
  {
    id: "BHISHMA_VOW", character: "Bhishma", source: "Mahabharata", event: "Takes lifelong celibacy vow so his father can remarry — a sacrifice no one asked for",
    themes: ["sacrifice", "self-determination", "living-by-choice"],
    intents: ["Life Direction", "Family Pressure"],
    card_title: "Bhishma Chooses His Sacrifice",
    card_story: "Bhishma was the crown prince. He gave it all up — the throne, marriage, children, legacy — so his aging father could have happiness. No one forced him. He chose it completely. The Mahabharata doesn't frame this as saintly. It frames it as a person who decided what he would stand for, and then lived entirely inside that decision for the rest of his life.",
    card_connect: "Sometimes the direction you choose is less about what you gain and more about what you're willing to stand for consistently.",
    teaching: "A life built on one clear choice, fully lived, is more coherent than a life built on a thousand unclear ones.",
  },
  {
    id: "SHABARI_WAIT", character: "Shabari", source: "Valmiki Ramayana", event: "Waits years alone in the forest, certain Rama will come",
    themes: ["patience", "trust", "quiet-purpose", "long-wait"],
    intents: ["Life Direction"],
    card_title: "Shabari Waits With Certainty",
    card_story: "Shabari's teacher told her Rama would come. She stayed in the forest alone for years after her teacher died, keeping the ashram, keeping berries ready, waiting. She never wavered. When Rama finally came, she fed him fruit she had tasted herself to make sure only the sweetest ones were offered. The texts treat this as one of the most perfect moments of devotion in the epic.",
    card_connect: "Sometimes direction isn't about movement. It's about being clear enough about what you're waiting for that the waiting itself becomes purposeful.",
    teaching: "Patience that comes from genuine certainty is different from patience that comes from resignation.",
  },
  {
    id: "MEERA_DEVOTION", character: "Meera", source: "Bhakti tradition", event: "Chooses devotion to Krishna over royal duty, walks away from palace life",
    themes: ["freedom", "unconventional-path", "inner-voice-over-society"],
    intents: ["Life Direction", "Identity Crisis"],
    card_title: "Meera Walks Out",
    card_story: "Meera was a queen who sang devotional songs in the street. Her family was humiliated. The court tried to stop her. She kept going. She wasn't reckless — she was absolutely clear about what she valued more than status, approval, or safety. She walked away from a life that looked complete from the outside because it was empty on the inside.",
    card_connect: "Direction that's genuinely yours often looks irresponsible to people who've never felt that kind of clarity.",
    teaching: "The life that looks wrong from the outside can be exactly right from the inside.",
  },
  {
    id: "HANUMAN_DOUBT", character: "Hanuman", source: "Valmiki Ramayana", event: "Forgets his own power until an elder reminds him",
    themes: ["fear", "self-doubt", "forgotten-strength", "reminder"],
    intents: ["Anxiety & Fear"],
    card_title: "Hanuman Forgets He Can Fly",
    card_story: "Everyone said the ocean crossing was impossible. Hanuman had the power to do it easily — but had completely forgotten. An elder asked: do you not know what you carry? That one question was enough. He leapt.",
    card_connect: "Fear doesn't mean you can't do it. It often means you've temporarily forgotten what you already know about yourself.",
    teaching: "The question is not how to stop being afraid. It is what you know about yourself that is larger than this fear.",
  },
  {
    id: "SITA_WAIT", character: "Sita", source: "Valmiki Ramayana", event: "Waits alone in captivity with no news, holding onto inner clarity",
    themes: ["uncertainty", "inner-anchor", "no-external-certainty"],
    intents: ["Anxiety & Fear"],
    card_title: "Sita Alone With No Answers",
    card_story: "Sita was held captive with no news, no timeline, no certainty anyone was coming. She didn't pretend it was fine. But through all of it, she held onto one thing: the clarity of who she was. That didn't leave her even when everything else did.",
    card_connect: "When fear is about uncertainty, the anchor isn't the answer. It's knowing who you are inside the uncertainty.",
    teaching: "Fear of the unknown becomes bearable when you know what in you cannot be taken.",
  },
  {
    id: "PRAHLADA_FAITH", character: "Prahlada", source: "Bhagavata Purana", event: "Faces repeated torture by his own father and stays inwardly calm",
    themes: ["fear", "courage", "inner-resource", "external-threat"],
    intents: ["Anxiety & Fear"],
    card_title: "Prahlada Walks Through Fire",
    card_story: "Prahlada was thrown into fire, attacked by elephants, tortured — all by his own father. Each time, something in him stayed steady. Not because he was fearless, but because he had something inside that the fear couldn't reach.",
    card_connect: "Fear can be real and loud and still not be the final word. There's usually something in you it hasn't been able to touch.",
    teaching: "Courage isn't the absence of fear. It's having something inside that fear cannot reach.",
  },
  {
    id: "ABHIMANYU_ENTRY", character: "Abhimanyu", source: "Mahabharata", event: "Enters the chakravyuh formation knowing he may not get out",
    themes: ["courage", "fear", "moving-despite-odds", "commitment"],
    intents: ["Anxiety & Fear"],
    card_title: "Abhimanyu Enters Anyway",
    card_story: "Abhimanyu knew how to enter the chakravyuh — the impossible spiral formation — but not how to exit. He went in anyway. The Mahabharata doesn't call him reckless. It calls him brave in the way that matters — not fearless, but willing to move despite knowing the odds.",
    card_connect: "Sometimes you act not because you know how it ends, but because the action is still yours to take.",
    teaching: "Courage is often about moving into what you can't control, not waiting until you can.",
  },
  {
    id: "ARJUNA_FEAR", character: "Arjuna", source: "Bhagavad Gita", event: "Overwhelmed by fear of consequences before the battle begins",
    themes: ["fear", "consequences", "paralysis"],
    intents: ["Anxiety & Fear"],
    card_title: "Arjuna Picks Up His Bow Again",
    card_story: "After the longest conversation in Indian philosophy — after every fear and doubt was named out loud — Arjuna picked his bow back up. Not because the fear was gone. Because he had looked at it fully and chosen anyway.",
    card_connect: "Fear examined honestly often loses some of its power. You don't have to resolve it to move — you just have to look at it clearly.",
    teaching: "Action taken after honest examination of fear is different from action taken despite fear. One is clearer.",
  },
  {
    id: "ARJUNA_COLLAPSE", character: "Arjuna", source: "Bhagavad Gita", event: "Collapses emotionally on the battlefield, physically unable to continue",
    themes: ["burnout", "emotional-exhaustion", "collapse", "carrying-too-much"],
    intents: ["Burnout"],
    card_title: "Arjuna Sits Down",
    card_story: "Arjuna was the warrior everyone was counting on. He had been preparing for this for years. And then he sat down in the middle of the battlefield and simply could not go on. His bow fell. His body trembled. He was genuinely empty — the kind of empty that comes from carrying too much for too long. Krishna didn't immediately push him to get up. He sat down beside him first.",
    card_connect: "Burnout isn't a productivity problem. It's a signal that something important has run out. Sitting with that honestly is the first step — not pushing through it.",
    teaching: "The collapse is not the end. It is the moment before something more honest begins.",
  },
  {
    id: "YUDHISHTHIRA_EMPTY", character: "Yudhishthira", source: "Mahabharata", event: "Wins the war but feels only emptiness — cannot celebrate",
    themes: ["emptiness", "hollow-victory", "post-achievement-loss"],
    intents: ["Burnout"],
    card_title: "Yudhishthira Refuses to Celebrate",
    card_story: "Yudhishthira won the war and couldn't feel any joy. He sat in the ruins, exhausted in a way that victory couldn't fix. He didn't perform happiness. He stayed with the emptiness until something real came through.",
    card_connect: "Sometimes exhaustion goes deeper than the body. When even achieving things feels hollow — that's a different kind of tired. It deserves honesty, not a pep talk.",
    teaching: "The exhaustion that follows doing everything right is one of the loneliest feelings. It still deserves rest.",
  },
  {
    id: "SHIVA_WITHDRAW", character: "Shiva", source: "Puranas", event: "Withdraws into deep meditation, unreachable by the world",
    themes: ["withdrawal", "rest-as-power", "disengagement"],
    intents: ["Burnout"],
    card_title: "Shiva Disappears",
    card_story: "When the world got too loud, Shiva retreated into the mountains and went silent. The texts don't frame this as escape. They frame it as a god who understood that stillness is its own kind of power. Not everything that stops is broken. Some things stop because they've reached the limit of what output without rest can produce.",
    card_connect: "Stepping back completely isn't failure. It's sometimes the most honest response to having given everything.",
    teaching: "Rest is not absence. It is the condition that makes return possible.",
  },
  {
    id: "VISHWAMITRA_FAILURE", character: "Vishwamitra", source: "Valmiki Ramayana", event: "Fails repeatedly over years before achieving anything lasting",
    themes: ["exhaustion", "repeated-failure", "starting-over"],
    intents: ["Burnout"],
    card_title: "Vishwamitra Burns Out Again and Again",
    card_story: "Vishwamitra tried to force his way to greatness through sheer willpower. He failed. Burned out. Started over. Failed again. The texts spend more time on his exhaustion than his success — because that's where the real learning happened.",
    card_connect: "Burning out doesn't mean you're not strong enough. It usually means you've been pushing at something that needs rest, not more effort.",
    teaching: "Burnout is what happens when effort is not matched by rest. The body knows before the mind admits it.",
  },
  {
    id: "KRISHNA_ACTION", character: "Krishna", source: "Bhagavad Gita", event: "Cuts through Arjuna's spiralling thoughts with a single grounding question",
    themes: ["clarity", "action", "thought-loops-broken", "decisive"],
    intents: ["Overthinking"],
    card_title: "Krishna's One Question",
    card_story: "Arjuna's mind ran everywhere at once — his teachers, his cousins, his guilt, his dharma. Krishna didn't tell him to stop thinking. He asked one question: what is actually yours to do right now? That question cut through everything.",
    card_connect: "Overthinking usually means you're trying to solve everything at once. The question is only ever: what is mine to do right now?",
    teaching: "One clear action chosen from your values is worth more than a thousand thoughts about every possible outcome.",
  },
  {
    id: "ASHTAVAKRA_STILL", character: "Ashtavakra", source: "Ashtavakra Gita", event: "Points to the self that watches thought — already still, never caught in the loop",
    themes: ["awareness", "watcher-self", "stillness-beneath-thought"],
    intents: ["Overthinking"],
    card_title: "Ashtavakra and the Stillness Beneath Thought",
    card_story: "Ashtavakra was a sage who taught that the self watching the thoughts is always already still. The thoughts come and go. The one watching them doesn't move. He wasn't teaching detachment — he was pointing to something that was never caught in the loop to begin with.",
    card_connect: "There is a part of you that is not inside the overthinking. It's the part noticing it. That part has never been tangled.",
    teaching: "You are not your thoughts. You are the one watching them — and that watcher is already still.",
  },
  {
    id: "NACHIKETA_CHOICE", character: "Nachiketa", source: "Katha Upanishad", event: "Rejects every temptation offered and waits three days in silence for what is real",
    themes: ["clarity", "stillness", "refusing-noise"],
    intents: ["Overthinking"],
    card_title: "Nachiketa Stops Reaching for More",
    card_story: "Nachiketa sat outside Death's door for three days with no food and no answer. When Death offered him wealth and pleasure instead of the truth he asked for, Nachiketa said no. He just wanted to know what was real. The mind can only find solid ground by going quiet — not by thinking harder.",
    card_connect: "The mind keeps spinning because it's looking for solid ground. But some things can only be found by going quiet, not by adding more thoughts.",
    teaching: "You cannot solve your way to peace. Stillness is not the absence of thought — it's the decision to stop feeding every one.",
  },
  {
    id: "KARNA_LOYALTY", character: "Karna", source: "Mahabharata", event: "Rejects his birth mother's offer of family legitimacy to honour the loyalty he actually lived",
    themes: ["loyalty", "chosen-bonds-over-blood", "integrity-under-pressure"],
    intents: ["Family Pressure"],
    card_title: "Karna Says No to His Mother",
    card_story: "Just before the war, Karna's birth mother came to him with an offer — recognition, legitimacy, a place in the family — if he switched sides. He said no. He chose the loyalty he had actually lived, not the family he had been born into.",
    card_connect: "Family obligation and your own integrity don't always point the same direction. You get to decide which one you live by.",
    teaching: "The family you choose to honour through your actions matters as much as the family you were born into.",
  },
  {
    id: "YUDHISHTHIRA_PRESSURE", character: "Yudhishthira", source: "Mahabharata", event: "Gambles the kingdom away under pressure of royal expectation and social convention",
    themes: ["expectation", "unexamined-pressure", "social-obligation"],
    intents: ["Family Pressure"],
    card_title: "Yudhishthira and the Weight of Expectation",
    card_story: "Yudhishthira was expected to be perfect — the eldest, the righteous one, the king everyone leaned on. The weight of that expectation eventually led him to make one of the worst decisions of his life. The Mahabharata doesn't excuse it, but it shows what unexamined pressure does.",
    card_connect: "The pressure to be everything a family needs can quietly erode your own judgment. Noticing that pressure is the first step to not being completely shaped by it.",
    teaching: "Expectation that is never examined often acts on you without your knowing. Naming it gives you back some choice.",
  },
  {
    id: "GANDHARI_BLINDFOLD", character: "Gandhari", source: "Mahabharata", event: "Blindfolds herself for life upon marriage to a blind king — an act of choice or sacrifice",
    themes: ["choice", "sacrifice", "compliance-or-solidarity", "family-obligation"],
    intents: ["Family Pressure"],
    card_title: "Gandhari Ties the Blindfold",
    card_story: "Gandhari blindfolded herself when she married a blind king and wore that blindfold for the rest of her life. The texts never fully answer whether it was love, solidarity, or quiet protest. What's clear is that she chose it — and then lived entirely inside that choice. The Mahabharata pays attention to what that cost her.",
    card_connect: "Sometimes the deepest family pressures are the ones you've already agreed to. The question isn't whether to comply — it's whether the choice was ever really examined.",
    teaching: "The obligations that bind us most tightly are often ones we accepted in a single moment and never revisited.",
  },
  {
    id: "DRAUPADI_HUMILIATION", character: "Draupadi", source: "Mahabharata", event: "Publicly humiliated in the royal court — calls out for justice alone",
    themes: ["shame", "public-humiliation", "dignity-maintained", "justice-demanded"],
    intents: ["Self-Worth & Shame"],
    card_title: "Draupadi Calls Out",
    card_story: "Draupadi was humiliated in front of an entire royal court. Every person she trusted looked away. She called out anyway. Years later she walked out of a war she never started, still herself.",
    card_connect: "What happened to you is not who you are. The fact that you're still asking that question means your sense of self is still intact.",
    teaching: "Shame belongs to the act, not to you.",
  },
  {
    id: "SITA_REFUSAL", character: "Sita", source: "Valmiki Ramayana", event: "Refuses to undergo a second test of purity — walks away instead",
    themes: ["self-worth", "not-proving-self", "dignity-over-approval"],
    intents: ["Self-Worth & Shame"],
    card_title: "Sita Stops Proving Herself",
    card_story: "After years of captivity, war, and rescue — Sita was asked to prove herself one more time. She had given everything. She didn't fight or plead. She simply stopped. It was not defeat. It was a person who had nothing left to prove and knew it.",
    card_connect: "There is a point where exhaustion isn't weakness. It's having genuinely given everything. That deserves to be named, not pushed through.",
    teaching: "Knowing when you have given enough is its own kind of wisdom.",
  },
  {
    id: "KARNA_INSULT", character: "Karna", source: "Mahabharata", event: "Insulted publicly before thousands at the tournament",
    themes: ["shame", "public-insult", "standing-despite-mockery"],
    intents: ["Self-Worth & Shame"],
    card_title: "Karna Stands in the Court",
    card_story: "Karna walked into a tournament and was publicly mocked — wrong birth, wrong caste, not allowed to compete. He stood there, insulted in front of thousands. He didn't collapse. He found another way to stand.",
    card_connect: "Being dismissed or shamed by others doesn't settle the question of your worth. It just means they didn't look properly.",
    teaching: "Worth built from what you know about yourself holds. Worth that depends on others' recognition is fragile.",
  },
  {
    id: "SAVITRI_LOVE", character: "Savitri", source: "Mahabharata", event: "Follows death itself to bring her husband back — wins through persistence and clarity",
    themes: ["love", "persistence", "choosing-someone-fully"],
    intents: ["Relationship Issues"],
    card_title: "Savitri Follows Death",
    card_story: "Savitri's husband died and Death came to take him. She followed. She didn't beg or collapse — she walked with Death and spoke clearly, asking questions that showed she understood something about love that most people avoid. Death gave him back. The Mahabharata frames this not as miracle but as what clarity and commitment actually look like.",
    card_connect: "The relationships that last are usually the ones where someone chose deliberately — not by default.",
    teaching: "Love that is chosen fully, even when the cost is visible, is different from love that simply happened.",
  },
  {
    id: "NALA_LOSS", character: "Nala", source: "Mahabharata", event: "Loses everything including wife due to a curse — and has to rebuild alone",
    themes: ["loss", "separation", "rebuilding-after-rupture"],
    intents: ["Relationship Issues", "Grief & Loss"],
    card_title: "Nala and the Long Separation",
    card_story: "Nala was a king who lost his kingdom, his wealth, and eventually his wife to a gambling curse. He wandered alone for years. He didn't stop loving her — but he had to learn how to stand again without her before the relationship could find its way back. The story doesn't rush the reunion.",
    card_connect: "Some relationship pain isn't about what went wrong between two people. It's about what one or both people still need to become.",
    teaching: "The work of returning to someone often requires first returning to yourself.",
  },
  {
    id: "DRAUPADI_QUESTION", character: "Draupadi", source: "Mahabharata", event: "Questions the court — asking who had the right to stake her in the first place",
    themes: ["conflict", "power-in-relationship", "being-seen", "justice"],
    intents: ["Relationship Issues"],
    card_title: "Draupadi Asks the Question No One Will Answer",
    card_story: "When Yudhishthira gambled her away, Draupadi didn't stay silent. She asked the court a sharp legal question: can a man stake what he no longer owns? No one answered. The whole court went silent. The question itself was a form of power — even when no one responded.",
    card_connect: "Sometimes in a relationship, the most important thing is asking the question clearly — even when you're not sure you'll get an answer.",
    teaching: "Clarity about what you need and what you deserve is not the same as demanding it be given. One is always in your power.",
  },
  {
    id: "LAKSHMAN_BOUNDARY", character: "Lakshman", source: "Valmiki Ramayana", event: "Draws a boundary line to protect Sita before he must leave",
    themes: ["boundary", "protection", "care-through-limits"],
    intents: ["Relationship Issues"],
    card_title: "Lakshman Draws the Line",
    card_story: "Before leaving Sita alone, Lakshman drew a line in the earth and asked her not to cross it. He couldn't stay — but he left what protection he could. The line wasn't about control. It was the most concrete form of care he could offer before having to go.",
    card_connect: "Setting a boundary isn't always about saying no. Sometimes it's the most specific way of saying: I'm trying to protect what matters here.",
    teaching: "Boundaries are a form of care, not a form of withdrawal.",
  },
  {
    id: "SUGRIVA_TRUST", character: "Sugriva", source: "Valmiki Ramayana", event: "Trusts Rama's alliance despite past betrayal and fear of being deceived again",
    themes: ["trust", "risk-of-trusting", "alliance-after-hurt"],
    intents: ["Relationship Issues"],
    card_title: "Sugriva Chooses to Trust",
    card_story: "Sugriva had been betrayed by his own brother. When Rama offered an alliance, trusting anyone again was the hard part — not the practical agreement. He chose to trust anyway. The Ramayana doesn't pretend this was easy. It shows the step being taken before the outcome was known.",
    card_connect: "Trusting someone after being hurt isn't naivety. It's a choice — and it can only be made before you know how it will go.",
    teaching: "Trust is never risk-free. The question is whether the person and moment are worth the risk.",
  },
  {
    id: "EKALAVYA_ALONE", character: "Ekalavya", source: "Mahabharata", event: "Practises alone for years with no teacher, no peers, no recognition",
    themes: ["isolation", "self-directed", "no-witness", "practising-without-approval"],
    intents: ["Loneliness"],
    card_title: "Ekalavya Practises Alone",
    card_story: "Ekalavya had no teacher, no classmates, no one watching. He practised every day in the forest. He became exceptional in complete isolation. The Mahabharata doesn't frame this as sad — it frames it as a different kind of strength. The kind that builds when there's no one to perform for.",
    card_connect: "Loneliness is real. But sometimes what happens when no one is watching is exactly what can't happen any other way.",
    teaching: "Some growth only comes in the absence of an audience.",
  },
  {
    id: "URMILA_SILENT", character: "Urmila", source: "Valmiki Ramayana", event: "Stays alone in the palace for 14 years while Lakshman is in exile",
    themes: ["loneliness", "invisible-sacrifice", "waiting-alone"],
    intents: ["Loneliness"],
    card_title: "Urmila's Silent Years",
    card_story: "When Lakshman went to the forest with Rama, his wife Urmila stayed behind. She waited fourteen years. The Ramayana barely mentions her. Later traditions filled in the silence: she chose to sleep, so Lakshman could stay awake protecting Rama. Whether legend or invention, what's striking is that her sacrifice was completely invisible — and she made it anyway.",
    card_connect: "Some of the loneliest positions are the ones where even the loneliness goes unnoticed.",
    teaching: "Carrying something alone is hardest when no one knows you're carrying it.",
  },
  {
    id: "KARNA_IDENTITY", character: "Karna", source: "Mahabharata", event: "Struggles his entire life with not knowing where he belongs or who he is",
    themes: ["identity", "belonging", "between-worlds"],
    intents: ["Identity Crisis"],
    card_title: "Karna Between Two Worlds",
    card_story: "Karna never fully belonged anywhere. Too noble for servants, too low-born for warriors, too loyal to switch sides. He spent his whole life between categories — known by everyone, claimed by no one. The Mahabharata gives more interior space to his identity struggle than almost any other character.",
    card_connect: "Not knowing where you belong isn't a failure of self-knowledge. Sometimes it's an accurate description of a position the world hasn't made space for yet.",
    teaching: "Identity doesn't come from finding the right category. It comes from deciding what you will stand for regardless.",
  },
  {
    id: "ARJUNA_IDENTITY", character: "Arjuna", source: "Bhagavad Gita", event: "Questions his own role and nature when everything he was trained to be comes into conflict",
    themes: ["identity", "role-confusion", "trained-self-vs-real-self"],
    intents: ["Identity Crisis"],
    card_title: "Arjuna Questions His Own Role",
    card_story: "Arjuna had been trained as a warrior his entire life. And then the very skills he built his identity on became the source of the deepest moral crisis of his life. He didn't know if what he was — warrior, son, cousin — was the same as who he was. That gap is what the Gita tries to close.",
    card_connect: "Identity confusion often comes when what you were trained to be starts conflicting with what you actually feel. That conflict is worth examining, not suppressing.",
    teaching: "What you were built for and who you are are not always the same question.",
  },
  {
    id: "SHIVA_ASCETIC", character: "Shiva", source: "Puranas", event: "Lives outside all social categories — neither householder nor renunciant, neither god nor human",
    themes: ["identity", "outside-categories", "uncategorisable"],
    intents: ["Identity Crisis"],
    card_title: "Shiva Lives Outside Every Category",
    card_story: "Shiva is the god the Puranas can't fully contain. He's an ascetic who marries. A destroyer who protects. He lives on cremation grounds, wears snakes, dances wildly. The texts don't resolve the contradiction — they celebrate it. His identity is precisely that he doesn't fit.",
    card_connect: "The feeling of not fitting any category isn't always a problem to be solved. Sometimes it's the most honest description of who you actually are.",
    teaching: "Some people are genuinely multiple things at once. The problem is usually the world's categories, not the person.",
  },
  {
    id: "GANESHA_TRANSFORM", character: "Ganesha", source: "Puranas", event: "Gets his head replaced — emerges as something completely new",
    themes: ["change", "transformation", "new-self-after-rupture"],
    intents: ["Identity Crisis"],
    card_title: "Ganesha Is Made New",
    card_story: "Ganesha's head was cut off and replaced with an elephant's. The event is violent, sudden, and permanent. He didn't return to who he was before. He became something new — something that turned out to be stronger. The Puranas treat the transformation, not the loss, as the point.",
    card_connect: "Sometimes the identity you lose was the threshold to the one you're actually becoming.",
    teaching: "What you were before a rupture is not necessarily what you're meant to keep being after it.",
  },
  {
    id: "DRAUPADI_VOW", character: "Draupadi", source: "Mahabharata", event: "Takes a vow of revenge after being publicly humiliated, keeping anger alive deliberately",
    themes: ["anger", "righteous-fury", "resentment-as-fuel"],
    intents: ["Anger & Resentment"],
    card_title: "Draupadi's Vow",
    card_story: "After her humiliation in the court, Draupadi left her hair loose and vowed she would not tie it up until it was washed in the blood of those who wronged her. She carried that anger for eighteen years through a war. The Mahabharata doesn't frame this as unhealthy. It frames it as a person who refused to let an injustice be forgotten.",
    card_connect: "Anger that comes from real injustice is different from anger that comes from hurt pride. The Mahabharata took Draupadi's seriously.",
    teaching: "Not every anger needs to be let go. Some needs to be understood first.",
  },
  {
    id: "PARASHURAMA_RAGE", character: "Parashurama", source: "Mahabharata", event: "Acts in rage after his father's murder — the anger shapes everything that follows",
    themes: ["anger", "rage-acted-on", "grief-beneath-anger"],
    intents: ["Anger & Resentment"],
    card_title: "Parashurama's Rage",
    card_story: "Parashurama's father was killed. He didn't wait or grieve quietly. He acted from pure rage. The Mahabharata shows what that rage produced — and the costs. The anger was real and the cause was real. But acting entirely from it, without the grief underneath it being named, cost more than he knew in advance.",
    card_connect: "Anger that isn't connected to the grief beneath it often acts before it understands what it's actually trying to fix.",
    teaching: "The need underneath anger is almost always simpler and sadder than the anger itself.",
  },
  {
    id: "RAMA_GRIEF", character: "Rama", source: "Valmiki Ramayana", event: "Searches for Sita with open, visible grief — doesn't suppress it",
    themes: ["grief", "searching", "love-and-loss"],
    intents: ["Grief & Loss"],
    card_title: "Rama Searches",
    card_story: "When Sita was taken, Rama didn't stay composed. He wept openly. He spoke to trees and rivers asking if they'd seen her. The Ramayana doesn't treat this as weakness in a god. It treats it as what love looks like when something is genuinely lost.",
    card_connect: "Grief that is visible isn't a breakdown. It's an honest response to something that mattered.",
    teaching: "The person who grieves openly is not weaker than the person who suppresses it. Often they're more honest.",
  },
  {
    id: "KUNTI_GRIEF", character: "Kunti", source: "Mahabharata", event: "Reveals the truth about Karna being her son — only after he is dead",
    themes: ["grief", "secret-carried-too-long", "too-late"],
    intents: ["Grief & Loss"],
    card_title: "Kunti Tells the Truth Too Late",
    card_story: "Kunti knew Karna was her son and said nothing for decades. She watched him be humiliated, excluded, and eventually killed. At his funeral she revealed the truth. The Mahabharata doesn't spare her from the weight of that timing. The grief she carried wasn't only for his death — it was for all the years before it.",
    card_connect: "Some grief comes from loss. Some comes from the time that passed before you said what needed to be said.",
    teaching: "The grief of what went unsaid is often heavier than the grief of loss itself.",
  },
  {
    id: "YUDHISHTHIRA_DHARMA", character: "Yudhishthira", source: "Mahabharata", event: "Refuses to lie even in battle when truth could save lives — holds to dharma at enormous cost",
    themes: ["integrity", "values-under-pressure", "cost-of-honesty"],
    intents: ["Life Direction", "Family Pressure"],
    card_title: "Yudhishthira Cannot Lie",
    card_story: "During the war, Krishna asked Yudhishthira to say Ashwatthama was dead — just once, as strategy. Yudhishthira could not do it fully. He said the words but softened them. It cost the battle a critical advantage. The Mahabharata doesn't applaud or condemn him. It just shows what it looks like to be someone who cannot cross certain lines, even when everyone else needs you to.",
    card_connect: "Living by values is rarely clean. Sometimes the cost of not compromising is visible and immediate.",
    teaching: "Integrity under pressure is not the same as rigidity. But they can look identical from the outside.",
  },
  {
    id: "DRAUPADI_RESILIENCE", character: "Draupadi", source: "Mahabharata", event: "Emerges from 13 years of exile, humiliation, and war still fully herself",
    themes: ["resilience", "self-intact-after-everything", "not-broken"],
    intents: ["Self-Worth & Shame", "Identity Crisis"],
    card_title: "Draupadi After Everything",
    card_story: "By the end of the Mahabharata, Draupadi had been humiliated, exiled, ignored, and widowed. And yet the texts never show her as a reduced version of herself. She's the same person she was at the beginning — just harder-won. The Mahabharata's most complete character arc belongs to someone who was treated as property.",
    card_connect: "What you've been through doesn't have to become what you are. Some people go through more and come out more themselves, not less.",
    teaching: "Resilience isn't returning to who you were. It's remaining recognisably yourself through what tried to change you.",
  },
  {
    id: "HANUMAN_SERVICE", character: "Hanuman", source: "Valmiki Ramayana", event: "Chooses total dedication to Rama's purpose — finds complete freedom in it",
    themes: ["purpose-through-service", "commitment", "freedom-in-dedication"],
    intents: ["Life Direction"],
    card_title: "Hanuman Finds Freedom in Commitment",
    card_story: "Hanuman had enormous power — the ability to change form, cross oceans, move mountains. He gave all of it to Rama's service. The Ramayana doesn't frame this as self-erasure. It frames it as the moment his power found its full expression. Not constraint, but direction.",
    card_connect: "Sometimes the confusion about what to do resolves when you find something worth giving yourself to completely.",
    teaching: "Purpose isn't something you find by searching inward indefinitely. Sometimes it's something you find by committing outward.",
  },
  {
    id: "SITA_EARTH", character: "Sita", source: "Valmiki Ramayana", event: "Asks the earth to take her back — refuses to be tested again",
    themes: ["enough-given", "refusing-further-proof", "dignity-over-belonging"],
    intents: ["Self-Worth & Shame", "Anger & Resentment"],
    card_title: "Sita Returns to the Earth",
    card_story: "When asked to prove her purity a second time, Sita asked the earth to take her back. The earth opened. She went. The Ramayana treats this as her choice — not defeat. She had proven herself once. She had nothing more to demonstrate to people who would keep asking. She left with her dignity intact.",
    card_connect: "There is a point where continuing to prove yourself is the wrong move. Not every demand for proof deserves an answer.",
    teaching: "Walking away from people who keep moving the standard isn't giving up. It's recognising the game.",
  },
  {
    id: "BHIMA_GRIEF", character: "Bhima", source: "Mahabharata", event: "Carries grief as physical weight — the most emotional of the Pandava brothers",
    themes: ["grief", "emotion-as-strength", "feeling-fully"],
    intents: ["Grief & Loss"],
    card_title: "Bhima Feels Everything",
    card_story: "Bhima was the strongest of the Pandavas and the most openly emotional. He wept for people. He carried grief in his body. The Mahabharata never treats his emotional expression as weakness — it treats it as what real presence in the world looks like when you actually let things matter to you.",
    card_connect: "Feeling things fully — including grief — isn't a problem to manage. It's what happens when you've actually invested in something.",
    teaching: "The person who feels deeply is not weaker. They are more present.",
  },
  {
    id: "YUDHISTHIRA_DOG", character: "Yudhishthira", source: "Mahabharata", event: "Refuses to enter heaven without his dog — the one companion who stayed loyal",
    themes: ["loyalty", "refusing-partial-good", "values-at-final-threshold"],
    intents: ["Relationship Issues", "Life Direction"],
    card_title: "Yudhishthira and the Dog",
    card_story: "At the gates of heaven, Yudhishthira was told he could enter — but not with the dog that had followed him through every loss. He refused. He had given up everything else. He would not give up the one who had stayed. The Mahabharata reveals it was a god testing him. But his answer came before he knew that.",
    card_connect: "The relationships that lasted through everything are not always the ones others understand. Sometimes the simplest loyalty is the most important one to keep.",
    teaching: "What you're willing to give up at the final threshold reveals what you actually value.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SCORING FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

function scoreEvent(event, intent, themes, recentEventIds, recentChars) {
  let score = 0;
  if (event.intents.includes(intent)) score += 50;
  const overlap = event.themes.filter(t => themes.includes(t)).length;
  score += overlap * 10;
  if (recentEventIds.includes(event.id)) score -= 100;
  if (recentChars.includes(event.character)) score -= 20;
  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
//  THEME HINTS
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_THEME_HINTS = {
  "Career Confusion": ["rejection", "identity", "self-made", "alternative-path", "reinvention"],
  "Life Direction": ["values", "purpose", "duty", "clarity-sought", "truth-seeking"],
  "Anxiety & Fear": ["fear", "self-doubt", "inner-anchor", "courage", "forgotten-strength"],
  "Burnout": ["burnout", "exhaustion", "collapse", "withdrawal", "rest-as-power"],
  "Overthinking": ["clarity", "stillness", "thought-loops-broken", "watcher-self"],
  "Family Pressure": ["expectation", "loyalty", "integrity-under-pressure", "chosen-bonds-over-blood"],
  "Self-Worth & Shame": ["shame", "dignity-maintained", "self-worth", "not-proving-self"],
  "Grief & Loss": ["grief", "loss", "love-and-loss", "too-late", "searching"],
  "Relationship Issues": ["trust", "boundary", "conflict", "love", "power-in-relationship"],
  "Loneliness": ["isolation", "no-witness", "invisible-sacrifice"],
  "Loneliness & Isolation": ["isolation", "no-witness", "invisible-sacrifice"],
  "Identity Crisis": ["identity", "between-worlds", "transformation", "uncategorisable"],
  "Anger & Resentment": ["anger", "righteous-fury", "grief-beneath-anger"],
  "Gratitude & Positive Sharing": ["purpose-through-service", "freedom-in-dedication"],
};

// ─────────────────────────────────────────────────────────────────────────────
//  LLM STORY GENERATION PROMPT
// ─────────────────────────────────────────────────────────────────────────────

function buildMythGenerationPrompt(event, intent, emotion) {
  return `You are the mythology storyteller for Ananda, an Indian-mythology-grounded mental wellness thinking partner.

TASK: Rewrite the story below into a warm, specific card for a user feeling "${emotion || "uncertain"}" around the theme of "${intent}".

STRICT RULES:
- Do NOT invent new facts, plot points, or characters
- Do NOT add modern interpretations not grounded in the original
- Do NOT use these banned words/phrases: "journey", "anchor", "resonate", "navigate", "sit with", "hold space", "transformative", "profound", "paradigm", "illuminate"
- Keep card_story to 4-6 sentences max — specific and concrete
- card_connect must link directly to the user's emotional context ("${intent}" / "${emotion}")
- teaching must be one sentence — a principle, not an affirmation
- Return ONLY valid JSON — no markdown, no backticks, no explanation

SOURCE EVENT:
Character: ${event.character}
Source: ${event.source}
Event: ${event.event}

CURRENT CARD (rewrite this, keeping the same facts):
card_title: ${event.card_title}
card_story: ${event.card_story}
card_connect: ${event.card_connect}
teaching: ${event.teaching}

Return JSON with exactly these fields:
{"card_title":"","card_story":"","card_connect":"","teaching":""}`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MYTHOLOGY CARD SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

async function selectMythologyCard({
  openai,
  intent,
  emotion = "uncertain",
  show = true,
  recentIds = [],
  recentChars = [],
  themes = [],
}) {
  if (!show) return null;

  const effectiveThemes = themes.length > 0
    ? themes
    : (INTENT_THEME_HINTS[intent] || []);

  const scored = STORY_EVENTS.map(event => ({
    event,
    score: scoreEvent(event, intent, effectiveThemes, recentIds, recentChars),
  }));

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) return null;

  const event = best.event;

  try {
    const genRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildMythGenerationPrompt(event, intent, emotion) }],
      temperature: 0.6,
      max_tokens: 400,
    });

    const raw = genRes.choices[0]?.message?.content || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      if (parsed.card_title && parsed.card_story && parsed.card_connect && parsed.teaching) {
        return {
          id: event.id,
          character: event.character,
          source: event.source,
          event: event.event,
          card_title: String(parsed.card_title),
          card_story: String(parsed.card_story),
          card_connect: String(parsed.card_connect),
          teaching: String(parsed.teaching),
          _generated: true,
        };
      }
    }
  } catch (_err) {
    // LLM failure — fall through to static fallback
  }

  return {
    id: event.id,
    character: event.character,
    source: event.source,
    event: event.event,
    card_title: event.card_title,
    card_story: event.card_story,
    card_connect: event.card_connect,
    teaching: event.teaching,
    _generated: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SESSION MEMORY
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_MEMORY_THRESHOLD = 4;

async function buildSessionSummary(openai, history) {
  if (!Array.isArray(history) || history.length < 8) return null;
  const snippet = history.slice(-12).map(m => `${m.role === "user" ? "User" : "Solace"}: ${(m.content || "").slice(0, 200)}`).join("\n");
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.4, max_tokens: 200,
      messages: [{ role: "user", content: `You are a compassionate note-taker for a mental wellness conversation.\nBased on the exchange below, write exactly 3 short bullet points (each under 12 words) summarising:\n1. What the person has been feeling or dealing with\n2. The core tension or question underneath it\n3. One thing that seems to matter most to them right now\n\nRules:\n- Each bullet starts with "–"\n- Plain language, no therapy jargon\n- No advice, no affirmations\n- Return ONLY the 3 bullets, nothing else\n\nConversation:\n${snippet}` }],
    });
    const raw = (res.choices[0]?.message?.content || "").trim();
    const bullets = raw.split("\n").filter(l => l.trim().startsWith("–"));
    if (bullets.length >= 3) return bullets.slice(0, 3).join("\n");
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  REFLECTION SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

const REFLECTION_INTERVAL = 6;

async function buildReflectionSummary(openai, history, intent) {
  if (!Array.isArray(history) || history.length < 10) return null;
  const userMessages = history.filter(m => m.role === "user").slice(-6).map(m => (m.content || "").slice(0, 180)).join(" | ");
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.5, max_tokens: 120,
      messages: [{ role: "user", content: `You are Ananda, a warm thinking partner.\nWrite a 2-sentence reflection that mirrors back what the user has been sharing — no advice, no questions, just honest witnessing.\n\nStart with: "Here's what I'm hearing from you…"\nSentence 1: Name what they've been feeling or dealing with, using their own words where possible.\nSentence 2: Name the deeper thing underneath — the real weight of it.\n\nCurrent intent theme: ${intent}\nUser messages: ${userMessages}\n\nReturn only the 2 sentences. Nothing else.` }],
    });
    const raw = (res.choices[0]?.message?.content || "").trim();
    if (raw.length > 20) return raw;
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  WRAP CARD
// ─────────────────────────────────────────────────────────────────────────────

const WRAP_MIN_TURNS = 6;

const CLOSING_PATTERNS = [
  /thank(s| you)/i, /that('s| is) (helpful|really helpful|good|great|useful)/i,
  /i feel (better|clearer|lighter)/i, /this (helped|was helpful|makes sense)/i,
  /okay(\s|,)?\s*(i('ll| will)|let me)/i, /i think i (get it|understand|need to)/i,
  /good(bye|night)/i, /talk (later|soon)/i, /i('ll| will) (think about|try|reflect)/i,
];

function isConversationClosing(message) {
  return CLOSING_PATTERNS.some(p => p.test(message));
}

async function buildWrapCard(openai, history, intent, mythCard) {
  const userMessages = history.filter(m => m.role === "user").map(m => (m.content || "").slice(0, 150)).join(" | ");
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.5, max_tokens: 250,
      messages: [{ role: "user", content: `You are Ananda, a warm thinking partner ending a conversation.\nGenerate a closing wrap card. Return ONLY valid JSON with exactly these fields:\n{\n  "summary": "2 sentences. What was explored today. Plain, honest, no jargon.",\n  "question_to_sit_with": "One open, specific question they can carry with them. Not generic. Based on what they shared."\n}\n\nIntent theme: ${intent}\nUser shared: ${userMessages}\nMythology story shown: ${mythCard?.card_title || "none"}\n\nJSON only:` }],
    });
    const raw = res.choices[0]?.message?.content || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      if (parsed.summary && parsed.question_to_sit_with) {
        return { summary: String(parsed.summary), question_to_sit_with: String(parsed.question_to_sit_with), mythology_title: mythCard?.card_title || null };
      }
    }
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  CROSS-SESSION MEMORY
// ─────────────────────────────────────────────────────────────────────────────

const _memoryStore = new Map();

async function loadMemory(userId) {
  if (!userId) return null;
  return _memoryStore.get(String(userId)) || null;
}

async function updateMemory(userId, { intent, history, openai }) {
  if (!userId) return;
  const key = String(userId);
  const existing = _memoryStore.get(key) || { summary: "", themes: [], keywords: [], lastIntent: "", sessionCount: 0, updatedAt: "" };
  const userMessages = (history || []).filter(m => m.role === "user").map(m => (m.content || "").slice(0, 200)).join(" | ");
  if (!userMessages) return;
  const updatedThemes = existing.themes.includes(intent) ? existing.themes : [...existing.themes, intent].slice(-8);
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.3, max_tokens: 200,
      messages: [{ role: "user", content: `You are building a compact memory record for a returning user of a mental wellness app called Solace.\n\nBased on what they shared in this session, generate a memory update. Return ONLY valid JSON:\n{\n  "summary": "2 plain sentences summarising what they've been working through overall. Present tense. No jargon.",\n  "keywords": ["3 to 6 specific words or short phrases the person keeps coming back to — their actual language, not clinical terms"]\n}\n\nTheir previous summary (may be empty): "${existing.summary}"\nWhat they shared this session: ${userMessages}\nMain theme this session: ${intent}\n\nJSON only:` }],
    });
    const raw = res.choices[0]?.message?.content || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      _memoryStore.set(key, {
        summary: String(parsed.summary || existing.summary),
        themes: updatedThemes,
        keywords: Array.isArray(parsed.keywords) ? [...new Set([...existing.keywords, ...parsed.keywords])].slice(-12) : existing.keywords,
        lastIntent: intent, sessionCount: existing.sessionCount + 1, updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    _memoryStore.set(key, { ...existing, themes: updatedThemes, lastIntent: intent, sessionCount: existing.sessionCount + 1, updatedAt: new Date().toISOString() });
  }
}

function formatMemoryForPrompt(memory) {
  if (!memory || !memory.summary) return "";
  const parts = [`RETURNING USER — session ${memory.sessionCount + 1}.`];
  if (memory.summary) parts.push(`What they've been working through: ${memory.summary}`);
  if (memory.themes?.length) parts.push(`Recurring themes: ${memory.themes.slice(-4).join(", ")}`);
  if (memory.keywords?.length) parts.push(`Words they return to: ${memory.keywords.slice(-6).join(", ")}`);
  if (memory.lastIntent) parts.push(`Last session focus: ${memory.lastIntent}`);
  return parts.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONTEXTUAL FOLLOW-UP QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

async function buildContextualQuestion(openai, history, intent, currentMessage, memory = null) {
  if (!Array.isArray(history) || history.length < 2) return null;
  const recentUserMessages = history.filter(m => m.role === "user").slice(-4).map(m => (m.content || "").slice(0, 200)).join("\n");
  const memoryContext = memory ? formatMemoryForPrompt(memory) : "";
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.6, max_tokens: 80,
      messages: [{ role: "user", content: `You are crafting a single follow-up question for a mental wellness thinking partner called Solace.\n\nThe question must:\n- Reference something SPECIFIC the person said (a word, situation, or detail they actually mentioned)\n- Target the gap, decision, or unspoken thing underneath their words\n- Feel like it comes from genuine curiosity, not a checklist\n- Be one sentence. No preamble. No "I'm curious" or "Can I ask"\n- NOT be answerable with yes/no\n- NOT be generic ("How does that make you feel?" is banned)\n\nIntent theme: ${intent}\n${memoryContext ? `User context from previous sessions:\n${memoryContext}\n` : ""}Recent messages from this conversation:\n${recentUserMessages}\n\nCurrent message: "${currentMessage}"\n\nReturn ONLY the question text. Nothing else.` }],
    });
    const q = (res.choices[0]?.message?.content || "").trim();
    if (q.includes("?") && q.split(" ").length <= 25) return q;
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  REFLECTION REPORT
// ─────────────────────────────────────────────────────────────────────────────

function shouldGenerateReflectionReport({ history, intentHistory }) {
  const userMessages = history.filter(h => h.role === "user");
  const messageCount = userMessages.length;
  if (messageCount < 6) return false;
  const avgLength = userMessages.reduce((acc, h) => acc + (h.content || "").split(" ").length, 0) / messageCount;
  if (avgLength < 12) return false;
  if (Array.isArray(intentHistory) && intentHistory.length >= 3) {
    const last3 = intentHistory.slice(-3);
    if (last3.length === 3 && new Set(last3).size === 1) return true;
  }
  if (!Array.isArray(intentHistory) || intentHistory.length === 0) return false;
  const freq = {};
  intentHistory.forEach(i => { freq[i] = (freq[i] || 0) + 1; });
  const maxIntentCount = Math.max(...Object.values(freq));
  const consistency = maxIntentCount / intentHistory.length;
  if (consistency < 0.6) return false;
  return true;
}

async function generateReflectionReport(openai, history) {
  const conversationText = history.slice(-20).map(m => `${m.role === "user" ? "User" : "Solace"}: ${(m.content || "").slice(0, 300)}`).join("\n");
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.5, max_tokens: 500,
      messages: [{ role: "user", content: `You are an emotionally intelligent reflection system.\n\nAnalyze the conversation and identify:\n\n1. Patterns in thinking\n2. Emotional tendencies\n3. Core internal tension\n4. Dominant life theme\n5. A meaningful reflection summary\n6. One question for the user\n\nRules:\n- Do NOT give advice\n- Do NOT sound like a therapist\n- Be observational, not prescriptive\n- Keep tone calm and neutral\n- patterns: array of 2-4 short plain-language strings (each under 12 words)\n- core_tension: one clear sentence naming the central conflict\n- emotional_trend: one sentence describing the emotional pattern across messages\n- dominant_theme: 3-5 words — the overarching theme\n- reflection_summary: 2-3 sentences synthesising what's really happening beneath the surface\n- next_question: one open, specific question to sit with — not generic\n\nReturn ONLY valid JSON, no markdown, no explanation:\n\n{\n  "patterns": [],\n  "core_tension": "",\n  "emotional_trend": "",\n  "dominant_theme": "",\n  "reflection_summary": "",\n  "next_question": ""\n}\n\nConversation:\n${conversationText}` }],
    });
    const raw = res.choices[0]?.message?.content || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    const parsed = JSON.parse(raw.slice(start, end + 1));
    if (
      Array.isArray(parsed.patterns) && parsed.patterns.length > 0 &&
      typeof parsed.core_tension === "string" && parsed.core_tension.trim() &&
      typeof parsed.emotional_trend === "string" && parsed.emotional_trend.trim() &&
      typeof parsed.dominant_theme === "string" && parsed.dominant_theme.trim() &&
      typeof parsed.reflection_summary === "string" && parsed.reflection_summary.trim() &&
      typeof parsed.next_question === "string" && parsed.next_question.trim()
    ) {
      return {
        patterns: parsed.patterns.map(p => String(p)),
        core_tension: String(parsed.core_tension),
        emotional_trend: String(parsed.emotional_trend),
        dominant_theme: String(parsed.dominant_theme),
        reflection_summary: String(parsed.reflection_summary),
        next_question: String(parsed.next_question),
      };
    }
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROGRESS OVER TIME
// ─────────────────────────────────────────────────────────────────────────────

const userProgressStore = {};

function storeProgressEntry(userId, reflectionReport) {
  if (!userId || !reflectionReport) return;
  if (!userProgressStore[userId]) userProgressStore[userId] = { sessions: [] };
  userProgressStore[userId].sessions.push({
    date: Date.now(),
    dominant_theme: reflectionReport.dominant_theme || "",
    emotional_trend: reflectionReport.emotional_trend || "",
    patterns: Array.isArray(reflectionReport.patterns) ? reflectionReport.patterns : [],
  });
}

function generateProgressInsights(userId) {
  const sessions = userProgressStore[userId]?.sessions || [];
  if (sessions.length < 2) return null;
  const themeCount = {};
  sessions.forEach(s => { if (s.dominant_theme) themeCount[s.dominant_theme] = (themeCount[s.dominant_theme] || 0) + 1; });
  const dominantRecurringTheme = Object.keys(themeCount).sort((a, b) => themeCount[b] - themeCount[a])[0] || "";
  const recentEmotionalTrend = sessions[sessions.length - 1].emotional_trend || "";
  return {
    session_count: sessions.length,
    recurring_theme: dominantRecurringTheme,
    recent_emotional_trend: recentEmotionalTrend,
    progress_summary: dominantRecurringTheme
      ? `You've been revisiting ${dominantRecurringTheme} across sessions.`
      : "You've been showing up consistently.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  STORY_EVENTS, scoreEvent, selectMythologyCard, INTENT_THEME_HINTS,
  buildSessionSummary, buildReflectionSummary, buildWrapCard, isConversationClosing,
  SESSION_MEMORY_THRESHOLD, REFLECTION_INTERVAL, WRAP_MIN_TURNS,
  loadMemory, updateMemory, formatMemoryForPrompt, buildContextualQuestion,
  shouldGenerateReflectionReport, generateReflectionReport,
  userProgressStore, storeProgressEntry, generateProgressInsights,
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      user_id,
      recent_myth_ids = [],
      recent_myth_chars = [],
      intent_themes = [],
    } = body;

    const intent = {
      primary_intent: "Career Confusion",
      emotion: "uncertain",
    };

    const mode = "normal";

    const mythCard = await selectMythologyCard({
      openai,
      intent: intent.primary_intent,
      emotion: intent.emotion,
      show: true,
      recentIds: recent_myth_ids,
      recentChars: recent_myth_chars,
      themes: intent_themes,
    });

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a calm, thoughtful reflection partner. Do not give direct advice. Help the user think.",
        },
        ...(history || []),
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = chatRes.choices?.[0]?.message?.content || "Hmm… tell me more.";

    return new Response(
      JSON.stringify({
        reply,
        meta: {
          mythology_card: mythCard,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
