
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { ExternalLink } from 'lucide-react';

const sitemapSections = [
  {
    title: 'Main',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Open Account', href: '/open-account' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Company', href: '/about?tab=Company' },
      { label: 'Careers', href: '/about?tab=Careers' },
      { label: 'Press & Media', href: '/about?tab=Press' },
      { label: 'Recognition', href: '/about?tab=Recognition' },
      { label: 'Reviews', href: '/about?tab=Reviews' },
    ],
  },
  {
    title: 'Network',
    links: [
      { label: 'Our Network', href: '/network' },
      { label: 'Tick Funds', href: '/tickfunds' },
      { label: 'Tushil', href: '/tushil' },
      { label: 'Choice FinX', href: '/choicefinx' },
      { label: 'Findemy', href: '/findemy' },
    ],
  },
  {
    title: 'Insights',
    links: [
      { label: 'Insights Hub', href: '/insights' },
      { label: 'Updates (News & Circulars)', href: '/updates' },
      { label: 'Videos', href: '/videos' },
      { label: 'Trading Q&A', href: '/tradingqna' },
    ],
  },
  {
    title: 'Tools & Calculators',
    links: [
      { label: 'All Calculators', href: '/calculators' },
      { label: 'SIP Calculator', href: '/calculators/sip' },
      { label: 'Lumpsum Calculator', href: '/calculators/lumpsum' },
      { label: 'Brokerage Calculator', href: '/calculators/brokerage' },
      { label: 'Margin Calculator', href: '/calculators/margin' },
      { label: 'Market Overview', href: '/market-overview' },
      { label: 'Calendars', href: '/calendars' },
      { label: 'Market Holidays', href: '/market-holidays' },
      { label: 'Economic Calendar', href: '/economic-calendar' },
    ],
  },
  {
    title: 'Engagement',
    links: [
      { label: 'Opinions (Polls & Surveys)', href: '/opinions' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Downloads', href: '/downloads' },
    ],
  },
  {
    title: 'Support & Contact',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Desk', href: '/support' },
      { label: 'Quick Links', href: '/quick-links' },
      { label: 'Schedule a Call', href: '/schedule-call' },
      { label: 'Fund Transfer', href: '/fund-transfer' },
      { label: 'Lodge a Complaint', href: '/complaints' },
      { label: 'Check Complaint Status', href: '/complaints/status' },
      { label: 'Credit Claim', href: '/credit-claim' },
    ],
  },
  {
    title: 'Legal & Compliance',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Policies', href: '/policies' },
      { label: 'Disclosures', href: '/disclosure' },
      { label: 'Investor Charter', href: '/investor-charter' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Philosophy', href: '/about/philosophy' },
      { label: 'Technology', href: '/tech' },
      { label: 'CSR', href: '/csr' },
      { label: 'Media', href: '/media' },
    ],
  },
];

export default function Sitemap() {
  return (
    <Layout>
      <PageHero
        title="Sitemap"
        description="A complete directory of all pages on the SERNET website."
      />
      <main className="container-zerodha section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sitemapSections.map(section => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
