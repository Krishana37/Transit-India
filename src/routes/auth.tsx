import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Sparkles, Train, Upload, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/transit/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Transit India" },
      { name: "description", content: "Access your Transit India account to manage bookings, saved passengers and preferences." },
      { property: "og:title", content: "Sign in — Transit India" },
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
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (hydrated && account) navigate({ to: "/" });
  }, [hydrated, account, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
            <Train className="h-5 w-5" />
          </div>
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
            <div className="grid h-9 w-9 place-items-center rounded-xl text-white brand-gradient">
              <Train className="h-5 w-5" />
            </div>
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
          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="signin" className="rounded-full">{t("auth.signIn")}</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">{t("auth.signUp")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <SignInForm onSuccess={() => navigate({ to: "/dashboard" })} />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <SignUpForm onSuccess={() => navigate({ to: "/dashboard" })} />
            </TabsContent>
          </Tabs>
          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Prototype only — no real accounts are created and data stays on this device.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useI18n();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login({ email, password });
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
      {error && <p className="text-xs text-[color:var(--destructive)]">{error}</p>}
      <Button type="submit" className="w-full rounded-full brand-gradient text-white">
        {t("auth.signIn")}
      </Button>
    </form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useI18n();
  const { signUp } = useStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
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
    const result = signUp({ email, username, password, photo });
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      toast.error(result.error ?? "Something went wrong.");
      return;
    }
    setError(null);
    toast.success("Account created — welcome to Transit India!");
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
      {error && <p className="text-xs text-[color:var(--destructive)]">{error}</p>}
      <Button type="submit" className="w-full rounded-full brand-gradient text-white">
        {t("auth.signUp")}
      </Button>
    </form>
  );
}
