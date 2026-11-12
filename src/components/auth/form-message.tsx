import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormMessageProps {
  tone: "error" | "success";
  children: string;
}

/** Announces form-level feedback to screen readers. */
export function FormMessage({ tone, children }: FormMessageProps) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        tone === "error"
          ? "border-red-200 bg-destructive-soft text-destructive-foreground"
          : "border-green-200 bg-success-soft text-success-foreground",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
