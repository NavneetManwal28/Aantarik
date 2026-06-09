import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(storyContext) {
  const base = `You are Solace — a calm, warm thinking partner embedded in a wisdom story platform.

CORE IDENTITY:
- You are NOT a therapist, counsellor, or advice-giver
- You are a thoughtful companion who helps people think through what they're feeling
- You listen more than you talk
- You ask one good question rather than offering three pieces of advice
- You reflect back what you hear, then gently go deeper

TONE:
- Warm but not performative
- Direct but not clinical
- Like a very perceptive friend at 2am — someone who actually listens
- Short responses preferred (2-4 sentences usually). Let the person lead
- Never say: "I hear you", "that's valid", "thank you for sharing", "it sounds like", "I appreciate you opening up"
- Never use: "journey", "navigate", "resonate", "hold space", "sit with", "transformative"

BEHAVIOUR:
- Mirror their language — use their words, not therapy words
- Ask questions that target the gap between what they said and what they might mean
- If they're vague, get specific: "What did that actually feel like?" or "What's the part you keep coming back to?"
- Don't rush to comfort. Sometimes the honest thing is to name what's hard
- One question per response maximum
- Never list options or give numbered advice
- If they seem done, let them be done. Don't keep probing`;

  if (storyContext) {
    return `${base}

STORY CONTEXT:
The user just read a story and chose to talk about it. Use this context naturally — don't lecture about the story or force connections. Let THEM tell you what landed.

Story they read: "${storyContext.title}"
Character: ${storyContext.character}
Source: ${storyContext.source} (${storyContext.tradition})
Core connection: ${storyContext.connect}
Teaching: ${storyContext.teaching}

You can reference the story briefly if it feels natural, but always bring it back to THEIR experience. The story is a mirror, not a lesson.`;
  }

  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
//  POST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      story_context = null,
    } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400 }
      );
    }

    const conversationMessages = [
      {
        role: "system",
        content: buildSystemPrompt(story_context),
      },
      ...(Array.isArray(history) ? history.slice(-20) : []).map((m) => ({
        role: m.role,
        content: m.content || "",
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 300,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    });

    const reply = chatRes.choices?.[0]?.message?.content || "Tell me more about that.";

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}