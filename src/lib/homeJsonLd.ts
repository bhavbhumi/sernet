import { companyHistory } from '@/lib/companyHistory';

/** Homepage structured data, shared by the server-rendered head and SEOHead. */
export const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SERNET Financial Services',
    url: 'https://sernetindia.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sernetindia.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'SERNET Financial Services',
    url: 'https://sernetindia.com',
    description: `Family financial-services practice ${companyHistory.familyLegacyLabel.toLowerCase()}; SERNET incorporated ${companyHistory.incorporationLabel}. Across 54 cities and 18 countries.`,
    foundingDate: companyHistory.incorporatedOn,
    areaServed: 'India',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: '10+' },
    telephone: '+91-920-676-7670',
    email: 'contact@sernetindia.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'A-412, Kanakia Wall Street, Andheri-Kurla Road, Chakala',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400093',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/sernetfspl',
      'https://www.youtube.com/@sernetfspl',
      'https://www.linkedin.com/company/sernetfspl/',
      'https://www.facebook.com/sernetfspl/',
    ],
  },
];
