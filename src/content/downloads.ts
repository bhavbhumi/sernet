import { APP_LINKS, TICKFUNDS_LINKS, TUSHIL_LINKS } from '@/lib/appLinks';

export const downloadsTabs = ['invest', 'insure', 'trade', 'other'] as const;
export type DownloadsTab = (typeof downloadsTabs)[number];

export const downloadsTabLabels: Record<DownloadsTab, string> = {
  invest: 'Invest',
  insure: 'Insure',
  trade: 'Trade',
  other: 'Other Services',
};

export interface DownloadDoc { name: string; note: string; href: string }
export interface DownloadSection { heading: string; docs: DownloadDoc[] }
export interface DownloadsTabContent { intro: string; sections: DownloadSection[] }

/** Sections with no documents are hidden until management supplies the files. */
export const downloadsContent: Record<DownloadsTab, DownloadsTabContent> = {
  invest: {
    intro: 'Forms, documents and apps for investing with Tick Funds and Altifi.',
    sections: [
      {
        heading: 'Apps',
        docs: [
          { name: 'Tick Funds Web', note: 'Open in browser', href: TICKFUNDS_LINKS.START_INVESTING },
          { name: 'Tick Funds for Android', note: 'Google Play', href: TICKFUNDS_LINKS.PLAY_STORE },
          { name: 'Tick Funds for iOS', note: 'App Store', href: TICKFUNDS_LINKS.APP_STORE },
        ],
      },
      {
        heading: 'Information',
        docs: [
          { name: 'Monthly Factsheets', note: 'Download from AMFI', href: 'https://www.amfiindia.com/online-center/download-factsheets' },
          { name: 'MF Scheme Master Documents', note: 'Download from SEBI', href: 'https://www.sebi.gov.in/filings/mutual-funds.html' },
        ],
      },
    ],
  },
  insure: {
    intro: 'Forms, documents and apps for insurance through Tushil.',
    sections: [
      {
        heading: 'Apps',
        docs: [
          { name: 'Tushil Web', note: 'Open in browser', href: TUSHIL_LINKS.WEB },
        ],
      },
    ],
  },
  trade: {
    intro: 'Forms, documents and apps for trading with Choice FinX.',
    sections: [
      {
        heading: 'Apps',
        docs: [
          { name: 'Choice FinX for Android', note: 'Google Play', href: APP_LINKS.PLAY_STORE },
          { name: 'Choice FinX for iOS', note: 'App Store', href: APP_LINKS.APP_STORE },
        ],
      },
    ],
  },
  other: {
    intro: 'Forms and documents for estate planning, credit counselling, tax filing and NRI documentation notarisation.',
    sections: [],
  },
};

export const isDownloadsTab = (v: string | null): v is DownloadsTab =>
  !!v && (downloadsTabs as readonly string[]).includes(v);

/** Legacy ?tab=apps and ?tab=documents links land on Invest. */
export const resolveDownloadsTab = (v: string | null): DownloadsTab =>
  isDownloadsTab(v) ? v : 'invest';
