
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { useToast } from '@/hooks/use-toast';

export default function PortalLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    if (data.user) {
      // Check if user has a portal profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, status')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (!profile) {
        // Not a portal user — might be admin
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: roleData } = await (supabase.from('user_roles') as any)
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (roleData) {
          // Admin user trying portal login — redirect to admin
          navigate('/admin');
          return;
        }

        await supabase.auth.signOut();
        setError('No account found. Please sign up first.');
        setLoading(false);
        return;
      }

      if (profile.status === 'pending_approval') {
        await supabase.auth.signOut();
        setError('Your account is pending approval. We\'ll notify you once approved.');
        setLoading(false);
        return;
      }

      if (profile.status === 'suspended') {
        await supabase.auth.signOut();
        setError('Your account has been suspended. Please contact support.');
        setLoading(false);
        return;
      }

      toast({ title: 'Welcome back!', description: `Signed in as ${profile.user_type}` });
      navigate('/portal');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src={sernetLogo} alt="SERNET" className="h-10 mx-auto mb-4 object-contain" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Client & Partner Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
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
          SERNET India · Secure Portal Access
        </p>
      </div>
    </div>
  );
}
