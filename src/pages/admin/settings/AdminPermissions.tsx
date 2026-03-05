
import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { departmentGroups, getDepartmentModuleKeys } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Users, KeyRound, Save, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface StaffUser {
  user_id: string;
  role: string;
  department: string | null;
  email: string;
  name: string;
}

interface Preset {
  id: string;
  name: string;
  department: string;
  module_keys: string[];
  is_default: boolean;
}

interface StaffPermission {
  user_id: string;
  allowed_modules: string[];
  preset_id: string | null;
}

// All module keys across all departments (excluding system)
const ALL_MODULE_KEYS = departmentGroups
  .filter(g => g.departmentKey !== 'system')
  .flatMap(g => g.items.filter(i => i.moduleKey).map(i => ({
    key: i.moduleKey!,
    label: i.label,
    department: g.department,
    departmentKey: g.departmentKey,
  })));

export default function AdminPermissions() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [permissions, setPermissions] = useState<Record<string, StaffPermission>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editModules, setEditModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch staff users (from user_roles)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: roles } = await (supabase.from('user_roles') as any)
      .select('user_id, role, department')
      .in('role', ['admin', 'editor']);

    // Fetch presets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: presetsData } = await (supabase.from('permission_presets') as any)
      .select('*')
      .order('department');

    // Fetch all staff permissions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: permsData } = await (supabase.from('staff_permissions') as any)
      .select('user_id, allowed_modules, preset_id');

    // Build user list with emails from auth metadata
    const users: StaffUser[] = (roles || []).map((r: any) => ({
      user_id: r.user_id,
      role: r.role,
      department: r.department,
      email: '',
      name: '',
    }));

    // Fetch profiles for names/emails via manage-users edge function
    // For simplicity, we'll show user_id and role info
    // In production you'd join with a profiles table

    setStaffUsers(users);
    setPresets(presetsData || []);

    const permsMap: Record<string, StaffPermission> = {};
    for (const p of (permsData || [])) {
      permsMap[p.user_id] = p;
    }
    setPermissions(permsMap);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // When a user is selected, populate their current modules
  useEffect(() => {
    if (!selectedUserId) {
      setEditModules([]);
      return;
    }
    const perm = permissions[selectedUserId];
    if (perm?.allowed_modules?.length) {
      setEditModules([...perm.allowed_modules]);
    } else {
      // Default: grant all modules for their department
      const user = staffUsers.find(u => u.user_id === selectedUserId);
      if (user?.department) {
        setEditModules(getDepartmentModuleKeys(user.department));
      } else {
        setEditModules(ALL_MODULE_KEYS.map(m => m.key));
      }
    }
  }, [selectedUserId, permissions, staffUsers]);

  const toggleModule = (key: string) => {
    setEditModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setEditModules([...preset.module_keys]);
    }
  };

  const selectAllDept = (deptKey: string) => {
    const deptModules = getDepartmentModuleKeys(deptKey);
    setEditModules(prev => {
      const without = prev.filter(k => !k.startsWith(deptKey + '/'));
      return [...without, ...deptModules];
    });
  };

  const deselectAllDept = (deptKey: string) => {
    setEditModules(prev => prev.filter(k => !k.startsWith(deptKey + '/')));
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    setSaving(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('staff_permissions') as any)
      .upsert({
        user_id: selectedUserId,
        allowed_modules: editModules,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save permissions', { description: error.message });
    } else {
      toast.success('Permissions saved');
      setPermissions(prev => ({
        ...prev,
        [selectedUserId]: { user_id: selectedUserId, allowed_modules: editModules, preset_id: null },
      }));
    }
    setSaving(false);
  };

  const handleReset = async () => {
    if (!selectedUserId) return;
    setSaving(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('staff_permissions') as any)
      .delete()
      .eq('user_id', selectedUserId);

    setPermissions(prev => {
      const next = { ...prev };
      delete next[selectedUserId];
      return next;
    });

    // Reset to dept defaults
    const user = staffUsers.find(u => u.user_id === selectedUserId);
    if (user?.department) {
      setEditModules(getDepartmentModuleKeys(user.department));
    } else {
      setEditModules(ALL_MODULE_KEYS.map(m => m.key));
    }

    toast.success('Permissions reset to department defaults');
    setSaving(false);
  };

  const selectedUser = staffUsers.find(u => u.user_id === selectedUserId);

  // Group modules by department for display
  const modulesByDept = departmentGroups
    .filter(g => g.departmentKey !== 'system')
    .map(g => ({
      department: g.department,
      departmentKey: g.departmentKey,
      color: g.color,
      icon: g.icon,
      modules: g.items.filter(i => i.moduleKey).map(i => ({
        key: i.moduleKey!,
        label: i.label,
      })),
    }));

  return (
    <AdminLayout
      title="Staff Permissions"
      subtitle="Manage module access for admin & editor staff"
      actions={
        selectedUserId ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={saving}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-3.5 w-3.5 mr-1" /> Save
            </Button>
          </div>
        ) : undefined
      }
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Per-User</TabsTrigger>
            <TabsTrigger value="presets" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* User selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Select Staff Member
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose a staff member to configure their module access. Super Admins always have full access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[240px]">
                    <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a staff member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {staffUsers.map(u => (
                          <SelectItem key={u.user_id} value={u.user_id}>
                            <span className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] capitalize">{u.role}</Badge>
                              <span className="text-xs font-mono">{u.user_id.slice(0, 8)}…</span>
                              {u.department && <Badge variant="secondary" className="text-[10px]">{u.department}</Badge>}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedUserId && (
                    <Select onValueChange={applyPreset}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Apply preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {presets.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.module_keys.length} modules)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedUser && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Role: <strong className="capitalize">{selectedUser.role}</strong></span>
                    {selectedUser.department && <span>• Dept: <strong className="capitalize">{selectedUser.department}</strong></span>}
                    <span>• {editModules.length} modules enabled</span>
                    {permissions[selectedUserId!] && <Badge variant="outline" className="text-[10px]">Custom overrides</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Module grid */}
            {selectedUserId && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modulesByDept.map(dept => {
                  const allSelected = dept.modules.every(m => editModules.includes(m.key));
                  const someSelected = dept.modules.some(m => editModules.includes(m.key));

                  return (
                    <Card key={dept.departmentKey}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <dept.icon className={`h-4 w-4 ${dept.color}`} />
                            {dept.department}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => allSelected ? deselectAllDept(dept.departmentKey) : selectAllDept(dept.departmentKey)}
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {dept.modules.map(mod => (
                          <label key={mod.key} className="flex items-center gap-2.5 cursor-pointer group">
                            <Checkbox
                              checked={editModules.includes(mod.key)}
                              onCheckedChange={() => toggleModule(mod.key)}
                            />
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                              {mod.label}
                            </span>
                          </label>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!selectedUserId && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <KeyRound className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a staff member above to manage their module permissions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Permission Presets</CardTitle>
                <CardDescription className="text-xs">
                  Default presets auto-assign modules based on department. Apply these when configuring staff.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {presets.map(preset => (
                    <div key={preset.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium">{preset.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{preset.department} • {preset.module_keys.length} modules</p>
                      </div>
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {preset.module_keys.map(k => (
                          <Badge key={k} variant="secondary" className="text-[10px]">
                            {k.split('/')[1].replace(/-/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}
