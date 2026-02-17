import { motion } from 'framer-motion';
import { Shield, TrendingUp, Landmark, Award, ArrowRight, Banknote, Heart, Coins, ScrollText, CreditCard, Scale, Check, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import networkPrincipalsImg from '@/assets/network-principals.webp';
import { AutoScrollShowcase, type ShowcaseItem } from './AutoScrollShowcase';
import { TieupFormDialog } from '@/components/shared/TieupFormDialog';

const principalStats = [
  { icon: Shield, value: '10+', label: 'Principal Partners' },
  { icon: Award, value: '500+', label: 'Products Available' },
  { icon: Landmark, value: '₹500Cr+', label: 'Assets Managed' },
];

const principalShowcaseItems: ShowcaseItem[] = [
  {
    icon: TrendingUp,
    title: 'Stock Broker & Depositories',
    subtitle: 'IPOs · Stocks · F&O · Commodities · Currencies · ETFs',
    detail: {
      heading: 'Choice Equity Broking Pvt. Ltd.',
      description: 'SERNET is a registered sub-broker under Choice Equity Broking Pvt. Ltd., a SEBI-registered full-service stockbroking firm offering trading and depository services across NSE, BSE, MCX, and NCDEX.',
      points: [
        'SEBI Registration No: INZ000160131 (Stock Broking)',
        'CDSL Depository Participant — IN-DP-529-2021',
        'Full-service broking: Equity delivery, Intraday, F&O, Commodity & Currency derivatives',
        'IPO applications, ETF investments, and portfolio tracking',
        'Disclaimer: Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance or provide any assurance of returns.',
      ],
    },
  },
  {
    icon: Landmark,
    title: 'Fund Houses',
    subtitle: 'Mutual Funds · SIFs · PMS · AIFs',
    detail: {
      heading: 'Regular Fund Distribution Services',
      description: 'SERNET is an AMFI-registered Mutual Fund Distributor (MFD) empanelled with leading Asset Management Companies for the regular distribution of mutual funds, Specialized Investment Funds (SIFs), PMS, and AIFs.',
      points: [
        'AMFI ARN No: ARN-274029 | Valid till: 22-Feb-2028',
        'APMI Membership for PMS distribution services',
        'Access to 5,000+ mutual fund schemes across 40+ AMCs (Regular Plans)',
        'SIF, PMS & AIF curated selection for HNI/UHNI investors',
        'Disclaimer: Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Past performance is not indicative of future returns. SERNET acts as a distributor and does not provide investment advisory services.',
      ],
    },
  },
  {
    icon: Heart,
    title: 'Insurance Companies',
    subtitle: 'Life · Health · Motor · Travel · Employee Benefits',
    detail: {
      heading: 'Srigoda Insurance Broking Services',
      description: 'Insurance products are distributed through Srigoda Insurance Broking Services, an IRDAI-licensed composite insurance broker offering life, health, general, and employee benefit solutions from leading insurers.',
      points: [
        'IRDAI Registration No: IRDA/DB/XXX/XX (Composite Broker)',
        'Insurance4life.in — Digital insurance platform by Srigoda',
        'Life, health, motor, travel, and critical illness coverage',
        'Group health and employee benefit schemes for corporates',
        'Disclaimer: Insurance is the subject matter of solicitation. IRDAI is not involved in activities like selling, endorsing or soliciting insurance. For more details on risk factors, please read the sales brochure carefully before concluding a sale.',
      ],
    },
  },
  {
    icon: Banknote,
    title: 'FD Issuers',
    subtitle: 'NBFC Company Fixed Deposits',
    detail: {
      heading: 'Corporate Fixed Deposit Distribution',
      description: 'SERNET distributes high-yield corporate fixed deposits from trusted NBFC companies, offering stable and predictable returns for conservative investors seeking alternatives to traditional bank FDs.',
      points: [
        'Curated NBFC FDs with competitive interest rates and CRISIL/ICRA ratings',
        'Flexible tenure options from 12 months to 60 months',
        'Cumulative and non-cumulative interest payout options',
        'Senior citizen additional interest rate benefits available',
        'Disclaimer: Corporate FDs are not insured by DICGC. Returns are subject to the creditworthiness of the issuing NBFC. Investors are advised to check the credit rating and financial health of the company before investing. RBI does not guarantee returns on NBFC deposits.',
      ],
    },
  },
  {
    icon: Award,
    title: 'OBPP Bond Broker',
    subtitle: 'GILT · SDL · Corporate Bonds',
    detail: {
      heading: 'Northern Arc Capital Ltd.',
      description: 'SERNET partners with Northern Arc Capital, a SEBI-registered Online Bond Platform Provider (OBPP), to offer listed retail debt securities including Government Securities (G-Sec), State Development Loans (SDLs), and corporate bonds.',
      points: [
        'SEBI-registered OBPP — Northern Arc Capital Ltd.',
        'Listed GILT securities, SDL bonds, and investment-grade corporate bonds',
        'Secondary market trading and liquidity for retail debt investors',
        'Tax-efficient bond structuring with monthly/quarterly payout options',
        'Disclaimer: Investments in debt securities are subject to credit risk, interest rate risk, and liquidity risk. Past performance is not indicative of future returns. Please read the offer document and risk disclosure carefully before investing in bonds.',
      ],
    },
  },
  {
    icon: Coins,
    title: 'Bullion Providers & Custodians',
    subtitle: 'Phygital Gold & Silver',
    detail: {
      heading: 'Augmont Gold Ltd.',
      description: 'SERNET enables digital and physical gold and silver investments through Augmont Gold, one of India\'s leading bullion dealers, refiners, and custodians with LBMA and BIS certifications.',
      points: [
        'Augmont Gold Ltd. — LBMA-certified refiner and custodian',
        'Buy, sell, and store 24K 999.9 purity gold and silver digitally',
        'Convert digital holdings to physical coins, bars, and jewellery',
        'Vault storage with full insurance and real-time pricing',
        'Disclaimer: Digital gold is not regulated by SEBI or RBI. The value of gold and silver is subject to market fluctuations. Investors should carefully evaluate the risks before making any purchase.',
      ],
    },
  },
  {
    icon: ScrollText,
    title: 'Estate Planners',
    subtitle: 'Will Writing · Family Trust Setup',
    detail: {
      heading: 'WillGenie',
      description: 'SERNET partners with WillGenie to offer professional estate planning services including legally valid will drafting, family trust creation, and succession planning for individuals and families.',
      points: [
        'Legally valid will writing compliant with Indian Succession Act',
        'Family trust setup and structuring for wealth preservation',
        'Nomination and beneficiary management advisory',
        'Executor appointment and estate administration guidance',
        'Advisory Note: Writing a will is a personal legal document. It is advisable to consult a qualified legal professional before finalizing. Trust structures should be evaluated for tax implications and family requirements.',
      ],
    },
  },
  {
    icon: CreditCard,
    title: 'Loan Aggregators',
    subtitle: 'LAMF · Loan Against Securities',
    detail: {
      heading: '50Fin',
      description: 'Through our partnership with 50Fin, SERNET facilitates Loan Against Mutual Funds (LAMF) and Loan Against Securities (LAS), enabling investors to unlock liquidity without liquidating their portfolio.',
      points: [
        '50Fin — RBI-regulated lending partner aggregator',
        'Loan Against Mutual Funds (LAMF) at competitive interest rates',
        'Loan Against Securities (LAS) including equities and bonds',
        'Quick digital processing with minimal documentation',
        'Disclaimer: Loans are subject to the terms and conditions of the lending partners. Borrowers should carefully assess their repayment capacity. Default on loan payments may result in liquidation of pledged securities. SERNET acts only as a referral partner.',
      ],
    },
  },
  {
    icon: Scale,
    title: 'Credit Counsellors',
    subtitle: 'Credit Repair for Individuals & Corporates',
    detail: {
      heading: 'Athena Credexpert',
      description: 'SERNET has partnered with Athena Credexpert to offer professional credit counselling and credit repair services for individuals and corporate entities looking to improve their credit health and financial standing.',
      points: [
        'Athena Credexpert — Certified credit counselling service',
        'CIBIL, Experian, CRIF, and Equifax score improvement programs',
        'Dispute resolution for incorrect entries and defaults',
        'Corporate credit health assessments and improvement strategies',
        'Disclaimer: Credit counselling is an advisory service and does not guarantee specific credit score improvements. Results vary based on individual credit history and circumstances. SERNET acts solely as a referral partner and is not responsible for outcomes.',
      ],
    },
  },
];

export const PrincipalsNetworkContent = () => (
  <>
    {/* Section 1 — Hero Split */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="heading-lg text-foreground mb-3">
              Backed by <span className="text-primary">strong principals</span>
            </h2>
            <p className="text-body max-w-lg mb-6">
              We operate under the authority of India&#39;s leading financial institutions, exchanges, and regulatory bodies — ensuring trust, compliance, and investor protection.
            </p>
            <ul className="space-y-2 mb-8">
              {['SEBI & IRDAI Regulated Partners', 'Multi-Product Financial Ecosystem', 'Full Compliance & Investor Protection'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/schedule-call" className="btn-primary inline-flex items-center">
                Schedule a Call <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <TieupFormDialog
                trigger={
                  <button className="btn-secondary inline-flex items-center">
                    Propose a Tieup <Handshake className="ml-2 h-4 w-4" />
                  </button>
                }
              />
            </div>
            {/* 3 Stats */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {principalStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-2.5">
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

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <img
              src={networkPrincipalsImg}
              alt="SERNET principals and regulators"
              className="w-full max-w-[480px] max-h-[400px] h-auto object-contain dark:bg-white dark:rounded-xl dark:p-3"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 — Auto-Scroll Showcase */}
    <AutoScrollShowcase
      sectionTitle="Our principals & products"
      sectionSubtitle="Licensed and empanelled with India's top financial product manufacturers."
      items={principalShowcaseItems}
    />

    {/* Compliance note */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="heading-md text-foreground mb-3">Fully Licensed & Compliant</h3>
          <p className="text-body text-sm max-w-xl mx-auto">
            SERNET operates with full regulatory compliance across all its business verticals — stock broking, mutual fund distribution, and insurance advisory. Your investments are always in safe hands.
          </p>
        </motion.div>
      </div>
    </section>
  </>
);
