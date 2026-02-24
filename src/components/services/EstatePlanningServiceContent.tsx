import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, Users, Shield, Scale, ScrollText, Landmark, BarChart3, Download, UserCheck, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { APP_LINKS } from '@/lib/appLinks';

const stats = [
  { icon: ScrollText, value: '5,000+', label: 'Wills Drafted' },
  { icon: Users, value: '1,200+', label: 'Trusts Created' },
  { icon: Landmark, value: '₹2,500Cr+', label: 'Assets Planned' },
];

const products = [
  { icon: ScrollText, name: 'Will Writing', description: 'Legally valid will drafting with expert guidance to ensure your assets are distributed exactly as you wish, avoiding disputes and delays.' },
  { icon: Users, name: 'Family Trust Setup', description: 'Create private or public trusts to protect and manage family wealth across generations with clear succession planning.' },
  { icon: Shield, name: 'Succession Planning', description: 'Comprehensive business and personal succession strategies to ensure smooth transition of assets, roles, and responsibilities.' },
  { icon: Scale, name: 'Power of Attorney', description: 'Draft general or specific power of attorney documents to authorise trusted individuals to act on your behalf in financial and legal matters.' },
  { icon: Landmark, name: 'HUF Formation', description: 'Structure Hindu Undivided Family entities for tax-efficient wealth management and intergenerational asset protection.' },
  { icon: FileText, name: 'Gift Deeds & Transfers', description: 'Facilitate legally compliant asset transfers and gift deeds with proper documentation, valuation, and stamp duty compliance.' },
];

export const EstatePlanningServiceContent = () => (
  <>
    {/* Hero — WillGenie */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-3">WillGenie</h2>
            <p className="text-body text-muted-foreground mb-8">
              Plan your legacy with confidence. Our estate planning services help you draft legally valid wills, set up family trusts, and create comprehensive succession plans — ensuring your wealth is protected and passed on exactly as you intend.
            </p>
            <ul className="space-y-2 mb-8">
              {['Legally Valid Will Drafting & Registration', 'Private & Public Family Trust Setup', 'End-to-End Succession Planning', 'Power of Attorney & Gift Deed Services', 'Expert Guidance from Legal Professionals'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href={APP_LINKS.OPEN_ACCOUNT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Planning <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/contact" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Schedule a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Trust strip stats */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
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
                  <ScrollText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Estate Planning</p>
                  <p className="text-xs text-muted-foreground">Powered by WillGenie</p>
                </div>
              </div>
              <div className="space-y-4">
                {['Will Drafted & Registered', 'Nominees & Executors Assigned', 'Trust Structure Defined', 'Assets Documented'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
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
          Comprehensive estate planning solutions to protect your wealth, secure your legacy, and ensure seamless intergenerational transitions.
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

    {/* Free Estate Health Check */}
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
            <h2 className="heading-lg text-foreground mb-3">Free Estate Health Check</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Get a comprehensive review of your current estate plan. Our experts will assess your will, trust structures, nominee assignments, and succession readiness — identifying gaps and recommending improvements, completely free.
            </p>
            <ul className="space-y-2 mb-8">
              {['Will validity and completeness check', 'Nominee and beneficiary audit', 'Trust structure assessment', 'Tax-efficient transfer recommendations', 'No obligation — 100% free'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={APP_LINKS.OPEN_ACCOUNT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Your Free Check
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
                  <p className="text-sm font-semibold text-foreground">Estate Readiness</p>
                  <p className="text-xs text-muted-foreground">Sample Report</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Will Completeness</span><span className="text-foreground font-medium">85%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '85%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Nominee Coverage</span><span className="text-foreground font-medium">60%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '60%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Succession Plan</span><span className="text-foreground font-medium">40%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '40%' }} /></div>
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
          Common questions about estate planning with WillGenie
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'Why do I need a will?', a: 'Without a legally valid will, your assets will be distributed according to succession laws — which may not align with your wishes. A will ensures your wealth goes to the people you choose, avoids family disputes, and speeds up the legal process significantly.' },
            { q: 'What is the difference between a will and a trust?', a: 'A will takes effect after death and goes through probate, while a trust can be set up during your lifetime for immediate asset management. Trusts offer privacy, avoid probate delays, and provide greater control over how and when assets are distributed to beneficiaries.' },
            { q: 'Is a registered will necessary?', a: 'While an unregistered will is legally valid in India, registration adds an extra layer of legal protection. It makes the will harder to contest, provides an official record, and simplifies the probate process for your heirs.' },
            { q: 'How often should I update my estate plan?', a: 'We recommend reviewing your estate plan every 2-3 years or after major life events — marriage, birth of a child, property purchase, retirement, or significant changes in financial circumstances. Regular reviews ensure your plan stays current and effective.' },
            { q: 'What does the estate planning service cost?', a: 'Our initial Estate Health Check is completely free. Will drafting, trust setup, and other services are priced transparently based on complexity. We provide a detailed quote after understanding your specific requirements during the consultation.' },
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
          Secure your legacy in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Consult', description: 'Schedule a free consultation to discuss your estate planning needs, family structure, and asset portfolio.' },
            { icon: UserCheck, step: '02', title: 'Document', description: 'Our legal experts draft your will, trust deed, or succession plan with meticulous attention to detail.' },
            { icon: FileText, step: '03', title: 'Review & Sign', description: 'Review all documents thoroughly, make any changes, and complete the signing and witness formalities.' },
            { icon: Play, step: '04', title: 'Register & Secure', description: 'We assist with registration and safe storage of your estate documents for complete peace of mind.' },
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
            href={APP_LINKS.OPEN_ACCOUNT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Start Your Estate Plan
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* Advisory Note */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Advisory Note:</strong> Estate planning documents including wills and trusts should be drafted with the assistance of qualified legal professionals. SERNET facilitates estate planning services through its principal partner WillGenie. The information provided here is for general guidance only and does not constitute legal advice. Individual circumstances may vary — we recommend a personal consultation before making estate planning decisions.
        </p>
      </div>
    </section>
  </>
);
