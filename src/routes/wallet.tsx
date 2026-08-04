import { createFileRoute } from "@tanstack/react-router";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { motion } from "framer-motion";
import {
  Banknote, Building2, CreditCard, IndianRupee, Landmark, Plus, Smartphone, Trash2, Wallet as WalletIcon,
  ArrowDownLeft, ArrowUpRight, RotateCcw, Coins, Star, Receipt,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useStore, tierFor, type PaymentMethodKind, type WalletTxn } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "My Wallet — Transit India" },
      { name: "description", content: "Manage your Transit Wallet balance, add money, review transactions and payment methods." },
      { property: "og:title", content: "My Wallet — Transit India" },
      { property: "og:description", content: "Top up your wallet, track credits, debits and refunds, and manage saved payment methods." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WalletPage,
});

const quickAmounts = [500, 1000, 2000, 5000];

const kindMeta: Record<PaymentMethodKind, { label: string; icon: typeof Smartphone; placeholder: string }> = {
  upi: { label: "UPI ID", icon: Smartphone, placeholder: "yourname@upi" },
  bank: { label: "Bank account", icon: Landmark, placeholder: "Account number ending 1234" },
  debit: { label: "Debit card", icon: CreditCard, placeholder: "Card number (16 digits)" },
  credit: { label: "Credit card", icon: CreditCard, placeholder: "Card number (16 digits)" },
  wallet: { label: "Wallet", icon: WalletIcon, placeholder: "Linked wallet handle" },
};

function relTime(at: string) {
  const diff = Date.now() - new Date(at).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(at).toLocaleDateString();
}

function txnIcon(type: WalletTxn["type"]) {
  if (type === "credit") return ArrowDownLeft;
  if (type === "refund") return RotateCcw;
  return ArrowUpRight;
}

