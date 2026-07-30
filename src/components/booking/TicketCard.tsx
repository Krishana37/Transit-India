import { Download, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { useStore, type Booking } from "@/lib/store";
import { QrCode } from "./QrCode";

export function TicketCard({ booking }: { booking: Booking }) {
  const { t, formatCurrency, formatDate } = useI18n();
  const { updateBooking } = useStore();

  const share = async () => {
    const text = `Transit India ticket\nPNR: ${booking.pnr}\n${booking.serviceName} (${booking.serviceCode})\n${booking.fromCity} → ${booking.toCity} on ${formatDate(booking.date)}\n${booking.depart} → ${booking.arrive} · ${booking.classCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Transit India ticket", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Ticket details copied to clipboard");
      }
    } catch {
      /* user cancelled share sheet */
    }
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(booking, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${booking.pnr}-ticket.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickRefund = () => {
    updateBooking(booking.id, { status: "refunded" });
    toast.success(t("pay.quickRefund"));
  };

  const mealTotal = booking.meals.reduce((s, m) => s + m.price * m.qty, 0);

  return (
    <Card className="glass-card overflow-hidden rounded-3xl">
      <div className="brand-gradient p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-white/80">E-ticket</div>
            <div className="text-lg font-semibold">{booking.serviceName}</div>
            <div className="text-[12px] text-white/80">{booking.serviceCode} · {booking.classCode}</div>
          </div>
          <Badge className="rounded-full border-white/40 bg-white/15 text-white" variant="outline">
            {booking.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
              <div className="font-semibold">{booking.fromCity} ({booking.fromCode})</div>
              <div className="text-muted-foreground">{booking.depart}</div>
            </div>
            <div className="px-3 text-muted-foreground">→</div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">To</div>
              <div className="font-semibold">{booking.toCity} ({booking.toCode})</div>
              <div className="text-muted-foreground">{booking.arrive}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">{formatDate(booking.date)}</span>
            {booking.coach && <span className="rounded-full bg-muted px-2 py-1">Coach {booking.coach}</span>}
            {booking.seats && <span className="rounded-full bg-muted px-2 py-1">Seat {booking.seats.join(", ")}</span>}
            <span className="rounded-full bg-muted px-2 py-1">PNR {booking.pnr}</span>
          </div>

          <Separator className="my-4" />

          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Passengers</div>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="pb-1 pr-2 font-medium">Name</th>
                  <th className="pb-1 pr-2 font-medium">Age/Gender</th>
                  <th className="pb-1 font-medium">ID</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="py-1.5 pr-2">{p.fullName}</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">{p.age} / {p.gender}</td>
                    <td className="py-1.5 text-muted-foreground">{p.idType} {p.idNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {booking.meals.length > 0 && (
            <>
              <div className="mt-4 text-[11px] uppercase tracking-widest text-muted-foreground">Meals</div>
              <div className="mt-1 flex flex-wrap gap-2 text-[12px] text-muted-foreground">
                {booking.meals.map((m) => (
                  <span key={m.id} className="rounded-full bg-muted px-2 py-1">{m.name} × {m.qty}</span>
                ))}
              </div>
            </>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold">Total paid{mealTotal ? " (incl. meals)" : ""}</span>
            <span className="text-lg font-bold text-brand-gradient">{formatCurrency(booking.total)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 justify-self-center">
          <QrCode seed={booking.pnr} />
          <div className="text-[10px] text-muted-foreground">Scan at boarding (demo)</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-muted/40 p-4">
        <Button onClick={share} variant="outline" className="rounded-full">
          <Share2 className="mr-1.5 h-4 w-4" /> Share
        </Button>
        <Button onClick={download} variant="outline" className="rounded-full">
          <Download className="mr-1.5 h-4 w-4" /> Download
        </Button>
        {booking.status === "confirmed" && (
          <Button onClick={quickRefund} variant="ghost" className="ml-auto rounded-full text-destructive hover:text-destructive">
            <RotateCcw className="mr-1.5 h-4 w-4" /> Train cancelled? → Quick Refund Processing
          </Button>
        )}
      </div>
    </Card>
  );
}
