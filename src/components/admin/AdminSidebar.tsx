
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logAudit } from '@/lib/auditLog';
import { useAdminSession } from '@/components/admin/AdminGuard';
import {
  LayoutDashboard, FileText, BarChart3, BookOpen, Bell, Newspaper, AlertCircle, BookOpenCheck,
  Vote, ClipboardList, Star, Briefcase, Users, Mic2, Settings, LogOut,
  ChevronDown, ChevronRight, Menu, X, Rss, Shield, Globe, Palette, ScanSearch, Images, Download,
  Sparkles, Calculator, UserCheck, CalendarDays, Mail, ScrollText, Scale, Lightbulb,
  TrendingUp, Building2, Gavel, Megaphone, Headphones, Ticket, BookMarked, MessageSquareText, Zap,
  Contact, CalendarClock, Clock, Receipt, Wallet
} from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';

const R = ADMIN_ROUTES;

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
  badge?: string;
}

interface DepartmentGroup {
  department: string;
  departmentKey: string; // maps to department enum
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: NavItem[];
}

const departmentGroups: DepartmentGroup[] = [
  {
    department: 'Marketing',
    departmentKey: 'marketing',
    icon: Megaphone,
    color: 'text-blue-500',
    items: [
      {
        label: 'Content Studio', icon: BookOpen, children: [
          { label: 'Articles', icon: FileText, href: R.marketing.content.articles },
          { label: 'Analysis', icon: BarChart3, href: R.marketing.content.analysis },
          { label: 'Awareness', icon: Lightbulb, href: R.marketing.content.awareness },
          { label: 'Reports', icon: BookOpen, href: R.marketing.content.reports },
          { label: 'Bulletin', icon: Bell, href: R.marketing.content.bulletin },
          { label: 'Import Articles', icon: Download, href: R.marketing.content.import },
        ]
      },
      {
        label: 'News & Updates', icon: Rss, children: [
          { label: 'News', icon: Newspaper, href: R.marketing.updates.news },
          { label: 'Circulars', icon: AlertCircle, href: R.marketing.updates.circulars },
        ]
      },
      {
        label: 'Engagement', icon: Vote, children: [
          { label: 'Polls', icon: Vote, href: R.marketing.engagement.polls },
          { label: 'Surveys', icon: ClipboardList, href: R.marketing.engagement.surveys },
          { label: 'Reviews', icon: Star, href: R.marketing.engagement.reviews },
          { label: 'Subscribers', icon: Mail, href: R.marketing.engagement.newsletter },
          { label: 'Composer', icon: Mail, href: R.marketing.engagement.composer },
        ]
      },
      { label: 'Press & Media', icon: Mic2, href: R.marketing.press },
      {
        label: 'Calendars', icon: CalendarDays, children: [
          { label: 'Market Holidays', icon: CalendarDays, href: R.marketing.calendars.holidays },
          { label: 'Economic Events', icon: BarChart3, href: R.marketing.calendars.economic },
          { label: 'Import Economic', icon: Download, href: R.marketing.calendars.importEconomic },
          { label: 'Corporate Events', icon: Briefcase, href: R.marketing.calendars.corporate },
        ]
      },
      {
        label: 'Website', icon: Globe, children: [
          { label: 'Site Settings', icon: Palette, href: R.marketing.site.settings },
          { label: 'Page Directory', icon: ScanSearch, href: R.marketing.site.pages },
          { label: 'Media Library', icon: Images, href: R.marketing.site.media },
        ]
      },
    ]
  },
  {
    department: 'Sales',
    departmentKey: 'sales',
    icon: TrendingUp,
    color: 'text-emerald-500',
    items: [
      {
        label: 'CRM', icon: UserCheck, children: [
          { label: 'Pipeline', icon: BarChart3, href: R.sales.pipeline },
          { label: 'Pipeline Config', icon: Settings, href: R.sales.pipelineConfig },
          { label: 'All Deals', icon: Briefcase, href: R.sales.deals },
          { label: 'Contacts', icon: Users, href: R.sales.contacts },
          { label: 'Activities', icon: ClipboardList, href: R.sales.activities },
          
        ]
      },
      { label: 'Website Leads', icon: UserCheck, href: R.sales.leads },
      { label: 'Calculator Leads', icon: Calculator, href: R.sales.calculatorLeads },
    ]
  },
  {
    department: 'HR',
    departmentKey: 'hr',
    icon: Building2,
    color: 'text-orange-500',
    items: [
      {
        label: 'Recruitment', icon: Briefcase, children: [
          { label: 'Job Openings', icon: Briefcase, href: R.hr.careers.openings },
          { label: 'Applications', icon: Users, href: R.hr.careers.applications },
          { label: 'Team Members', icon: Contact, href: R.hr.careers.team },
        ]
      },
      {
        label: 'Personnel', icon: Contact, children: [
          { label: 'Employees', icon: Contact, href: R.hr.employees },
          { label: 'Attendance', icon: Clock, href: R.hr.attendance },
          { label: 'Leave Management', icon: CalendarClock, href: R.hr.leave },
        ]
      },
    ]
  },
  {
    department: 'Accounts',
    departmentKey: 'accounts',
    icon: Wallet,
    color: 'text-amber-500',
    items: [
      {
        label: 'Masters', icon: Building2, children: [
          { label: 'Firm Profile', icon: Building2, href: R.accounts.firmProfile },
          { label: 'Tax Rates', icon: Receipt, href: R.accounts.taxRates },
          { label: 'Bank Accounts', icon: Wallet, href: R.accounts.bankAccounts },
          { label: 'Payment Terms', icon: Clock, href: R.accounts.paymentTerms },
          { label: 'Service Catalog', icon: ClipboardList, href: R.accounts.serviceCatalog },
          { label: 'Salary Components', icon: Users, href: R.accounts.salaryComponents },
        ]
      },
      { label: 'Invoices', icon: Receipt, href: R.accounts.invoices },
      { label: 'Payroll Register', icon: Wallet, href: R.accounts.payroll },
      { label: 'Partner Payouts', icon: Wallet, href: R.accounts.partnerPayouts },
      { label: 'Commission Claims', icon: Receipt, href: R.accounts.commissionClaims },
    ]
  },
  {
    department: 'Support',
    departmentKey: 'support',
    icon: Headphones,
    color: 'text-cyan-500',
    items: [
      { label: 'Tickets', icon: Ticket, href: R.support.tickets },
      {
        label: 'Classification', icon: Shield, children: [
          { label: 'Issue Types', icon: ClipboardList, href: R.support.issueTypes },
          { label: 'Escalation & Rules', icon: Zap, href: R.support.escalation },
        ]
      },
      { label: 'Knowledge Base', icon: BookMarked, href: R.support.knowledgeBase },
      { label: 'Documents', icon: FileText, href: R.support.documents },
      { label: 'Canned Responses', icon: MessageSquareText, href: R.support.cannedResponses },
    ]
  },
  {
    department: 'Legal & Compliance',
    icon: Gavel,
    color: 'text-violet-500',
    items: [
      { label: 'Legal Pages', icon: Scale, href: R.legal.pages },
      { label: 'Investor Charter', icon: BookOpenCheck, href: R.legal.investorCharter },
      { label: 'Agreements', icon: Scale, href: R.legal.agreements },
    ]
  },
  {
    department: 'System',
    icon: Settings,
    color: 'text-muted-foreground',
    items: [
      { label: 'Admin Users', icon: Shield, href: R.settings.users },
      { label: 'Workflows', icon: Zap, href: R.settings.workflows },
      { label: 'RSS Feeds', icon: Rss, href: R.settings.rss },
      { label: 'AI Usage', icon: Sparkles, href: R.settings.aiUsage },
      { label: 'Audit Log', icon: ScrollText, href: R.settings.auditLog },
    ]
  },
];

