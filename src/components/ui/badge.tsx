import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        info: "border-blue-200 bg-accent text-blue-700",
        success: "border-green-200 bg-success-soft text-success-foreground",
        warning: "border-amber-200 bg-warning-soft text-warning-foreground",
        danger: "border-red-200 bg-destructive-soft text-destructive-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
