import { ServiceOverview } from './ServiceOverview';
import { TUSHIL_LINKS } from '@/lib/appLinks';

export const InsuranceServiceContent = () => (
  <ServiceOverview
    partner="Through Shrigoda Insurance Brokers"
    title="Insurance with Tushil"
    intro="Compare life, health, motor and other policies on Tushil. SERNET refers you to Shrigoda Insurance Brokers, an IRDAI-registered broker, who places and services your policy."
    points={[
      'Policies from 10+ insurers through our broker partner',
      'Life, health, motor, travel, home and group cover',
      'Claims help coordinated with the broker',
      'No charge to you; SERNET earns a referral fee from the broker',
    ]}
    learnMore={{ label: 'Explore Tushil', to: '/tushil' }}
    primaryCta={{ label: 'Open Tushil', href: TUSHIL_LINKS.WEB, external: true }}
    disclaimer="Insurance is the subject matter of solicitation. SERNET is not an insurer, insurance broker or corporate agent; it refers clients to Shrigoda Insurance Brokers, an IRDAI-registered insurance broker, and may receive a referral fee. Policies are issued by the insurer and claims are decided by the insurer. Read the policy terms and exclusions carefully before buying."
  />
);
