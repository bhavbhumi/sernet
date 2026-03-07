
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logAudit } from '@/lib/auditLog';
import { useAdminSession } from '@/components/admin/AdminGuard';
import {
  LayoutDashboard, FileText, BarChart3, BookOpen, Bell, Newspaper, AlertCircle, BookOpenCheck, Target,
  Vote, ClipboardList, Star, Briefcase, Users, Mic2, Settings, LogOut,
  ChevronDown, ChevronRight, Menu, X, Rss, Shield, Globe, Palette, ScanSearch, Images, Download,
  Sparkles, Calculator, UserCheck, CalendarDays, Mail, ScrollText, Scale, Lightbulb,
  TrendingUp, Building2, Gavel, Megaphone, Headphones, Ticket, BookMarked, MessageSquareText, Zap,
  Contact, CalendarClock, Clock, Receipt, Wallet, Lock, KeyRound, Activity, ExternalLink, PanelLeftClose, PanelLeftOpen,
  Database, MonitorDot
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import sernetLogo from '@/assets/sernet-logo.png';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { toast } from 'sonner';

const R = ADMIN_ROUTES;

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
  badge?: string;
  moduleKey?: string; // maps to staff_permissions.allowed_modules
}

interface DepartmentGroup {
  department: string;
  departmentKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: NavItem[];
}

