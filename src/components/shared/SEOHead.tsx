import { companyHistory } from '@/lib/companyHistory';
import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

type JsonLdInput = Record<string, unknown> | Array<Record<string, unknown>>;

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  jsonLd?: JsonLdInput;
  image?: string;
  /** Adds `robots: noindex, follow` (e.g. the not-found page). */
  noindex?: boolean;
}

const FALLBACK_SITE_NAME = 'SERNET Financial Services';
const FALLBACK_BASE_URL = 'https://sernetindia.com';

export const SEOHead = ({ title, description, path = '/', type = 'website', jsonLd, image, noindex = false }: SEOHeadProps) => {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.identity?.schema_org_name || FALLBACK_SITE_NAME;
  const baseUrl = settings?.identity?.site_url || FALLBACK_BASE_URL;
  const ogImageUrl = image || settings?.branding?.og_image_url || 'https://sernetindia.com/og-image.jpg';

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
    foundingDate: companyHistory.incorporatedOn,
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

  const keywords = settings?.identity?.seo_keywords || '';
  const jsonLdText = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd || defaultJsonLd]);

  // Server-rendered titles/share tags come from route head() (see src/lib/routeHead.ts);
  // this keeps the open document in sync after hydration and client navigation.
  useEffect(() => {
    const head = document.head;
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!content) {
        if (el?.dataset.seohead) el.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.dataset.seohead = '1';
        head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    document.title = fullTitle;
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:image', ogImageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:image', ogImageUrl);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    const isNonCanonicalHost = window.location.hostname.includes('lovable.app')
      || window.location.hostname.includes('lovableproject.com');
    setMeta('name', 'robots', isNonCanonicalHost ? 'noindex, nofollow' : noindex ? 'noindex, follow' : '');

    let canonical = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      head.appendChild(canonical);
    }
    canonical.href = url;

    head.querySelectorAll('script[data-seohead]').forEach((el) => el.remove());
    for (const block of JSON.parse(jsonLdText) as unknown[]) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seohead = '1';
      script.textContent = JSON.stringify(block);
      head.appendChild(script);
    }
  }, [fullTitle, description, url, type, siteName, ogImageUrl, keywords, noindex, jsonLdText]);

  return null;
};
