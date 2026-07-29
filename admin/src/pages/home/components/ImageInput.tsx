import { mediaUrl } from "@/lib/media";
import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useId, useState, type ChangeEvent } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export function ImageInput({ label, uploadLabel, hint, existingUrl, registration }: { label: string; uploadLabel: string; hint: string; existingUrl?: string; registration: UseFormRegisterReturn }) {
  const id = useId();
  const [preview, setPreview] = useState(() => mediaUrl(existingUrl));

  useEffect(() => setPreview(mediaUrl(existingUrl)), [existingUrl]);
  useEffect(() => () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  function change(event: ChangeEvent<HTMLInputElement>) {
    void registration.onChange(event);
    const file = event.target.files?.[0];
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    setPreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return nextPreview;
    });
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-alt/70">{label}</span>
      <input id={id} name={registration.name} ref={registration.ref} onBlur={registration.onBlur} type="file" accept="image/*" className="sr-only" onChange={change} />
      <label htmlFor={id} className="group relative flex min-h-36 cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-dashed border-main/25 bg-main/[.025] p-4 transition hover:border-main/50 hover:bg-main/[.05] focus-within:ring-3 focus-within:ring-main/15">
        {preview ? (
          <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-white bg-white p-2 shadow-sm"><img src={preview} alt="" className="size-full object-contain" /></span>
        ) : (
          <span className="grid size-24 shrink-0 place-items-center rounded-xl bg-white text-main shadow-sm"><ImagePlus className="size-7" /></span>
        )}
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-black text-alt"><UploadCloud className="size-4 text-main" />{uploadLabel}</span>
          <span className="mt-1 block text-xs leading-5 text-alt/40">{hint}</span>
        </span>
      </label>
    </div>
  );
}
