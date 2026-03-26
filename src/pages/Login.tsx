
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logAudit } from '@/lib/auditLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, ArrowLeft, Shield, User, Briefcase, Users } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { useToast } from '@/hooks/use-toast';

interface DetectedRole {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<DetectedRole[]>([]);
  const [showChooser, setShowChooser] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoles([]);
    setShowChooser(false);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message?.toLowerCase().includes('email not confirmed')) {
        setError('Your email is not confirmed. Please check your inbox or contact support.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const detectedRoles: DetectedRole[] = [];

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (roleData) {
      detectedRoles.push({
        key: 'admin',
        label: 'Admin Panel',
        description: `Signed in as ${roleData.role.replace('_', ' ')}`,
        icon: <Shield className="h-5 w-5" />,
        route: '/admin',
      });
    }

    // Check portal profile (client/partner)
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type, status')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (profile) {
      if (profile.status === 'pending_approval') {
        // Don't add — show message instead if it's the only role
      } else if (profile.status === 'suspended') {
        // Don't add
      } else if (profile.user_type === 'client') {
        detectedRoles.push({
          key: 'client',
          label: 'Client Portal',
          description: 'Manage your portfolio & support',
          icon: <User className="h-5 w-5" />,
          route: '/portal',
        });
      } else if (profile.user_type === 'partner') {
        detectedRoles.push({
          key: 'partner',
          label: 'Partner Portal',
          description: 'Commissions, payouts & reports',
          icon: <Briefcase className="h-5 w-5" />,
          route: '/portal/partner',
        });
      }
    }

    // Check employee record
    const { data: employee } = await supabase
      .from('employees')
      .select('id, full_name, status')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (employee && employee.status === 'active') {
      detectedRoles.push({
        key: 'employee',
        label: 'Employee Portal',
        description: 'Attendance, leave & payslips',
        icon: <Users className="h-5 w-5" />,
        route: '/employee',
      });
    }

    // No roles found
    if (detectedRoles.length === 0) {
      if (profile?.status === 'pending_approval') {
        await supabase.auth.signOut();
        setError('Your account is pending approval. We\'ll notify you once approved.');
      } else if (profile?.status === 'suspended') {
        await supabase.auth.signOut();
        setError('Your account has been suspended. Please contact support.');
      } else {
        await supabase.auth.signOut();
        setError('No active account found. Please sign up or contact support.');
      }
      setLoading(false);
      return;
    }

    // Single role — auto-route
    if (detectedRoles.length === 1) {
      if (detectedRoles[0].key === 'admin') {
        logAudit({ action: 'login', entity_type: 'auth', details: { role: roleData?.role } });
      }
      toast({ title: 'Welcome back!', description: detectedRoles[0].description });
      navigate(detectedRoles[0].route);
      return;
    }

    // Multiple roles — show chooser
    setRoles(detectedRoles);
    setShowChooser(true);
    setLoading(false);
  };

  const handleRoleSelect = (role: DetectedRole) => {
    if (role.key === 'admin') {
      logAudit({ action: 'login', entity_type: 'auth', details: { role: 'admin', via: 'chooser' } });
    }
    toast({ title: 'Welcome back!', description: role.description });
    navigate(role.route);
  };

  if (showChooser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={sernetLogo} alt="SERNET" className="h-10 mx-auto mb-4 object-contain" />
            <h1 className="text-xl font-semibold text-foreground">Choose Your Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">You have access to multiple portals</p>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleRoleSelect(role)}
                className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {role.icon}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{role.label}</h3>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setShowChooser(false);
                setRoles([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Sign out &amp; use another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src={sernetLogo} alt="SERNET" className="h-10 mx-auto mb-4 object-contain" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your SERNET account</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/portal/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to website
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          SERNET India · Secure Access
        </p>
      </div>
    </div>
  );
}
