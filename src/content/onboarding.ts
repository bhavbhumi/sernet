import { APP_LINKS, KYC_LINKS, TICKFUNDS_LINKS, TUSHIL_LINKS } from '@/lib/appLinks';

export const onboardingTabs = ['invest', 'insure', 'trade'] as const;
export type OnboardingTab = (typeof onboardingTabs)[number];

export const tabLabels: Record<OnboardingTab, string> = {
  invest: 'Invest',
  insure: 'Insure',
  trade: 'Trade',
};

export const investorTypes = ['Individual', 'HUF', 'NRI', 'Minor', 'Non-individual'] as const;

export const interestOptions = [
  { value: 'invest', label: 'Investments (Tick Funds)' },
  { value: 'insure', label: 'Insurance (Tushil)' },
  { value: 'trade', label: 'Trading (Choice FinX)' },
  { value: 'ckyc', label: 'KYC help' },
] as const;

export interface OnboardingLink { label: string; href: string; primary?: boolean }
export interface OnboardingStep { title: string; text?: string; links?: OnboardingLink[] }
export interface OnboardingTabContent { heading: string; intro: string; steps: OnboardingStep[]; note: string }

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
    intro: 'Invest in regular mutual funds and SIF on Tick Funds, with support from a SERNET relationship manager.',
    steps: [
      { title: 'Make sure your KYC is done', links: [{ label: 'Complete Digital CKYC', href: KYC_LINKS.UTI_CKYC }] },
      { title: 'Sign up on Tick Funds', links: [{ label: 'Sign up on Tick Funds', href: TICKFUNDS_LINKS.SIGNUP, primary: true }] },
      { title: 'Or use the mobile app', links: [{ label: 'Google Play', href: TICKFUNDS_LINKS.PLAY_STORE }, { label: 'App Store', href: TICKFUNDS_LINKS.APP_STORE }] },
    ],
    note: 'SERNET is an AMFI-registered Mutual Fund Distributor (ARN 35275) and earns commissions from fund houses. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.',
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
