import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  as: Tag = "section",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return <Tag className={cn("panel p-4", className)}>{children}</Tag>;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-start justify-between gap-3", className)}>
      <div>
        <h3 className="text-panel font-heading font-bold">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-meta text-ink-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
