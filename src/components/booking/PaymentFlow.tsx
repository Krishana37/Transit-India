import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, Landmark, Loader2, ShieldCheck, Smartphone, Wallet, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Method = "UPI" | "Card" | "Netbanking" | "Wallet";
type Stage = "select" | "loading" | "otp-reading" | "otp-verified" | "processing" | "success" | "failed";

const methods: { id: Method; label: string; icon: typeof Smartphone }[] = [
  { id: "UPI", label: "UPI", icon: Smartphone },
  { id: "Card", label: "Card", icon: CreditCard },
  { id: "Netbanking", label: "Netbanking", icon: Landmark },
  { id: "Wallet", label: "Wallet", icon: Wallet },
];

export function PaymentFlow({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const { formatCurrency, t } = useI18n();
  const [method, setMethod] = useState<Method | null>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [otp, setOtp] = useState("");

  const start = (m: Method) => {
    setMethod(m);
    setOtp("");
    setStage("loading");
  };

  useEffect(() => {
    if (stage === "loading") {
      const t1 = setTimeout(() => setStage("otp-reading"), 900);
      return () => clearTimeout(t1);
    }
    if (stage === "otp-reading") {
      const generated = String(100000 + Math.floor(Math.random() * 900000));
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setOtp(generated.slice(0, i));
        if (i >= 6) {
          clearInterval(iv);
          setTimeout(() => setStage("otp-verified"), 400);
        }
      }, 140);
      return () => clearInterval(iv);
    }
    if (stage === "otp-verified") {
      const t2 = setTimeout(() => setStage("processing"), 800);
      return () => clearTimeout(t2);
    }
    if (stage === "processing") {
      const t3 = setTimeout(() => {
        const fail = Math.floor(Math.random() * 6) === 0;
        setStage(fail ? "failed" : "success");
      }, 1200);
      return () => clearTimeout(t3);
    }
    if (stage === "success") {
      const t4 = setTimeout(() => onSuccess(), 900);
      return () => clearTimeout(t4);
    }
  }, [stage, onSuccess]);

  if (stage === "select") {
    return (
      <Card className="glass-card rounded-2xl p-5">
        <div className="text-sm font-semibold">Choose a payment method</div>
        <p className="mt-1 text-[13px] text-muted-foreground">Amount payable {formatCurrency(total)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => start(m.id)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/70 p-4 text-sm transition hover:border-primary/40 hover:-translate-y-0.5"
            >
              <m.icon className="h-5 w-5 text-primary" />
              {m.label}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card flex min-h-[280px] flex-col items-center justify-center rounded-2xl p-8 text-center">
      {stage === "loading" && (
        <StageBlock icon={<Loader2 className="h-8 w-8 animate-spin text-primary" />} title={`Connecting to ${method}…`} sub="Please do not close this window." />
      )}
      {stage === "otp-reading" && (
        <StageBlock
          icon={<ShieldCheck className="h-8 w-8 text-primary" />}
          title="Reading OTP…"
          sub="Auto-fetched from your registered mobile number."
        >
          <InputOTP maxLength={6} value={otp} readOnly containerClassName="mt-4 justify-center">
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </StageBlock>
      )}
      {stage === "otp-verified" && (
        <StageBlock icon={<CheckCircle2 className="h-8 w-8 text-[color:var(--success)]" />} title="OTP verified" sub="Authorising your payment…" />
      )}
      {stage === "processing" && (
        <StageBlock icon={<Loader2 className="h-8 w-8 animate-spin text-primary" />} title="Processing payment…" sub={`Charging ${formatCurrency(total)}`} />
      )}
      {stage === "success" && (
        <StageBlock icon={<CheckCircle2 className="h-8 w-8 text-[color:var(--success)]" />} title="Payment successful" sub="Generating your ticket…" />
      )}
      {stage === "failed" && (
        <StageBlock icon={<XCircle className="h-8 w-8 text-destructive" />} title="Payment failed" sub={`${t("pay.noDeduction")} ${t("pay.refund")}`}>
          <Button onClick={() => setStage("select")} className="mt-4 rounded-full brand-gradient text-white">
            Retry payment
          </Button>
        </StageBlock>
      )}
    </Card>
  );
}

function StageBlock({ icon, title, sub, children }: { icon: React.ReactNode; title: string; sub: string; children?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col items-center gap-3")}>
      {icon}
      <div className="text-base font-semibold">{title}</div>
      <div className="max-w-xs text-[13px] text-muted-foreground">{sub}</div>
      {children}
    </motion.div>
  );
}
