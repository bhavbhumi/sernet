
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield, Pencil, UserCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface EnrichedUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  department: string | null;
  role_id: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', desc: 'Full access + user management' },
  { value: 'admin', label: 'Admin', desc: 'Full CMS access by department' },
  { value: 'editor', label: 'Editor', desc: 'Content creation only' },
];

const DEPARTMENTS = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'support', label: 'Support' },
  { value: 'legal', label: 'Legal & Compliance' },
];

const roleColors: Record<string, string> = {
  super_admin: 'bg-primary/10 text-primary border-primary/20',
  admin: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  editor: 'bg-muted text-muted-foreground border-border',
};

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<EnrichedUser | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('editor');
  const [formDepartment, setFormDepartment] = useState('');
  const [saving, setSaving] = useState(false);

  const callManageUsers = async (payload: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const res = await supabase.functions.invoke('manage-users', {
      body: payload,
    });

    if (res.error) throw new Error(res.error.message || 'Edge function error');
    if (res.data?.error) throw new Error(res.data.error);
    return res.data;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await callManageUsers({ action: 'list_users' });
      setUsers(data.users || []);
    } catch (err: any) {
      toast({ title: 'Error loading users', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setCurrentUserId(session.user.id);
    });
    fetchUsers();
  }, []);

  const openCreateDialog = () => {
    setEditUser(null);
    setFormName(''); setFormEmail(''); setFormPassword('');
    setFormRole('editor'); setFormDepartment('');
    setDialogOpen(true);
  };

  const openEditDialog = (user: EnrichedUser) => {
    setEditUser(user);
    setFormName(user.name || '');
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role || 'editor');
    setFormDepartment(user.department || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editUser) {
        // Update role/department
        await callManageUsers({
          action: 'update_role',
          user_id: editUser.id,
          role: formRole,
          department: formDepartment || null,
        });

        // Update password/metadata if changed
        const updatePayload: Record<string, unknown> = { action: 'update_user', user_id: editUser.id };
        if (formPassword) updatePayload.password = formPassword;
        if (formName !== editUser.name) updatePayload.user_metadata = { name: formName };
        if (formPassword || formName !== editUser.name) {
          await callManageUsers(updatePayload);
        }

        toast({ title: 'User updated', description: `${formEmail} role set to ${formRole}` });
      } else {
        if (!formEmail || !formPassword) {
          toast({ title: 'Email and password required', variant: 'destructive' });
          setSaving(false);
          return;
        }
        await callManageUsers({
          action: 'create_user',
          email: formEmail,
          password: formPassword,
          name: formName,
          role: formRole,
          department: formDepartment || null,
        });
        toast({ title: 'User created', description: `${formEmail} added as ${formRole}` });
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleDelete = async (user: EnrichedUser) => {
    if (user.id === currentUserId) {
      toast({ title: 'Cannot delete yourself', variant: 'destructive' });
      return;
    }
    if (!confirm(`Remove ${user.name || user.email}? This cannot be undone.`)) return;
    try {
      await callManageUsers({ action: 'delete_user', user_id: user.id });
      toast({ title: 'User removed' });
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <AdminLayout
      title="Users & Access Control"
      subtitle="Manage admin users, roles and department-level access"
      actions={<Button onClick={openCreateDialog} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add User</Button>}
    >
      {/* Role Legend */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Access Levels</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {ROLES.map(r => (
            <div key={r.value} className="p-3 bg-muted/30 rounded-lg">
              <Badge variant="outline" className={roleColors[r.value]}>{r.label}</Badge>
              <p className="text-xs text-muted-foreground mt-2">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            Active Users ({users.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No users found.</p>
        ) : (
          <div className="divide-y divide-border">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {getInitials(user.name, user.email)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name || 'Unnamed User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {user.department && (
                    <Badge variant="outline" className="text-xs capitalize">{user.department}</Badge>
                  )}
                  <Badge variant="outline" className={roleColors[user.role || ''] || ''}>
                    {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Editor'}
                  </Badge>
                  {user.last_sign_in_at && (
                    <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(user.last_sign_in_at), 'dd MMM, HH:mm')}
                    </span>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(user)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {user.id !== currentUserId && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(user)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input placeholder="e.g. Urwashi Jivani" value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            {!editUser && (
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" placeholder="user@sernetindia.com" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{editUser ? 'New Password (leave blank to keep current)' : 'Password *'}</Label>
              <Input type="password" placeholder="Min. 8 characters" value={formPassword} onChange={e => setFormPassword(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role *</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={formDepartment} onValueChange={setFormDepartment}>
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editUser ? 'Update' : 'Create User'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
