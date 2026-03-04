
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PortalSession {
  userId: string;
  email: string;
  name: string;
  userType: 'client' | 'partner';
  status: string;
  kycStatus: string;
  phone: string;
  profileId: string;
}

interface PortalContextValue {
  session: PortalSession | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const PortalContext = createContext<PortalContextValue>({ session: null, loading: true, refreshProfile: async () => {} });

export const usePortalSession = () => useContext(PortalContext);

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (!authSession) {
      navigate('/portal/login');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authSession.user.id)
      .maybeSingle();

    if (!profile) {
      // Maybe an admin user — redirect them
      await supabase.auth.signOut();
      navigate('/portal/login');
      setLoading(false);
      return;
    }

    if (profile.status === 'pending_approval' || profile.status === 'suspended') {
      await supabase.auth.signOut();
      navigate('/portal/login');
      setLoading(false);
      return;
    }

    setSession({
      userId: authSession.user.id,
      email: authSession.user.email || profile.email || '',
      name: profile.full_name || authSession.user.user_metadata?.name || '',
      userType: profile.user_type,
      status: profile.status,
      kycStatus: profile.kyc_status,
      phone: profile.phone || '',
      profileId: profile.id,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        navigate('/portal/login');
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
    <PortalContext.Provider value={{ session, loading, refreshProfile: loadProfile }}>
      {children}
    </PortalContext.Provider>
  );
}
