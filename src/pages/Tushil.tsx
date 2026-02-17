import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Download, UserCheck, FileText, Play,
  Shield, Heart, Car, Plane, Home, Users, BarChart3,
  BadgeCheck, Handshake, Star, Phone, Clock, Award, HeadphonesIcon, CalendarCheck
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';

const stats = [
  { icon: BadgeCheck, value: '₹500Cr+', label: 'Claims Settled' },
  { icon: Shield, value: '2L+', label: 'Policies Served' },
  { icon: Handshake, value: '30+', label: 'Insurer Partners' },
];

const features = [
  { icon: HeadphonesIcon, title: 'Dedicated Claims Support', description: 'End-to-end assistance from filing to settlement — we act as your advocate when it matters most.' },
  { icon: Shield, title: 'IRDAI Licensed', description: 'Fully regulated insurance distribution with complete compliance and transparency.' },
  { icon: Handshake, title: '30+ Insurer Partners', description: 'Access to policies from all major life, health, motor, and general insurers in India.' },
  { icon: Award, title: 'Expert Recommendations', description: 'Personalised policy suggestions based on your needs, not sales targets.' },
  { icon: Clock, title: 'Instant Policy Issuance', description: 'Digital-first process with instant policy documents for most products.' },
  { icon: Phone, title: 'Always Available', description: 'Reach our experts via call, WhatsApp, or in-person — especially during claims.' },
];

const products = [
  { icon: Shield, name: 'Life Insurance', description: 'Term plans, endowment policies, and ULIPs to secure your family\'s financial future.' },
  { icon: Heart, name: 'Health Insurance', description: 'Individual, family floater, and senior citizen plans with cashless hospitalisation.' },
  { icon: Car, name: 'Motor Insurance', description: 'Comprehensive and third-party car & bike insurance with instant issuance.' },
  { icon: Plane, name: 'Travel Insurance', description: 'Domestic and international coverage for medical emergencies, cancellations, and more.' },
  { icon: Home, name: 'Home Insurance', description: 'Protect your property against natural disasters, theft, fire, and unforeseen events.' },
  { icon: Users, name: 'Employee Benefits', description: 'Group health, group term life, and key-man insurance solutions for businesses.' },
];

const testimonials = [
  { name: 'Arun D.', role: 'Policyholder, Mumbai', text: 'When my father was hospitalised, Tushil\'s claims team handled everything. We didn\'t have to chase the insurer even once.' },
  { name: 'Meena R.', role: 'Business Owner, Ahmedabad', text: 'They set up group health insurance for my 50-person team. The process was smooth and the coverage is excellent.' },
  { name: 'Sanjay V.', role: 'Family Man, Jaipur', text: 'The free portfolio review revealed I was over-insured on motor but under-insured on health. Saved me money and gave me peace of mind.' },
];

