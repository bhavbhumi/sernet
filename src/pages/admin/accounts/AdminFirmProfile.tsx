import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Building2, Save } from 'lucide-react';

const AdminFirmProfile = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    legal_name: '', trade_name: '', gstin: '', pan: '', cin: '',
    registered_address: '', city: '', state: '', pincode: '',
    phone: '', email: '', website: '', logo_url: '',
  });
  const [profileId, setProfileId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['firm-profile'],
    queryFn: async () => {
      const { data, error } = await supabase.from('firm_profile').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setProfileId(data.id);
      setForm({
        legal_name: data.legal_name || '',
        trade_name: data.trade_name || '',
        gstin: data.gstin || '',
        pan: data.pan || '',
        cin: data.cin || '',
        registered_address: data.registered_address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        logo_url: data.logo_url || '',
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (profileId) {
        const { error } = await supabase.from('firm_profile').update(form).eq('id', profileId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('firm_profile').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['firm-profile'] }); toast.success('Firm profile saved'); },
    onError: (e: any) => toast.error(e.message),
  });

  const set = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  return (
    <AdminLayout title="Firm Profile" subtitle="Company identity & registration details for invoices">
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Company Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Legal Name *</Label><Input value={form.legal_name} onChange={e => set('legal_name', e.target.value)} placeholder="e.g. SERNET Finserve Pvt Ltd" /></div>
              <div><Label>Trade Name</Label><Input value={form.trade_name} onChange={e => set('trade_name', e.target.value)} placeholder="e.g. SERNET" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>GSTIN</Label><Input value={form.gstin} onChange={e => set('gstin', e.target.value)} placeholder="22AAAAA0000A1Z5" /></div>
              <div><Label>PAN</Label><Input value={form.pan} onChange={e => set('pan', e.target.value)} placeholder="AAAAA0000A" /></div>
              <div><Label>CIN</Label><Input value={form.cin} onChange={e => set('cin', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Registered Address</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Address</Label><Textarea value={form.registered_address} onChange={e => set('registered_address', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>City</Label><Input value={form.city} onChange={e => set('city', e.target.value)} /></div>
              <div><Label>State</Label><Input value={form.state} onChange={e => set('state', e.target.value)} /></div>
              <div><Label>Pincode</Label><Input value={form.pincode} onChange={e => set('pincode', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact & Web</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><Label>Website</Label><Input value={form.website} onChange={e => set('website', e.target.value)} /></div>
            </div>
            <div><Label>Logo URL</Label><Input value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." /></div>
          </CardContent>
        </Card>

        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />{profileId ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminFirmProfile;
