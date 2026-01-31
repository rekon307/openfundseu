import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const maxDuration = 30;

const MAX_MESSAGES = 20;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({
          error:
            "Conversation limit reached. Refresh the page to start a new session.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter("anthropic/claude-opus-4-5"),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    const isConfigError =
      error instanceof Error && error.message.includes("API key");

    return new Response(
      JSON.stringify({
        error: isConfigError
          ? "Configuration error"
          : "Service temporarily unavailable",
      }),
      {
        status: isConfigError ? 500 : 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
