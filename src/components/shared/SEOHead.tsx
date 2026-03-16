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
  const rawTitle = `${title} | ${SITE_NAME}`;
  const fullTitle = rawTitle.length > 60 ? rawTitle.slice(0, 57) + '…' : rawTitle;
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
      'https://www.instagram.com/sernetfspl',
      'https://www.youtube.com/@sernetfspl',
      'https://www.linkedin.com/company/sernetfspl/',
      'https://www.facebook.com/sernetfspl/',
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content="https://sernetindia.com/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://sernetindia.com/og-image.png" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};
