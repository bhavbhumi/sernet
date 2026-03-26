
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['client', 'partner']),
});

export default function PortalSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', userType: 'client' as 'client' | 'partner',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = signupSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + '/portal',
        data: {
          name: form.name,
          full_name: form.name,
          phone: form.phone,
          user_type: form.userType,
        },
      },
    });

    if (error) {
      setErrors({ email: error.message });
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <Link to="/" className="inline-block">
            <img src={sernetLogo} alt="SERNET" className="h-10 mx-auto mb-6 object-contain" />
          </Link>
          <div className="bg-card border border-border rounded-xl p-8">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Verify Your Email</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a verification link to <strong className="text-foreground">{form.email}</strong>.
              Please check your inbox and click the link to activate your account.
            </p>
            {form.userType === 'partner' && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 rounded-lg p-3 mb-4">
                Partner accounts require admin approval after email verification. We'll notify you once your account is activated.
              </p>
            )}
            <Link to="/login">
              <Button variant="outline" className="w-full">Go to Login</Button>
            </Link>
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
          <h1 className="text-xl font-semibold text-foreground">Create Your Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join SERNET as a Client or Partner</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Account Type */}
            <div className="space-y-1.5">
              <Label>I am a</Label>
              <Select value={form.userType} onValueChange={v => handleChange('userType', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">
                    <span className="font-medium">Client</span>
                    <span className="text-muted-foreground ml-1">— Invest & manage portfolio</span>
                  </SelectItem>
                  <SelectItem value="partner">
                    <span className="font-medium">Partner</span>
                    <span className="text-muted-foreground ml-1">— Business associate</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input
                placeholder="e.g. Rajesh Sharma"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                required
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                required
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  required
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
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/portal/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
