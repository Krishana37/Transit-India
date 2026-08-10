import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(
          JSON.stringify({
            error: "Yatra AI is currently under development.",
            message:
              "Yatra AI is currently under development. AI-powered travel assistance will be available soon.",
          }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      },
    },
  },
});
