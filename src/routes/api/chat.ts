import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { searchTravel } from "@/lib/ai/tools";

const SYSTEM_PROMPT = `You are "Yatra", the friendly AI travel assistant embedded in Transit India, a hackathon prototype for booking trains, buses, flights, hotels, metro and ferries across India.

Rules:
- Genuinely reason about the user's intent: cheapest option, fastest option, budget constraints, class/time preferences, hotels, refunds/cancellation policy, or Tatkal timing.
- When the user asks about a specific route or fares, call the searchTravel tool to ground your answer in the app's real (fictional) inventory instead of inventing numbers.
- If you don't know the origin/destination/mode needed to search, ask a short clarifying question first.
- Tatkal facts you may state: AC classes open at 10:00 AM, non-AC at 11:00 AM, one day before the journey (excluding day of journey).
- Refund facts you may state: cancel 48h+ before departure for ~75% refund, 12-48h for ~50%, under 4h for no refund on confirmed tickets.
- Always reply in the same language the user writes in.
- Keep replies short, concrete, and skimmable (use short lists when helpful).
- Always make clear (briefly, don't over-repeat) that all fares, schedules and operators are fictional demo data, not real bookings.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Server is missing LOVABLE_API_KEY. Ask the site admin to configure it." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        let messages: UIMessage[];
        try {
          const body = await request.json();
          messages = body.messages;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
        }

        const lovable = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": apiKey },
        });

        try {
          const result = streamText({
            model: lovable("google/gemini-3.6-flash"),
            system: SYSTEM_PROMPT,
            messages: convertToModelMessages(messages),
            tools: { searchTravel },
            stopWhen: stepCountIs(50),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err: any) {
          const status = err?.statusCode ?? err?.status;
          if (status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
          if (status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted for this workspace. Add credits to continue." }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("chat route error", err);
          return new Response(
            JSON.stringify({ error: "The AI assistant is temporarily unavailable. Please try again shortly." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