const departmentGroups: DepartmentGroup[] = [
  {
    department: 'System',
    departmentKey: 'system',
    icon: Settings,
    color: 'text-muted-foreground',
    items: [
      { label: 'Master Data', icon: Database, href: R.settings.masterData, moduleKey: 'system/master-data' },
      { label: 'Users & Access', icon: Shield, href: R.settings.users, moduleKey: 'system/admin-users' },
      { label: 'Monitor', icon: MonitorDot, href: '/admin/settings/monitor', moduleKey: 'system/monitor' },
    ]
  },
  {
    department: 'Marketing',
    departmentKey: 'marketing',
    icon: Megaphone,
    color: 'text-blue-500',
    items: [
      {
        label: 'Content Studio', icon: BookOpen, moduleKey: 'marketing/content-studio', children: [
          { label: 'Articles', icon: FileText, href: R.marketing.content.articles },
          { label: 'Analysis', icon: BarChart3, href: R.marketing.content.analysis },
          { label: 'Awareness', icon: Lightbulb, href: R.marketing.content.awareness },
          { label: 'Reports', icon: BookOpen, href: R.marketing.content.reports },
          { label: 'Bulletin', icon: Bell, href: R.marketing.content.bulletin },
          { label: 'Import Articles', icon: Download, href: R.marketing.content.import },
        ]
      },
      {
        label: 'News & Updates', icon: Rss, moduleKey: 'marketing/news-updates', children: [
          { label: 'News', icon: Newspaper, href: R.marketing.updates.news },
          { label: 'Circulars', icon: AlertCircle, href: R.marketing.updates.circulars },
        ]
      },
      {
        label: 'Engagement', icon: Vote, moduleKey: 'marketing/engagement', children: [
          { label: 'Polls', icon: Vote, href: R.marketing.engagement.polls },
          { label: 'Surveys', icon: ClipboardList, href: R.marketing.engagement.surveys },
          { label: 'Reviews', icon: Star, href: R.marketing.engagement.reviews },
          { label: 'Subscribers', icon: Mail, href: R.marketing.engagement.newsletter },
          { label: 'Composer', icon: Mail, href: R.marketing.engagement.composer },
        ]
      },
      {
        label: 'Campaigns', icon: Target, moduleKey: 'marketing/campaigns', children: [
          { label: 'Campaign Tracker', icon: Target, href: R.marketing.campaigns.tracker },
          { label: 'Lead Attribution', icon: TrendingUp, href: R.marketing.campaigns.attribution },
          { label: 'Events & Webinars', icon: CalendarDays, href: R.marketing.campaigns.events },
        ]
      },
      { label: 'Press & Media', icon: Mic2, href: R.marketing.press, moduleKey: 'marketing/press-media' },
      {
        label: 'Calendars', icon: CalendarDays, moduleKey: 'marketing/calendars', children: [
          { label: 'Market Holidays', icon: CalendarDays, href: R.marketing.calendars.holidays },
          { label: 'Economic Events', icon: BarChart3, href: R.marketing.calendars.economic },
          { label: 'Import Economic', icon: Download, href: R.marketing.calendars.importEconomic },
          { label: 'Corporate Events', icon: Briefcase, href: R.marketing.calendars.corporate },
        ]
      },
      {
        label: 'Website', icon: Globe, moduleKey: 'marketing/website', children: [
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
        label: 'CRM', icon: Briefcase, moduleKey: 'sales/crm', children: [
          { label: 'Leads', icon: UserCheck, href: R.sales.leads },
          { label: 'Contacts', icon: Users, href: R.sales.contacts },
          { label: 'Deals & Pipeline', icon: BarChart3, href: R.sales.deals },
        ]
      },
    ]
  },
  {
    department: 'HR',
    departmentKey: 'hr',
    icon: Building2,
    color: 'text-orange-500',
    items: [
      {
        label: 'Recruitment', icon: Briefcase, moduleKey: 'hr/recruitment', children: [
          { label: 'Job Openings', icon: Briefcase, href: R.hr.careers.openings },
          { label: 'Applications', icon: Users, href: R.hr.careers.applications },
          { label: 'Team Members', icon: Contact, href: R.hr.careers.team },
        ]
      },
      {
        label: 'Personnel', icon: Contact, moduleKey: 'hr/personnel', children: [
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
      { label: 'Invoices', icon: Receipt, href: R.accounts.invoices, moduleKey: 'accounts/invoices' },
      { label: 'Payroll Register', icon: Wallet, href: R.accounts.payroll, moduleKey: 'accounts/payroll' },
      { label: 'Partner Payouts', icon: Wallet, href: R.accounts.partnerPayouts, moduleKey: 'accounts/partner-payouts' },
      { label: 'Commission Claims', icon: Receipt, href: R.accounts.commissionClaims, moduleKey: 'accounts/commission-claims' },
    ]
  },
  {
    department: 'Support',
    departmentKey: 'support',
    icon: Headphones,
    color: 'text-cyan-500',
    items: [
      { label: 'Tickets', icon: Ticket, href: R.support.tickets, moduleKey: 'support/tickets' },
      {
        label: 'Classification', icon: Shield, moduleKey: 'support/classification', children: [
          { label: 'Issue Types', icon: ClipboardList, href: R.support.issueTypes },
          { label: 'Escalation & Rules', icon: Zap, href: R.support.escalation },
        ]
      },
      { label: 'Knowledge Base', icon: BookMarked, href: R.support.knowledgeBase, moduleKey: 'support/knowledge-base' },
      { label: 'Documents', icon: FileText, href: R.support.documents, moduleKey: 'support/documents' },
      { label: 'Canned Responses', icon: MessageSquareText, href: R.support.cannedResponses, moduleKey: 'support/canned-responses' },
    ]
  },
  {
    department: 'Legal & Compliance',
    departmentKey: 'legal',
    icon: Gavel,
    color: 'text-violet-500',
    items: [
      { label: 'Legal Pages', icon: Scale, href: R.legal.pages, moduleKey: 'legal/legal-pages' },
      { label: 'Investor Charter', icon: BookOpenCheck, href: R.legal.investorCharter, moduleKey: 'legal/investor-charter' },
      { label: 'Agreements', icon: Scale, href: R.legal.agreements, moduleKey: 'legal/agreements' },
    ]
  },
];

/** Get all module keys for a department */
function getDepartmentModuleKeys(departmentKey: string): string[] {
  const group = departmentGroups.find(g => g.departmentKey === departmentKey);
  if (!group) return [];
  const keys: string[] = [];
  for (const item of group.items) {
    if (item.moduleKey) keys.push(item.moduleKey);
  }
  return keys;
}

/** Check if a module is allowed for current user */
function isModuleAllowed(
  moduleKey: string | undefined,
  session: { role: string; department: string | null; allowedModules: string[] | null } | null
): boolean {
  if (!session || !moduleKey) return true;
  if (session.role === 'super_admin') return true;
  // If no explicit permissions set, fall back to department-based access
  if (!session.allowedModules) return true;
  return session.allowedModules.includes(moduleKey);
}

const NavItemComponent = React.memo(function NavItemComponent({
  item, collapsed, depth = 0, locked = false
}: {
  item: NavItem; collapsed: boolean; depth?: number; locked?: boolean;
}) {
  const location = useLocation();
  const isActive = item.href ? location.pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some(c =>
    c.href ? location.pathname === c.href :
    c.children?.some(gc => gc.href && location.pathname === gc.href)
  );
  const [open, setOpen] = useState(isChildActive ?? false);

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.error('Access restricted', { description: 'You don\'t have permission to access this module. Contact your admin.' });
  };

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={locked ? handleLockedClick : () => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors',
            locked ? 'text-muted-foreground/50 cursor-not-allowed' :
            isChildActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {locked ? (
                <Lock className="h-3 w-3 text-muted-foreground/40" />
              ) : (
                open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              )}
            </>
          )}
        </button>
        {open && !collapsed && !locked && (
          <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2.5">
            {item.children!.map(child => (
              <NavItemComponent key={child.href || child.label} item={child} collapsed={collapsed} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (locked) {
    return (
      <button
        onClick={handleLockedClick}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground/50 cursor-not-allowed"
      >
        <item.icon className="h-3.5 w-3.5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            <Lock className="h-3 w-3 text-muted-foreground/40" />
          </>
        )}
      </button>
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

const DepartmentSection = React.memo(function DepartmentSection({
  group, collapsed, session
}: {
  group: DepartmentGroup; collapsed: boolean;
  session: { role: string; department: string | null; allowedModules: string[] | null } | null;
}) {
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
            <NavItemComponent
              key={item.href || item.label}
              item={item}
              collapsed={collapsed}
              locked={!isModuleAllowed(item.moduleKey, session)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export { departmentGroups, getDepartmentModuleKeys };

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAdminSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await logAudit({ action: 'logout', entity_type: 'auth' });
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const isDashboard = location.pathname === '/admin';

  // All departments are visible, but individual modules show lock icons
  const visibleGroups = departmentGroups.filter(group => {
    if (!session) return false;
    // Super admins see everything
    if (session.role === 'super_admin') return true;
    // System and Monitor sections only for super_admin
    if (group.departmentKey === 'system' || group.departmentKey === 'monitor') return false;
    // Everyone else sees all departments (with locks on restricted modules)
    return true;
  });

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header — matches right-side page header height */}
      <div className={cn('flex items-center border-b border-border h-[53px] px-4 shrink-0', collapsed ? 'justify-center' : 'gap-3')}>
        {!collapsed && <img src={sernetLogo} alt="SERNET" className="h-7 object-contain" />}
        {!collapsed && <span className="text-xs font-medium text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>}
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
        {visibleGroups.map((group) => (
          <DepartmentSection key={group.department} group={group} collapsed={collapsed} session={session} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-1">
            {/* User info */}
            <div className="flex-1 min-w-0 px-2">
              {session && !collapsed && (
                <>
                  <p className="text-xs font-medium text-foreground truncate">{session.name || session.email}</p>
                  <p className="text-[10px] text-muted-foreground capitalize truncate">{session.role.replace('_', ' ')}{session.department ? ` · ${session.department}` : ''}</p>
                </>
              )}
            </div>
            {/* Action icons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  target="_blank"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top"><span>View Site</span></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top"><span>Sign Out</span></TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
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
                {visibleGroups.map((group) => (
                  <DepartmentSection key={group.department} group={group} collapsed={false} session={session} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 bg-background border-r border-border transition-all duration-200 relative',
        collapsed ? 'w-14' : 'w-60'
      )}>
        {sidebarContent}
        {/* Collapse toggle — overlapping the sidebar edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[15px] z-40 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
        </button>
      </aside>
    </>
  );
}
