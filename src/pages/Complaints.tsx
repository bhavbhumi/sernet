import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    step: 1,
    title: 'Try self-help first',
    description: 'Search our support portal for answers to common queries. Most issues can be resolved instantly.',
  },
  {
    step: 2,
    title: 'Create a support ticket',
    description: 'If you can\'t find an answer, raise a ticket through the support portal. Our team will respond within 24 hours.',
  },
  {
    step: 3,
    title: 'Escalate if needed',
    description: 'If your issue is not resolved within the stipulated time, you can escalate to the compliance team.',
  },
  {
    step: 4,
    title: 'External escalation',
    description: 'If still unresolved, you can approach SEBI SCORES or the Exchange Investor Grievance cell.',
  },
];

const Complaints = () => {
  return (
    <Layout>
      <SEOHead
        title="Lodge a Complaint"
        description="SERNET's grievance redressal mechanism — raise and track complaints as per SEBI guidelines."
        path="/complaints"
      />
      <section className="section-padding">
        <div className="container-zerodha max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-xl mb-4">
              How to File a Complaint
            </h1>
            <p className="text-body">
              We are committed to resolving your grievances in a fair and timely manner
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Escalation
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Support:</p>
                  <a href="mailto:support@sernetindia.com" className="text-primary">support@sernetindia.com</a>
                </div>
                <div>
                  <p className="text-muted-foreground">Compliance Officer:</p>
                  <a href="mailto:compliance@sernetindia.com" className="text-primary">compliance@sernetindia.com</a>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Phone Support
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Toll-free:</p>
                  <p className="text-foreground font-medium">1800-103-0053</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available:</p>
                  <p className="text-foreground">Mon-Sat, 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-primary/10 rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">External Grievance Redressal</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>SEBI SCORES:</strong> Register complaints at{' '}
                <a href="https://scores.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary">
                  scores.gov.in
                </a>
              </p>
              <p>
                <strong>NSE:</strong> Contact NSE's Investor Grievance Cell at ignse@nse.co.in
              </p>
              <p>
                <strong>BSE:</strong> Contact BSE's Investor Grievance Cell at igc@bseindia.com
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Complaints;
