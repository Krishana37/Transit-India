import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageSquareHeart, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BrandIcon } from "@/components/brand/BrandAssets";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { StarInput, StarRating } from "@/components/common/StarRating";
import { AppShell } from "@/components/transit/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { useStore, type FeedbackTopic } from "@/lib/store";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Share Feedback — Transit India" },
      { name: "description", content: "Rate the Transit India prototype, suggest features and read what other travellers are saying." },
      { property: "og:title", content: "Share Feedback — Transit India" },
      { property: "og:description", content: "Rate your experience, report what could be better and browse the public traveller feedback wall." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FeedbackPage,
});

const topics: FeedbackTopic[] = [
  "Overall experience", "UI / UX", "Features", "Performance", "Accessibility", "Suggestion", "Bug", "Other",
];

function FeedbackPage() {
  const { feedback, submitFeedback } = useStore();
  const { t, formatDate } = useI18n();

  const [topic, setTopic] = useState<FeedbackTopic>("Overall experience");
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [screenshot, setScreenshot] = useState<string | undefined>();
  const [filter, setFilter] = useState<string>("all");

  const average = useMemo(() => {
    if (!feedback.length) return 0;
    return Number((feedback.reduce((a, f) => a + f.stars, 0) / feedback.length).toFixed(1));
  }, [feedback]);

  const visible = useMemo(
    () => (filter === "all" ? feedback : feedback.filter((f) => f.topic === filter)),
    [feedback, filter],
  );

  const submit = () => {
    if (!stars) {
      toast.error(t("feedback.errStars", "Please pick a star rating first."));
      return;
    }
    if (message.trim().length < 5) {
      toast.error(t("feedback.errMessage", "Tell us a little more — at least a short sentence."));
      return;
    }
    submitFeedback({
      topic,
      stars,
      message: message.trim(),
      suggestion: suggestion.trim() || undefined,
      screenshot,
    });
    toast.success(t("feedback.success", "Thank you! Your feedback has been submitted."), {
      description: t("feedback.successHint", "It is now visible on the public feedback wall below."),
    });
    setStars(0);
    setMessage("");
    setSuggestion("");
    setScreenshot(undefined);
    setTopic("Overall experience");
  };

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <BrandIcon name="feedback" label={t("nav.feedback", "Feedback")} size={72} className="sm:!h-20 sm:!w-20" eager />
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">{t("feedback.eyebrow", "Community")}</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("feedback.title", "Share your feedback")}</h1>
            <p className="break-words text-[13px] text-muted-foreground">
              {t("feedback.subtitle", "Rate the app, suggest features and see what other travellers think.")}
            </p>
          </div>
        </div>

        <Card className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5">
          <div className="min-w-0">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground">
              {t("feedback.communityScore", "Community score")}
            </p>
            <StarRating stars={average} count={feedback.length} size={18} className="mt-1" />
          </div>
          <Badge className="rounded-full border-none bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {feedback.length} {t("feedback.entries", "public reviews")}
          </Badge>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="glass-card space-y-4 rounded-3xl p-5">
            <h2 className="text-lg font-semibold tracking-tight">{t("feedback.formTitle", "Tell us how it went")}</h2>

            <div className="space-y-1.5">
              <Label>{t("feedback.topic", "What is your feedback about?")}</Label>
              <Select value={topic} onValueChange={(v) => setTopic(v as FeedbackTopic)}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {topics.map((tp) => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-center">
              <p className="text-[12px] uppercase tracking-widest text-muted-foreground">
                {t("feedback.rate", "Your rating")}
              </p>
              <div className="mt-2 flex justify-center">
                <StarInput value={stars} onChange={setStars} />
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {stars ? `${stars} / 5` : t("feedback.tapStar", "Tap a star to rate")}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fb-message">{t("feedback.message", "Your feedback")}</Label>
              <Textarea
                id="fb-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={t("feedback.messagePh", "What worked well, and what felt clunky?")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fb-suggestion">{t("feedback.suggestion", "Feature suggestion (optional)")}</Label>
              <Input
                id="fb-suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={t("feedback.suggestionPh", "Something you wish Transit India had…")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t("feedback.screenshot", "Screenshot (optional)")}</Label>
              <ImageUploadField value={screenshot} onChange={setScreenshot} />
            </div>

            <Button className="w-full rounded-full brand-gradient text-white" onClick={submit}>
              <MessageSquareHeart className="mr-1.5 h-4 w-4" /> {t("feedback.submit", "Submit feedback")}
            </Button>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full border px-3 py-1 text-[12px] transition ${filter === "all" ? "border-primary/40 bg-[color:var(--brand-soft)] text-primary" : "border-border/70 text-muted-foreground hover:text-foreground"}`}
              >
                {t("feedback.all", "All")}
              </button>
              {topics.map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setFilter(tp)}
                  className={`rounded-full border px-3 py-1 text-[12px] transition ${filter === tp ? "border-primary/40 bg-[color:var(--brand-soft)] text-primary" : "border-border/70 text-muted-foreground hover:text-foreground"}`}
                >
                  {tp}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <Card className="grid place-items-center gap-2 rounded-3xl border-border/60 p-10 text-center">
                <MessageSquareHeart className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">{t("feedback.empty", "No feedback in this category yet")}</p>
                <p className="max-w-xs text-[13px] text-muted-foreground">
                  {t("feedback.emptyHint", "Be the first to share your thoughts using the form.")}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {visible.map((f) => (
                  <Card key={f.id} className="glass-card space-y-2 rounded-2xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
                        <span className="truncate font-medium text-foreground">{f.handle}</span>
                        <span>·</span>
                        <span>{formatDate(f.at)}</span>
                      </div>
                      <StarRating stars={f.stars} size={13} showValue={false} />
                    </div>
                    <Badge className="rounded-full border-none bg-muted text-muted-foreground">{f.topic}</Badge>
                    <p className="break-words text-[13px] text-foreground/90">{f.message}</p>
                    {f.suggestion && (
                      <p className="break-words rounded-xl bg-muted/50 p-2.5 text-[12px] text-muted-foreground">
                        <span className="font-medium text-foreground">{t("feedback.idea", "Suggestion")}: </span>
                        {f.suggestion}
                      </p>
                    )}
                    {f.screenshot && (
                      <img
                        src={f.screenshot}
                        alt={`Screenshot attached by ${f.handle}`}
                        loading="lazy"
                        className="max-h-56 w-full rounded-xl border border-border/60 object-contain"
                      />
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground" data-a11y="optional">
          {t("feedback.disclaimer", "Feedback shown here is fictional demo data stored locally for prototype purposes only.")}
        </p>
      </motion.section>
    </AppShell>
  );
}
