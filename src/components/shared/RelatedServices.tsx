import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedItem {
  label: string;
  href: string;
  description: string;
}

interface RelatedServicesProps {
  currentService: string;
}

const allLinks: Record<string, RelatedItem[]> = {
  Trading: [
    { label: 'Investment Services', href: '/services?tab=Investment', description: 'Mutual Funds, PMS, AIF, Bonds & more' },
    { label: 'Brokerage Calculator', href: '/calculators/brokerage', description: 'Calculate your trading costs instantly' },
    { label: 'Margin Calculator', href: '/calculators/margin', description: 'Check margin requirements before you trade' },
  ],
  Investment: [
    { label: 'SIP Calculator', href: '/calculators/sip', description: 'Plan your monthly SIP investments' },
    { label: 'Lumpsum Calculator', href: '/calculators/lumpsum', description: 'Estimate your lumpsum investment growth' },
    { label: 'Insurance Services', href: '/services?tab=Insurance', description: 'Protect your wealth with the right cover' },
  ],
  Insurance: [
    { label: 'Estate Planning', href: '/services?tab=Estate Planning', description: 'Secure your legacy for the next generation' },
    { label: 'Investment Services', href: '/services?tab=Investment', description: 'Grow your wealth alongside protection' },
    { label: 'Schedule a Call', href: '/schedule-call', description: 'Speak with an insurance advisor' },
  ],
  'Estate Planning': [
    { label: 'Insurance Services', href: '/services?tab=Insurance', description: 'Life & health cover for your family' },
    { label: 'Credit Counselling', href: '/services?tab=Credit Counselling', description: 'Manage liabilities before estate planning' },
    { label: 'Schedule a Call', href: '/schedule-call', description: 'Book a free consultation' },
  ],
  'Credit Counselling': [
    { label: 'Investment Services', href: '/services?tab=Investment', description: 'Start investing once debts are managed' },
    { label: 'Insurance Services', href: '/services?tab=Insurance', description: 'Protect yourself while you rebuild' },
    { label: 'Schedule a Call', href: '/schedule-call', description: 'Talk to a credit counsellor' },
  ],
};

export const RelatedServices = ({ currentService }: RelatedServicesProps) => {
  const links = allLinks[currentService];
  if (!links) return null;

  return (
    <section className="section-padding bg-muted/30" aria-label="Related services and tools">
      <div className="container-sernet">
        <h2 className="heading-lg text-foreground mb-2 text-center">Related Services & Tools</h2>
        <p className="text-body text-center mb-8 text-muted-foreground">Explore more from SERNET</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="feature-card group flex flex-col justify-between hover:border-primary/30 transition-colors"
            >
              <div>
                <h3 className="heading-md text-foreground mb-1 group-hover:text-primary transition-colors">{link.label}</h3>
                <p className="text-small text-muted-foreground">{link.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-primary mt-3 font-medium">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
