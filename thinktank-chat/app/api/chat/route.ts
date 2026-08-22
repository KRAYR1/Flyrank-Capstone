/**
 * app/api/chat/route.ts
 *
 * Server-side route handler. Receives the conversation so far, calls
 * Gemini via the AI SDK's streamText, and returns a streamed response
 * that useChat on the client consumes.
 *
 * The Google API key is read from process.env here — it never
 * reaches the browser. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local
 * (and in your deployment platform's environment variables for the
 * preview URL) — never commit it.
 */
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { CHAT_MODEL, MODEL_CONFIG, SYSTEM_PROMPT } from "@/lib/ai-config";

// Allow this route to stream for up to 30s of generation.
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
    temperature: MODEL_CONFIG.temperature,
  });

  // toUIMessageStreamResponse() returns the SSE stream useChat expects,
  // including typed message parts (text-delta, etc.) and abort support
  // for the stop button.
  return result.toUIMessageStreamResponse();
}