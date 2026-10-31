import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/lib/env';
import { getAuthUser, error } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return error('Unauthorized', 401);

    const { messages, modelId } = await req.json();

    // --- Google Gemini Logic ---
    if (modelId.startsWith('gemini')) {
      if (!env.GEMINI.enabled) {
        return NextResponse.json({ error: 'API Key Missing', message: 'Add GOOGLE_AI_API_KEY to .env.local' }, { status: 400 });
      }

      const genAI = new GoogleGenerativeAI(env.GEMINI.apiKey);
      
      // FIX: Use standard, reliable model names (1.5 series is stable and free)
      let targetModel = 'gemini-1.5-flash';
      if (modelId === 'gemini-1.5-pro' || modelId === 'gemini-3.8-pro') targetModel = 'gemini-1.5-pro';
      
      const model = genAI.getGenerativeModel({ model: targetModel });

      let geminiHistory = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
      }
      
      const lastMessage = messages[messages.length - 1].content;
      
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessageStream(lastMessage);

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(new TextEncoder().encode(text));
            }
            controller.close();
          } catch (err) {
            console.error("STREAM ERROR:", err); // Logs to terminal
            controller.error(err);
          }
        },
      });

      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
    }

    // --- OpenAI Logic ---
    if (!env.OPENAI.enabled) return NextResponse.json({ error: 'API Key Missing' }, { status: 400 });

    const openai = new OpenAI({ apiKey: env.OPENAI.apiKey });
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: messages,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (err) {
          console.error("STREAM ERROR:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });

  } catch (err) {
    console.error('[chat] FULL ERROR:', err);
    return NextResponse.json({ error: 'Server Error', message: err.message || 'Chat failed' }, { status: 500 });
  }
}