const Tushil = () => (
  <Layout>
    {/* Hero */}
    <section className="py-16 md:py-24" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Insurance Distribution</span>
            <h1 className="heading-xl mb-4">Insurance with <span className="gradient-text">claims support</span> that matters</h1>
            <p className="text-body text-muted-foreground mb-8 max-w-lg">
              We work with 30+ leading insurers to bring you the best policies — backed by dedicated claims support that makes all the difference when you need it most.
            </p>
            <ul className="space-y-2 mb-8">
              {['IRDAI Licensed Insurance Distributor', 'Dedicated Claims Support & Assistance', 'Policies from 30+ Leading Insurers', 'Personalised Policy Recommendations', 'End-to-End Service'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-primary shrink-0" />{hook}</li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="flex flex-col leading-tight"><span className="text-[10px] opacity-80">GET IT ON</span><span className="text-sm font-semibold">App Store</span></div>
              </a>
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="flex flex-col leading-tight"><span className="text-[10px] opacity-80">GET IT ON</span><span className="text-sm font-semibold">Google Play</span></div>
              </a>
              <Link to="/schedule-call" className="btn-secondary text-sm">
                <CalendarCheck className="w-4 h-4 mr-2" /> Book a Consultation
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10"><stat.icon className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium text-foreground leading-tight">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex items-center justify-center">
            <img src={choicefinxShowcase} alt="Tushil insurance platform" className="rounded-xl w-full max-w-[540px] object-contain" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why Tushil */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Why Tushil?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Insurance is only as good as the support you get when you need it.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="feature-card group">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><f.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{f.title}</h3>
              <p className="text-small leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Products */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Insurance products we cover</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Comprehensive coverage across every insurance category you need.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="feature-card group">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><p.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{p.name}</h3>
              <p className="text-small leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Free Review CTA */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Free Service</span>
            <h2 className="heading-lg text-foreground mb-3">Free Insurance Portfolio Review</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">We'll evaluate your coverage, identify gaps, and recommend the right products — completely free. Our claims expertise means we know what matters when it counts.</p>
            <ul className="space-y-2 mb-8">
              {['Coverage adequacy and gap analysis', 'Premium optimisation across policies', 'Claim settlement ratio comparison', 'No obligation — 100% free'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start"><Check className="w-4 h-4 text-primary shrink-0" />{item}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="https://ekyc.choiceindia.com/open-free-demat-account" target="_blank" rel="noopener noreferrer" className="btn-primary">Get Free Review <ArrowRight className="w-4 h-4 ml-2" /></a>
              <Link to="/schedule-call" className="btn-secondary"><CalendarCheck className="w-4 h-4 mr-2" /> Book Consultation</Link>
            </div>
          </div>
          <div className="flex-shrink-0 w-full max-w-[280px] lg:max-w-[320px]">
            <div className="rounded-xl bg-background border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">Insurance Score</p><p className="text-xs text-muted-foreground">Sample Report</p></div>
              </div>
              <div className="space-y-3">
                {[{ label: 'Coverage Adequacy', value: '72%', width: '72%' }, { label: 'Premium Efficiency', value: 'Good', width: '65%', accent: true }, { label: 'Claims Readiness', value: '85%', width: '85%' }].map((bar) => (
                  <div key={bar.label}><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{bar.label}</span><span className="text-foreground font-medium">{bar.value}</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${bar.accent ? 'bg-accent' : 'bg-primary'}`} style={{ width: bar.width }} /></div></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">What our policyholders say</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Claims support that makes the difference.</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="feature-card">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div><p className="text-sm font-medium text-foreground">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How to Get Started */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Get the right coverage in 4 steps</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Simple, guided, and hassle-free.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download App', description: 'Get the Choice FinX app or call us to get started.' },
            { icon: UserCheck, step: '02', title: 'Share Your Needs', description: 'Tell us about your requirements, existing policies, and budget.' },
            { icon: FileText, step: '03', title: 'Get Recommendations', description: 'Receive personalised recommendations compared across 30+ insurers.' },
            { icon: Play, step: '04', title: 'Buy & Relax', description: 'Purchase seamlessly and enjoy dedicated claims support.' },
          ].map((card, i) => (
            <motion.div key={card.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="feature-card relative">
              <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{card.step}</span>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><card.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{card.title}</h3>
              <p className="text-small leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Frequently Asked Questions</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">Everything you need to know about Tushil</motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'How does Tushil earn its revenue?', a: 'We earn commissions from insurance companies whose products we distribute. You never pay extra — the premium is the same whether you buy directly or through us.' },
            { q: 'What makes your claims support different?', a: 'Our dedicated claims team assists you end-to-end — from filing and documentation to follow-ups and settlement. We act as your advocate during the most critical moment.' },
            { q: 'How do I choose the right health insurance?', a: 'We evaluate your needs based on age, family size, medical history, and budget, then compare plans across 30+ insurers on coverage, CSR, network hospitals, and exclusions.' },
            { q: 'Can you help with corporate insurance?', a: 'Yes, we offer group health, group term life, and key-man insurance solutions for businesses of all sizes.' },
            { q: 'Is the portfolio review really free?', a: 'Yes, completely free with no obligation. We\'ll review your existing policies, identify gaps, and suggest improvements at zero cost.' },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-16 md:py-20" style={{ background: 'var(--gradient-cta)' }}>
      <div className="container-zerodha text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-4">Get insured with confidence</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">Join 2 lakh+ policyholders who trust Tushil for their insurance needs and claims support.</motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4">
          <a href="https://ekyc.choiceindia.com/open-free-demat-account" target="_blank" rel="noopener noreferrer" className="btn-primary">Get Insured Today <ArrowRight className="w-4 h-4 ml-2" /></a>
          <Link to="/schedule-call" className="btn-secondary"><CalendarCheck className="w-4 h-4 mr-2" /> Book Consultation</Link>
        </motion.div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Insurance is a subject matter of solicitation. IRDAI does not endorse or guarantee the accuracy of any advertisements or marketing material. SERNET acts as a licensed insurance distributor and earns commissions from its insurer partners. Policy terms, conditions, and exclusions apply. Please read the policy document carefully before purchasing.
        </p>
      </div>
    </section>
  </Layout>
);

export default Tushil;