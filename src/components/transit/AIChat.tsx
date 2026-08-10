import { AnimatePresence, motion } from "framer-motion";
import { Bot, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl brand-gradient pulse-ring"
        aria-label="Open Yatra AI assistant"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="glass-card fixed bottom-24 right-6 z-50 flex h-[420px] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full text-white brand-gradient">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <div className="text-sm font-semibold">
                  Yatra Assistant
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Under Development
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full brand-gradient text-white shadow-lg">
                  <Bot className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-semibold">
                  Yatra AI — Under Development
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our AI-powered travel assistant is currently under
                  development and will be available soon.
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  You can still explore all other Transit India features.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
