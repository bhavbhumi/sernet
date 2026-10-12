import { Scale, Shield, FileText, BadgeCheck, MessageSquare } from 'lucide-react';

export const legalTabs = [
  { key: 'terms', label: 'Terms & Conditions', icon: Scale, description: 'Terms governing use of our website and distribution services.' },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield, description: 'How personal information is collected, used and protected.' },
  { key: 'policies', label: 'Policies & Procedures', icon: FileText, description: 'Our approach to distribution, investor onboarding and service requests.' },
  { key: 'disclosures', label: 'Disclosures', icon: BadgeCheck, description: 'Our registrations, product empanelments, commission schedules and investment risk disclosures.' },
  { key: 'grievances', label: 'Grievance Redressal', icon: MessageSquare, description: 'Contact, escalation and product-specific complaint channels.' },
] as const;

export type LegalTabKey = typeof legalTabs[number]['key'];

export const distributorRegistrations = [
  { authority: 'AMFI', role: 'Mutual Fund Distributor', registration: 'ARN 35275', euin: 'E025145', validUntil: '28 October 2028' },
  { authority: 'APMI', role: 'PMS Distributor', registration: 'APRN 10097', euin: 'E19955', validUntil: '28 October 2028' },
] as const;

export const distributorScope = 'SERNET is an AMFI-registered mutual fund distributor and an APMI-registered PMS distributor. SERNET is not a stock broker, Research Analyst (RA) or Registered Investment Adviser (RIA).';