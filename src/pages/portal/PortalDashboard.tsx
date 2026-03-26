
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePortalSession } from '@/components/portal/PortalGuard';
import { PortalGuard } from '@/components/portal/PortalGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Ticket, LogOut, Shield, Phone, Mail, MapPin, Edit2, Save, X } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

function PortalDashboardContent() {
  const { session, refreshProfile } = usePortalSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '', phone: '', city: '', state: '', pan: '', gender: '', date_of_birth: '',
  });
  const [saving, setSaving] = useState(false);

  // Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setProfileForm({
        full_name: session.name,
        phone: session.phone,
        city: '', state: '', pan: '', gender: '', date_of_birth: '',
      });
      loadFullProfile();
      loadTickets();
    }
  }, [session]);

  const loadFullProfile = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.profileId)
      .single();
    if (data) {
      setProfileForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state || '',
        pan: data.pan || '',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || '',
      });
    }
  };

  const loadTickets = async () => {
    if (!session) return;
    setTicketsLoading(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('created_by', session.userId)
      .order('created_at', { ascending: false })
      .limit(20);
    setTickets(data || []);
    setTicketsLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!session) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        city: profileForm.city,
        state: profileForm.state,
        pan: profileForm.pan,
        gender: profileForm.gender,
        date_of_birth: profileForm.date_of_birth || null,
      })
      .eq('id', session.profileId);

    if (error) {
      toast({ title: 'Error saving profile', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
      setEditing(false);
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!session) return null;

  const kycColor = session.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-600' :
    session.kycStatus === 'submitted' ? 'bg-amber-500/10 text-amber-600' :
    'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><img src={sernetLogo} alt="SERNET" className="h-7 object-contain" /></Link>
            <Badge variant="outline" className="capitalize text-xs">{session.userType} Portal</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground hidden sm:block">{session.name}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Welcome, {session.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">Manage your profile, documents and support requests</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-4 w-4" /> Profile & KYC</TabsTrigger>
            <TabsTrigger value="tickets" className="gap-1.5"><Ticket className="h-4 w-4" /> Support Tickets</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                    {session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{session.name}</h3>
                    <p className="text-xs text-muted-foreground">{session.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={kycColor}>
                    <Shield className="h-3 w-3 mr-1" />
                    KYC: {session.kycStatus}
                  </Badge>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                        <Save className="h-3.5 w-3.5 mr-1" /> {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(false); loadFullProfile(); }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Full Name</Label>
                  {editing ? (
                    <Input value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.full_name || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</Label>
                  {editing ? (
                    <Input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.phone || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
                  <p className="text-sm text-foreground">{session.email}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">PAN</Label>
                  {editing ? (
                    <Input value={profileForm.pan} onChange={e => setProfileForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} placeholder="ABCDE1234F" maxLength={10} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.pan || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> City</Label>
                  {editing ? (
                    <Input value={profileForm.city} onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.city || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">State</Label>
                  {editing ? (
                    <Input value={profileForm.state} onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.state || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  {editing ? (
                    <Select value={profileForm.gender} onValueChange={v => setProfileForm(p => ({ ...p, gender: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-foreground capitalize">{profileForm.gender || '—'}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                  {editing ? (
                    <Input type="date" value={profileForm.date_of_birth} onChange={e => setProfileForm(p => ({ ...p, date_of_birth: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-foreground">{profileForm.date_of_birth ? format(new Date(profileForm.date_of_birth), 'dd MMM yyyy') : '—'}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Your Support Tickets</h3>
              <Link to="/support?tab=raise">
                <Button size="sm">Raise New Ticket</Button>
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl">
              {ticketsLoading ? (
                <div className="p-6 space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No tickets found. Need help? <Link to="/support?tab=raise" className="text-primary hover:underline">Raise a ticket</Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {tickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</span>
                          <Badge variant="outline" className={
                            ticket.status === 'open' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-muted text-muted-foreground'
                          }>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mt-1">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.product} · {format(new Date(ticket.created_at), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function PortalDashboard() {
  return (
    <PortalGuard>
      <PortalDashboardContent />
    </PortalGuard>
  );
}
