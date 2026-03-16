import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Download, UserCheck, Wallet, Play,
  TrendingUp, BarChart3, Layers, Globe, DollarSign, Rocket, RefreshCw, Landmark,
  Users, Star, Shield, Zap, Clock, Smartphone, HeadphonesIcon, Award
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';
import { APP_LINKS } from '@/lib/appLinks';

const stats = [
  { icon: Download, value: '2.5M+', label: 'Downloads' },
  { icon: Users, value: '13L+', label: 'Active Clients' },
  { icon: Star, value: '4.2', label: 'App Rating' },
];

const features = [
  { icon: Zap, title: 'Lightning-Fast Execution', description: 'Place orders in milliseconds with our optimised trading engine built for speed and reliability.' },
  { icon: BarChart3, title: 'Advanced Charting', description: 'Professional-grade charts with 100+ indicators, drawing tools, and multi-timeframe analysis.' },
  { icon: Shield, title: 'Bank-Grade Security', description: '256-bit encryption, 2FA authentication, and biometric login to keep your account secure.' },
  { icon: Clock, title: 'Real-Time Market Data', description: 'Live streaming quotes, market depth, and news feed — never miss a market move.' },
  { icon: Smartphone, title: 'Trade Anywhere', description: 'Seamless experience across mobile, tablet, and web — your portfolio syncs everywhere.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', description: 'Expert support via call, chat, and email — no chatbots, real people who understand markets.' },
];

const products = [
  { icon: TrendingUp, name: 'Stocks', description: 'Trade equities across NSE & BSE with real-time data and seamless execution.' },
  { icon: BarChart3, name: 'F&O', description: 'Futures & Options trading with advanced analytics and strategy tools.' },
  { icon: Landmark, name: 'Retail Debt', description: 'Access government securities and bonds for stable, fixed-income returns.' },
  { icon: Layers, name: 'Commodities', description: 'Trade gold, silver, crude oil and more on MCX with competitive margins.' },
  { icon: Globe, name: 'Currency', description: 'Participate in forex markets with USD/INR, EUR/INR and other currency pairs.' },
  { icon: Rocket, name: 'IPOs', description: 'Apply for IPOs directly through your account with UPI-based mandates.' },
  { icon: RefreshCw, name: 'SLBM', description: 'Securities Lending & Borrowing — earn extra returns on your idle holdings.' },
  { icon: DollarSign, name: 'MTF', description: 'Margin Trade Funding — leverage your capital for delivery trades with flexible funding.' },
];

const testimonials = [
  { name: 'Rajesh M.', role: 'Day Trader, Mumbai', text: 'Switched from another broker and the execution speed difference is night and day. Choice FinX is incredibly fast and reliable.' },
  { name: 'Priya S.', role: 'Investor, Bangalore', text: 'The charting tools are professional-grade. I can do all my technical analysis right in the app without needing any third-party tools.' },
  { name: 'Amit K.', role: 'F&O Trader, Delhi', text: 'Zero auto square-off charges and the lowest brokerage I\'ve found. The customer support team actually picks up the phone!' },
];

