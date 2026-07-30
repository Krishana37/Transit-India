import { useState } from "react";
import { Plus, Check, Pencil, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore, type SavedPassenger } from "@/lib/store";
import { cn } from "@/lib/utils";

type FormState = Omit<SavedPassenger, "id" | "age"> & { age: string };

const emptyForm: FormState = {
  fullName: "", age: "", gender: "Male", mobile: "", email: "", nationality: "Indian", idType: "Aadhaar", idNumber: "",
};

export function PassengerPicker({
  selected, onToggle,
}: { selected: string[]; onToggle: (id: string) => void }) {
  const { passengers, addPassenger, updatePassenger } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SavedPassenger | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const startAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const startEdit = (p: SavedPassenger) => {
    setEditing(p);
    setForm({ fullName: p.fullName, age: String(p.age), gender: p.gender, mobile: p.mobile, email: p.email, nationality: p.nationality, idType: p.idType, idNumber: p.idNumber });
    setOpen(true);
  };

  const save = () => {
    if (!form.fullName.trim() || !form.age) return;
    const payload = { ...form, age: Number(form.age) };
    if (editing) {
      updatePassenger(editing.id, payload);
    } else {
      const created = addPassenger(payload);
      onToggle(created.id);
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {passengers.map((p) => {
          const active = selected.includes(p.id);
          return (
            <div key={p.id} className="relative">
              <button
                type="button"
                onClick={() => onToggle(p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-3 py-2 pr-8 text-left transition",
                  active ? "border-primary bg-[color:var(--brand-soft)]" : "border-border bg-background/70 hover:border-primary/40",
                )}
              >
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold", active ? "brand-gradient text-white" : "bg-muted text-muted-foreground")}>
                  {active ? <Check className="h-3.5 w-3.5" /> : p.fullName.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.fullName}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {p.age}y · {p.gender} · {p.idType} {p.idNumber}
                  </div>
                </div>
              </button>
              <button
                type="button"
                aria-label={`Edit ${p.fullName}`}
                onClick={() => startEdit(p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={startAdd}
              className="flex items-center gap-2 rounded-2xl border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Add new passenger
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><IdCard className="h-4 w-4" /> {editing ? "Edit passenger" : "Add passenger"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" className="col-span-2">
                <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              </Field>
              <Field label="Age">
                <Input type="number" min={0} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
              </Field>
              <Field label="Gender">
                <RadioGroup value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v as SavedPassenger["gender"] }))} className="flex gap-3 pt-2">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <label key={g} className="flex items-center gap-1.5 text-sm">
                      <RadioGroupItem value={g} /> {g}
                    </label>
                  ))}
                </RadioGroup>
              </Field>
              <Field label="Mobile">
                <Input value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label="Nationality">
                <Input value={form.nationality} onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))} />
              </Field>
              <Field label="Identity type">
                <Input value={form.idType} onChange={(e) => setForm((f) => ({ ...f, idType: e.target.value }))} />
              </Field>
              <Field label="Identity number" className="col-span-2">
                <Input value={form.idNumber} onChange={(e) => setForm((f) => ({ ...f, idNumber: e.target.value }))} />
              </Field>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="rounded-full brand-gradient text-white" onClick={save}>Save passenger</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
