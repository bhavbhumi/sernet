import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'SERNET Financial Services';
const BASE_URL = 'https://sernetindia.com';

export const SEOHead = ({ title, description, path = '/', type = 'website', jsonLd }: SEOHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE_NAME,
    url: BASE_URL,
    description,
    foundingDate: '1989',
    areaServed: 'India',
    sameAs: [
      'https://twitter.com/sernetindia',
      'https://instagram.com/sernetindia',
      'https://linkedin.com/company/sernetindia',
      'https://youtube.com/@sernetindia',
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};
