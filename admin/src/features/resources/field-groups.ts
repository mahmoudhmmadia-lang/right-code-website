import type { FieldConfig } from "./types";

export function fieldGroups(fields: FieldConfig[]) {
  const groups = new Map<string, FieldConfig[]>();
  fields.forEach((field) => {
    const key = field.group ?? "default";
    groups.set(key, [...(groups.get(key) ?? []), field]);
  });
  return [...groups.entries()].map(([key, items]) => ({ key, items }));
}