const NavItemComponent = React.memo(function NavItemComponent({ item, collapsed, depth = 0 }: { item: NavItem; collapsed: boolean; depth?: number }) {
  const location = useLocation();
  const isActive = item.href ? location.pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some(c =>
    c.href ? location.pathname === c.href :
    c.children?.some(gc => gc.href && location.pathname === gc.href)
  );
  const [open, setOpen] = useState(isChildActive ?? false);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors',
            isChildActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2.5">
            {item.children!.map(child => (
              <NavItemComponent key={child.href || child.label} item={child} collapsed={collapsed} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href!}
      className={cn(
        'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-3.5 w-3.5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
});

const DepartmentSection = React.memo(function DepartmentSection({ group, collapsed }: { group: DepartmentGroup; collapsed: boolean }) {
  const location = useLocation();

  const isAnyActive = (items: NavItem[]): boolean => {
    return items.some(item => {
      if (item.href && location.pathname === item.href) return true;
      if (item.children) return isAnyActive(item.children);
      return false;
    });
  };

  const active = isAnyActive(group.items);
  const [open, setOpen] = useState(active);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors',
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <group.icon className={cn('h-4 w-4 shrink-0', group.color)} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{group.department}</span>
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="mt-0.5 space-y-0.5 ml-1">
          {group.items.map((item) => (
            <NavItemComponent key={item.href || item.label} item={item} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
});

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await logAudit({ action: 'logout', entity_type: 'auth' });
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const isDashboard = location.pathname === '/admin';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn('flex items-center border-b border-border p-4', collapsed ? 'justify-center' : 'gap-3')}>
        {!collapsed && <img src={sernetLogo} alt="SERNET" className="h-7 object-contain" />}
        {!collapsed && <span className="text-xs font-medium text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hidden md:block"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Master Dashboard Link */}
      <div className="px-3 pt-3 pb-1">
        <Link
          to="/admin"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isDashboard
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Master Dashboard</span>}
        </Link>
      </div>

      {/* Department Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pt-1 pb-3 space-y-0.5">
        {departmentGroups.map((group) => (
          <DepartmentSection key={group.department} group={group} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-4 w-4 shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
        <img src={sernetLogo} alt="SERNET" className="h-7 object-contain" />
        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <img src={sernetLogo} alt="SERNET" className="h-7 object-contain" />
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-57px)]">
              <div className="px-3 pt-3 pb-1">
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isDashboard ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span>Master Dashboard</span>
                </Link>
              </div>
              <nav className="px-3 pt-1 pb-3 space-y-0.5">
                {departmentGroups.map((group) => (
                  <DepartmentSection key={group.department} group={group} collapsed={false} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 bg-background border-r border-border transition-all duration-200',
        collapsed ? 'w-14' : 'w-60'
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
