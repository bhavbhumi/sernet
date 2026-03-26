
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeSession {
  userId: string;
  email: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  employeeCode: string | null;
  photoUrl: string | null;
  dateOfJoining: string | null;
  /** Whether this user also has admin access */
  hasAdminAccess: boolean;
}

interface EmployeeContextValue {
  session: EmployeeSession | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextValue>({ session: null, loading: true, refreshProfile: async () => {} });

export const useEmployeeSession = () => useContext(EmployeeContext);

export function EmployeeGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (!authSession) {
      navigate('/login');
      setLoading(false);
      return;
    }

    const { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', authSession.user.id)
      .maybeSingle();

    if (!employee || employee.status !== 'active') {
      navigate('/login');
      setLoading(false);
      return;
    }

    // Check if also admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authSession.user.id)
      .maybeSingle();

    setSession({
      userId: authSession.user.id,
      email: authSession.user.email || employee.email || '',
      employeeId: employee.id,
      fullName: employee.full_name,
      department: employee.department,
      designation: employee.designation,
      employeeCode: employee.employee_code,
      photoUrl: employee.photo_url,
      dateOfJoining: employee.date_of_joining,
      hasAdminAccess: !!roleData,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();

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
          <p className="text-sm text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <EmployeeContext.Provider value={{ session, loading, refreshProfile: loadProfile }}>
      {children}
    </EmployeeContext.Provider>
  );
}
