import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/pages/home/components/FormField";
import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export function RepeatableCard({ title, removeLabel, onRemove, children }: { title: string; removeLabel: string; onRemove: () => void; children: ReactNode }) {
  return <div className="rounded-2xl border border-alt/10 bg-alt/[.015] p-4"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-black text-alt">{title}</h3><Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onRemove}><Trash2 className="size-4" />{removeLabel}</Button></div>{children}</div>;
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Button type="button" variant="outline" className="w-fit" onClick={onClick}><Plus className="size-4" />{label}</Button>;
}

export { Input, Textarea, FormField };
