import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { TicketWizard } from '@/components/support/TicketWizard';

export default function RaiseTicket() {
  return (
    <Layout>
      <SEOHead title="Raise a Support Ticket — SERNET Financial Services" description="Submit a support request for Tick Funds, Choice FinX, or Tushil products" />
      <div className="container-sernet py-12 md:py-20">
        <TicketWizard showHeading={true} />
      </div>
    </Layout>
  );
}
