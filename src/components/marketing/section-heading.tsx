import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** "dark" is for navy backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("text-sm font-medium", dark ? "text-blue-300" : "text-primary")}>
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-3 text-base", dark ? "text-white/75" : "text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
