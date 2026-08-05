import { useState } from "react";
import { toast } from "sonner";
import { StarInput, StarRating } from "@/components/common/StarRating";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { blendRating, communityRating, ratingTone } from "@/lib/ratings";
import { cn } from "@/lib/utils";

/**
 * One reusable rating surface: shows the blended community score and lets the
 * traveller leave (or update) their own rating and note.
 */
export function RateDialog({
  ratingKey,
  title,
  subtitle,
  trigger,
  compact,
}: {
  ratingKey: string;
  title: string;
  subtitle?: string;
  trigger?: React.ReactNode;
  compact?: boolean;
}) {
  const { ratings, rateService } = useStore();
  const mine = ratings[ratingKey];
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(mine?.stars ?? 0);
  const [note, setNote] = useState(mine?.note ?? "");

  const blended = blendRating(communityRating(ratingKey), mine?.stars);

  const submit = () => {
    if (!stars) {
      toast.error("Pick a star rating first.");
      return;
    }
    rateService(ratingKey, stars, note.trim() || undefined);
    toast.success(`Thanks — ${stars}★ recorded for ${title}.`);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          setStars(mine?.stars ?? 0);
          setNote(mine?.note ?? "");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 transition hover:border-primary/40 hover:text-primary",
              compact ? "text-[11px]" : "text-[12px]",
            )}
          >
            <StarRating stars={blended.stars} count={blended.count} size={compact ? 12 : 14} />
            <span className="text-muted-foreground">{mine ? "Your rating saved" : "Rate"}</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {title}</DialogTitle>
          <DialogDescription>
            {subtitle ?? "Your rating helps other travellers pick the best service on this route."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] uppercase tracking-widest text-muted-foreground">Traveller score</span>
            <StarRating stars={blended.stars} count={blended.count} />
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">{ratingTone(blended.stars)} on this route</p>
        </div>

        <div className="flex flex-col items-center gap-2 py-2">
          <StarInput value={stars} onChange={setStars} />
          <p className="text-[12px] text-muted-foreground">
            {stars ? `${stars} out of 5` : "Tap a star to rate"}
          </p>
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything worth telling other travellers? (optional)"
          className="min-h-20 rounded-2xl"
        />

        <DialogFooter>
          <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>Not now</Button>
          <Button className="rounded-full brand-gradient text-white" onClick={submit}>
            {mine ? "Update rating" : "Submit rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
