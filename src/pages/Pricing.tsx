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
            { price: '0.30%', title: 'Equity delivery', desc: '0.30% per executed delivery order on Choice FinX, the full-service broking app from Choice Equity Broking.' },
            { price: '0.03%', title: 'Equity intraday', desc: '0.03% per executed order on both buy and sell legs for intraday trades.' },
            { price: '₹0', title: 'Account opening', desc: 'Opening a trading and demat account on Choice FinX is free.' },
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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-4 text-center">Detailed charges</motion.h2>
        <p className="text-small text-center mb-12 max-w-2xl mx-auto">Share trading is provided on Choice FinX, the full-service broking app from Choice Equity Broking Private Limited. Brokerage shown applies to clients onboarded through SERNET and is levied by Choice Equity Broking as per its schedule; SERNET is not a stock broker.</p>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            { category: 'Equity', items: [{ name: 'Equity delivery', price: '0.30%', description: 'Per executed delivery order (NSE, BSE) on Choice FinX' }, { name: 'Equity intraday', price: '0.03%', description: 'Per executed order, charged on both buy and sell legs' }] },
            { category: 'Derivatives & other segments', items: [{ name: 'F&O, currency and commodity', price: 'As per schedule', description: 'Charged as per the Choice FinX schedule from Choice Equity Broking' }] },
            { category: 'Account', items: [{ name: 'Account opening', price: 'FREE', description: 'Opening a trading and demat account' }, { name: 'AMC', price: 'FREE', description: 'Annual maintenance charge' }] },
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
            { price: '₹0', title: 'Regular mutual funds', desc: 'No fees charged to you; we are paid commission by the fund house, disclosed under Disclosures.' },
            { price: '0.30%', title: 'Stocks (Delivery)', desc: 'Buy and hold stocks on Choice FinX at 0.30% per executed delivery order.' },
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
            { category: 'Mutual Funds', items: [{ name: 'Regular mutual funds', price: 'FREE', description: 'Zero fees to you, invest in 5000+ funds (distributor commission is paid by the fund house and included in the scheme expense ratio)' }, { name: 'SIP investments', price: 'FREE', description: 'Systematic investment plans at no cost' }] },
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
            { price: '₹0', title: 'No fees', desc: 'No fee charged to you; we earn a referral fee from Shrigoda Insurance Brokers.' },
            { price: '100%', title: 'Claim support', desc: 'Dedicated support throughout the claims process.' },
            { price: '10+', title: 'Insurers through Partner', desc: 'Policies from 10+ insurers via Shrigoda Insurance Brokers, our IRDAI-registered broker partner.' },
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
            { category: 'Life Insurance', items: [{ name: 'Term life insurance', price: 'No charge to you', description: 'Pure term plans from top insurers; we earn a referral fee from Shrigoda Insurance Brokers' }, { name: 'ULIPs', price: 'No charge to you', description: 'Unit-linked insurance plans; we earn a referral fee from Shrigoda Insurance Brokers' }] },
            { category: 'Health Insurance', items: [{ name: 'Individual health', price: 'No charge to you', description: 'Comprehensive health coverage; we earn a referral fee from Shrigoda Insurance Brokers' }, { name: 'Family floater', price: 'No charge to you', description: 'Coverage for the entire family; we earn a referral fee from Shrigoda Insurance Brokers' }] },
            { category: 'General Insurance', items: [{ name: 'Motor insurance', price: 'No charge to you', description: 'Car and bike insurance; we earn a referral fee from Shrigoda Insurance Brokers' }, { name: 'Travel insurance', price: 'No charge to you', description: 'Domestic and international travel cover; we earn a referral fee from Shrigoda Insurance Brokers' }] },
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
        <p className="text-small text-center mt-12 max-w-3xl mx-auto">Insurance is the subject matter of solicitation. SERNET is not an insurer, insurance broker or corporate agent; it refers clients to Shrigoda Insurance Brokers, an IRDAI-registered insurance broker, under a referral agreement and may receive a referral fee from the broker. Policies are sold, issued and serviced by the broker and insurer; claims are decided by the insurer. Read the policy document, terms, conditions and exclusions carefully before buying.</p>
      </div>
    </section>
  </>
);

const tabContent: Record<PricingTab, React.ReactNode> = {
  Trading: <TradingContent />,
  Investment: <InvestmentContent />,
  Insurance: <InsuranceContent />,
};

const tabFeatures: Record<PricingTab, string[]> = {
  Trading: [
    'Full-service broking via Choice FinX',
    'Free account opening',
    'No AMC for demat account',
    '0.30% delivery, 0.03% intraday',
    'Advanced trading platforms',
    'In-depth reports & analytics',
    'Dedicated support',
  ],
  Investment: [
    'Zero-fee regular mutual funds',
    '5,000+ funds from 40+ AMCs',
    'SIP, lumpsum and goal-based investing',
    'PMS, AIF, bonds and FDs via your RM',
    'Consolidated portfolio view',
    'Dedicated relationship manager',
  ],
  Insurance: [
    'Life, health and general insurance',
    'Policies from 10+ insurers',
    'Placed through Shrigoda Insurance Brokers',
    'No charge to you — we earn a referral fee',
    'Dedicated claim support',
    'Guidance from your relationship manager',
  ],
};

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<PricingTab>('Trading');

  return (
    <Layout>
      <SEOHead
        title="Pricing"
        description="Simple and transparent pricing — zero-fee regular mutual funds, and share trading on Choice FinX from Choice Equity Broking at 0.30% delivery and 0.03% intraday."
        path="/pricing"
      />
      <PageHero
        title="Simple, transparent"
        highlight="pricing"
        description="Clear pricing across every product. Share trading is provided on Choice FinX, the full-service broking app from Choice Equity Broking; SERNET is not a stock broker."
        
      />

      {/* Tab Navigation */}
      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
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
              {tabFeatures[activeTab].map((feature, index) => (
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
            <p className="text-body mb-8">Modern platforms and apps, zero-fee regular mutual funds, and share trading on Choice FinX at 0.30% delivery and 0.03% intraday.</p>
            <Link to="/signup" className="btn-primary">Sign up for free</Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