const ChoiceFinX = () => (
  <Layout>
    <SEOHead
      title="Choice FinX Trading Platform"
      description="Advanced trading platform by SERNET — trade equities, F&O, commodities and currencies with powerful tools."
      path="/choicefinx"
    />
    {/* Hero */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Trading Platform
            </span>
            <h1 className="heading-xl mb-4">The only app you need to <span className="text-primary font-normal">trade & invest</span></h1>
            <p className="text-body text-muted-foreground mb-8 max-w-lg">
              Access stocks, commodities, currency, F&O and more with lightning-fast execution, advanced charting, and zero hassle — all from one powerful app.
            </p>
            <ul className="space-y-2 mb-8">
              {['No Account Opening Fee', 'No AMC for 1st Year', 'No Auto Square Off Charges', 'No Call & Trade Charges', 'Lowest Full Service Brokerage'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" /> {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href={APP_LINKS.APP_STORE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="flex flex-col leading-tight"><span className="text-[10px] opacity-80">GET IT ON</span><span className="text-sm font-semibold">App Store</span></div>
              </a>
              <a href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
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
            <img src={choicefinxShowcase} alt="ChoiceFinX online trading platform – trade stocks, F&O, commodities and currency with zero brokerage delivery" width={540} height={400} className="rounded-xl w-full max-w-[540px] object-contain dark:bg-white dark:p-3" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why Choice FinX */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Why Choice FinX?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Built for traders who demand speed, reliability, and a seamless experience.
        </motion.p>
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Trade across every asset class</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          A complete suite of trading instruments — all accessible from one app.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="feature-card group">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><p.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{p.name}</h3>
              <p className="text-small leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Transparent pricing, no hidden charges</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          The lowest full-service brokerage rates in the industry.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: 'Account Opening', price: '₹0', items: ['Free Demat + Trading Account', 'Fully Digital KYC', 'Activated in 15-30 min'] },
            { title: 'Equity Delivery', price: '₹0', items: ['Zero brokerage on delivery', 'No hidden charges', 'Long-term investing made free'], featured: true },
            { title: 'Intraday & F&O', price: 'Flat Fee', items: ['Lowest full-service rates', 'No auto square-off charges', 'No call & trade charges'] },
          ].map((plan, i) => (
            <motion.div key={plan.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`rounded-xl border p-8 text-center ${plan.featured ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-card'}`}>
              <h3 className="heading-md text-foreground mb-2">{plan.title}</h3>
              <p className="text-4xl font-bold text-primary mb-6">{plan.price}</p>
              <ul className="space-y-3 text-left">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-primary shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center mt-8">
          <Link to="/pricing" className="link-primary inline-flex items-center gap-1 text-sm font-medium">View detailed pricing <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Trusted by lakhs of traders</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Here's what our community has to say.
        </motion.p>
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Get started in 4 simple steps</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">From download to your first trade — in minutes.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download', description: 'Search "Choice FinX" on Google Play or Apple App Store.' },
            { icon: UserCheck, step: '02', title: 'Complete KYC', description: 'Aadhaar e-verification, PAN upload, and video verification — all digital.' },
            { icon: Wallet, step: '03', title: 'Fund Account', description: 'Add funds via UPI, Net Banking, or NEFT/RTGS instantly.' },
            { icon: Play, step: '04', title: 'Start Trading', description: 'Explore markets, place trades, and grow your portfolio.' },
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
          <a href={APP_LINKS.OPEN_ACCOUNT} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open Demat + Trading Account <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Frequently Asked Questions</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">Everything you need to know about Choice FinX</motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What documents do I need to open an account?', a: 'PAN card, Aadhaar (linked to mobile), cancelled cheque or bank statement, and a passport-size photograph. The entire KYC is digital.' },
            { q: 'How long does account activation take?', a: 'With our digital onboarding, your account can be activated within 15–30 minutes once all documents are verified.' },
            { q: 'What are the brokerage charges?', a: 'Zero brokerage on equity delivery. For intraday and F&O, we offer the lowest full-service rates in the industry. No auto square-off or call & trade charges.' },
            { q: 'Can I trade on both mobile and desktop?', a: 'Yes, Choice FinX is available on iOS, Android, and web. Your account, watchlists, and positions sync across all devices.' },
            { q: 'How do I add funds?', a: 'Add funds instantly via UPI, Net Banking, or NEFT/RTGS. You can also set up Autopay Mandates for automatic margin funding.' },
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-4">Ready to start trading?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
          Open your free Demat + Trading account in minutes. Join 13 lakh+ active traders on Choice FinX.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4">
          <a href={APP_LINKS.OPEN_ACCOUNT} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open Demat + Trading Account <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <Link to="/services" className="btn-secondary">Explore All Services</Link>
        </motion.div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance or provide any assurance of returns. SERNET facilitates trading services through its principal partner Choice Equity Broking Pvt. Ltd. (SEBI Reg. No: INZ000160131). Brokerage will not exceed SEBI prescribed limits.
        </p>
      </div>
    </section>
  </Layout>
);

export default ChoiceFinX;