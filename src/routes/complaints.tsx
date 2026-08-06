import { createFileRoute } from "@tanstack/react-router";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { motion } from "framer-motion";
import { ArrowBigUp, MessageSquareWarning, Plus, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/transit/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  categories, seedComplaints, statuses, TECH_CATEGORY, technicalIssues, transportTypes,
  type Complaint, type ComplaintCategory, type ComplaintStatus,
} from "@/components/trips/complaintsData";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaint Portal — Transit India" },
      { name: "description", content: "Browse community-reported travel complaints, upvote issues and raise your own — fictional demo data." },
      { property: "og:title", content: "Complaint Portal — Transit India" },
      { property: "og:description", content: "A community complaint board covering cleanliness, delays, safety and more across all transport modes." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ComplaintsPage,
});

const statusStyles: Record<ComplaintStatus, string> = {
  Submitted: "bg-primary/10 text-primary",
  Open: "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]",
  "Under review": "bg-primary/10 text-primary",
  "In progress": "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]",
  "Action taken": "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  Resolved: "bg-muted text-muted-foreground",
};

const ALL = "all";

function ComplaintsPage() {
  const { notify } = useStore();
  const [complaints, setComplaints] = useState<Complaint[]>(seedComplaints);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState(ALL);
  const [stationFilter, setStationFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [open, setOpen] = useState(false);

  const stations = useMemo(() => Array.from(new Set(complaints.map((c) => c.station))).sort(), [complaints]);

  const filtered = complaints.filter((c) => {
    if (modeFilter !== ALL && c.mode !== modeFilter) return false;
    if (stationFilter !== ALL && c.station !== stationFilter) return false;
    if (statusFilter !== ALL && c.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (
        !c.body.toLowerCase().includes(q) &&
        !(c.subject ?? "").toLowerCase().includes(q) &&
        !(c.technicalIssue ?? "").toLowerCase().includes(q) &&
        !c.route.toLowerCase().includes(q) &&
        !c.station.toLowerCase().includes(q) &&
        !c.id.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const upvote = (id: string) => setVotes((v) => ({ ...v, [id]: (v[id] ?? 0) + 1 }));

  const submit = (data: NewComplaint) => {
    const id = `TIC-${Math.floor(10000 + Math.random() * 89999)}`;
    const created: Complaint = {
      id,
      handle: `traveller_${Math.floor(Math.random() * 900 + 100)}`,
      mode: data.mode,
      station: data.station,
      route: data.route,
      category: data.category,
      subject: data.subject,
      technicalIssue: data.technicalIssue,
      attachment: data.attachment,
      body: data.body,
      upvotes: 0,
      status: "Submitted",
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setComplaints((c) => [created, ...c]);
    notify({ kind: "platform", title: "Complaint submitted", body: `${id} logged with status “Submitted” (demo).` });
    toast.success(`Complaint ${id} submitted.`, { description: "You can track its status right here in the portal." });
    setOpen(false);
  };

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <BrandIcon name="complaint" label="Complaints" size={72} className="sm:!h-20 sm:!w-20" eager />
            <div className="min-w-0">
              <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Community</p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Complaint Portal</h1>
              <p className="text-[13px] text-muted-foreground">Browse, upvote and raise travel complaints.</p>
            </div>
          </div>
          <RaiseComplaintDialog open={open} onOpenChange={setOpen} onSubmit={submit} />
        </div>

        <Card className="glass-card space-y-3 rounded-3xl p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search complaints, routes, stations..."
              className="rounded-full pl-9"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Transport type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All transport types</SelectItem>
                {transportTypes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Station / route" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All stations/routes</SelectItem>
                {stations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="grid place-items-center gap-3 rounded-3xl border-border/60 p-10 text-center">
            <MessageSquareWarning className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No complaints match these filters</p>
            <p className="max-w-xs text-[13px] text-muted-foreground">Try clearing a filter, or raise a new complaint.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <ComplaintCard key={c.id} complaint={c} extraVotes={votes[c.id] ?? 0} onUpvote={() => upvote(c.id)} />
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground" data-a11y="optional">
          All complaints, moderation notes and outcomes shown here are fictional demo data for prototype purposes only.
        </p>
      </motion.section>
    </AppShell>
  );
}

function ComplaintCard({ complaint, extraVotes, onUpvote }: { complaint: Complaint; extraVotes: number; onUpvote: () => void }) {
  const [voted, setVoted] = useState(false);
  return (
    <Card className="glass-card rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground">{complaint.id}</span>
            <span>·</span>
            <span>{complaint.handle}</span>
            <span>·</span>
            <span>{complaint.date}{complaint.time ? ` · ${complaint.time}` : ""}</span>
          </div>
          {complaint.subject && (
            <p className="mt-1 break-words text-[14px] font-semibold leading-snug">{complaint.subject}</p>
          )}
          <p className="mt-1 break-words text-[13px] font-medium">{complaint.mode} · {complaint.route}</p>
          <p className="break-words text-[12px] text-muted-foreground">
            {complaint.station} · {complaint.category}
            {complaint.technicalIssue ? ` · ${complaint.technicalIssue}` : ""}
          </p>
          <p className="mt-2 break-words text-[13px] text-foreground/90">{complaint.body}</p>
          {complaint.attachment && (
            <img
              src={complaint.attachment}
              alt={`Evidence attached to complaint ${complaint.id}`}
              loading="lazy"
              className="mt-3 max-h-56 w-full rounded-xl border border-border/60 object-contain"
            />
          )}
          {complaint.status === "Resolved" && complaint.moderation && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-2.5 text-[12px] text-muted-foreground" data-a11y="optional">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--success)]" />
              <span>{complaint.moderation}</span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className={cn("rounded-full border-none", statusStyles[complaint.status])}>{complaint.status}</Badge>
          <Button
            size="sm"
            variant={voted ? "default" : "outline"}
            className={cn("rounded-full", voted && "brand-gradient text-white")}
            onClick={() => {
              if (voted) return;
              setVoted(true);
              onUpvote();
            }}
          >
            <ArrowBigUp className="mr-1 h-4 w-4" /> {complaint.upvotes + extraVotes}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export type NewComplaint = {
  mode: string;
  route: string;
  station: string;
  category: ComplaintCategory;
  subject: string;
  technicalIssue?: string;
  attachment?: string;
  body: string;
};

function RaiseComplaintDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: NewComplaint) => void;
}) {
  const [mode, setMode] = useState(transportTypes[0]);
  const [station, setStation] = useState("");
  const [route, setRoute] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>(categories[0]);
  const [technicalIssue, setTechnicalIssue] = useState<string>(technicalIssues[0]);
  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState<string | undefined>();
  const [body, setBody] = useState("");

  const isTechnical = category === TECH_CATEGORY;

  const reset = () => {
    setMode(transportTypes[0]);
    setStation("");
    setRoute("");
    setCategory(categories[0]);
    setTechnicalIssue(technicalIssues[0]);
    setSubject("");
    setAttachment(undefined);
    setBody("");
  };

  const pickCategory = (v: string) => {
    const next = v as ComplaintCategory;
    setCategory(next);
    if (next === TECH_CATEGORY) {
      setMode("Website / App");
      setStation((s) => s || "Transit India app");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="shrink-0 rounded-full brand-gradient text-white">
          <Plus className="mr-1.5 h-4 w-4" /> Raise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Raise a complaint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Complaint category</Label>
            <Select value={category} onValueChange={pickCategory}>
              <SelectTrigger className="h-auto rounded-2xl py-2 text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-w-[min(92vw,26rem)]">
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="whitespace-normal">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isTechnical && (
            <div className="space-y-1.5">
              <Label>What went wrong?</Label>
              <Select value={technicalIssue} onValueChange={setTechnicalIssue}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {technicalIssues.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Transport type</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {transportTypes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="complaint-subject">Subject</Label>
            <Input
              id="complaint-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={90}
              placeholder={isTechnical ? "e.g. Wallet balance not refreshing" : "e.g. Coach S4 washroom not cleaned"}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="complaint-station">{isTechnical ? "Screen / page" : "Station / property"}</Label>
              <Input
                id="complaint-station"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder={isTechnical ? "e.g. Wallet page" : "e.g. New Delhi"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="complaint-route">{isTechnical ? "Flow / journey" : "Route"}</Label>
              <Input
                id="complaint-route"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder={isTechnical ? "e.g. Booking → Payment" : "e.g. New Delhi → Mumbai Central"}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="complaint-body">Description</Label>
            <Textarea id="complaint-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Describe what happened..." />
          </div>

          <div className="space-y-1.5">
            <Label>Evidence (optional)</Label>
            <ImageUploadField value={attachment} onChange={setAttachment} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="rounded-full brand-gradient text-white"
            onClick={() => {
              if (!subject.trim() || !station.trim() || !route.trim() || !body.trim()) {
                toast.error("Please fill in subject, location, route and description.");
                return;
              }
              onSubmit({
                mode,
                route: route.trim(),
                station: station.trim(),
                category,
                subject: subject.trim(),
                technicalIssue: isTechnical ? technicalIssue : undefined,
                attachment,
                body: body.trim(),
              });
              reset();
            }}
          >
            Submit complaint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