function WalletPage() {
  const { walletBalance, walletTxns, coins, points, addMoney, paymentMethods, addPaymentMethod, removePaymentMethod } = useStore();
  const { formatCurrency } = useI18n();
  const [customAmount, setCustomAmount] = useState("");
  const tier = tierFor(points);

  const handleAdd = (amount: number) => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    addMoney(amount, "Money added via prototype top-up");
    toast.success(`${formatCurrency(amount)} added to your wallet.`);
    setCustomAmount("");
  };

  return (
    <AppShell>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        <div className="flex min-w-0 items-center gap-4">
          <BrandIcon name="wallet" label="Wallet" size={72} className="sm:!h-20 sm:!w-20" eager />
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Transit Wallet</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Wallet</h1>
            <p className="text-[13px] text-muted-foreground">Add money, review transactions and manage payment methods.</p>
          </div>
        </div>

        <Card className="brand-gradient rounded-3xl p-6 text-white">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/80">Wallet balance</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{formatCurrency(walletBalance)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/80">Transit Coins</p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold">
                <Coins className="h-5 w-5" /> {coins}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/80">Transit Points · {tier.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold">
                <Star className="h-5 w-5" /> {points}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-5">
          <h2 className="text-sm font-semibold">Add Money</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {quickAmounts.map((amt) => (
              <Button key={amt} variant="outline" className="rounded-full" onClick={() => handleAdd(amt)}>
                <IndianRupee className="mr-1 h-3.5 w-3.5" />{amt}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="rounded-full"
            />
            <Button className="shrink-0 rounded-full brand-gradient text-white" onClick={() => handleAdd(Number(customAmount))}>
              <Plus className="mr-1.5 h-4 w-4" /> Add money
            </Button>
          </div>
        </Card>

        <TxnHistory txns={walletTxns} />

        <PaymentMethods methods={paymentMethods} onAdd={addPaymentMethod} onRemove={removePaymentMethod} />
      </motion.section>
    </AppShell>
  );
}

function TxnHistory({ txns }: { txns: WalletTxn[] }) {
  const { formatCurrency } = useI18n();
  const filterFor = (tab: string) => {
    if (tab === "credit") return txns.filter((t) => t.type === "credit");
    if (tab === "debit") return txns.filter((t) => t.type === "debit");
    if (tab === "refund") return txns.filter((t) => t.type === "refund");
    return txns;
  };

  const renderList = (list: WalletTxn[]) =>
    list.length === 0 ? (
      <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <Receipt className="h-6 w-6 text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">No transactions here yet.</p>
      </div>
    ) : (
      <div className="space-y-2">
        {list.map((t) => {
          const Icon = txnIcon(t.type);
          const positive = t.type !== "debit";
          return (
            <div key={t.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 p-3">
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                  positive ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-destructive/15 text-destructive",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{relTime(t.at)}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-[13px] font-semibold",
                  positive ? "text-[color:var(--success)]" : "text-destructive",
                )}
              >
                {positive ? "+" : "-"}{formatCurrency(t.amount)}
              </span>
            </div>
          );
        })}
      </div>
    );

  return (
    <Card className="rounded-3xl border-border/60 p-5">
      <h2 className="text-sm font-semibold">Transaction history</h2>
      <Tabs defaultValue="all" className="mt-3">
        <TabsList className="grid w-full grid-cols-4 rounded-full">
          <TabsTrigger value="all" className="rounded-full text-[12px]">All</TabsTrigger>
          <TabsTrigger value="credit" className="rounded-full text-[12px]">Added</TabsTrigger>
          <TabsTrigger value="debit" className="rounded-full text-[12px]">Spent</TabsTrigger>
          <TabsTrigger value="refund" className="rounded-full text-[12px]">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-3">{renderList(filterFor("all"))}</TabsContent>
        <TabsContent value="credit" className="mt-3">{renderList(filterFor("credit"))}</TabsContent>
        <TabsContent value="debit" className="mt-3">{renderList(filterFor("debit"))}</TabsContent>
        <TabsContent value="refund" className="mt-3">{renderList(filterFor("refund"))}</TabsContent>
      </Tabs>
    </Card>
  );
}

function PaymentMethods({
  methods, onAdd, onRemove,
}: {
  methods: { id: string; kind: PaymentMethodKind; label: string; detail: string; primary?: boolean }[];
  onAdd: (m: { kind: PaymentMethodKind; label: string; detail: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<PaymentMethodKind>("upi");
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");

  const reset = () => {
    setKind("upi");
    setLabel("");
    setDetail("");
  };

  const submit = () => {
    if (label.trim().length < 2) {
      toast.error("Enter a label for this payment method.");
      return;
    }
    if ((kind === "upi") && !detail.includes("@")) {
      toast.error("Enter a valid UPI ID, e.g. name@bank.");
      return;
    }
    if ((kind === "debit" || kind === "credit")) {
      const digits = detail.replace(/\D/g, "");
      if (digits.length < 4) {
        toast.error("Enter at least the last 4 digits of the card.");
        return;
      }
      const masked = `•••• ${digits.slice(-4)}`;
      onAdd({ kind, label: label.trim(), detail: masked });
      toast.success("Payment method added.");
      setOpen(false);
      reset();
      return;
    }
    if (!detail.trim()) {
      toast.error("Enter the required detail.");
      return;
    }
    onAdd({ kind, label: label.trim(), detail: detail.trim() });
    toast.success("Payment method added.");
    setOpen(false);
    reset();
  };

  return (
    <Card className="rounded-3xl border-border/60 p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <h2 className="min-w-0 text-sm font-semibold">Payment methods</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="shrink-0 rounded-full">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add method
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add payment method</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={kind} onValueChange={(v) => { setKind(v as PaymentMethodKind); setDetail(""); }}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(kindMeta) as PaymentMethodKind[]).map((k) => (
                      <SelectItem key={k} value={k}>{kindMeta[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pm-label">Label</Label>
                <Input id="pm-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. My HDFC card" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pm-detail">Detail</Label>
                <Input id="pm-detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder={kindMeta[kind].placeholder} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="rounded-full brand-gradient text-white" onClick={submit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {methods.length === 0 ? (
        <div className="mt-3 grid place-items-center gap-2 rounded-2xl border border-dashed border-border/60 p-8 text-center">
          <Banknote className="h-6 w-6 text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">No payment methods saved yet.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {methods.map((m) => {
            const Icon = kindMeta[m.kind].icon;
            return (
              <div key={m.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{m.label} {m.primary && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">· Primary</span>}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{m.detail}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label={`Remove ${m.label}`}
                  onClick={() => { onRemove(m.id); toast.success("Payment method removed."); }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
