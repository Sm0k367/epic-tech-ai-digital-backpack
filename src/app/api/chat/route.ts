export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getApiContext, rateLimitResponse, apiResponse, errorResponse } from '@/lib/api-middleware';

// Smart free-tier responses using pattern matching
function smartFreeResponse(messages: { role: string; content: string }[]): string {
  const last = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (last.includes('hello') || last.includes('hi') || last.includes('hey')) {
    return "Hey! I'm Epic AI, your digital backpack assistant. I can help you with studying, coding, writing, brainstorming, and more. What would you like to work on today?";
  }
  if (last.includes('what can you do') || last.includes('help me') || last.includes('features')) {
    return `I can help you with:\n\n• **Study & Learning** — Explain concepts, create study plans, quiz you on topics\n• **Coding** — Debug code, explain algorithms, suggest best practices\n• **Writing** — Draft emails, essays, summaries, and creative content\n• **Brainstorming** — Generate ideas, mind maps, and creative solutions\n• **Math & Science** — Solve problems step by step\n• **Productivity** — Task planning, time management tips\n\nAdd your API key in the sidebar for full AI-powered responses!`;
  }
  if (last.includes('code') || last.includes('programming') || last.includes('function') || last.includes('bug')) {
    return "I'd love to help with your code! For the best coding assistance with syntax highlighting and detailed explanations, add your API key in the sidebar. In the meantime, share your code and I'll do my best to help!\n\nTip: Use the **Code Vault** to save and organize your snippets.";
  }
  if (last.includes('study') || last.includes('learn') || last.includes('exam') || last.includes('test')) {
    return "Great that you're studying! Here are some proven techniques:\n\n1. **Spaced Repetition** — Review material at increasing intervals (use the Flashcards tool!)\n2. **Active Recall** — Test yourself instead of re-reading\n3. **Pomodoro Technique** — 25 min focus, 5 min break\n4. **Feynman Technique** — Explain concepts in simple terms\n5. **Mind Mapping** — Connect ideas visually\n\nWant me to create a study plan for a specific subject?";
  }
  if (last.includes('math') || last.includes('calculate') || last.includes('equation')) {
    return "I can help with math! For complex calculations and step-by-step solutions, add your API key for full AI support. For basic math:\n\n• Share the problem and I'll walk through it\n• Use the Notes tool to organize your work\n• The Flashcards tool is great for memorizing formulas";
  }
  if (last.includes('write') || last.includes('essay') || last.includes('email') || last.includes('letter')) {
    return "I can help with writing! For full AI-powered writing assistance, add your API key. Here are some writing tips:\n\n1. **Start with an outline** — Structure your thoughts first\n2. **Write first, edit later** — Don't perfect as you go\n3. **Use active voice** — More engaging and direct\n4. **Be specific** — Concrete details beat vague generalities\n\nShare what you're working on and I'll help!";
  }
  if (last.includes('idea') || last.includes('brainstorm') || last.includes('creative')) {
    return "Let's brainstorm! Here's a framework:\n\n**SCAMPER Method:**\n• **S**ubstitute — What can be replaced?\n• **C**ombine — What can be merged?\n• **A**dapt — What can be adjusted?\n• **M**odify — What can be changed?\n• **P**ut to other uses — New applications?\n• **E**liminate — What can be removed?\n• **R**everse — What if you flip it?\n\nTell me your topic and we'll generate ideas together!";
  }
  if (last.includes('api') || last.includes('key') || last.includes('upgrade')) {
    return "To unlock full AI responses:\n\n1. Go to **API Keys** in the sidebar\n2. Click **Generate** to create your key\n3. Paste it in the **API Key** field below the chat list\n\nWith an API key you get:\n• 1,000 requests/hour (vs 20 free)\n• Full AI-powered responses\n• Access to all API endpoints\n\nYour key is stored locally — we never see it!";
  }
  if (last.includes('thank') || last.includes('thanks') || last.includes('great') || last.includes('awesome')) {
    return "You're welcome! Happy to help. Is there anything else you'd like to explore? Remember, you can use all the tools in your Digital Backpack — Notes, Tasks, Flashcards, Code Vault, and more!";
  }

  // Default intelligent response
  const topic = messages[messages.length - 1]?.content?.slice(0, 60) || 'that';
  return `That's an interesting question about "${topic}".\n\nFor detailed, AI-powered responses on any topic, add your API key in the sidebar (it's free to generate). \n\nIn the meantime, I can help you:\n• Break down complex topics into simpler parts\n• Create study materials using the Flashcards tool\n• Organize your research in Notes\n• Track related tasks in the Task Manager\n\nWhat specific aspect would you like to explore?`;
}

export async function POST(req: NextRequest) {
  const ctx = getApiContext(req);
  const limited = rateLimitResponse(ctx);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return errorResponse('messages array is required');
    }

    // API tier: try OpenAI if configured
    if (ctx.tier === 'api' && process.env.OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are Epic AI, a helpful assistant in the Epic Tech AI Digital Backpack. Be concise, helpful, and use markdown when appropriate.' },
              ...messages,
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const content = data.choices?.[0]?.message?.content || 'No response generated.';
          return apiResponse({ role: 'assistant', content, model: 'gpt-4o-mini' }, ctx);
        }
      } catch {
        // Fall through to smart response
      }
    }

    // Free tier or fallback: smart pattern-matched response
    const content = smartFreeResponse(messages);
    return apiResponse({ role: 'assistant', content, model: 'epic-free' }, ctx);

  } catch {
    return errorResponse('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}
