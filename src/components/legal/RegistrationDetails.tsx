import { distributorRegistrations, distributorScope } from '@/lib/legalConfig';

export function RegistrationDetails() {
  return (
    <section aria-label="SERNET distributor registrations" className="border-b border-border bg-muted/30">
      <div className="container-sernet py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {distributorRegistrations.map((item) => (
            <div key={item.authority} className="space-y-1">
              <p className="text-xs font-semibold uppercase text-primary">{item.authority} · {item.role}</p>
              <p className="text-lg font-semibold text-foreground">{item.registration} <span className="text-sm font-normal text-muted-foreground">/ EUIN {item.euin}</span></p>
              <p className="text-sm text-muted-foreground">Valid until {item.validUntil}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{distributorScope}</p>
      </div>
    </section>
  );
}