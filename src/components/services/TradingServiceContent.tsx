import { ServiceOverview } from './ServiceOverview';
import { APP_LINKS } from '@/lib/appLinks';

export const TradingServiceContent = () => (
  <ServiceOverview
    partner="Through Choice Equity Broking"
    title="Trading with Choice FinX"
    intro="Trade stocks, F&O, commodities and currency on Choice FinX, the app of Choice Equity Broking Pvt. Ltd. SERNET helps you open and service your account as Choice's Authorised Person."
    points={[
      'Delivery 0.30% and intraday 0.03% on both legs for clients onboarded through SERNET',
      'Free account opening and demat AMC',
      'Your trades, money and shares are handled by Choice',
      'Help from the SERNET team for account and service queries',
    ]}
    learnMore={{ label: 'Explore Choice FinX', to: '/choicefinx' }}
    primaryCta={{ label: 'Open account', href: APP_LINKS.OPEN_ACCOUNT, external: true }}
    disclaimer="Investments in securities market are subject to market risks. Read all related documents carefully before investing. Choice Equity Broking Pvt. Ltd. (SEBI Reg. No. INZ000160131) is the stock broker; SERNET is not a stock broker and acts as its Authorised Person. Statutory charges and GST are extra."
  />
);
