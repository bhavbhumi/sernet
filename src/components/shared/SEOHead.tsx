import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const FALLBACK_SITE_NAME = 'SERNET Financial Services';
const FALLBACK_BASE_URL = 'https://sernetindia.com';

export const SEOHead = ({ title, description, path = '/', type = 'website', jsonLd }: SEOHeadProps) => {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.identity?.schema_org_name || FALLBACK_SITE_NAME;
  const baseUrl = settings?.identity?.site_url || FALLBACK_BASE_URL;
  const ogImageUrl = settings?.branding?.og_image_url || 'https://sernetindia.com/og-image.png';

  const rawTitle = `${title} | ${siteName}`;
  const fullTitle = rawTitle.length > 60 ? rawTitle.slice(0, 57) + '…' : rawTitle;
  const url = `${baseUrl}${path}`;

  const socialLinks = settings?.identity
    ? [
        settings.identity.social_instagram,
        settings.identity.social_youtube,
        settings.identity.social_linkedin,
        settings.identity.social_facebook,
      ].filter(Boolean)
    : [
        'https://www.instagram.com/sernetfspl',
        'https://www.youtube.com/@sernetfspl',
        'https://www.linkedin.com/company/sernetfspl/',
        'https://www.facebook.com/sernetfspl/',
      ];

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': settings?.identity?.schema_org_type || 'FinancialService',
    name: siteName,
    url: baseUrl,
    description: settings?.identity?.seo_description || description,
    foundingDate: '1989',
    areaServed: settings?.identity?.country || 'India',
    ...(settings?.identity?.schema_address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.identity.schema_address,
        addressRegion: settings.identity.region,
        addressCountry: settings.identity.country,
      },
    }),
    ...(settings?.identity?.schema_phone && {
      telephone: settings.identity.schema_phone,
    }),
    sameAs: socialLinks,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

      {settings?.identity?.seo_keywords && (
        <meta name="keywords" content={settings.identity.seo_keywords} />
      )}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};
