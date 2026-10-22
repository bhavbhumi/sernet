import { APP_LINKS, KYC_LINKS, TICKFUNDS_LINKS, TUSHIL_LINKS } from '@/lib/appLinks';

export const onboardingTabs = ['invest', 'insure', 'trade', 'other'] as const;
export type OnboardingTab = (typeof onboardingTabs)[number];

export const tabLabels: Record<OnboardingTab, string> = {
  invest: 'Invest',
  insure: 'Insure',
  trade: 'Trade',
  other: 'Other Services',
};

export const investorTypes = ['Individual', 'HUF', 'NRI', 'Minor', 'Non-individual'] as const;

export const interestOptions = [
  { value: 'invest', label: 'Investments (Tick Funds)' },
  { value: 'insure', label: 'Insurance (Tushil)' },
  { value: 'trade', label: 'Trading (Choice FinX)' },
  { value: 'bonds', label: 'Bonds (Altifi)' },
  { value: 'pms', label: 'PMS' },
  { value: 'aif', label: 'AIF' },
  { value: 'estate', label: 'Estate Planning' },
  { value: 'credit', label: 'Credit Counselling' },
  { value: 'tax_planning', label: 'Tax Planning' },
  { value: 'tax_filing', label: 'Tax Filing (Quicko)' },
  { value: 'notarisation', label: 'NRI Documentation Notarisation' },
  { value: 'ckyc', label: 'KYC help' },
] as const;

export interface OnboardingLink { label: string; href: string; primary?: boolean }
export interface OnboardingStep { title: string; text?: string; links?: OnboardingLink[] }
export interface OnboardingSection { heading: string; intro: string; steps?: OnboardingStep[]; interest?: string; links?: OnboardingLink[]; note?: string }
export interface OnboardingTabContent { heading: string; intro: string; steps: OnboardingStep[]; note: string; sections?: OnboardingSection[] }

export const defaultInterests = (tab: OnboardingTab): string[] => tab === 'other' ? [] : [tab];

export const kycChecks: OnboardingLink[] = [
  { label: 'Check your KYC status (CVL KRA)', href: KYC_LINKS.KRA_STATUS },
  { label: 'Check your CKYC number (CKYC India)', href: KYC_LINKS.CKYC_NUMBER },
  { label: 'Check your FATCA status (CAMS)', href: KYC_LINKS.FATCA_STATUS },
  { label: 'Verify PAN–Aadhaar link status (CVL)', href: KYC_LINKS.PAN_AADHAAR_STATUS },
  { label: 'Link your PAN with Aadhaar (Income Tax portal)', href: KYC_LINKS.PAN_AADHAAR_LINK },
];

