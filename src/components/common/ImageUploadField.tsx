import { ImagePlus, RefreshCw, Trash2, Upload } from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Prototype-only screenshot/photo attachment field. The picked file is read as a
 * data URL so it can be previewed and stored in local demo state — nothing is
 * uploaded to a server.
 */
export function ImageUploadField({
  value,
  onChange,
  label = "Attach a screenshot or photo",
  hint = "JPG, JPEG, PNG or WEBP · up to 4 MB · prototype upload only",
  className,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = useCallback(() => inputRef.current?.click(), []);

  const read = useCallback(
    (file?: File) => {
      if (!file) return;
      const ok = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
      if (!ok) {
        toast.error("Unsupported format. Use JPG, JPEG, PNG or WEBP.");
        return;
      }
      if (file.size > MAX_BYTES) {
        toast.error("Image is larger than 4 MB. Please pick a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onChange(String(reader.result));
        toast.success("Image attached.");
      };
      reader.onerror = () => toast.error("Could not read that image.");
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          read(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
            <img src={value} alt="Attached evidence preview" className="max-h-56 w-full object-contain" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={pick}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Replace image
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full text-destructive hover:text-destructive"
              onClick={() => onChange(undefined)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            read(e.dataTransfer.files?.[0]);
          }}
          className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition hover:border-primary/50 hover:bg-accent/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-background text-primary ring-1 ring-border/60">
            <ImagePlus className="h-5 w-5" />
          </span>
          <span className="text-[13px] font-medium">{label}</span>
          <span className="text-[11px] text-muted-foreground">{hint}</span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary">
            <Upload className="h-3.5 w-3.5" /> Choose file
          </span>
        </button>
      )}
    </div>
  );
}
