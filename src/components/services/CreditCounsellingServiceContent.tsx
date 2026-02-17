import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, UserCheck, Download, Play, CreditCard, TrendingUp, ShieldCheck, BarChart3, AlertTriangle, Building2, User } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const stats = [
  { value: '10,000+', label: 'Cases Resolved' },
  { value: '750+', label: 'Score Improvements' },
  { value: '98%', label: 'Client Satisfaction' },
];

const products = [
  { icon: CreditCard, name: 'Credit Score Repair', description: 'Systematic analysis and resolution of errors, defaults, and disputes in your credit report to improve your CIBIL, Experian, and Equifax scores.' },
  { icon: TrendingUp, name: 'Credit Score Improvement', description: 'Strategic guidance on credit utilisation, repayment optimisation, and credit mix diversification to steadily boost your credit score over time.' },
  { icon: AlertTriangle, name: 'Dispute Resolution', description: 'Expert handling of incorrect entries, duplicate accounts, and unauthorised inquiries on your credit report with direct intervention at bureau level.' },
  { icon: Building2, name: 'Corporate Credit Repair', description: 'Specialised credit counselling for businesses — resolve commercial credit issues, improve business credit ratings, and enhance loan eligibility.' },
  { icon: ShieldCheck, name: 'Debt Management', description: 'Structured debt repayment plans, creditor negotiations, and settlement strategies to help you become debt-free without compromising your credit health.' },
  { icon: User, name: 'Credit Education', description: 'Personalised coaching on building and maintaining a strong credit profile — understand scoring factors, best practices, and common pitfalls to avoid.' },
];

export const CreditCounsellingServiceContent = () => (
  <>
    {/* Hero — Athena Credexpert */}
    <section className="section-padding" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-3">Athena Credexpert</h2>
            <p className="text-body text-muted-foreground mb-8">
              Take control of your credit health. Our credit counselling services help individuals and businesses repair, rebuild, and strengthen their credit profiles — unlocking better loan terms, lower interest rates, and greater financial freedom.
            </p>
            <ul className="space-y-2 mb-8">
              {['CIBIL, Experian & Equifax Score Analysis', 'Credit Report Error Identification & Dispute', 'Personalised Credit Improvement Roadmap', 'Corporate Credit Repair for Businesses', 'Ongoing Monitoring & Expert Support'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="https://ekyc.choiceindia.com/open-free-demat-account"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Check My Score <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/contact" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Book a Session <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Trust strip stats */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="rounded-xl bg-background border border-border p-8 shadow-sm w-full max-w-[420px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Credit Health Score</p>
                  <p className="text-xs text-muted-foreground">Sample Analysis</p>
                </div>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" className="stroke-muted" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" className="stroke-primary" strokeWidth="10" strokeDasharray="314" strokeDashoffset="94" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">720</span>
                    <span className="text-[10px] text-muted-foreground">CIBIL Score</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Payment History', status: 'Good', color: 'bg-primary' },
                  { label: 'Credit Utilisation', status: 'Needs Work', color: 'bg-accent' },
                  { label: 'Credit Age', status: 'Excellent', color: 'bg-primary' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.color === 'bg-primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Services We Offer */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Services we offer
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          End-to-end credit repair and counselling services for individuals and businesses to achieve financial credibility and unlock better opportunities.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="feature-card group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <product.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground mb-2">{product.name}</h3>
              <p className="text-small leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Free Credit Health Check */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
        >
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Free Service
            </span>
            <h2 className="heading-lg text-foreground mb-3">Free Credit Health Checkup</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Get a comprehensive analysis of your credit report across all major bureaus. Our experts will identify errors, suggest improvements, and provide a clear roadmap to boost your credit score — absolutely free.
            </p>
            <ul className="space-y-2 mb-8">
              {['Multi-bureau credit report analysis', 'Error and dispute identification', 'Credit utilisation optimisation tips', 'Personalised score improvement plan', 'No obligation — 100% free'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://ekyc.choiceindia.com/open-free-demat-account"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Your Free Checkup
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex-shrink-0 w-full max-w-[280px] lg:max-w-[320px]">
            <div className="rounded-xl bg-background border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Credit Analysis</p>
                  <p className="text-xs text-muted-foreground">Sample Report</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Payment History</span><span className="text-foreground font-medium">92%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '92%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Credit Utilisation</span><span className="text-foreground font-medium">45%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '45%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Dispute Resolution</span><span className="text-foreground font-medium">78%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '78%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Frequently Asked Questions
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">
          Common questions about credit counselling with Athena Credexpert
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What is credit counselling?', a: 'Credit counselling is a professional service that helps individuals and businesses understand, repair, and improve their credit profiles. It includes credit report analysis, error dispute resolution, debt management guidance, and strategic planning to boost credit scores over time.' },
            { q: 'How long does it take to improve my credit score?', a: 'The timeline depends on your current situation. Simple errors can be resolved in 30-45 days, while comprehensive credit repair may take 3-6 months. Our team provides a realistic timeline after assessing your credit report and creates a step-by-step improvement roadmap.' },
            { q: 'Can you remove legitimate negative entries from my report?', a: 'We do not remove legitimate entries. Our approach is ethical and compliant — we focus on disputing incorrect, duplicate, or outdated entries, and guide you on strategies to build positive credit history that gradually outweighs past negatives.' },
            { q: 'Do you offer corporate credit repair?', a: 'Yes, we specialise in both individual and corporate credit repair. For businesses, we address commercial credit report issues, improve business credit ratings with CIBIL and D&B, and enhance your company\'s loan eligibility and vendor trust.' },
            { q: 'Is the Credit Health Checkup really free?', a: 'Yes, the initial Credit Health Checkup is completely free with no strings attached. Our experts will analyse your credit report, identify issues, and provide an improvement roadmap. Paid services are only offered if you choose to proceed with active credit repair or counselling.' },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* Ready to Get Started */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Ready to get started?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Improve your credit health in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Get Your Report', description: 'Share your credit report or let us fetch it from CIBIL, Experian, and Equifax for a complete multi-bureau analysis.' },
            { icon: UserCheck, step: '02', title: 'Expert Analysis', description: 'Our credit specialists review every entry, identify errors, and assess your overall credit health with a detailed report.' },
            { icon: FileText, step: '03', title: 'Action Plan', description: 'Receive a personalised credit improvement roadmap with disputes filed, repayment strategies, and optimisation tips.' },
            { icon: Play, step: '04', title: 'Monitor & Grow', description: 'Track your score improvements with ongoing monitoring and expert support until you reach your credit goals.' },
          ].map((card, index) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card relative"
            >
              <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{card.step}</span>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground mb-2">{card.title}</h3>
              <p className="text-small leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://ekyc.choiceindia.com/open-free-demat-account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Start Credit Repair
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Credit counselling and credit repair services are facilitated through our principal partner Athena Credexpert. Credit score improvements depend on individual circumstances and are not guaranteed. SERNET does not directly modify credit bureau records — all disputes are filed through legitimate channels as per RBI and credit bureau guidelines. This service is advisory in nature and does not constitute financial or legal advice.
        </p>
      </div>
    </section>
  </>
);
