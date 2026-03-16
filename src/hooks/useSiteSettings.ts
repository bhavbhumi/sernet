import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IdentitySettings {
  site_name: string;
  tagline: string;
  site_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  schema_org_name: string;
  schema_org_type: string;
  schema_address: string;
  schema_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_youtube: string;
  social_whatsapp: string;
  social_telegram: string;
  country: string;
  region: string;
  timezone: string;
}

export interface HeaderSettings {
  cta_label: string;
  cta_url: string;
  show_cta_button: boolean;
  show_language_switcher: boolean;
  show_logo: boolean;
  show_nav: boolean;
  show_theme_toggle: boolean;
  sticky: boolean;
  height: number;
}

export interface FooterSettings {
  copyright_text: string;
  disclaimer: string;
  sebi_reg_text: string;
  show_legal_links: boolean;
  show_logo: boolean;
  show_newsletter: boolean;
  show_social_icons: boolean;
  show_tagline: boolean;
  show_sebi_reg: boolean;
}

export interface BrandingSettings {
  logo_url: string;
  logo_dark_url: string;
  favicon_url: string;
  og_image_url: string;
  primary_color_1: string;
  primary_color_2: string;
  secondary_color_1: string;
  secondary_color_2: string;
}

interface SiteSettings {
  identity: IdentitySettings;
  header: HeaderSettings;
  footer: FooterSettings;
  branding: BrandingSettings;
}

const DEFAULTS: SiteSettings = {
  identity: {
    site_name: 'SERNET',
    tagline: 'Unlock your path to Prosperity',
    site_url: 'https://sernetindia.com',
    seo_title: 'SERNET – Your Prosperity Companion',
    seo_description: 'SERNET offers competitive full service brokerage trading, investment and insurance products distribution under one roof.',
    seo_keywords: '',
    schema_org_name: 'SERNET Financial Services Pvt Ltd',
    schema_org_type: 'FinancialService',
    schema_address: '',
    schema_phone: '+919206767670',
    social_facebook: 'https://www.facebook.com/sernetfspl/',
    social_instagram: 'https://www.instagram.com/sernetfspl',
    social_linkedin: 'https://www.linkedin.com/company/sernetfspl/',
    social_twitter: '',
    social_youtube: 'https://www.youtube.com/@sernetfspl',
    social_whatsapp: 'https://wa.me/919206767670',
    social_telegram: 'https://t.me/sernetindia',
    country: 'India',
    region: 'MH',
    timezone: 'Asia/Kolkata',
  },
  header: {
    cta_label: 'Open Account',
    cta_url: '/open-account',
    show_cta_button: true,
    show_language_switcher: true,
    show_logo: true,
    show_nav: true,
    show_theme_toggle: true,
    sticky: true,
    height: 64,
  },
  footer: {
    copyright_text: '© 2026 SERNET. All rights reserved.',
    disclaimer: 'Investments in securities market are subject to market risks. Read all the related documents carefully before investing.',
    sebi_reg_text: 'SEBI Registered Investment Adviser',
    show_legal_links: true,
    show_logo: true,
    show_newsletter: false,
    show_social_icons: true,
    show_tagline: true,
    show_sebi_reg: true,
  },
  branding: {
    logo_url: '',
    logo_dark_url: '',
    favicon_url: '',
    og_image_url: '',
    primary_color_1: '#1B3F77',
    primary_color_2: '#1a56db',
    secondary_color_1: '#D4AF37',
    secondary_color_2: '#B8962E',
  },
};

async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['identity', 'header', 'footer', 'branding']);

  if (error || !data) return DEFAULTS;

  const map: Record<string, any> = {};
  for (const row of data) {
    map[row.key] = row.value;
  }

  return {
    identity: { ...DEFAULTS.identity, ...map.identity },
    header: { ...DEFAULTS.header, ...map.header },
    footer: { ...DEFAULTS.footer, ...map.footer },
    branding: { ...DEFAULTS.branding, ...map.branding },
  };
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 30 * 60 * 1000,
  });
}
