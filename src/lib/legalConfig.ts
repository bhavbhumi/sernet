import { Scale, Shield, FileText, BadgeCheck, MessageSquare } from 'lucide-react';

export const legalTabs = [
  { key: 'terms', label: 'Terms & Conditions', icon: Scale, description: 'Terms governing use of our website and distribution services.' },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield, description: 'How personal information is collected, used and protected.' },
  { key: 'policies', label: 'Policies & Procedures', icon: FileText, description: 'Our organisational Information Technology and Sales & Operations HR policies.' },
  { key: 'disclosures', label: 'Disclosures', icon: BadgeCheck, description: 'Our registrations, product empanelments, commission schedules and investment risk disclosures.' },
  { key: 'grievances', label: 'Grievance Redressal', icon: MessageSquare, description: 'Contact, escalation and product-specific complaint channels.' },
] as const;

export type LegalTabKey = typeof legalTabs[number]['key'];

export { distributorRegistrations, distributorScope } from './regulatoryIdentity';