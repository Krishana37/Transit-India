import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Banknote, CheckCircle2, CreditCard, Landmark, Loader2, ShieldCheck, Smartphone, Wallet, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useI18n } from "@/lib/i18n";
import type { PaymentMethod } from "@/lib/store";
import { cn } from "@/lib/utils";

type Stage = "select" | "loading" | "otp-reading" | "otp-verified" | "processing" | "success" | "failed";

const methodIcon: Record<PaymentMethod["kind"], typeof Smartphone> = {
  upi: Smartphone, bank: Landmark, debit: CreditCard, credit: CreditCard, wallet: Wallet,
};

export function PaymentFlow({
  total, walletBalance, paymentMethods, onSuccess,
}: {
  total: number;
  walletBalance: number;
  paymentMethods: PaymentMethod[];
  onSuccess: (paidWith: string) => void;
}) {
  const { formatCurrency, t } = useI18n();
  const [methodLabel, setMethodLabel] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [otp, setOtp] = useState("");
  const [walletError, setWalletError] = useState(false);

  const start = (label: string, isWallet: boolean) => {
    if (isWallet && walletBalance < total) {
      setWalletError(true);
      return;
    }
    setWalletError(false);
    setMethodLabel(label);
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
      const t4 = setTimeout(() => onSuccess(methodLabel ?? "Payment"), 900);
      return () => clearTimeout(t4);
    }
  }, [stage, onSuccess, methodLabel]);

  if (stage === "select") {
    return (
      <Card className="glass-card rounded-2xl p-5">
        <div className="text-sm font-semibold">Choose a payment method</div>
        <p className="mt-1 text-[13px] text-muted-foreground">Amount payable {formatCurrency(total)}</p>

        {walletError && (
          <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-[12px] text-destructive">
            Insufficient wallet balance for this payment.{" "}
            <Link to="/wallet" className="font-semibold underline underline-offset-2">Add money to wallet</Link>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2.5">
          <button
            onClick={() => start("TripSync Wallet", true)}
            className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-background/70 p-3.5 text-left transition hover:border-primary/40 hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--brand-soft)] text-primary"><Banknote className="h-4 w-4" /></span>
              <span>
                <span className="block text-sm font-medium">TripSync Wallet</span>
                <span className="block text-[11px] text-muted-foreground">Balance {formatCurrency(walletBalance)}</span>
              </span>
            </span>
            {walletBalance < total && <Badge variant="outline" className="rounded-full text-[10px] text-destructive border-destructive/40">Low balance</Badge>}
          </button>

          {paymentMethods.map((m) => {
            const Icon = methodIcon[m.kind] ?? CreditCard;
            return (
              <button
                key={m.id}
                onClick={() => start(m.label, false)}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/70 p-3.5 text-left transition hover:border-primary/40 hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon className="h-4 w-4" /></span>
                <span>
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{m.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card flex min-h-[280px] flex-col items-center justify-center rounded-2xl p-8 text-center">
      {stage === "loading" && (
        <StageBlock icon={<Loader2 className="h-8 w-8 animate-spin text-primary" />} title={`Connecting to ${methodLabel}…`} sub="Please do not close this window." />
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
