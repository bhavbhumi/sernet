import { Mail } from 'lucide-react';
import { FooterNewsletterForm } from '@/components/layout/Footer';

/** Inline newsletter sign-up (no pop-up). No subscriber count shown until a real figure is approved. */
export const InlineNewsletter = ({ title = 'Get SERNET Insights in your inbox', className = '' }: { title?: string; className?: string }) => (
  <section aria-label="Newsletter sign-up" className={`rounded-lg border border-border bg-muted/30 p-5 md:p-6 ${className}`}>
    <div className="flex items-start gap-3 mb-4">
      <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">Market updates, IPO notes and money guides.</p>
      </div>
    </div>
    <FooterNewsletterForm />
  </section>
);
