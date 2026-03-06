import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const db = (t: string) => supabase.from(t as any) as any;

export function EscalationMatrixContent() {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('matrix');

  // Matrix form
  const [matrixDialog, setMatrixDialog] = useState(false);
  const [editingMatrix, setEditingMatrix] = useState<string | null>(null);
  const [matrixForm, setMatrixForm] = useState({ level: 1, role_title: '', department: 'support', tat_breach_hours: 4, product: 'all' });

  // Rules form
  const [ruleDialog, setRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState({ name: '', description: '', trigger_type: 'keyword', conditions_json: '', actions_json: '' });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: m }, { data: r }] = await Promise.all([
      db('support_escalation_matrix').select('*').order('level'),
      db('support_automation_rules').select('*').order('sort_order'),
    ]);
    setMatrix(m ?? []);
    setRules(r ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Matrix CRUD
  const saveMatrix = async () => {
    setSaving(true);
    const payload = { ...matrixForm };
    const { error } = editingMatrix
      ? await db('support_escalation_matrix').update(payload).eq('id', editingMatrix)
      : await db('support_escalation_matrix').insert([payload]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Saved' }); setMatrixDialog(false); fetchAll(); }
    setSaving(false);
  };

  const deleteMatrix = async (id: string) => {
    if (!confirm('Delete?')) return;
    await db('support_escalation_matrix').delete().eq('id', id);
    toast({ title: 'Deleted' }); fetchAll();
  };

  // Rule CRUD
  const saveRule = async () => {
    setSaving(true);
    try {
      const payload = {
        name: ruleForm.name,
        description: ruleForm.description || null,
        trigger_type: ruleForm.trigger_type,
        conditions: JSON.parse(ruleForm.conditions_json || '{}'),
        actions: JSON.parse(ruleForm.actions_json || '{}'),
      };
      const { error } = editingRule
        ? await db('support_automation_rules').update(payload).eq('id', editingRule)
        : await db('support_automation_rules').insert([payload]);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Saved' }); setRuleDialog(false); fetchAll(); }
    } catch {
      toast({ title: 'Invalid JSON', variant: 'destructive' });
    }
    setSaving(false);
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Delete?')) return;
    await db('support_automation_rules').delete().eq('id', id);
    toast({ title: 'Deleted' }); fetchAll();
  };

  const levelColors: Record<number, string> = {
    1: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    3: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    4: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <AdminLayout title="Escalation & Automation" subtitle="Configure escalation matrix and automation rules">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="matrix">Escalation Matrix</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => { setEditingMatrix(null); setMatrixForm({ level: 1, role_title: '', department: 'support', tat_breach_hours: 4, product: 'all' }); setMatrixDialog(true); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Level
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : matrix.map(m => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge className={levelColors[m.level] ?? ''}>L{m.level}</Badge>
                  <ArrowUp className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{m.role_title}</p>
                  <p className="text-xs text-muted-foreground">Dept: {m.department} • TAT Breach: {m.tat_breach_hours}h • Notify: {(m.notification_channels ?? []).join(', ')}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingMatrix(m.id); setMatrixForm({ level: m.level, role_title: m.role_title, department: m.department, tat_breach_hours: m.tat_breach_hours, product: m.product }); setMatrixDialog(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteMatrix(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => { setEditingRule(null); setRuleForm({ name: '', description: '', trigger_type: 'keyword', conditions_json: '{"keywords":[]}', actions_json: '{"set_priority":"standard","assign_team":"support"}' }); setRuleDialog(true); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Rule
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : rules.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{r.name}</p>
                    <Badge variant="outline" className="text-[10px]">{r.trigger_type}</Badge>
                    <Badge variant={r.is_active ? 'default' : 'secondary'} className="text-[10px]">{r.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingRule(r.id); setRuleForm({ name: r.name, description: r.description ?? '', trigger_type: r.trigger_type, conditions_json: JSON.stringify(r.conditions, null, 2), actions_json: JSON.stringify(r.actions, null, 2) }); setRuleDialog(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteRule(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                {r.description && <p className="text-xs text-muted-foreground mb-2">{r.description}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Conditions</p>
                    <pre className="text-[11px] bg-muted/50 rounded p-2 overflow-auto max-h-20">{JSON.stringify(r.conditions, null, 2)}</pre>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Actions</p>
                    <pre className="text-[11px] bg-muted/50 rounded p-2 overflow-auto max-h-20">{JSON.stringify(r.actions, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Matrix Dialog */}
      <Dialog open={matrixDialog} onOpenChange={setMatrixDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMatrix ? 'Edit Level' : 'Add Escalation Level'}</DialogTitle>
            <DialogDescription>Configure escalation level, role, and TAT breach threshold</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Level (L1-L4)</Label>
                <Input type="number" min={1} max={4} value={matrixForm.level} onChange={e => setMatrixForm(f => ({ ...f, level: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-1.5">
                <Label>TAT Breach (hours)</Label>
                <Input type="number" value={matrixForm.tat_breach_hours} onChange={e => setMatrixForm(f => ({ ...f, tat_breach_hours: parseInt(e.target.value) || 4 }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Role Title</Label>
              <Input value={matrixForm.role_title} onChange={e => setMatrixForm(f => ({ ...f, role_title: e.target.value }))} placeholder="Team Lead" />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={matrixForm.department} onValueChange={v => setMatrixForm(f => ({ ...f, department: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setMatrixDialog(false)}>Cancel</Button>
            <Button onClick={saveMatrix} disabled={saving || !matrixForm.role_title.trim()}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rule Dialog */}
      <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Rule' : 'Add Automation Rule'}</DialogTitle>
            <DialogDescription>Define conditions and actions for automatic ticket routing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Rule Name <span className="text-destructive">*</span></Label>
                <Input value={ruleForm.name} onChange={e => setRuleForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Trigger Type</Label>
                <Select value={ruleForm.trigger_type} onValueChange={v => setRuleForm(f => ({ ...f, trigger_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword Match</SelectItem>
                    <SelectItem value="category">Category Match</SelectItem>
                    <SelectItem value="tat_breach">TAT Breach</SelectItem>
                    <SelectItem value="product">Product Match</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={ruleForm.description} onChange={e => setRuleForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Conditions (JSON)</Label>
              <textarea className="w-full border border-border rounded-lg p-3 text-sm font-mono bg-background text-foreground min-h-[80px]" value={ruleForm.conditions_json} onChange={e => setRuleForm(f => ({ ...f, conditions_json: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Actions (JSON)</Label>
              <textarea className="w-full border border-border rounded-lg p-3 text-sm font-mono bg-background text-foreground min-h-[80px]" value={ruleForm.actions_json} onChange={e => setRuleForm(f => ({ ...f, actions_json: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRuleDialog(false)}>Cancel</Button>
            <Button onClick={saveRule} disabled={saving || !ruleForm.name.trim()}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function AdminEscalationMatrix() {
  return <EscalationMatrixContent />;
}
