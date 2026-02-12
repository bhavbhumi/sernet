import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, FileText, Phone, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I open an account?',
    answer: 'You can open a Zerodha account online in a few minutes. All you need is your Aadhaar, PAN, and a bank account. The entire process is paperless and can be completed from your phone or computer.',
  },
  {
    question: 'What documents are required?',
    answer: 'You need PAN card, Aadhaar (linked to mobile for e-sign), bank account details (cancelled cheque/bank statement), and a recent passport size photograph.',
  },
  {
    question: 'How long does account opening take?',
    answer: 'If all documents are in order, your account can be opened within 24 hours. Trading and demat account activation typically happens within 24-48 hours.',
  },
  {
    question: 'Is there any account opening fee?',
    answer: 'Account opening is completely free. There are no hidden charges or annual maintenance fees for the trading account.',
  },
  {
    question: 'How do I transfer funds?',
    answer: 'You can add funds instantly using UPI, net banking, or NEFT/RTGS. Funds reflect in your trading account within minutes for UPI and net banking.',
  },
  {
    question: 'What is the brokerage for equity delivery?',
    answer: 'Equity delivery is absolutely free on Zerodha. You pay zero brokerage on all equity delivery trades across NSE and BSE.',
  },
];

const supportLinks = [
  {
    icon: Search,
    title: 'Support portal',
    description: 'Search our knowledge base with over 2000+ support articles',
    link: '#',
  },
  {
    icon: MessageCircle,
    title: 'Track tickets',
    description: 'Track existing tickets or raise a new support ticket',
    link: '#',
  },
  {
    icon: FileText,
    title: 'Z-Connect',
    description: 'Read our official blog for updates and tutorials',
    link: '#',
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-hero">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-xl text-foreground mb-6">
              Support
            </h1>
            <p className="text-body mb-8">
              Search our knowledge base or get in touch with our support team.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search support articles..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Links */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportLinks.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-card flex items-start gap-4 hover:border-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-md text-foreground mb-1 flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </h3>
                  <p className="text-small">{item.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Frequently asked questions
          </motion.h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <span className={`text-2xl text-muted-foreground transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-body">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="heading-lg text-foreground mb-8">Contact us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="feature-card">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-body">080-47181888</p>
              </div>
              <div className="feature-card">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-body">support@zerodha.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="heading-lg text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-body mb-8">
              Open a Zerodha account today and start investing.
            </p>
            <Link to="/signup" className="btn-primary">
              Sign up for free
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
