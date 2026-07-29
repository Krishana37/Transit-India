import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NostalgicIntro } from "@/components/transit/NostalgicIntro";
import { TransitApp } from "@/components/transit/TransitApp";
import { AIChat } from "@/components/transit/AIChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transit India — Book trains, buses & metros with a single sentence" },
      { name: "description", content: "AI-powered ticket booking for Indian Railways, buses and metros. Natural-language search, Tatkal ready queue, transparent fares and smart alternatives." },
      { property: "og:title", content: "Transit India — Smarter public transport booking" },
      { property: "og:description", content: "Ditch the forms. Book trains, buses and metros in India using natural language, with Tatkal ready queue and transparent pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = typeof window !== "undefined" && window.sessionStorage.getItem("transit-intro-seen");
    if (!seen) {
      setShowIntro(true);
      window.sessionStorage.setItem("transit-intro-seen", "1");
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {showIntro && <NostalgicIntro onDone={() => setShowIntro(false)} />}
      <TransitApp />
      <AIChat />
    </>
  );
}
