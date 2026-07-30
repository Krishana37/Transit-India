import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Search, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const quickChips = ["Cheapest option", "Fastest route", "AC train tomorrow morning", "I have ₹1000 budget"];

const greeting = "Hi! I'm Yatra — your travel assistant. Ask me about routes, fares, or Tatkal timings (all demo data).";

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      toast.error(err.message || "Yatra is unavailable right now. Please try again.");
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!busy && open) inputRef.current?.focus();
  }, [busy, open]);

  function send(q?: string) {
    const value = (q ?? text).trim();
    if (!value || busy) return;
    setText("");
    sendMessage({ text: value });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
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
            className="glass-card fixed bottom-24 right-6 z-50 flex h-[560px] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-3xl"
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
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm leading-relaxed text-foreground">
                  {greeting}
                </div>
              </div>

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    }`}
                  >
                    {m.parts.map((part, i) => {
                      if (part.type === "text") {
                        return m.role === "user" ? (
                          <span key={i}>{part.text}</span>
                        ) : (
                          <div key={i} className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      if (part.type === "tool-searchTravel") {
                        return (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Search className="h-3 w-3 animate-pulse" />
                            Searching options…
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}

              {busy && (
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

              {error && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-[13px] text-muted-foreground">
                    Yatra couldn't respond just now ({error.message || "connection issue"}). Please try again in a moment.
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <div className="border-t border-border/60 px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {quickChips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    disabled={busy}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent disabled:opacity-50"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-end gap-2"
              >
                <Textarea
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about routes, fares…"
                  rows={1}
                  className="max-h-24 min-h-10 flex-1 resize-none rounded-2xl py-2.5"
                />
                <Button type="submit" size="icon" disabled={busy || !text.trim()} className="h-10 w-10 shrink-0 rounded-full brand-gradient text-white">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
