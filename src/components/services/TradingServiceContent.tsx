import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Apple, Smartphone, ArrowRight, TrendingUp, BarChart3, Layers, Globe, DollarSign, Rocket, RefreshCw, Landmark, Check, Download, UserCheck, Wallet, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';

const stats = [
  { value: '2.5M+', label: 'Downloads' },
  { value: '13L+', label: 'Active Clients' },
  { value: '4.2', label: 'App Rating' },
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

export const TradingServiceContent = () => (
  <>
    {/* Hero — Choice FinX */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-3">Choice FinX</h2>
            <p className="text-body text-muted-foreground mb-8">
              Only best in class app you need for your access to trade or invest in stocks, commodities and currency markets with lightening fast execution
            </p>
            <ul className="space-y-2 mb-8">
              {['No Account Opening Fee for Trading + Demat', 'No AMC for the 1st Year of Demat Account', 'No Auto Square Off Charges', 'No Charges for Call and Trade', 'Lowest Full Service Brokerage Rates'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
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
              <Link to="/products/kite" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
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
            <img src={choicefinxShowcase} alt="Choice FinX trading app on desktop, tablet and mobile" className="rounded-xl w-full max-w-[520px]" />
            <div className="flex items-center justify-center gap-8 mt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-small">{stat.label}</div>
                </div>
              ))}
            </div>
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
          A complete suite of trading instruments across every major asset class.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

    {/* Portfolio Health Check CTA */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
        >
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Free Service
            </span>
            <h2 className="heading-lg text-foreground mb-3">Free Stock Portfolio Health Check</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Get a comprehensive analysis of your existing stock portfolio by our expert research team. We'll evaluate your holdings, identify risks, and suggest actionable improvements — completely free of charge.
            </p>
            <ul className="space-y-2 mb-8">
              {['Detailed risk assessment of your current holdings', 'Sector diversification analysis', 'Personalized recommendations from SEBI-registered analysts', 'No obligation — 100% free'].map((item) => (
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
              Get Your Free Health Check
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
                  <p className="text-sm font-semibold text-foreground">Portfolio Score</p>
                  <p className="text-xs text-muted-foreground">Sample Report</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Diversification</span><span className="text-foreground font-medium">72%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '72%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Risk Level</span><span className="text-foreground font-medium">Moderate</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '55%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Growth Potential</span><span className="text-foreground font-medium">85%</span></div>
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
          Everything you need to know about trading with Choice FinX
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What documents do I need to open a trading account?', a: 'You need your PAN card, Aadhaar card (linked to mobile number for e-verification), a cancelled cheque or bank statement, and a passport-size photograph. The entire KYC process can be completed digitally through the Choice FinX app.' },
            { q: 'How long does it take to open an account?', a: 'With our fully digital onboarding, your account can be activated within 15–30 minutes once all documents are verified. In-person video verification is completed instantly during the sign-up flow.' },
            { q: 'What are the brokerage charges for trading?', a: 'We offer the lowest full-service brokerage rates in the industry. Delivery trades on equity have zero brokerage. For intraday, F&O and other segments, we offer highly competitive flat-fee plans. Contact us for detailed rate cards.' },
            { q: 'Can I trade on both mobile and desktop?', a: 'Yes, Choice FinX is available on iOS, Android, and web platforms. Your account, watchlists, and positions sync seamlessly across all devices so you can trade from anywhere.' },
            { q: 'How do I add funds to my trading account?', a: 'You can add funds instantly via UPI, Net Banking, or through NEFT/RTGS bank transfers. You can also set up Autopay Mandates for automatic margin funding when needed.' },
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
          Get up and running in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download', description: 'Search "Choice FinX" on Google Play or Apple App Store & download our Mobile Trading App.' },
            { icon: UserCheck, step: '02', title: 'Complete KYC', description: 'Sign up with Mobile No., Complete Aadhaar e‑Verification, Upload PAN, Add Bank Details and Finish In Person Video verification.' },
            { icon: Wallet, step: '03', title: 'Fund Your Account', description: 'Add funds via UPI, Net Banking or NEFT / RTGS. Set up Autopay Mandates for margin needs.' },
            { icon: Play, step: '04', title: 'Start Trading', description: 'Unlock all features, explore markets, place trades and grow your portfolio.' },
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
            Open Demat + Trading Account
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  </>
);
