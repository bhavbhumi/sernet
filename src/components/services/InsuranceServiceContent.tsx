import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, UserCheck, FileText, Play, Shield, Heart, Car, Plane, Home, Users, BarChart3, BadgeCheck, Handshake } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';

const stats = [
  { icon: BadgeCheck, value: '₹500Cr+', label: 'Claims Settled' },
  { icon: Shield, value: '2L+', label: 'Policies Served' },
  { icon: Handshake, value: '30+', label: 'Insurer Partners' },
];

const products = [
  { icon: Shield, name: 'Life Insurance', description: 'Term plans, endowment policies, and ULIPs from leading insurers — helping you secure your family\'s financial future with the right coverage.' },
  { icon: Heart, name: 'Health Insurance', description: 'Individual, family floater, and senior citizen health plans with cashless hospitalisation, critical illness cover, and comprehensive benefits.' },
  { icon: Car, name: 'Motor Insurance', description: 'Comprehensive and third-party car & bike insurance with instant policy issuance, easy renewals, and hassle-free claims assistance.' },
  { icon: Plane, name: 'Travel Insurance', description: 'Domestic and international travel protection covering medical emergencies, trip cancellations, baggage loss, and flight delays.' },
  { icon: Home, name: 'Home Insurance', description: 'Protect your home and belongings against natural disasters, theft, fire, and other unforeseen events with comprehensive property coverage.' },
  { icon: Users, name: 'Employee Benefits', description: 'Group health insurance, group term life, and key-man insurance solutions tailored for businesses of all sizes to attract and retain talent.' },
];

export const InsuranceServiceContent = () => (
  <>
    {/* Hero — Tushil */}
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
            <h2 className="heading-lg text-foreground mb-3">Tushil</h2>
            <p className="text-body text-muted-foreground mb-8">
              Your trusted insurance distribution partner. We work with 30+ leading insurers to bring you the best policies across life, health, motor, and more — backed by dedicated claims support that makes all the difference when you need it most.
            </p>
            <ul className="space-y-2 mb-8">
              {['IRDAI Licensed Insurance Distributor', 'Dedicated Claims Support & Assistance', 'Policies from 30+ Leading Insurers', 'Personalised Policy Recommendations', 'End-to-End Service from Purchase to Claims'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] opacity-80">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </a>
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] opacity-80">GET IT ON</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </a>
              <Link to="/products/console" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Know More <ArrowRight className="w-4 h-4" />
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
            <img src={choicefinxShowcase} alt="Tushil insurance platform on desktop, tablet and mobile" className="rounded-xl w-full max-w-[520px] max-h-[400px] object-contain" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Products We Offer */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Products we offer
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          A comprehensive range of insurance products distributed through our trusted insurer partnerships. We earn commissions from our principals so you never pay extra.
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

    {/* Free Insurance Portfolio Review */}
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
            <h2 className="heading-lg text-foreground mb-3">Free Insurance Portfolio Review Service</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Get a comprehensive review of your existing insurance policies by our experienced team. We'll evaluate your coverage adequacy, identify gaps, and recommend the right products — completely free of charge. Our claims support expertise means we know what matters when it counts.
            </p>
            <ul className="space-y-2 mb-8">
              {['Coverage adequacy and gap analysis', 'Premium optimisation across policies', 'Claim settlement ratio comparison', 'Personalised recommendations from our expert team', 'No obligation — 100% free'].map((item) => (
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
              Get Your Free Review
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
                  <p className="text-sm font-semibold text-foreground">Insurance Score</p>
                  <p className="text-xs text-muted-foreground">Sample Report</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Coverage Adequacy</span><span className="text-foreground font-medium">72%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '72%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Premium Efficiency</span><span className="text-foreground font-medium">Good</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '65%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Claims Readiness</span><span className="text-foreground font-medium">85%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '85%' }} /></div>
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
          Everything you need to know about insurance with Tushil
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'How does Tushil earn its revenue?', a: 'We earn commissions from the insurance companies (our principals and partners) whose products we distribute. You never pay anything extra — the premium you pay is the same whether you buy directly or through us, but with us you get personalised guidance and dedicated claims support.' },
            { q: 'What makes your claims support different?', a: 'Claims support is the real differentiator in insurance. Our dedicated claims team assists you end-to-end — from filing the claim and documentation to follow-ups with the insurer and settlement. We act as your advocate during the most critical moment of your insurance journey.' },
            { q: 'How do I choose the right health insurance plan?', a: 'Our team evaluates your needs based on age, family size, medical history, and budget. We compare plans across 30+ insurers on parameters like coverage, claim settlement ratio, network hospitals, and exclusions to recommend the best fit for you.' },
            { q: 'Can you help with corporate or group insurance?', a: 'Yes, we offer comprehensive employee benefits solutions including group health insurance, group term life, and key-man insurance. We work with businesses of all sizes to design cost-effective plans that help attract and retain talent.' },
            { q: 'Is there a cost for the Insurance Portfolio Review?', a: 'No, the Insurance Portfolio Review Service is completely free with no obligation. Our experts will review your existing policies, identify coverage gaps, and suggest improvements — all at zero cost to you.' },
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
          Get the right insurance coverage in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download', description: 'Get the Choice FinX app from Google Play or the Apple App Store to explore insurance products.' },
            { icon: UserCheck, step: '02', title: 'Share Your Needs', description: 'Tell us about your insurance requirements, existing policies, and budget preferences.' },
            { icon: FileText, step: '03', title: 'Get Recommendations', description: 'Receive personalised policy recommendations compared across 30+ insurers for the best fit.' },
            { icon: Play, step: '04', title: 'Buy & Relax', description: 'Purchase your policy seamlessly and enjoy dedicated claims support whenever you need it.' },
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
            Get Insured Today
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Insurance is the subject matter of solicitation. IRDAI is not involved in activities like selling, endorsing, or soliciting insurance. For more details on risk factors, please read the sales brochure carefully before concluding a sale. SERNET facilitates insurance distribution through its principal partner Srigoda Insurance Broking Services. Premium amounts and benefits are subject to the terms and conditions of the respective insurance company.
        </p>
      </div>
    </section>
  </>
);
