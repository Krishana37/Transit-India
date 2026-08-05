import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell, Bot, Bus, Coins, LogOut, MessageSquareWarning, Moon, Plane, Ship, Sun,
  Ticket, Train as TrainIcon, TrainFront, User, Menu, Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo, BrandIcon } from "@/components/brand/BrandAssets";
import { useI18n, languages } from "@/lib/i18n";
import { useStore, type AccessibilityMode } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", key: "nav.home", label: "Home", icon: TrainIcon, brand: "home" },
  { to: "/book/$mode", params: { mode: "train" }, key: "nav.book", label: "Book", icon: Ticket, brand: "train" },
  { to: "/trips", key: "nav.trips", label: "My Trips", icon: TrainFront, brand: "trips" },
  { to: "/pnr", key: "nav.pnr", label: "PNR", icon: TrainFront, brand: "pnr" },
  { to: "/cabber", key: "nav.cabber", label: "Cabber", icon: Bus, brand: "cabber" },
  { to: "/wallet", key: "nav.wallet", label: "Wallet", icon: Wallet, brand: "wallet" },
  { to: "/rewards", key: "nav.rewards", label: "Rewards", icon: Wallet, brand: "coins" },
  { to: "/complaints", key: "nav.complaints", label: "Complaints", icon: MessageSquareWarning, brand: "complaint" },
  { to: "/about", key: "nav.about", label: "About", icon: Ship, brand: "about" },
] as const;

const a11yModes: { id: AccessibilityMode; label: string; hint: string }[] = [
  { id: "default", label: "Default", hint: "Standard layout" },
  { id: "large", label: "Large text", hint: "Bigger type & targets" },
  { id: "senior", label: "Senior citizen", hint: "High contrast, calmer motion" },
  { id: "simple", label: "Simple interface", hint: "Only essential controls" },
];


export function AppShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("mx-auto w-full flex-1 px-4 pb-20 pt-6 md:pt-10", wide ? "max-w-7xl" : "max-w-6xl")}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { account, logout, dark, setDark, unreadCount, accessibility, setAccessibility, coins } = useStore();
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const label = (n: (typeof navItems)[number]) => {
    const v = t(n.key);
    return v === n.key ? n.label : v;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <BrandLogo size={48} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[15px] font-semibold tracking-tight">{t("brand.name")}</div>
            <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">{t("brand.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 text-[13px] lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.key}
              to={n.to}
              params={"params" in n ? n.params : undefined}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-[color:var(--brand-soft)] text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              <BrandIcon name={n.brand} label={n.label} size={26} rounded="rounded-full" eager />
              {label(n)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/rewards"
            data-a11y="optional"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary sm:inline-flex"
          >
            <Coins className="h-4 w-4 text-[color:var(--accent-orange)]" /> {coins}
          </Link>

          <Link
            to="/notifications"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Accessibility options" className="relative">
                <BrandIcon name="accessibility" label="Accessibility" size={32} rounded="rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Accessibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {a11yModes.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  onClick={() => setAccessibility(m.id)}
                  className={cn("flex-col items-start gap-0.5", accessibility === m.id && "text-primary")}
                >
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-[11px] text-muted-foreground">{m.hint}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>


          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-background/70 py-1 pl-1 pr-3 transition hover:border-primary/40">
                  <Avatar account={account} />
                  <span className="hidden max-w-[90px] truncate text-sm font-medium sm:block">{account.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">{account.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard", search: { tab: "profile" } })}>
                  {t("dash.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard", search: { tab: "bookings" } })}>
                  {t("dash.bookings")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard", search: { tab: "passengers" } })}>
                  {t("dash.passengers")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard", search: { tab: "settings" } })}>
                  {t("dash.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setConfirmLogout(true); }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full brand-gradient text-white">
              <Link to="/auth">{t("auth.signIn")}</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpenMobile((o) => !o)} aria-label="Menu">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {openMobile && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-2 lg:hidden">
          {navItems.map((n) => (
            <Link
              key={n.key}
              to={n.to}
              params={"params" in n ? n.params : undefined}
              onClick={() => setOpenMobile(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-primary bg-[color:var(--brand-soft)]" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              <BrandIcon name={n.brand} label={n.label} size={34} rounded="rounded-full" eager />
              {label(n)}
            </Link>
          ))}
        </div>
      )}
      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("auth.logout")}</AlertDialogTitle>
            <AlertDialogDescription>{t("auth.logoutConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full brand-gradient text-white"
              onClick={() => { logout(); navigate({ to: "/auth" }); }}
            >
              {t("auth.logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}

export function Avatar({ account }: { account: { username: string; photo?: string } }) {
  if (account.photo) {
    return <img src={account.photo} alt={account.username} className="h-7 w-7 rounded-full object-cover" />;
  }
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold text-white brand-gradient">
      {account.username.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("common.language")} className="relative">
          <BrandIcon name="language" label={t("common.language")} size={32} rounded="rounded-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-52 overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{t("common.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className={cn(lang === l.code && "text-primary")}>
            <span className="flex-1">{l.native}</span>
            <span className="text-[11px] text-muted-foreground">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandLogo size={64} rounded="rounded-full" />
              <div className="text-[15px] font-semibold tracking-tight">{t("brand.name")}</div>
            </div>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              A conversational, AI-first way to move across India — trains, buses, flights, hotels, metro, ferries
              and last-mile Cabber rides in one prototype.
            </p>
          </div>
          <FooterCol title="Book" links={[["Trains", "/book/train"], ["Buses", "/book/bus"], ["Flights", "/book/flight"], ["Hotels", "/book/hotel"]]} />
          <FooterCol title="Travel" links={[["Metro", "/book/metro"], ["Ferry", "/book/ferry"], ["PNR status", "/pnr"], ["Cabber", "/cabber"]]} />
          <FooterCol title="Company" links={[["About", "/about"], ["Dashboard", "/dashboard"], ["Become a driver", "/cabber/driver"]]} />
        </div>

        <div className="mt-8 rounded-2xl border border-border/70 bg-muted/40 p-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Disclaimer</div>
          <p className="text-[12px] leading-relaxed text-muted-foreground">{t("disclaimer.text")}</p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-[12px] text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} {t("brand.name")} · Hackathon prototype</span>
          <span className="inline-flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> Fictional data only · No real bookings</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
      <ul className="space-y-2 text-[13px]">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-muted-foreground transition hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const modeIcon = { train: TrainIcon, bus: Bus, flight: Plane, hotel: Ticket, metro: TrainFront, ferry: Ship, cab: User };
