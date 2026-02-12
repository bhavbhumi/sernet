import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const quickLinksData = [
  {
    category: "Exchanges",
    links: [
      { name: "NSE - National Stock Exchange", href: "https://www.nseindia.com", external: true },
      { name: "BSE - Bombay Stock Exchange", href: "https://www.bseindia.com", external: true },
      { name: "MCX - Multi Commodity Exchange", href: "https://www.mcxindia.com", external: true },
      { name: "NCDEX", href: "https://www.ncdex.com", external: true },
    ]
  },
  {
    category: "Depositories",
    links: [
      { name: "NSDL - National Securities Depository", href: "https://nsdl.co.in", external: true },
      { name: "CDSL - Central Depository Services", href: "https://www.cdslindia.com", external: true },
    ]
  },
  {
    category: "Regulatory Bodies",
    links: [
      { name: "SEBI - Securities and Exchange Board of India", href: "https://www.sebi.gov.in", external: true },
      { name: "RBI - Reserve Bank of India", href: "https://www.rbi.org.in", external: true },
      { name: "AMFI - Association of Mutual Funds in India", href: "https://www.amfiindia.com", external: true },
      { name: "IRDAI - Insurance Regulatory Authority", href: "https://www.irdai.gov.in", external: true },
    ]
  },
  {
    category: "Investor Resources",
    links: [
      { name: "SEBI SCORES - Investor Grievances", href: "https://scores.gov.in", external: true },
      { name: "Smart ODR - Online Dispute Resolution", href: "https://smartodr.in", external: true },
      { name: "Investor Education - SEBI", href: "https://investor.sebi.gov.in", external: true },
    ]
  },
  {
    category: "SERNET Resources",
    links: [
      { name: "Investor Charter", href: "/investor-charter", external: false },
      { name: "Downloads", href: "/downloads", external: false },
      { name: "Market Holidays", href: "/market-holidays", external: false },
      { name: "Economic Calendar", href: "/economic-calendar", external: false },
      { name: "Calculators", href: "/calculators/brokerage", external: false },
    ]
  },
];

const QuickLinks = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <h1 className="heading-lg text-foreground mb-4">Quick Links</h1>
        <p className="text-body mb-8 max-w-2xl">
          Access important resources, regulatory bodies, and useful tools for your investment journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickLinksData.map((category, index) => (
            <div key={index}>
              <h3 className="text-lg font-medium text-foreground mb-4 pb-2 border-b border-border">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[14px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default QuickLinks;
