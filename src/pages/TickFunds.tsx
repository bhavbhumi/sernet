import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Download, UserCheck, Wallet, Play,
  PieChart, Briefcase, Landmark, Gem, Building2, BarChart3,
  TrendingUp, Users, Layers, Shield, Target, Award, Star, Heart, RefreshCw
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';

const stats = [
  { icon: TrendingUp, value: '₹10,000Cr+', label: 'AUM Managed' },
  { icon: Users, value: '5L+', label: 'Investors' },
  { icon: Layers, value: '500+', label: 'Products' },
];

const features = [
  { icon: Target, title: 'Goal-Based Planning', description: 'We help you map investments to life goals — retirement, education, home, or wealth creation.' },
  { icon: Shield, title: 'AMFI Registered MFD', description: 'Regulated and compliant mutual fund distribution with complete transparency.' },
  { icon: Users, title: 'Dedicated Relationship Manager', description: 'A personal RM who knows your portfolio and guides you through every market cycle.' },
  { icon: RefreshCw, title: 'Regular Portfolio Reviews', description: 'Periodic health checks to rebalance and optimize your investment mix.' },
  { icon: Award, title: 'Curated Product Selection', description: 'Access 5,000+ schemes from top AMCs, plus PMS, AIF, bonds, and digital gold.' },
  { icon: Heart, title: 'Investor-First Approach', description: 'We earn from principals, not from you. Your interests always come first.' },
];

const products = [
  { icon: PieChart, name: 'Mutual Funds & SIF', description: 'Invest in regular mutual funds across 5,000+ schemes from top AMCs with personalised guidance.' },
  { icon: Briefcase, name: 'PMS & AIF', description: 'Portfolio Management Services and Alternative Investment Funds for HNI investors.' },
  { icon: Landmark, name: 'Bonds', description: 'Government securities, corporate bonds, and tax-free bonds for stable returns.' },
  { icon: Building2, name: 'Company FD', description: 'Fixed deposits from top-rated corporates offering higher interest rates.' },
  { icon: Gem, name: 'Digital Gold & Silver', description: 'Buy 24K digital gold and 999 purity silver in any amount — securely stored.' },
];

const testimonials = [
  { name: 'Sunita P.', role: 'Investor, Pune', text: 'My RM helped me create a goal-based portfolio that I finally feel confident about. The regular reviews keep me on track.' },
  { name: 'Vikram J.', role: 'HNI Investor, Hyderabad', text: 'The PMS recommendations from Tick Funds have been excellent. Great product selection and transparent process.' },
  { name: 'Neha T.', role: 'First-time Investor, Chennai', text: 'I started with just ₹500 SIP and now I have a diversified portfolio. The guidance made all the difference.' },
];

