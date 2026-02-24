import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const pricingTabs = ['Trading', 'Investment', 'Insurance'] as const;
type PricingTab = (typeof pricingTabs)[number];

/* ── Trading ── */
const TradingContent = () => (
  <>
    {/* Highlights */}
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { price: '₹0', title: 'Free equity delivery', desc: 'All equity delivery investments are absolutely free — ₹0 brokerage.' },
            { price: '₹20', title: 'Intraday and F&O', desc: 'Flat ₹20 or 0.03% (whichever is lower) per executed order.' },
            { price: '₹0', title: 'Free direct MF', desc: 'All direct mutual fund investments are absolutely free.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Detailed Charges */}
    <section className="section-padding bg-section-alt">
      <div className="container-sernet">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-12 text-center">Detailed charges</motion.h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            { category: 'Equity', items: [{ name: 'Equity delivery', price: 'FREE', description: 'All equity delivery investments (NSE, BSE)' }, { name: 'Equity intraday', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }] },
            { category: 'Derivatives', items: [{ name: 'F&O (Equity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }, { name: 'F&O (Currency)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }, { name: 'F&O (Commodity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }] },
            { category: 'Others', items: [{ name: 'Account opening', price: 'FREE', description: 'Opening an account' }, { name: 'AMC', price: 'FREE', description: 'Annual maintenance charge' }] },
          ].map((tier, tierIndex) => (
            <motion.div key={tier.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: tierIndex * 0.1 }}>
              <h3 className="heading-md text-foreground mb-6">{tier.category}</h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {tier.items.map((item, itemIndex) => (
                  <div key={item.name} className={`flex items-center justify-between p-4 ${itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''}`}>
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-small">{item.description}</p>
                    </div>
                    <div className={`text-lg font-bold ${item.price === 'FREE' ? 'text-success' : 'text-primary'}`}>{item.price}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

/* ── Investment ── */
const InvestmentContent = () => (
  <>
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { price: '₹0', title: 'Direct mutual funds', desc: 'Invest in direct mutual funds online, completely free.' },
            { price: '₹0', title: 'Stocks (Delivery)', desc: 'Buy and hold stocks with zero brokerage charges.' },
            { price: '₹0', title: 'Digital gold', desc: 'Invest in 24K digital gold with no extra charges.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-section-alt">
      <div className="container-sernet">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-12 text-center">Investment charges</motion.h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            { category: 'Mutual Funds', items: [{ name: 'Direct mutual funds', price: 'FREE', description: 'Zero commission, invest in 5000+ funds' }, { name: 'SIP investments', price: 'FREE', description: 'Systematic investment plans at no cost' }] },
            { category: 'Bonds & FDs', items: [{ name: 'Government bonds', price: 'FREE', description: 'Invest in sovereign bonds at no charge' }, { name: 'Corporate bonds', price: 'FREE', description: 'Access corporate bonds marketplace' }] },
            { category: 'Others', items: [{ name: 'IPO applications', price: 'FREE', description: 'Apply for IPOs using UPI' }, { name: 'Digital gold', price: 'FREE', description: 'Buy and sell 24K digital gold' }] },
          ].map((tier, tierIndex) => (
            <motion.div key={tier.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: tierIndex * 0.1 }}>
              <h3 className="heading-md text-foreground mb-6">{tier.category}</h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {tier.items.map((item, itemIndex) => (
                  <div key={item.name} className={`flex items-center justify-between p-4 ${itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''}`}>
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-small">{item.description}</p>
                    </div>
                    <div className="text-lg font-bold text-success">{item.price}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

/* ── Insurance ── */
const InsuranceContent = () => (
  <>
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { price: '₹0', title: 'No commission', desc: 'Zero commission on all insurance products.' },
            { price: '100%', title: 'Claim support', desc: 'Dedicated support throughout the claims process.' },
            { price: '10+', title: 'Insurers', desc: 'Choose from a wide range of top insurance providers.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-section-alt">
      <div className="container-sernet">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-12 text-center">Insurance products</motion.h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            { category: 'Life Insurance', items: [{ name: 'Term life insurance', price: 'No commission', description: 'Pure term plans from top insurers' }, { name: 'ULIPs', price: 'No commission', description: 'Unit-linked insurance plans' }] },
            { category: 'Health Insurance', items: [{ name: 'Individual health', price: 'No commission', description: 'Comprehensive health coverage' }, { name: 'Family floater', price: 'No commission', description: 'Coverage for the entire family' }] },
            { category: 'General Insurance', items: [{ name: 'Motor insurance', price: 'No commission', description: 'Car and bike insurance' }, { name: 'Travel insurance', price: 'No commission', description: 'Domestic and international travel cover' }] },
          ].map((tier, tierIndex) => (
            <motion.div key={tier.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: tierIndex * 0.1 }}>
              <h3 className="heading-md text-foreground mb-6">{tier.category}</h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {tier.items.map((item, itemIndex) => (
                  <div key={item.name} className={`flex items-center justify-between p-4 ${itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''}`}>
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-small">{item.description}</p>
                    </div>
                    <div className="text-lg font-bold text-success">{item.price}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

const tabContent: Record<PricingTab, React.ReactNode> = {
  Trading: <TradingContent />,
  Investment: <InvestmentContent />,
  Insurance: <InsuranceContent />,
};

const features = [
  'Free equity delivery trades',
  'Free direct mutual funds',
  'Free account opening',
  'No AMC for demat account',
  'Flat ₹20 for intraday & F&O',
  'Advanced trading platforms',
  'In-depth reports & analytics',
  'Dedicated support',
];

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<PricingTab>('Trading');

  return (
    <Layout>
      <SEOHead
        title="Pricing"
        description="Simple and transparent pricing — free equity delivery, flat ₹20 intraday and F&O trades at SERNET."
        path="/pricing"
      />
      <PageHero
        title="Simple, transparent"
        highlight="pricing"
        description="We pioneered the concept of discount broking and price transparency in India. No hidden charges, ever."
        
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {pricingTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="pricing-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-sernet">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-foreground mb-8">What you get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {features.map((feature, index) => (
                <motion.div key={feature} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-body">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-section-alt">
        <div className="container-sernet">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <h2 className="heading-lg text-foreground mb-4">Open an account</h2>
            <p className="text-body mb-8">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
            <Link to="/signup" className="btn-primary">Sign up for free</Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
