
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// All public routes grouped by section
const sitePages: { section: string; pages: { title: string; path: string; description: string; status: 'live' | 'beta' | 'hidden' }[] }[] = [
  {
    section: 'Main',
    pages: [
      { title: 'Home', path: '/', description: 'Hero, Stats, Pricing, Testimonials, Ecosystem', status: 'live' },
      { title: 'Services', path: '/services', description: 'Trading, Investment, Insurance, Estate Planning, Education, Credit Counselling', status: 'live' },
      { title: 'Pricing', path: '/pricing', description: 'Zero brokerage pricing plans', status: 'live' },
      { title: 'Open Account', path: '/open-account', description: 'Account opening flow', status: 'live' },
    ],
  },
  {
    section: 'About',
    pages: [
      { title: 'About (Company)', path: '/about?tab=Company', description: 'Company overview, journey, philosophy', status: 'live' },
      { title: 'Careers', path: '/about?tab=Careers', description: 'Job openings & team', status: 'live' },
      { title: 'Press & Media', path: '/about?tab=Press', description: 'Press mentions & featured coverage', status: 'live' },
      { title: 'Recognition', path: '/about?tab=Recognition', description: 'Awards & achievements', status: 'live' },
      { title: 'Reviews', path: '/about?tab=Reviews', description: 'Client testimonials', status: 'live' },
    ],
  },
  {
    section: 'Network',
    pages: [
      { title: 'Network', path: '/network', description: 'Clients, Partners, Principals', status: 'live' },
      { title: 'Tick Funds', path: '/tickfunds', description: 'Tick Funds product page', status: 'live' },
      { title: 'Tushil', path: '/tushil', description: 'Tushil platform page', status: 'live' },
      { title: 'Choice FinX', path: '/choicefinx', description: 'Choice FinX product page', status: 'live' },
      { title: 'Findemy', path: '/findemy', description: 'Findemy product page', status: 'live' },
    ],
  },
  {
    section: 'Insights',
    pages: [
      { title: 'Z-Connect (Insights Hub)', path: '/z-connect', description: 'Articles, Analysis, Reports, Bulletin', status: 'live' },
      { title: 'Article Detail', path: '/z-connect/articles/:id', description: 'Individual article view', status: 'live' },
      { title: 'Updates', path: '/updates', description: 'News & Circulars', status: 'live' },
      { title: 'Videos', path: '/videos', description: 'Video library', status: 'live' },
      { title: 'Trading Q&A', path: '/tradingqna', description: 'Trading questions and answers', status: 'live' },
    ],
  },
  {
    section: 'Tools',
    pages: [
      { title: 'Calculators Hub', path: '/calculators', description: 'All calculators landing page', status: 'live' },
      { title: 'SIP Calculator', path: '/calculators/sip', description: 'SIP returns calculator', status: 'live' },
      { title: 'Lumpsum Calculator', path: '/calculators/lumpsum', description: 'Lumpsum returns calculator', status: 'live' },
      { title: 'Brokerage Calculator', path: '/calculators/brokerage', description: 'Brokerage fee calculator', status: 'live' },
      { title: 'Margin Calculator', path: '/calculators/margin', description: 'Margin requirement calculator', status: 'live' },
      { title: 'Market Overview', path: '/market-overview', description: 'Live market data widget', status: 'live' },
      { title: 'Calendars', path: '/calendars', description: 'Economic & corporate calendars', status: 'live' },
      { title: 'Market Holidays', path: '/market-holidays', description: 'Exchange holiday list', status: 'live' },
      { title: 'Economic Calendar', path: '/economic-calendar', description: 'Macro economic events', status: 'live' },
    ],
  },
  {
    section: 'Engagement',
    pages: [
      { title: 'Opinions', path: '/opinions', description: 'Polls & Surveys', status: 'live' },
      { title: 'Reviews', path: '/reviews', description: 'All public reviews', status: 'live' },
    ],
  },
  {
    section: 'Support & Contact',
    pages: [
      { title: 'Contact', path: '/contact', description: 'Ask Us, Schedule Call, Visit Us', status: 'live' },
      { title: 'Support / Help Desk', path: '/support', description: 'Help desk & ticket submission', status: 'live' },
      { title: 'Quick Links', path: '/quick-links', description: 'Broker quick links', status: 'live' },
      { title: 'Schedule Call', path: '/schedule-call', description: 'Book a consultation call', status: 'live' },
      { title: 'Fund Transfer', path: '/fund-transfer', description: 'Fund transfer instructions', status: 'live' },
      { title: 'Complaints', path: '/complaints', description: 'Lodge a complaint', status: 'live' },
      { title: 'Complaint Status', path: '/complaints/status', description: 'Check complaint status', status: 'live' },
      { title: 'Credit Claim', path: '/credit-claim', description: 'Credit claim form', status: 'live' },
    ],
  },
  {
    section: 'Legal & Compliance',
    pages: [
      { title: 'Terms & Conditions', path: '/terms', description: 'Terms of service', status: 'live' },
      { title: 'Privacy Policy', path: '/privacy', description: 'Privacy & data handling', status: 'live' },
      { title: 'Policies', path: '/policies', description: 'All policies', status: 'live' },
      { title: 'Disclosures', path: '/disclosure', description: 'SEBI mandatory disclosures', status: 'live' },
      { title: 'Investor Charter', path: '/investor-charter', description: 'SEBI investor charter', status: 'live' },
      { title: 'Signup', path: '/signup', description: 'Account signup form', status: 'live' },
      { title: 'Sitemap', path: '/sitemap', description: 'Full site directory', status: 'live' },
    ],
  },
  {
    section: 'Downloads & Media',
    pages: [
      { title: 'Downloads', path: '/downloads', description: 'Apps & document downloads', status: 'live' },
      { title: 'CSR', path: '/csr', description: 'Corporate social responsibility', status: 'live' },
      { title: 'Technology', path: '/tech', description: 'Technology & infrastructure', status: 'live' },
      { title: 'Media', path: '/media', description: 'Media & press gallery', status: 'live' },
      { title: 'Philosophy', path: '/about/philosophy', description: 'Investment philosophy', status: 'live' },
    ],
  },
];

const allSections = ['All', ...sitePages.map(s => s.section)];

export default function AdminSitePages() {
  const [activeTab, setActiveTab] = useState('All');
  const baseUrl = window.location.origin;

  const displayedSections = activeTab === 'All' ? sitePages : sitePages.filter(s => s.section === activeTab);
  const totalPages = sitePages.reduce((sum, s) => sum + s.pages.length, 0);

  return (
    <AdminLayout
      title="Site & Pages"
      subtitle={`Complete page directory — ${totalPages} pages across ${sitePages.length} sections`}
    >
      {/* Section tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1">
          {allSections.map(s => (
            <TabsTrigger key={s} value={s} className="text-xs px-3 py-1.5">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-6">
          {displayedSections.map(section => (
            <div key={section.section}>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                {section.section}
                <Badge variant="secondary" className="text-xs font-normal">{section.pages.length} pages</Badge>
              </h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Page</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Path</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Description</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-20">Status</th>
                      <th className="px-4 py-2.5 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {section.pages.map(page => (
                      <tr key={page.path} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{page.path}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{page.description}</td>
                        <td className="px-4 py-3">
                          <Badge variant={page.status === 'live' ? 'default' : page.status === 'beta' ? 'secondary' : 'outline'}>
                            {page.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => window.open(`${baseUrl}${page.path.replace(':id', 'sample')}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" /> Visit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