const TickFunds = () => (
  <Layout>
    {/* Hero */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Investment Platform</span>
            <h1 className="heading-xl mb-4">Build lasting wealth with <span className="text-primary font-normal">Tick Funds</span></h1>
            <p className="text-body text-muted-foreground mb-8 max-w-lg">
              Your comprehensive investment distribution platform. As an AMFI-registered Mutual Fund Distributor, we help you access the best mutual funds, bonds, and more — with personalised guidance at every step.
            </p>
            <ul className="space-y-2 mb-8">
              {['AMFI-Registered Mutual Fund Distributor', 'Regular Plans with Personalised Advisory', 'Curated PMS & AIF for HNI Investors', 'Digital Gold & Silver with Insured Vaults', 'Dedicated Relationship Manager'].map((hook) => (
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
            <img src={choicefinxShowcase} alt="Tick Funds investment platform" className="rounded-xl w-full max-w-[540px] object-contain" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why Tick Funds */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Why Tick Funds?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Personalised wealth building with transparency and trust.</motion.p>
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Investment products we distribute</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">A comprehensive range across every asset class.</motion.p>
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

    {/* Free Health Check CTA */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Free Service</span>
            <h2 className="heading-lg text-foreground mb-3">Free Investment Portfolio Health Checkup</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">Get a comprehensive review of your holdings by our experienced team. We'll evaluate your asset allocation, identify gaps, and recommend improvements — completely free.</p>
            <ul className="space-y-2 mb-8">
              {['Asset allocation and rebalancing analysis', 'Fund overlap and expense ratio review', 'Goal-based investment gap assessment', 'No obligation — 100% free'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start"><Check className="w-4 h-4 text-primary shrink-0" />{item}</li>
              ))}
            </ul>
            <a href="https://ekyc.choiceindia.com/open-free-demat-account" target="_blank" rel="noopener noreferrer" className="btn-primary">Get Your Free Checkup <ArrowRight className="w-4 h-4 ml-2" /></a>
          </div>
          <div className="flex-shrink-0 w-full max-w-[280px] lg:max-w-[320px]">
            <div className="rounded-xl bg-background border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">Investment Score</p><p className="text-xs text-muted-foreground">Sample Report</p></div>
              </div>
              <div className="space-y-3">
                {[{ label: 'Asset Allocation', value: '68%', width: '68%' }, { label: 'Fund Overlap', value: 'Low', width: '30%', accent: true }, { label: 'Goal Alignment', value: '82%', width: '82%' }].map((bar) => (
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">What our investors say</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Real stories from real investors.</motion.p>
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Begin your investment journey</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Four simple steps to start building wealth.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download', description: 'Get the Choice FinX app from Google Play or the Apple App Store.' },
            { icon: UserCheck, step: '02', title: 'Complete KYC', description: 'Sign up, complete Aadhaar e-verification, upload PAN, and finish video verification.' },
            { icon: Wallet, step: '03', title: 'Fund Account', description: 'Add funds via UPI, Net Banking, or NEFT/RTGS. Set up SIP mandates.' },
            { icon: Play, step: '04', title: 'Start Investing', description: 'Explore mutual funds, bonds, gold and more with expert guidance.' },
          ].map((card, i) => (
            <motion.div key={card.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="feature-card relative">
              <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{card.step}</span>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><card.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{card.title}</h3>
              <p className="text-small leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center mt-12">
          <a href="https://ekyc.choiceindia.com/open-free-demat-account" target="_blank" rel="noopener noreferrer" className="btn-primary">Start Investing Today <ArrowRight className="w-4 h-4 ml-2" /></a>
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Frequently Asked Questions</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">Everything you need to know about Tick Funds</motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What is the minimum amount to start investing?', a: 'You can start with as little as ₹500 through a SIP. Lump-sum investments typically start from ₹1,000 depending on the fund house.' },
            { q: 'Are you a SEBI-registered Investment Advisor?', a: 'No, we are an AMFI-registered Mutual Fund Distributor (MFD). We earn commissions from AMCs for regular plan distribution and do not charge advisory fees.' },
            { q: 'What is the difference between regular and direct plans?', a: 'Regular plans include a distributor commission in the expense ratio, compensating us for personalised guidance and portfolio reviews. Direct plans have a slightly lower expense ratio but no advisory support.' },
            { q: 'Is digital gold safe?', a: 'Yes, digital gold is 24K, 999.9 purity stored in MMTC-PAMP insured vaults. Buy from ₹1, convert to physical gold, or redeem for cash anytime.' },
            { q: 'How are PMS and AIF different?', a: 'PMS involves direct stock investments (min ₹50L). AIF pools money for specialised strategies like PE or hedge funds (min ₹1Cr).' },
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
    <section className="py-16 md:py-20 bg-section-alt">
      <div className="container-zerodha text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-4">Start building your wealth today</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">Join 5 lakh+ investors who trust Tick Funds for their wealth journey.</motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4">
          <a href="https://ekyc.choiceindia.com/open-free-demat-account" target="_blank" rel="noopener noreferrer" className="btn-primary">Open Free Account <ArrowRight className="w-4 h-4 ml-2" /></a>
          <Link to="/services" className="btn-secondary">Explore All Services</Link>
        </motion.div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. SERNET is an AMFI-registered Mutual Fund Distributor (ARN-274029) and earns commissions from AMCs for regular plan distribution. SERNET does not provide SEBI-registered investment advisory services.
        </p>
      </div>
    </section>
  </Layout>
);

export default TickFunds;