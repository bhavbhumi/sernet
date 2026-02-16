import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Apple, Smartphone, ArrowRight, TrendingUp, BarChart3, Layers, Globe, DollarSign, Rocket, RefreshCw, Landmark, Check, Download, UserCheck, Wallet, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import tradingShowcase from '@/assets/trading-app-showcase.png';

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
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Apple className="w-4 h-4" />
                iOS Download
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Smartphone className="w-4 h-4" />
                Android Download
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
            <img src={tradingShowcase} alt="Choice FinX trading app on desktop, tablet and mobile" className="rounded-xl w-full max-w-[480px]" />
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
