import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const maxDuration = 30;

const MAX_MESSAGES = 20;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string().max(5000),
        parts: z
          .array(
            z.object({
              type: z.string(),
              text: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .max(MAX_MESSAGES),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      const isOverLimit = body?.messages?.length > MAX_MESSAGES;
      return new Response(
        JSON.stringify({
          error: isOverLimit
            ? "Conversation limit reached. Refresh the page to start a new session."
            : "Invalid request",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = parsed.data;

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter("anthropic/claude-opus-4-5"),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages as UIMessage[]),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    const isConfigError =
      error instanceof Error &&
      error.message.includes("API key");

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
