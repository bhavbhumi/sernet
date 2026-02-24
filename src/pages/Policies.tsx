import { Layout } from '@/components/layout/Layout';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Policies = () => {
  const policies = [
    {
      category: 'Account & Trading',
      items: [
        { name: 'Account Opening Policy', description: 'Guidelines for opening a trading and demat account' },
        { name: 'Trading Policy', description: 'Rules and guidelines for trading on our platform' },
        { name: 'Margin Policy', description: 'Margin requirements and policy for leveraged trading' },
        { name: 'Square Off Policy', description: 'Auto square-off rules for intraday and leveraged positions' },
      ],
    },
    {
      category: 'Security & Privacy',
      items: [
        { name: 'Privacy Policy', description: 'How we collect, use, and protect your data', href: '/privacy' },
        { name: 'Information Security Policy', description: 'Our approach to securing your information' },
        { name: 'Password Policy', description: 'Guidelines for creating and managing passwords' },
      ],
    },
    {
      category: 'Compliance',
      items: [
        { name: 'AML Policy', description: 'Anti-Money Laundering policy and procedures' },
        { name: 'KYC Policy', description: 'Know Your Customer requirements and verification' },
        { name: 'PMLA Policy', description: 'Prevention of Money Laundering Act compliance' },
      ],
    },
    {
      category: 'Operations',
      items: [
        { name: 'Fund Withdrawal Policy', description: 'Rules for withdrawing funds from your account' },
        { name: 'Depository Operations Policy', description: 'Guidelines for depository-related operations' },
        { name: 'Corporate Actions Policy', description: 'Handling of dividends, bonuses, and other corporate actions' },
      ],
    },
    {
      category: 'Grievance & Support',
      items: [
        { name: 'Grievance Redressal Policy', description: 'How we handle and resolve complaints' },
        { name: 'Investor Grievance Policy', description: 'SEBI-mandated grievance redressal mechanism' },
        { name: 'Escalation Matrix', description: 'Levels of escalation for unresolved issues' },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container-sernet section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-xl text-foreground mb-4">Policies & Procedures</h1>
          <p className="text-body mb-12">
            Our policies ensure transparency, compliance, and protection for all stakeholders
          </p>

          <div className="space-y-8">
            {policies.map((category) => (
              <div key={category.category} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                  <h2 className="heading-md">{category.category}</h2>
                </div>
                <div className="divide-y divide-border">
                  {category.items.map((item) => (
                    item.href ? (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    ) : (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">Need more information?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our compliance team for detailed policy documents
            </p>
            <a
              href="mailto:compliance@sernetindia.com"
              className="text-primary hover:underline"
            >
              compliance@sernetindia.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policies;
