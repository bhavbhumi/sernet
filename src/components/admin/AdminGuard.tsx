
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  department: string | null;
  /** null = full access (super_admin), string[] = specific modules */
  allowedModules: string[] | null;
}

interface AdminContextValue {
  session: AdminSession | null;
  loading: boolean;
}

const AdminContext = createContext<AdminContextValue>({ session: null, loading: true });

export const useAdminSession = () => useContext(AdminContext);

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) {
        navigate('/login');
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: roleData } = await (supabase.from('user_roles') as any)
        .select('role, department')
        .eq('user_id', authSession.user.id)
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate('/login');
        setLoading(false);
        return;
      }

      // Fetch module-level permissions for non-super_admin users
      let allowedModules: string[] | null = null;
      if (roleData.role !== 'super_admin') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: permsData } = await (supabase.from('staff_permissions') as any)
          .select('allowed_modules')
          .eq('user_id', authSession.user.id)
          .maybeSingle();

        if (permsData?.allowed_modules?.length) {
          allowedModules = permsData.allowed_modules;
        } else {
          // No custom permissions set — grant all modules for their department by default
          allowedModules = null;
        }
      }

      setSession({
        userId: authSession.user.id,
        email: authSession.user.email || '',
        name: authSession.user.user_metadata?.name || '',
        role: roleData.role,
        department: roleData.department,
        allowedModules,
      });
      setLoading(false);
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminContext.Provider value={{ session, loading }}>
      {children}
    </AdminContext.Provider>
  );
}
