import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, UserCheck, Wallet, Play, PieChart, Briefcase, Landmark, Gem, Building2, BarChart3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import choicefinxShowcase from '@/assets/choicefinx-showcase.png';

const stats = [
  { value: '₹10,000Cr+', label: 'AUM Managed' },
  { value: '5L+', label: 'Investors' },
  { value: '500+', label: 'Products' },
];

const products = [
  { icon: PieChart, name: 'Mutual Funds & SIF', description: 'Invest in direct mutual funds and Systematic Investment Facilities with zero commission across 5,000+ schemes.' },
  { icon: Briefcase, name: 'PMS & AIF', description: 'Portfolio Management Services and Alternative Investment Funds for HNI investors seeking alpha-driven strategies.' },
  { icon: Landmark, name: 'Bonds', description: 'Government securities, corporate bonds, and tax-free bonds for stable, fixed-income returns with transparent pricing.' },
  { icon: Building2, name: 'Company FD', description: 'Fixed deposits from top-rated corporates offering higher interest rates than traditional bank FDs with flexible tenures.' },
  { icon: Gem, name: 'Digital Gold & Silver', description: 'Buy, sell, and accumulate 24K digital gold and 999 purity silver in any amount — stored securely in insured vaults.' },
];

export const InvestmentServiceContent = () => (
  <>
    {/* Hero — Investment Platform */}
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
            <h2 className="heading-lg text-foreground mb-3">Smart Investments, Simplified</h2>
            <p className="text-body text-muted-foreground mb-8">
              Build long-term wealth with our comprehensive investment platform. Access mutual funds, PMS, bonds, and more — all with expert guidance and zero hidden charges.
            </p>
            <ul className="space-y-2 mb-8">
              {['Zero Commission on Direct Mutual Funds', 'SEBI-Registered Investment Advisory', 'Curated PMS & AIF for HNI Investors', 'Digital Gold & Silver with Insured Vaults', 'Dedicated Relationship Manager'].map((hook) => (
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
              <Link to="/products/coin" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
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
            <img src={choicefinxShowcase} alt="Choice investment platform on desktop, tablet and mobile" className="rounded-xl w-full max-w-[520px]" />
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
          A comprehensive range of investment products to help you build and grow your wealth.
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

    {/* Investment Portfolio Health Check CTA */}
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
            <h2 className="heading-lg text-foreground mb-3">Free Investment Portfolio Health Checkup</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Get a comprehensive review of your mutual fund, bond, and equity holdings by our expert advisory team. We'll evaluate your asset allocation, identify gaps, and recommend improvements — completely free of charge.
            </p>
            <ul className="space-y-2 mb-8">
              {['Asset allocation and rebalancing analysis', 'Fund overlap and expense ratio review', 'Goal-based investment gap assessment', 'Personalized recommendations from SEBI-registered advisors', 'No obligation — 100% free'].map((item) => (
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
              Get Your Free Health Checkup
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
                  <p className="text-sm font-semibold text-foreground">Investment Score</p>
                  <p className="text-xs text-muted-foreground">Sample Report</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Asset Allocation</span><span className="text-foreground font-medium">68%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '68%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Fund Overlap</span><span className="text-foreground font-medium">Low</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '30%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Goal Alignment</span><span className="text-foreground font-medium">82%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '82%' }} /></div>
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
          Everything you need to know about investing with Choice
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What is the minimum amount to start investing in mutual funds?', a: 'You can start investing in mutual funds with as little as ₹500 through a SIP (Systematic Investment Plan). Lump-sum investments typically start from ₹1,000 depending on the fund house.' },
            { q: 'What is the difference between PMS and AIF?', a: 'PMS (Portfolio Management Services) involves direct stock investments managed by a portfolio manager with a minimum investment of ₹50 lakhs. AIF (Alternative Investment Funds) pool money from investors for specialized strategies like venture capital, private equity, or hedge funds with a minimum of ₹1 crore.' },
            { q: 'Are there any charges for investing in direct mutual funds?', a: 'No, we offer zero commission on direct mutual fund investments. You save the distributor commission (typically 0.5%–1.5% annually) compared to regular plans, which can significantly boost your long-term returns.' },
            { q: 'How do Company FDs differ from bank FDs?', a: 'Company FDs typically offer 1%–3% higher interest rates than bank FDs. However, they carry slightly higher credit risk. We only offer FDs from top-rated corporates (AAA/AA+ rated) to balance returns with safety.' },
            { q: 'Is digital gold safe to invest in?', a: 'Yes, digital gold purchased through our platform is 24K, 999.9 purity gold stored in MMTC-PAMP insured vaults. You can buy any amount starting from ₹1, and it can be converted to physical gold or redeemed for cash anytime.' },
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
          Begin your investment journey in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Download, step: '01', title: 'Download', description: 'Get the Choice FinX app from Google Play or the Apple App Store to start investing.' },
            { icon: UserCheck, step: '02', title: 'Complete KYC', description: 'Sign up with your mobile number, complete Aadhaar e-Verification, upload PAN, and finish video verification.' },
            { icon: Wallet, step: '03', title: 'Fund Your Account', description: 'Add funds via UPI, Net Banking, or NEFT/RTGS. Set up SIP mandates for automated investing.' },
            { icon: Play, step: '04', title: 'Start Investing', description: 'Explore mutual funds, bonds, gold and more. Build a diversified portfolio with expert guidance.' },
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
            Start Investing Today
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  </>
);
