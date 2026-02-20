
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard, FileText, BarChart3, BookOpen, Bell, Newspaper, AlertCircle,
  Vote, ClipboardList, Star, Briefcase, Users, Mic2, Settings, LogOut,
  ChevronDown, ChevronRight, Menu, X, Rss, Shield, Globe, Map, Palette, Type, ScanSearch, Images, Download
} from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  {
    label: 'Content', icon: BookOpen, children: [
      { label: 'Articles', icon: FileText, href: '/admin/content/articles' },
      { label: 'Import Articles', icon: Download, href: '/admin/content/import' },
      { label: 'Analysis', icon: BarChart3, href: '/admin/content/analysis' },
      { label: 'Reports', icon: BookOpen, href: '/admin/content/reports' },
      { label: 'Bulletin', icon: Bell, href: '/admin/content/bulletin' },
    ]
  },
  {
    label: 'Updates', icon: Rss, children: [
      { label: 'News', icon: Newspaper, href: '/admin/updates/news' },
      { label: 'Circulars', icon: AlertCircle, href: '/admin/updates/circulars' },
    ]
  },
  {
    label: 'Engagement', icon: Vote, children: [
      { label: 'Polls', icon: Vote, href: '/admin/engagement/polls' },
      { label: 'Surveys', icon: ClipboardList, href: '/admin/engagement/surveys' },
      { label: 'Reviews', icon: Star, href: '/admin/engagement/reviews' },
    ]
  },
  {
    label: 'Careers', icon: Briefcase, children: [
      { label: 'Job Openings', icon: Briefcase, href: '/admin/careers/openings' },
      { label: 'Applications', icon: Users, href: '/admin/careers/applications' },
      { label: 'Team Members', icon: Users, href: '/admin/careers/team' },
    ]
  },
  { label: 'Press & Media', icon: Mic2, href: '/admin/press' },
  {
    label: 'Site', icon: Globe, children: [
      { label: 'Site Settings', icon: Palette, href: '/admin/site/settings' },
      { label: 'Page Directory', icon: ScanSearch, href: '/admin/site/pages' },
      { label: 'Media Library', icon: Images, href: '/admin/site/media' },
    ]
  },
  {
    label: 'Settings', icon: Settings, children: [
      { label: 'RSS Feeds', icon: Rss, href: '/admin/settings/rss' },
      { label: 'CMS Source', icon: Settings, href: '/admin/settings/cms-source' },
      { label: 'Admin Users', icon: Shield, href: '/admin/settings/users' },
    ]
  },
];

function NavItemComponent({ item, collapsed, depth = 0 }: { item: NavItem; collapsed: boolean; depth?: number }) {
  const location = useLocation();
  const isActive = item.href ? location.pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some(c => c.href && location.pathname.startsWith(c.href));
  const [open, setOpen] = useState(isChildActive ?? false);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
            isChildActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-3">
            {item.children!.map(child => (
              <NavItemComponent key={child.href} item={child} collapsed={collapsed} depth={depth + 1} />
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
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function AdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn('flex items-center border-b border-border p-4', collapsed ? 'justify-center' : 'gap-3')}>
        {!collapsed && <img src={sernetLogo} alt="SERNET" className="h-7 object-contain" />}
        {!collapsed && <span className="text-xs font-medium text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">CMS</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hidden md:block"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItemComponent key={item.label} item={item} collapsed={collapsed} />
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
        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">CMS</span>
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
            <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100%-57px)]">
              {navItems.map((item) => (
                <NavItemComponent key={item.label} item={item} collapsed={false} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 bg-background border-r border-border transition-all duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
