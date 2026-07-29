import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "bot"; text: string };

const seed: Msg[] = [
  { role: "bot", text: "Hi! I'm Yatra — your travel assistant. Ask me about routes, fares, or Tatkal timings." },
];

const canned = [
  { q: /cheapest|cheap|budget/i, a: "The cheapest option Delhi → Jaipur tomorrow is Ashram Express (Sleeper) at ₹285. Fastest is Vande Bharat at ₹1,245 (4h 25m)." },
  { q: /tatkal/i, a: "Tatkal for AC classes opens at 10:00 AM (1 day prior). I can prepare your booking and auto-submit at 09:59:58." },
  { q: /pnr/i, a: "Share your 10-digit PNR and I'll fetch the latest status, coach and berth." },
  { q: /refund|cancel/i, a: "Cancel 48h+ before departure for a ~75% refund. Between 12–48h, ~50%. Under 4h, no refund on confirmed tickets." },
  { q: /vande/i, a: "Vande Bharat 22439 runs Mon–Sat, NDLS 06:10 → JP 10:35. Chair Car ₹1,245 · Exec ₹2,340. Breakfast included in EC." },
];

function reply(q: string): string {
  for (const c of canned) if (c.q.test(q)) return c.a;
  return "Got it. Based on your route I'd suggest the Vande Bharat 06:10 for speed, or the Shatabdi 06:05 with breakfast for slightly less. Want me to prepare either?";
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  function send(q?: string) {
    const t = (q ?? text).trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: reply(t) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl brand-gradient pulse-ring"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-card fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[92vw] flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full text-white brand-gradient">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Yatra Assistant</div>
                <div className="text-[11px] text-muted-foreground">AI · online</div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-border/60 px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["Cheapest option", "Tatkal timing", "Refund rules"].map((c) => (
                  <button key={c} onClick={() => send(c)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent">
                    {c}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about routes, fares…" className="h-10 rounded-full" />
                <Button type="submit" size="icon" className="h-10 w-10 rounded-full brand-gradient text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
