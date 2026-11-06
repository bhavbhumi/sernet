import reliance from '@/assets/recognition/reliance-silver-partner-2009.webp.asset.json';
import fpsb from '@/assets/recognition/fpsb-finstitute-2010.webp.asset.json';
import iciciPartner from '@/assets/recognition/icici-preferred-partner-2012.webp.asset.json';
import iciciDecade from '@/assets/recognition/icici-dynamic-decade.webp.asset.json';
import hdfcLife from '@/assets/recognition/hdfc-life-premier-star-2016.webp.asset.json';
import uti2017 from '@/assets/recognition/uti-chairmans-club-2017.webp.asset.json';
import icici15 from '@/assets/recognition/icici-15-dynamic-years-2017.webp.asset.json';
import uti2018 from '@/assets/recognition/uti-chairmans-club-2018.webp.asset.json';
import maccia from '@/assets/recognition/maccia-member-2018.webp.asset.json';
import aafm from '@/assets/recognition/aafm-estate-planning-2019.webp.asset.json';
import idfc from '@/assets/recognition/idfc-financial-literacy-2022.webp.asset.json';
import franklin from '@/assets/recognition/franklin-30-years-2024.webp.asset.json';
import lt from '@/assets/recognition/lt-mf-partnership.webp.asset.json';
import swatantra from '@/assets/recognition/uti-swatantra.webp.asset.json';
import demat from '@/assets/recognition/six-crore-demat.webp.asset.json';

export type RecognitionKind = 'Award' | 'Partner appreciation' | 'Membership & credentials';

export interface RecognitionRecord {
  id: string;
  /** Text shown as the date; only what is printed on the record. */
  period: string;
  /** Sort key (year); undated records sort last. */
  sortYear: number | null;
  issuer: string;
  title: string;
  detail: string;
  kind: RecognitionKind;
  image: string;
  width: number;
  height: number;
}

/** Transcribed only from wording printed on each original certificate, plaque or trophy. */
export const recognitionRecords: RecognitionRecord[] = [
  { id: 'idfc-2022', period: 'October 2022', sortYear: 2022, issuer: 'IDFC Mutual Fund', title: 'Financial Literacy Champions Award', detail: 'Certificate of Appreciation “for championing efforts to spread financial literacy”.', kind: 'Award', image: idfc.url, width: 1200, height: 866 },
  { id: 'uti-2018', period: 'Chairman’s Club 2017–18 · June 2018', sortYear: 2018, issuer: 'UTI Mutual Fund', title: 'Chairman’s Club — Outstanding Performance', detail: 'Mumbai Region, in recognition of outstanding performance. Presented in Paris.', kind: 'Award', image: uti2018.url, width: 900, height: 1200 },
  { id: 'uti-2017', period: 'Chairman’s Club 2016–17 · June 2017', sortYear: 2017, issuer: 'UTI Mutual Fund', title: 'Chairman’s Club — Outstanding Performance', detail: 'Mumbai Region, for outstanding performance. Presented in Israel.', kind: 'Award', image: uti2017.url, width: 900, height: 1200 },
  { id: 'hdfc-life-2016', period: 'AY 2016–17', sortYear: 2016, issuer: 'HDFC Life', title: 'Premier Star — Star Performance Club', detail: 'Certificate of Appreciation awarded to Kiran Vora, Mumbai – Borivali Branch.', kind: 'Award', image: hdfcLife.url, width: 1200, height: 869 },
  { id: 'reliance-2009', period: 'Financial Year 2009', sortYear: 2009, issuer: 'Reliance Mutual Fund', title: 'Silver Partner — Forever Together loyalty programme', detail: 'Recognised as a Silver Partner in the partner loyalty programme.', kind: 'Award', image: reliance.url, width: 939, height: 1200 },
  { id: 'franklin-2024', period: '2024', sortYear: 2024, issuer: 'Franklin Templeton', title: '30 years of resilience — “My Stamp” memento', detail: 'Thanks distributor partners for being “an integral part of our 30-year journey”.', kind: 'Partner appreciation', image: franklin.url, width: 1198, height: 1200 },
  { id: 'icici-15-2017', period: '2002–2017', sortYear: 2017, issuer: 'ICICI Prudential Mutual Fund', title: 'Celebrating 15 Dynamic Years', detail: 'Thanks SERNET for its contribution towards ICICI Prudential Dynamic Plan.', kind: 'Partner appreciation', image: icici15.url, width: 900, height: 1200 },
  { id: 'icici-2012', period: '2012', sortYear: 2012, issuer: 'ICICI Prudential Mutual Fund', title: 'Preferred Partner plaque', detail: '“We value your association with us and thank you for being our preferred partner.”', kind: 'Partner appreciation', image: iciciPartner.url, width: 956, height: 1200 },
  { id: 'icici-decade', period: 'A Dynamic Decade', sortYear: 2012, issuer: 'ICICI Prudential Mutual Fund', title: 'Celebrating 10 — “I am Dynamic”', detail: 'Recognises SERNET’s contribution to ten years of ICICI Prudential Dynamic Plan.', kind: 'Partner appreciation', image: iciciDecade.url, width: 1004, height: 1200 },
  { id: 'lt', period: 'Date not stated', sortYear: null, issuer: 'L&T Mutual Fund', title: 'Thank you for your partnership', detail: 'Crystal memento signed by the CEO of L&T Financial Services Mutual Fund.', kind: 'Partner appreciation', image: lt.url, width: 900, height: 1200 },
  { id: 'swatantra', period: 'Date not stated', sortYear: null, issuer: 'UTI Mutual Fund', title: 'UTI Swatantra investor education initiative', detail: 'Framed feature with Bhavesh Vora’s ExpertSpeak column on financial planning steps.', kind: 'Partner appreciation', image: swatantra.url, width: 1200, height: 925 },
  { id: 'demat', period: 'Date not stated', sortYear: null, issuer: 'Issuer not named on memento', title: '6 crore demat accounts — “Empowering the Atmanirbhar Niveshak”', detail: '“Thank you for joining us in our journey and being a wonderful partner and well-wisher.”', kind: 'Partner appreciation', image: demat.url, width: 900, height: 1200 },
  { id: 'aafm-2019', period: '1 February 2019', sortYear: 2019, issuer: 'AAFM India', title: 'Estate Planning workshop certificate', detail: 'Bhavesh Vora completed a one-day workshop in Estate Planning (Reg. AAFMEP00785).', kind: 'Membership & credentials', image: aafm.url, width: 1200, height: 809 },
  { id: 'maccia-2018', period: '1 April 2018 – 31 March 2019', sortYear: 2018, issuer: 'Maharashtra Chamber of Commerce, Industry & Agriculture', title: 'Ordinary Member', detail: 'SERNET Financial Services Pvt. Ltd., Mumbai, approved as an Ordinary Member.', kind: 'Membership & credentials', image: maccia.url, width: 874, height: 1200 },
  { id: 'fpsb-2010', period: '10 June 2010 – 9 June 2011', sortYear: 2010, issuer: 'Financial Planning Standards Board India', title: 'Authorized Education Provider — CFP Certification', detail: 'Finstitute approved as an Authorized Education Provider for the CFP Certification Education Program in India.', kind: 'Membership & credentials', image: fpsb.url, width: 1200, height: 981 },
];
