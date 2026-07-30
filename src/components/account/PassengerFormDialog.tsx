import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { SavedPassenger } from "@/lib/store";

export const identityTypes = ["Aadhaar", "Passport", "Driving Licence", "PAN", "Birth Certificate"] as const;
export const berthOptions = ["No Preference", "Lower", "Middle", "Upper", "Side Lower", "Side Upper"] as const;

const passengerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the full name."),
  age: z.coerce.number({ invalid_type_error: "Enter a valid age." }).int().min(1, "Age must be at least 1.").max(120, "Enter a valid age."),
  gender: z.enum(["Male", "Female", "Other"]),
  mobile: z.string().trim().min(10, "Enter a valid 10-digit mobile number.").max(15),
  email: z.string().trim().email("Enter a valid email address."),
  nationality: z.string().trim().min(2, "Enter a nationality."),
  idType: z.enum(identityTypes),
  idNumber: z.string().trim().min(3, "Enter the identity number."),
  berth: z.string().optional(),
});

export type PassengerFormValues = z.infer<typeof passengerSchema>;

export function PassengerFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SavedPassenger | null;
  onSubmit: (values: PassengerFormValues) => void;
  title?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      fullName: "", age: undefined as unknown as number, gender: "Male", mobile: "", email: "",
      nationality: "Indian", idType: "Aadhaar", idNumber: "", berth: "No Preference",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? { ...initial, berth: initial.berth ?? "No Preference" }
          : {
              fullName: "", age: undefined as unknown as number, gender: "Male", mobile: "", email: "",
              nationality: "Indian", idType: "Aadhaar", idNumber: "", berth: "No Preference",
            },
      );
    }
  }, [open, initial, reset]);

  const gender = watch("gender");
  const idType = watch("idType");
  const berth = watch("berth");

  const submit = handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title ?? (initial ? "Edit passenger" : "Add passenger")}</DialogTitle>
          <DialogDescription>Details are saved to your profile for faster bookings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} placeholder="e.g. Aarav Sharma" />
            {errors.fullName && <p className="text-xs text-[color:var(--destructive)]">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" {...register("age")} placeholder="e.g. 32" />
            {errors.age && <p className="text-xs text-[color:var(--destructive)]">{errors.age.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(v) => setValue("gender", v as PassengerFormValues["gender"], { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" {...register("mobile")} placeholder="98100 12345" />
            {errors.mobile && <p className="text-xs text-[color:var(--destructive)]">{errors.mobile.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="name@example.com" />
            {errors.email && <p className="text-xs text-[color:var(--destructive)]">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" {...register("nationality")} placeholder="Indian" />
            {errors.nationality && <p className="text-xs text-[color:var(--destructive)]">{errors.nationality.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Identity Type</Label>
            <Select value={idType} onValueChange={(v) => setValue("idType", v as PassengerFormValues["idType"], { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {identityTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="idNumber">Identity Number</Label>
            <Input id="idNumber" {...register("idNumber")} placeholder="XXXX-XXXX-1234" />
            {errors.idNumber && <p className="text-xs text-[color:var(--destructive)]">{errors.idNumber.message}</p>}
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label>Berth Preference (optional)</Label>
            <Select value={berth} onValueChange={(v) => setValue("berth", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {berthOptions.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-full brand-gradient text-white">
              {initial ? "Save changes" : "Add passenger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
