
import { AdminSidebar, getModuleKeyForPath, isModuleAllowed } from './AdminSidebar';
import { AdminGuard, useAdminSession } from './AdminGuard';
import { useLocation } from '@/lib/router-compat';
import { ShieldAlert } from 'lucide-react';

/** Blocks pages outside the user's allowed modules, even when opened by typing the address. */
function ModuleGate({ children }: { children: React.ReactNode }) {
  const { session } = useAdminSession();
  const { pathname } = useLocation();
  if (isModuleAllowed(getModuleKeyForPath(pathname), session)) return <>{children}</>;
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-3">
      <ShieldAlert className="h-8 w-8 text-muted-foreground" />
      <h2 className="text-base font-semibold text-foreground">Access restricted</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        You don't have permission to open this section. Ask an administrator to grant access.
      </p>
    </div>
  );
}
import { AdminMISRefresh } from './AdminMISRefresh';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminMISRefresh />
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Page Header */}
          <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 h-[53px] flex items-center mt-14 md:mt-0">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <ModuleGate>{children}</ModuleGate>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
