
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AdminUser { user_id: string; role: string; email?: string; }

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('user_roles') as any).select('user_id, role').order('role');
    setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newEmail || !newPassword) {
      toast({ title: 'Email and password required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const { data, error } = await supabase.auth.signUp({ email: newEmail, password: newPassword });
    if (error || !data.user) {
      toast({ title: 'Error creating user', description: error?.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('user_roles') as any).insert([{ user_id: data.user.id, role: newRole }]);
    toast({ title: 'Admin user created', description: `${newEmail} has been added as ${newRole}` });
    setSaving(false);
    setDialogOpen(false);
    setNewEmail(''); setNewPassword(''); setNewRole('editor');
    fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Remove this admin user?')) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('user_roles') as any).delete().eq('user_id', userId);
    fetchUsers();
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-primary/10 text-primary',
    admin: 'bg-emerald-500/10 text-emerald-600',
    editor: 'bg-muted text-muted-foreground',
  };

  return (
    <AdminLayout
      title="Admin Users"
      subtitle="Manage who has access to the CMS admin panel"
      actions={<Button onClick={() => setDialogOpen(true)} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Admin</Button>}
    >
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Admin Access Levels</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          {[
            { role: 'super_admin', label: 'Super Admin', desc: 'Full access + can manage other admins' },
            { role: 'admin', label: 'Admin', desc: 'Full CMS access, cannot manage users' },
            { role: 'editor', label: 'Editor', desc: 'Can create and edit content only' },
          ].map(r => (
            <div key={r.role} className="p-3 bg-muted/30 rounded-lg">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[r.role]}`}>{r.label}</span>
              <p className="text-xs text-muted-foreground mt-2">{r.desc}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No admin users found.</p>
        ) : (
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.user_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {user.user_id.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">{user.user_id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={roleColors[user.role] ?? ''}>{user.role}</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(user.user_id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Admin User</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" placeholder="admin@sernetindia.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Temporary Password *</Label>
              <Input type="password" placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create User'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
