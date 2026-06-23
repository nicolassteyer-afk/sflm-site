import type { ReactNode } from "react";

type Props = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  textarea?: boolean;
  children?: ReactNode;
};

export function FormField({ label, name, defaultValue, type = "text", textarea, children }: Props) {
  return (
    <label className="admin-label">
      {label}
      {children ?? (textarea ? (
        <textarea className="admin-textarea" name={name} defaultValue={defaultValue ?? ""} />
      ) : (
        <input className="admin-input" name={name} type={type} defaultValue={defaultValue ?? ""} />
      ))}
    </label>
  );
}

export function ToggleField({ label, name, defaultChecked = true }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-bone/10 p-3 text-sm font-bold text-bone/70">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
