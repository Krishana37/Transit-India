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
import {
  useStore, tierFor, driverEarningsSummary, WALLET_MIN_TOPUP, WALLET_MAX_TOPUP, POINT_VALUE,
  type PaymentMethodKind, type WalletTxn,
} from "@/lib/store";
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
  const {
    walletBalance, walletTxns, coins, points, addMoney, paymentMethods, addPaymentMethod, removePaymentMethod,
  } = useStore();
  const { formatCurrency } = useI18n();
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const tier = tierFor(points);

  const totals = useMemo(() => {
    let added = 0, spent = 0, refunded = 0, earned = 0;
    for (const t of walletTxns) {
      if (t.type === "credit") added += t.amount;
      else if (t.type === "debit") spent += t.amount;
      else if (t.type === "refund") refunded += t.amount;
      else if (t.type === "earning") earned += t.amount;
    }
    return { added, spent, refunded, earned };
  }, [walletTxns]);

  const handleAdd = (amount: number) => {
    const res = addMoney(amount, "Money added via prototype top-up");
    if (!res.ok) {
      setAmountError(res.error ?? "Enter a valid amount.");
      toast.error(res.error ?? "Enter a valid amount.");
      return;
    }
    setAmountError(null);
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
              <p className="text-[11px] text-white/80">
                1 point = {formatCurrency(POINT_VALUE)} · worth {formatCurrency(Math.floor(points * POINT_VALUE))}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryTile label="Money added" value={formatCurrency(totals.added)} tone="up" icon={ArrowDownLeft} />
          <SummaryTile label="Money spent" value={formatCurrency(totals.spent)} tone="down" icon={ArrowUpRight} />
          <SummaryTile label="Refunds received" value={formatCurrency(totals.refunded)} tone="up" icon={RotateCcw} />
          <SummaryTile label="Driver earnings in wallet" value={formatCurrency(totals.earned)} tone="up" icon={Banknote} />
        </div>

        <CabberEarnings />

        <Card className="rounded-3xl border-border/60 p-5">

          <h2 className="text-sm font-semibold">Add Money</h2>
          <p className="text-[12px] text-muted-foreground">
            Between {formatCurrency(WALLET_MIN_TOPUP)} and {formatCurrency(WALLET_MAX_TOPUP)} per transaction.
          </p>
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
              min={WALLET_MIN_TOPUP}
              max={WALLET_MAX_TOPUP}
              step={1}
              aria-invalid={!!amountError}
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                const v = e.target.value;
                setCustomAmount(v);
                const n = Number(v);
                setAmountError(
                  v === "" ? null
                    : !Number.isFinite(n) || n < WALLET_MIN_TOPUP ? `Minimum ${formatCurrency(WALLET_MIN_TOPUP)}.`
                    : n > WALLET_MAX_TOPUP ? `Maximum ${formatCurrency(WALLET_MAX_TOPUP)} per transaction.`
                    : null,
                );
              }}
              className="rounded-full"
            />
            <Button
              className="shrink-0 rounded-full brand-gradient text-white"
              disabled={!!amountError || customAmount === ""}
              onClick={() => handleAdd(Math.floor(Number(customAmount)))}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add money
            </Button>
          </div>
          {amountError && <p className="mt-2 text-[12px] text-destructive">{amountError}</p>}
        </Card>

        <TransferMoney />

        <TxnHistory txns={walletTxns} />

        <PaymentMethods methods={paymentMethods} onAdd={addPaymentMethod} onRemove={removePaymentMethod} />
      </motion.section>
    </AppShell>
  );
}

function SummaryTile({
  label, value, tone, icon: Icon,
}: { label: string; value: string; tone: "up" | "down"; icon: typeof ArrowDownLeft }) {
  return (
    <Card className="min-w-0 rounded-2xl border-border/60 p-4">
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full",
          tone === "up" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-destructive/15 text-destructive",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2 break-words text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="break-words text-lg font-semibold">{value}</p>
    </Card>
  );
}

/** Driver-only earnings panel — never shown to customers who aren't registered drivers. */
function CabberEarnings() {
  const { driver, driverEarnings, driverWithdrawn, withdrawEarnings } = useStore();
  const { formatCurrency } = useI18n();
  if (!driver) return null;
  const summary = driverEarningsSummary(driverEarnings, driverWithdrawn);

  const withdraw = () => {
    const res = withdrawEarnings(summary.withdrawable);
    if (!res.ok) {
      toast.error(res.error ?? "Nothing to withdraw yet.");
      return;
    }
    toast.success(`${formatCurrency(summary.withdrawable)} moved to your Transit Wallet.`);
  };

  return (
    <Card className="rounded-3xl border-border/60 p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Cabber driver earnings</h2>
          <p className="break-words text-[12px] text-muted-foreground">
            {driver.name} · {driver.vehicleNumber} — kept separate from your customer wallet.
          </p>
        </div>
        <Button
          className="shrink-0 rounded-full brand-gradient text-white"
          disabled={summary.withdrawable <= 0}
          onClick={withdraw}
        >
          Withdraw
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <SummaryTile label="Today" value={formatCurrency(summary.today)} tone="up" icon={Banknote} />
        <SummaryTile label="This week" value={formatCurrency(summary.week)} tone="up" icon={Banknote} />
        <SummaryTile label="Total earned" value={formatCurrency(summary.total)} tone="up" icon={Banknote} />
        <SummaryTile label="Completed rides" value={String(summary.rides)} tone="up" icon={Receipt} />
        <SummaryTile label="Pending" value={formatCurrency(summary.pending)} tone="down" icon={RotateCcw} />
        <SummaryTile label="Withdrawable" value={formatCurrency(summary.withdrawable)} tone="up" icon={ArrowDownLeft} />
      </div>
    </Card>
  );
}



