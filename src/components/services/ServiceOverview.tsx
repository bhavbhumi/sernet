import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

type Cta = { label: string; href: string; external?: boolean };

interface ServiceOverviewProps {
  title: string;
  partner: string;
  intro: string;
  points: string[];
  learnMore: { label: string; to: string };
  primaryCta?: Cta;
  extra?: ReactNode;
  eligibility?: { text: string; href: string };
  disclaimer: string;
}

/** Short Services-tab summary. Full product detail lives on the product page (one home per product). */
export const ServiceOverview = ({ title, partner, intro, points, learnMore, primaryCta, extra, eligibility, disclaimer }: ServiceOverviewProps) => (
  <>
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{partner}</p>
            <h2 className="heading-lg text-foreground mb-3">{title}</h2>
            <p className="text-body text-muted-foreground mb-8">{intro}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={learnMore.to}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {learnMore.label} <ArrowRight className="w-4 h-4" />
              </Link>
              {primaryCta && (primaryCta.external ? (
                <a href={primaryCta.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  {primaryCta.label} <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <Link to={primaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  {primaryCta.label}
                </Link>
              ))}
            </div>
            {eligibility && (
              <p className="text-small text-muted-foreground mt-5">
                {eligibility.text}{' '}
                <Link to={eligibility.href} className="text-primary hover:underline">Download forms</Link>
              </p>
            )}
          </div>
          <ul className="space-y-3 self-center">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-body text-foreground">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>

    {extra}

    <section className="section-padding bg-section-alt">
      <div className="container-sernet text-center">
        <h2 className="heading-md text-foreground mb-2">Prefer to talk to someone?</h2>
        <p className="text-body text-muted-foreground mb-6">Your relationship manager can walk you through options. You make the decision.</p>
        <Link to="/contact?tab=Schedule%20a%20Call" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
          Schedule a call <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>

    <section className="py-6 bg-muted/30">
      <div className="container-sernet">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> {disclaimer}
        </p>
      </div>
    </section>
  </>
);
