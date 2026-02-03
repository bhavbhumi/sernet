import { Layout } from '@/components/layout/Layout';
import { Shield, FileText, Users, Scale } from 'lucide-react';

const InvestorCharter = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Investor Charter
          </h1>
          <p className="text-xl text-muted-foreground">
            Rights and responsibilities of investors as prescribed by SEBI
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Investor Rights</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Our Obligations</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Grievance Redressal</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Dispute Resolution</h3>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Vision & Mission */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Vision & Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Vision:</strong> Invest with confidence.
              </p>
              <p>
                <strong className="text-foreground">Mission:</strong> Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy customer service.
              </p>
            </div>
          </section>

          {/* Investor Rights */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Rights of Investors</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Obtain and receive accurate information about products/services from the stock broker.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Receive timely services without discrimination.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Receive proper guidance and support in case of any query or complaint.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Get fair and transparent treatment from the stock broker.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">5.</span>
                <span>Protection of your personal information and trading data.</span>
              </li>
            </ul>
          </section>

          {/* Responsibilities */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Responsibilities of Investors</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Read all the documents carefully before signing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Provide correct and complete information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Understand the risk factors associated with investments.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Keep your account information and credentials secure.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">5.</span>
                <span>Report any unauthorized transactions immediately.</span>
              </li>
            </ul>
          </section>

          {/* Grievance Redressal */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Grievance Redressal Mechanism</h2>
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Level 1: Stock Broker</h3>
                <p className="text-muted-foreground text-sm">
                  Write to complaints@zerodha.com. We aim to resolve complaints within 30 days.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Level 2: Stock Exchange</h3>
                <p className="text-muted-foreground text-sm">
                  If not satisfied with our response, escalate to the stock exchange's investor grievance cell.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Level 3: SEBI SCORES</h3>
                <p className="text-muted-foreground text-sm">
                  Register a complaint on SEBI's SCORES portal at scores.gov.in
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Level 4: Arbitration</h3>
                <p className="text-muted-foreground text-sm">
                  Apply for arbitration through the stock exchange as per SEBI regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Service Standards */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Service Standards</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Activity</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Timeline</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Account opening</td>
                    <td className="py-3 px-4">24 hours (after document verification)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">KYC modification</td>
                    <td className="py-3 px-4">7 working days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Complaint resolution</td>
                    <td className="py-3 px-4">30 days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Fund payout</td>
                    <td className="py-3 px-4">24 hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">DP pledge creation</td>
                    <td className="py-3 px-4">Same day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default InvestorCharter;
