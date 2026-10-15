import { BadgeCheck, CalendarCheck } from 'lucide-react';
import { distributorRegistrations, distributorScope, regulatoryLimits, regulatoryShortLine, formatReviewDate } from '@/lib/regulatoryIdentity';

/** Central regulatory identity. `compact` = one-line strip for product pages; `panel` = full registration cards. */
export function RegulatoryIdentity({ variant = 'compact' }: { variant?: 'compact' | 'panel' }) {
  if (variant === 'compact') {
    return (
      <aside aria-label="SERNET regulatory status" className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <p className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span><span className="font-semibold text-foreground">{regulatoryShortLine}.</span> {regulatoryLimits}</span></p>
      </aside>
    );
  }
  return (
    <section aria-label="SERNET distributor registrations" className="rounded-lg border border-border bg-muted/30 p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {distributorRegistrations.map((item) => (
          <div key={item.authority} className="space-y-1">
            <p className="text-xs font-semibold uppercase text-primary">{item.authority} · {item.role}</p>
            <p className="text-lg font-semibold text-foreground">{item.registration} <span className="text-sm font-normal text-muted-foreground">/ EUIN {item.euin}</span></p>
            <p className="text-sm text-muted-foreground">First registered {item.firstRegistered} · Valid until {item.validUntil}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{distributorScope} {regulatoryLimits}</p>
    </section>
  );
}

/** Shows a genuine content-review date; renders nothing when no review date is recorded. */
export function LastReviewed({ date }: { date?: string | null }) {
  if (!date) return null;
  return (
    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Last reviewed: <time dateTime={date.slice(0, 10)}>{formatReviewDate(date)}</time>
    </p>
  );
}