/** Prototype payout: move wallet money to a bank account, UPI ID or saved method. */
function TransferMoney() {
  const { walletBalance, paymentMethods, transferMoney, addPaymentMethod } = useStore();
  const { formatCurrency } = useI18n();
  const [target, setTarget] = useState<string>(paymentMethods[0]?.id ?? "new-upi");
  const [newUpi, setNewUpi] = useState("");
  const [newBank, setNewBank] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState<{ amount: number; destination: string } | null>(null);

  const numeric = Math.floor(Number(amount));
  const invalid =
    amount === "" ? null
      : !Number.isFinite(numeric) || numeric <= 0 ? "Enter an amount greater than zero."
      : numeric > walletBalance ? "Amount exceeds your available wallet balance."
      : null;

  const destinationLabel = () => {
    if (target === "new-upi") return newUpi.trim();
    if (target === "new-bank") return `Bank A/C ${newBank.trim()}`;
    const m = paymentMethods.find((p) => p.id === target);
    return m ? `${m.label} · ${m.detail}` : "";
  };

  const send = () => {
    const destination = destinationLabel();
    if (!destination) {
      toast.error("Add a UPI ID or bank account number first.");
      return;
    }
    if (invalid || amount === "") {
      toast.error(invalid ?? "Enter a transfer amount.");
      return;
    }
    const res = transferMoney({ amount: numeric, destination });
    if (!res.ok) {
      toast.error(res.error ?? "Transfer failed.");
      return;
    }
    if (target === "new-upi") addPaymentMethod({ kind: "upi", label: "Payout UPI", detail: newUpi.trim() });
    if (target === "new-bank") addPaymentMethod({ kind: "bank", label: "Payout bank", detail: `A/C ${newBank.trim()}` });
    setDone({ amount: numeric, destination });
    toast.success(`${formatCurrency(numeric)} transferred to ${destination}.`);
    setAmount("");
    setNewUpi("");
    setNewBank("");
  };

  return (
    <Card className="rounded-3xl border-border/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Transfer money out</h2>
        <span className="text-[12px] text-muted-foreground">
          Available: <span className="font-semibold text-foreground">{formatCurrency(walletBalance)}</span>
        </span>
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Send your Transit Wallet balance to your own bank account, UPI ID or a saved payment method.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Transfer to</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="rounded-full"><SelectValue placeholder="Choose a destination" /></SelectTrigger>
            <SelectContent>
              {paymentMethods.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.label} · {m.detail}</SelectItem>
              ))}
              <SelectItem value="new-upi">Add a new UPI ID</SelectItem>
              <SelectItem value="new-bank">Add a new bank account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="transfer-amount">Amount</Label>
          <Input
            id="transfer-amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={amount}
            aria-invalid={!!invalid}
            onChange={(e) => { setAmount(e.target.value); setDone(null); }}
            placeholder="Enter amount"
            className="rounded-full"
          />
        </div>
      </div>

      {target === "new-upi" && (
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="transfer-upi">UPI ID</Label>
          <Input id="transfer-upi" value={newUpi} onChange={(e) => setNewUpi(e.target.value)} placeholder="yourname@upi" className="rounded-full" />
        </div>
      )}
      {target === "new-bank" && (
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="transfer-bank">Account number</Label>
          <Input id="transfer-bank" value={newBank} onChange={(e) => setNewBank(e.target.value)} placeholder="Account number" className="rounded-full" />
        </div>
      )}

      {invalid && <p className="mt-2 text-[12px] text-destructive">{invalid}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {[500, 1000, 2000].filter((q) => q <= walletBalance).map((q) => (
          <Button key={q} variant="outline" size="sm" className="rounded-full" onClick={() => setAmount(String(q))}>
            <IndianRupee className="mr-1 h-3 w-3" />{q}
          </Button>
        ))}
        {walletBalance > 0 && (
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setAmount(String(Math.floor(walletBalance)))}>
            All
          </Button>
        )}
      </div>

      <Button
        className="mt-3 w-full rounded-full brand-gradient text-white"
        disabled={!!invalid || amount === "" || walletBalance <= 0}
        onClick={send}
      >
        <ArrowUpRight className="mr-1.5 h-4 w-4" /> Confirm transfer
      </Button>

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="mt-3 flex items-start gap-2 rounded-2xl bg-[color:var(--success)]/12 p-3 text-[13px] text-[color:var(--success)]"
        >
          <Banknote className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">
            {formatCurrency(done.amount)} transferred to {done.destination}. Expect it in 2–3 working days (demo).
          </span>
        </motion.div>
      )}
    </Card>
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
                <p className="break-words text-[11px] text-muted-foreground">
                  {new Date(t.at).toLocaleString()} · {relTime(t.at)}
                  {t.category ? ` · ${t.category}` : ""}
                  {t.ref ? ` · Ref ${t.ref}` : ""}
                  {` · ${t.status ?? "success"}`}
                </p>
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
