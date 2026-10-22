import { ServiceOverview } from './ServiceOverview';

export const TaxFilingServiceContent = () => (
  <ServiceOverview
    partner="Through Quicko Infosoft Pvt Ltd"
    title="Tax Filing with Quicko"
    intro="File your income tax return on Quicko, an online tax filing platform. SERNET refers you to Quicko, mainly for NRI clients; Quicko prepares and files the return with you."
    points={[
      'Online income tax return filing on Quicko',
      'Useful for NRIs with income or investments in India',
      'Check with Quicko that your residency status and filing needs are supported',
      'SERNET refers you and does not perform the filing',
    ]}
    learnMore={{ label: 'Continue to Quicko', to: '/open-account?tab=other' }}
    primaryCta={{ label: 'Open Quicko', href: 'https://www.quicko.com?ref=sernetfspl', external: true }}
    disclaimer="Tax filing services are provided by Quicko Infosoft Pvt Ltd. SERNET is not a tax adviser or chartered accountant and only refers clients to Quicko. Confirm eligibility and fees with Quicko before filing."
  />
);