export const tabContent: Record<OnboardingTab, OnboardingTabContent> = {
  invest: {
    heading: 'Start investing with Tick Funds',
    sections: [
      { heading: 'Bonds through Altifi', intro: 'Open your account with Northern Arc Securities Private Limited (NASPL) on Altifi, then coordinate your bond purchase with your SERNET relationship manager.', interest: 'bonds', steps: [
        { title: 'Create your Altifi account', text: 'Use your name as shown on PAN, mobile number and email.', links: [{ label: 'Open an Altifi account', href: 'https://altifi.ai/sign_up', primary: true }] },
        { title: 'Log in and complete KYC on Altifi', text: 'Log in with your mobile OTP. Keep PAN, Aadhaar, bank account and IFSC, and demat account details ready.' },
        { title: 'Coordinate your purchase', text: 'After account activation, contact your relationship manager for the selected bond, exact amount and current provider payment instructions.' },
      ], note: 'Activation and demat credit depend on provider verification and settlement. Bonds carry credit, interest-rate and liquidity risks. Use verified transaction-specific payment instructions only.' },
      { heading: 'Portfolio Management Services (PMS)', intro: 'Explore PMS from empanelled managers with your relationship manager. The provider handles eligibility checks, documentation and account opening.', interest: 'pms' },
      { heading: 'Alternative Investment Funds (AIF)', intro: 'For eligible investors, our team can coordinate introductions to AIF partners and the provider’s documentation process.', interest: 'aif' },
    ],
    intro: 'Invest in regular mutual funds and SIF on Tick Funds, with support from a SERNET relationship manager.',
    steps: [
      { title: 'Make sure your KYC is done', links: [{ label: 'Complete Digital CKYC', href: KYC_LINKS.UTI_CKYC }] },
      { title: 'Sign up on Tick Funds', links: [{ label: 'Sign up on Tick Funds', href: TICKFUNDS_LINKS.SIGNUP, primary: true }] },
      { title: 'Or use the mobile app', links: [{ label: 'Google Play', href: TICKFUNDS_LINKS.PLAY_STORE }, { label: 'App Store', href: TICKFUNDS_LINKS.APP_STORE }] },
    ],
    note: 'SERNET is an AMFI-registered Mutual Fund Distributor (ARN 35275) and earns commissions from fund houses. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.',
  },
  other: {
    heading: 'Other services',
    intro: 'Connect with our team for estate planning, credit counselling and tax-planning enquiries, or continue to Quicko for tax filing.',
    steps: [],
    sections: [
      { heading: 'Estate Planning', intro: 'Share your will, trust or succession-planning requirements. Our team will coordinate the next steps with the service partner.', interest: 'estate' },
      { heading: 'Credit Counselling', intro: 'Request help understanding your credit report, repayment concerns or credit-report disputes. Outcomes and loan approvals are not guaranteed.', interest: 'credit' },
      { heading: 'Tax Planning', intro: 'Share your tax-planning enquiry and our team will discuss the appropriate next steps.', interest: 'tax_planning' },
      { heading: 'Tax Filing through Quicko', intro: 'Continue to Quicko Infosoft Pvt Ltd for tax filing using the SERNET referral link.', links: [{ label: 'Continue to Quicko', href: 'https://www.quicko.com?ref=sernetfspl', primary: true }], interest: 'tax_filing', note: 'Confirm with Quicko whether your residency status and filing requirements are supported, especially for NRI cases. SERNET does not perform the filing.' },
    ],
    note: 'For NRI Documentation Notarisation, select the checkbox in Express your interest. Service availability, documentation and charges are confirmed before proceeding; do not submit sensitive documents through this form.',
  },
  insure: {
    heading: 'Get insured with Tushil',
    intro: 'Compare and buy insurance on Tushil. Policies are arranged by Shrigoda Insurance Brokers; SERNET is the referrer.',
    steps: [
      { title: 'Log in or sign up on Tushil', links: [{ label: 'Continue on Tushil', href: TUSHIL_LINKS.LOGIN, primary: true }] },
      { title: 'Need help choosing a cover?', text: 'Share your interest and our team will call you back.' },
    ],
    note: 'SERNET is not an insurer or insurance broker. Insurance is solicited by Shrigoda Insurance Brokers, who may pay SERNET a referral fee. Insurance is the subject matter of solicitation.',
  },
  trade: {
    heading: 'Start trading with Choice FinX',
    intro: 'Open your trading and demat account with Choice Equity Broking, with SERNET as its partner. Delivery 0.30% and intraday 0.03% on both legs for clients onboarded through SERNET.',
    steps: [
      { title: 'Open your account', links: [{ label: 'Open a Choice FinX account', href: APP_LINKS.OPEN_ACCOUNT, primary: true }] },
      { title: 'Already a client?', links: [{ label: 'Log in to Choice FinX', href: APP_LINKS.LOGIN }] },
    ],
    note: 'Choice Equity Broking Pvt. Ltd. (SEBI Reg. No. INZ000160131) is the stock broker; SERNET is not a stock broker. Investments in securities market are subject to market risks. Statutory charges and GST are extra.',
  },
};

export const isOnboardingTab = (v: string | null): v is OnboardingTab =>
  !!v && (onboardingTabs as readonly string[]).includes(v);
