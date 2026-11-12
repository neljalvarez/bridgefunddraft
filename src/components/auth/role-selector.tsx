import { Building2, GraduationCap, type LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import type { SelfServiceRole } from "@/types";

const OPTIONS: {
  value: SelfServiceRole;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "student",
    title: "Student",
    description: "Find support for the costs of learning.",
    icon: GraduationCap,
  },
  {
    value: "organization",
    title: "Organization",
    description: "Offer verified financial support.",
    icon: Building2,
  },
];

interface RoleSelectorProps {
  name: string;
  defaultValue: SelfServiceRole;
}

export function RoleSelector({ name, defaultValue }: RoleSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <Label asChild>
        <legend>I am joining as</legend>
      </Label>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value, title, description, icon: Icon }) => (
          <label
            key={value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-card p-3 transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring"
          >
            <input
              type="radio"
              name={name}
              value={value}
              defaultChecked={value === defaultValue}
              className="sr-only"
            />
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-medium text-navy">{title}</span>
              <span className="block text-xs text-muted-foreground">
                {description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
