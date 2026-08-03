import { motion } from "framer-motion";
import { useEffect } from "react";
import { BrandLogo } from "@/components/brand/BrandAssets";

/**
 * Transit India opening splash. Original branding only — no third-party
 * transport-portal imagery, colours or layout is referenced anywhere.
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(16px)", scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
      role="status"
      aria-label="Transit India is starting"
    >
      {/* ambient field */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 32%, transparent), transparent)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, x: -120 }}
          animate={{ opacity: 0.35, x: 120 }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--accent-orange) 28%, transparent), transparent)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="relative"
        >
          <BrandLogo size={112} rounded="rounded-full" className="shadow-2xl" />
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ boxShadow: "0 0 0 0 color-mix(in oklab, var(--brand) 45%, transparent)" }}
            animate={{ boxShadow: "0 0 0 28px color-mix(in oklab, var(--brand) 0%, transparent)" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Transit <span className="text-brand-gradient">India</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-2 text-[13px] uppercase tracking-[0.32em] text-muted-foreground"
        >
          Every journey · One search
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 h-[3px] w-44 overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="h-full w-full rounded-full brand-gradient"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
