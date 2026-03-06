import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Zap, History, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const ENTITY_TYPES = ['crm_deals', 'crm_contacts', 'leads', 'support_tickets', 'invoices'];
const TRIGGER_EVENTS = ['insert', 'update', 'delete'];
const OPERATORS = ['equals', 'not_equals', 'contains', 'gt', 'lt', 'is_empty', 'is_not_empty'];
const ACTION_TYPES = ['update_field', 'create_activity', 'send_notification'];

type Condition = { field: string; operator: string; value: string };
type Action = { type: string; config: Record<string, string> };

const emptyRule = {
  name: '',
  description: '',
  entity_type: 'crm_deals',
  trigger_event: 'update',
  trigger_field: '',
  trigger_value: '',
  is_active: true,
  priority: 0,
};

export const WorkflowsContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyRule);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([{ type: 'update_field', config: { field: '', value: '' } }]);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['workflow-rules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workflow_rules').select('*').order('priority');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['workflow-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_logs')
        .select('*, workflow_rules(name)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const createRule = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('workflow_rules').insert({
        name: form.name,
        description: form.description || null,
        entity_type: form.entity_type,
        trigger_event: form.trigger_event,
        trigger_field: form.trigger_field || null,
        trigger_value: form.trigger_value || null,
        conditions: conditions.filter(c => c.field),
        actions: actions.filter(a => a.type),
        is_active: form.is_active,
        priority: form.priority,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflow-rules'] });
      toast.success('Workflow rule created');
      setOpen(false);
      setForm(emptyRule);
      setConditions([]);
      setActions([{ type: 'update_field', config: { field: '', value: '' } }]);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleRule = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('workflow_rules').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workflow-rules'] }); toast.success('Rule updated'); },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workflow_rules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workflow-rules'] }); toast.success('Rule deleted'); },
  });

  const addCondition = () => setConditions(p => [...p, { field: '', operator: 'equals', value: '' }]);
  const removeCondition = (idx: number) => setConditions(p => p.filter((_, i) => i !== idx));
  const updateCondition = (idx: number, key: keyof Condition, val: string) =>
    setConditions(p => p.map((c, i) => i === idx ? { ...c, [key]: val } : c));

  const addAction = () => setActions(p => [...p, { type: 'update_field', config: { field: '', value: '' } }]);
  const removeAction = (idx: number) => setActions(p => p.filter((_, i) => i !== idx));
  const updateAction = (idx: number, type: string) =>
    setActions(p => p.map((a, i) => i === idx ? { type, config: {} } : a));
  const updateActionConfig = (idx: number, key: string, val: string) =>
    setActions(p => p.map((a, i) => i === idx ? { ...a, config: { ...a.config, [key]: val } } : a));

  const statusColors: Record<string, string> = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    skipped: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Rules</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rules.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rules.filter((r: any) => r.is_active).length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Executions (Recent)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{logs.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Errors</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{logs.filter((l: any) => l.status === 'error').length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules"><Zap className="h-4 w-4 mr-1" />Rules</TabsTrigger>
          <TabsTrigger value="logs"><History className="h-4 w-4 mr-1" />Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Workflow Rules</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Rule</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Create Workflow Rule</DialogTitle></DialogHeader>
                  <div className="space-y-5">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <div><Label>Rule Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Auto-assign high value deals" /></div>
                      <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What does this rule do?" /></div>
                    </div>

                    {/* Trigger Config */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trigger</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Entity</Label>
                          <Select value={form.entity_type} onValueChange={v => setForm(p => ({ ...p, entity_type: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{ENTITY_TYPES.map(e => <SelectItem key={e} value={e}>{e.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Event</Label>
                          <Select value={form.trigger_event} onValueChange={v => setForm(p => ({ ...p, trigger_event: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{TRIGGER_EVENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>Watch Field (optional)</Label><Input value={form.trigger_field} onChange={e => setForm(p => ({ ...p, trigger_field: e.target.value }))} placeholder="e.g. stage" /></div>
                        <div><Label>Match Value (optional)</Label><Input value={form.trigger_value} onChange={e => setForm(p => ({ ...p, trigger_value: e.target.value }))} placeholder="e.g. won" /></div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Conditions</h4>
                        <Button type="button" size="sm" variant="outline" onClick={addCondition}><Plus className="h-3 w-3 mr-1" />Add</Button>
                      </div>
                      {conditions.length === 0 && <p className="text-xs text-muted-foreground">No conditions — rule applies to all matching events.</p>}
                      {conditions.map((c, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_120px_1fr_32px] gap-2 items-end">
                          <Input placeholder="field" value={c.field} onChange={e => updateCondition(idx, 'field', e.target.value)} />
                          <Select value={c.operator} onValueChange={v => updateCondition(idx, 'operator', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{OPERATORS.map(o => <SelectItem key={o} value={o}>{o.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                          </Select>
                          <Input placeholder="value" value={c.value} onChange={e => updateCondition(idx, 'value', e.target.value)} />
                          <Button size="icon" variant="ghost" onClick={() => removeCondition(idx)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Actions</h4>
                        <Button type="button" size="sm" variant="outline" onClick={addAction}><Plus className="h-3 w-3 mr-1" />Add</Button>
                      </div>
                      {actions.map((a, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Select value={a.type} onValueChange={v => updateAction(idx, v)}>
                              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                              <SelectContent>{ACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                            </Select>
                            <Button size="icon" variant="ghost" onClick={() => removeAction(idx)} disabled={actions.length === 1}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                          {a.type === 'update_field' && (
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="field name" value={a.config.field || ''} onChange={e => updateActionConfig(idx, 'field', e.target.value)} />
                              <Input placeholder="new value" value={a.config.value || ''} onChange={e => updateActionConfig(idx, 'value', e.target.value)} />
                            </div>
                          )}
                          {a.type === 'create_activity' && (
                            <div className="space-y-2">
                              <Input placeholder="Subject" value={a.config.subject || ''} onChange={e => updateActionConfig(idx, 'subject', e.target.value)} />
                              <Input placeholder="Description" value={a.config.description || ''} onChange={e => updateActionConfig(idx, 'description', e.target.value)} />
                            </div>
                          )}
                          {a.type === 'send_notification' && (
                            <Input placeholder="Notification message" value={a.config.message || ''} onChange={e => updateActionConfig(idx, 'message', e.target.value)} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Priority & Submit */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1"><Label>Priority (lower = first)</Label><Input type="number" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: Number(e.target.value) }))} /></div>
                      <div className="flex items-center gap-2 pt-5">
                        <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
                        <Label>Active</Label>
                      </div>
                    </div>

                    <Button className="w-full" disabled={!form.name} onClick={() => createRule.mutate()}>Create Rule</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : rules.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No workflow rules yet. Create your first automation!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Watch Field</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="font-mono text-xs">{r.entity_type}</TableCell>
                        <TableCell><Badge variant="outline">{r.trigger_event}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{r.trigger_field || '—'}</TableCell>
                        <TableCell>{(r.conditions as any[])?.length || 0}</TableCell>
                        <TableCell>{(r.actions as any[])?.length || 0}</TableCell>
                        <TableCell>{r.priority}</TableCell>
                        <TableCell>
                          <Badge className={r.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}>
                            {r.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => toggleRule.mutate({ id: r.id, is_active: !r.is_active })}>
                              {r.is_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteRule.mutate(r.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader><CardTitle>Execution Logs</CardTitle></CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No executions yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Rule</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions Executed</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((l: any) => (
                      <TableRow key={l.id}>
                        <TableCell className="text-xs">{format(new Date(l.created_at), 'dd MMM HH:mm:ss')}</TableCell>
                        <TableCell className="font-medium">{l.workflow_rules?.name || l.rule_id.slice(0, 8)}</TableCell>
                        <TableCell className="font-mono text-xs">{l.entity_type}</TableCell>
                        <TableCell><Badge variant="outline">{l.trigger_event}</Badge></TableCell>
                        <TableCell><Badge className={statusColors[l.status] || ''}>{l.status}</Badge></TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{(l.actions_executed as string[])?.join(', ') || '—'}</TableCell>
                        <TableCell className="text-xs">{l.execution_time_ms}ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminWorkflows;
