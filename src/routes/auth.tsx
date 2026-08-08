import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Sparkles, Upload, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/BrandAssets";
import { LanguageSwitcher } from "@/components/transit/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { languages, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — TripSync" },
      { name: "description", content: "Access your TripSync account to manage bookings, saved passengers and preferences." },
      { property: "og:title", content: "Sign in — TripSync" },
      { property: "og:description", content: "A single account for trains, buses, flights, hotels, metro and last-mile Cabber rides." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AuthPage,
});

const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;

function AuthPage() {
  const { t } = useI18n();
  const { account, hydrated, login, signUp } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup" | "reset">("signin");

  useEffect(() => {
    if (hydrated && account) navigate({ to: "/" });
  }, [hydrated, account, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <BrandLogo size={64} rounded="rounded-full" />
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">{t("brand.name")}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/70">{t("brand.tagline")}</div>
          </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative space-y-6"
        >
          <Sparkles className="h-8 w-8" />
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            One account for every journey across India.
          </h1>
          <p className="max-w-md text-sm text-white/80">
            Book trains, buses, flights, hotels, metro and last-mile cabs — all searchable in one sentence, with
            saved passengers and instant PNR tracking.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" />
            Prototype only — no real accounts or payments are created.
          </div>
        </motion.div>

        <div className="relative text-xs text-white/60">© {new Date().getFullYear()} {t("brand.name")}</div>
      </div>

      <div className="flex flex-col justify-center gap-6 px-5 py-10 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size={48} />
            <span className="text-sm font-semibold">{t("brand.name")}</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card mx-auto w-full max-w-md rounded-3xl border border-border/60 p-6 sm:p-8"
        >
          <div className="hidden justify-end lg:flex">
            <LanguageSwitcher />
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup" | "reset")} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="signin" className="rounded-full">{t("auth.signIn")}</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">{t("auth.signUp")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <SignInForm onSuccess={() => navigate({ to: "/dashboard" })} onForgot={() => setTab("reset")} />
            </TabsContent>
            <TabsContent value="reset" className="mt-6">
              <ResetForm onDone={() => setTab("signin")} />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <SignUpForm onSuccess={() => navigate({ to: "/dashboard" })} />
            </TabsContent>
          </Tabs>
          <div className="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Hackathon prototype
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">{t("disclaimer.text")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SignInForm({ onSuccess, onForgot }: { onSuccess: () => void; onForgot: () => void }) {
  const { t } = useI18n();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login({ email, password, remember });
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      toast.error(result.error ?? "Something went wrong.");
      return;
    }
    setError(null);
    toast.success("Welcome back!");
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="signin-email">{t("auth.email")}</Label>
        <Input id="signin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signin-password">{t("auth.password")}</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> {t("auth.rememberMe")}
        </label>
        <button type="button" onClick={onForgot} className="text-[12px] font-medium text-primary hover:underline">
          {t("auth.forgot")}
        </button>
      </div>
      {error && <p className="text-xs text-[color:var(--destructive)]">{error}</p>}
      <Button type="submit" className="w-full rounded-full brand-gradient text-white">
        {t("auth.signIn")}
      </Button>
    </form>
  );
}

function ResetForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const { resetPassword } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!sent) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          toast.success("Prototype reset link sent", { description: "No real email is delivered — continue below." });
        }}
        className="space-y-4"
      >
        <p className="text-[13px] text-muted-foreground">
          Enter your email and we will simulate sending a reset link. Nothing leaves this device.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="reset-email">{t("auth.email")}</Label>
          <Input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <Button type="submit" className="w-full rounded-full brand-gradient text-white">
          Send reset link
        </Button>
        <button type="button" onClick={onDone} className="w-full text-center text-[12px] text-muted-foreground hover:text-foreground">
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const res = resetPassword({ email, password });
        if (!res.ok) {
          setError(res.error ?? "Something went wrong.");
          toast.error(res.error ?? "Something went wrong.");
          return;
        }
        toast.success("Password updated — please sign in.");
        onDone();
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="reset-new">New password</Label>
        <Input id="reset-new" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
      </div>
      {error && <p className="text-xs text-[color:var(--destructive)]">{error}</p>}
      <Button type="submit" className="w-full rounded-full brand-gradient text-white">
        {t("auth.reset")}
      </Button>
      <button type="button" onClick={onDone} className="w-full text-center text-[12px] text-muted-foreground hover:text-foreground">
        Back to sign in
      </button>
    </form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useI18n();
  const { signUp } = useStore();
  const { lang, setLang } = useI18n();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [remember, setRemember] = useState(true);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Photo is too large. Please pick an image under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.onerror = () => toast.error("Could not read that image. Try another file.");
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith("@gmail.com") && !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    const result = signUp({ email, username, password, photo, fullName, language: lang, location, remember });
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      toast.error(result.error ?? "Something went wrong.");
      return;
    }
    setError(null);
    toast.success("Account created — welcome to TripSync!");
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Upload profile photo"
          className="group relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-border/60 bg-muted"
        >
          {photo ? (
            <img src={photo} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <Upload className="h-4 w-4 text-white" />
          </span>
        </button>
        <div>
          <p className="text-[13px] font-medium">{t("auth.photo")}</p>
          <p className="text-[11px] text-muted-foreground">JPG or PNG, up to 1.5 MB.</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-name">{t("auth.fullName")}</Label>
        <Input id="signup-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Rahul Verma" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-email">{t("auth.email")}</Label>
        <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-username">{t("auth.username")}</Label>
        <Input id="signup-username" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. aarav_sharma" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-password">{t("auth.password")}</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="pr-10"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-confirm">{t("auth.confirmPassword")}</Label>
        <Input
          id="signup-confirm"
          type={showPassword ? "text" : "password"}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t("common.language")}</Label>
        <Select value={lang} onValueChange={(v) => setLang(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {languages.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                {l.native} · {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium">{t("common.location")}</p>
            <p className="text-[11px] text-muted-foreground">
              {location ? `Using ${location} for nearby suggestions.` : t("auth.locationPermission")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={locating}
            onClick={() => {
              setLocating(true);
              if (!navigator.geolocation) {
                setLocation("New Delhi");
                setLocating(false);
                toast("Location unavailable — using New Delhi for the demo.");
                return;
              }
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
                  setLocating(false);
                  toast.success("Location enabled — nearby suggestions unlocked.");
                },
                () => {
                  setLocation("New Delhi");
                  setLocating(false);
                  toast("Permission denied — using New Delhi for the demo.");
                },
                { timeout: 8000 },
              );
            }}
          >
            {locating ? "Locating…" : location ? "Update" : "Allow"}
          </Button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> {t("auth.rememberMe")}
      </label>

      {error && <p className="text-xs text-[color:var(--destructive)]">{error}</p>}
      <Button type="submit" className="w-full rounded-full brand-gradient text-white">
        {t("auth.signUp")}
      </Button>
    </form>
  );
}
