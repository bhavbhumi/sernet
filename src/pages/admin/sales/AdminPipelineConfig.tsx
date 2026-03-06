import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, GripVertical, Pencil, Trash2, Palette, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PipelineStage = {
  id: string;
  pipeline_key: string;
  stage_key: string;
  stage_label: string;
  stage_color: string;
  sort_order: number;
  is_active: boolean;
  pipeline_sub_statuses: SubStatus[];
};

type SubStatus = {
  id: string;
  stage_id: string;
  sub_status_key: string;
  sub_status_label: string;
  color_class: string;
  sort_order: number;
  is_active: boolean;
};

const COLOR_OPTIONS = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-amber-500', label: 'Amber' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-emerald-500', label: 'Emerald' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-orange-500', label: 'Orange' },
];

const SUB_COLOR_OPTIONS = [
  { value: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Blue' },
  { value: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', label: 'Amber' },
  { value: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Red' },
  { value: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200', label: 'Emerald' },
  { value: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Purple' },
  { value: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200', label: 'Sky' },
  { value: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Orange' },
  { value: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Yellow' },
  { value: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', label: 'Indigo' },
  { value: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200', label: 'Violet' },
  { value: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200', label: 'Fuchsia' },
  { value: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200', label: 'Stone' },
  { value: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Gray' },
];

// ---- Stage Editor Dialog ----
function StageDialog({ stage, onSaved }: { stage?: PipelineStage; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    stage_key: stage?.stage_key || '',
    stage_label: stage?.stage_label || '',
    stage_color: stage?.stage_color || 'bg-blue-500',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.stage_key.trim() || !form.stage_label.trim()) {
      toast.error('Key and label are required');
      return;
    }
    setSaving(true);
    try {
      if (stage) {
        const { error } = await supabase.from('pipeline_stages').update({
          stage_label: form.stage_label,
          stage_color: form.stage_color,
        }).eq('id', stage.id);
        if (error) throw error;
        toast.success('Stage updated');
      } else {
        const { data: existing } = await supabase
          .from('pipeline_stages')
          .select('sort_order')
          .eq('pipeline_key', 'default')
          .order('sort_order', { ascending: false })
          .limit(1);
        const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

        const { error } = await supabase.from('pipeline_stages').insert({
          pipeline_key: 'default',
          stage_key: form.stage_key.toLowerCase().replace(/\s+/g, '_'),
          stage_label: form.stage_label,
          stage_color: form.stage_color,
          sort_order: nextOrder,
        });
        if (error) throw error;
        toast.success('Stage created');
      }
      setOpen(false);
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {stage ? (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
        ) : (
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Stage</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{stage ? 'Edit Stage' : 'New Stage'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Stage Key</Label>
            <Input
              value={form.stage_key}
              onChange={e => setForm(f => ({ ...f, stage_key: e.target.value }))}
              placeholder="e.g. negotiation"
              disabled={!!stage}
              className={stage ? 'opacity-50' : ''}
            />
            {stage && <p className="text-[10px] text-muted-foreground mt-1">Key cannot be changed after creation</p>}
          </div>
          <div>
            <Label>Display Label</Label>
            <Input value={form.stage_label} onChange={e => setForm(f => ({ ...f, stage_label: e.target.value }))} placeholder="e.g. Negotiation" />
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm(f => ({ ...f, stage_color: c.value }))}
                  className={cn('w-7 h-7 rounded-full border-2 transition-all', c.value, form.stage_color === c.value ? 'border-foreground scale-110' : 'border-transparent')}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Sub-Status Editor Dialog ----
function SubStatusDialog({ stageId, subStatus, onSaved }: { stageId: string; subStatus?: SubStatus; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    sub_status_key: subStatus?.sub_status_key || '',
    sub_status_label: subStatus?.sub_status_label || '',
    color_class: subStatus?.color_class || SUB_COLOR_OPTIONS[0].value,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.sub_status_key.trim() || !form.sub_status_label.trim()) {
      toast.error('Key and label are required');
      return;
    }
    setSaving(true);
    try {
      if (subStatus) {
        const { error } = await supabase.from('pipeline_sub_statuses').update({
          sub_status_label: form.sub_status_label,
          color_class: form.color_class,
        }).eq('id', subStatus.id);
        if (error) throw error;
        toast.success('Sub-status updated');
      } else {
        const { data: existing } = await supabase
          .from('pipeline_sub_statuses')
          .select('sort_order')
          .eq('stage_id', stageId)
          .order('sort_order', { ascending: false })
          .limit(1);
        const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

        const { error } = await supabase.from('pipeline_sub_statuses').insert({
          stage_id: stageId,
          sub_status_key: form.sub_status_key.toLowerCase().replace(/\s+/g, '_'),
          sub_status_label: form.sub_status_label,
          color_class: form.color_class,
          sort_order: nextOrder,
        });
        if (error) throw error;
        toast.success('Sub-status created');
      }
      setOpen(false);
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {subStatus ? (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Pencil className="h-3 w-3" /></Button>
        ) : (
          <Button variant="outline" size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" /> Sub-Status</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{subStatus ? 'Edit Sub-Status' : 'New Sub-Status'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Key</Label>
            <Input
              value={form.sub_status_key}
              onChange={e => setForm(f => ({ ...f, sub_status_key: e.target.value }))}
              placeholder="e.g. follow_up"
              disabled={!!subStatus}
              className={subStatus ? 'opacity-50' : ''}
            />
          </div>
          <div>
            <Label>Display Label</Label>
            <Input value={form.sub_status_label} onChange={e => setForm(f => ({ ...f, sub_status_label: e.target.value }))} placeholder="e.g. Follow Up" />
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {SUB_COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm(f => ({ ...f, color_class: c.value }))}
                  className={cn('text-[10px] px-2 py-1 rounded-full border transition-all', c.value, form.color_class === c.value ? 'ring-2 ring-foreground/50' : '')}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Exported Content (used by Master Data hub) ----
export function PipelineConfigContent() {
  const queryClient = useQueryClient();

  const { data: stages = [], isLoading } = useQuery({
    queryKey: ['pipeline-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*, pipeline_sub_statuses(*)')
        .eq('pipeline_key', 'default')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data as PipelineStage[]).map(s => ({
        ...s,
        pipeline_sub_statuses: (s.pipeline_sub_statuses || []).sort((a: SubStatus, b: SubStatus) => a.sort_order - b.sort_order),
      }));
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['pipeline-config'] });

  const toggleStageActive = async (stage: PipelineStage) => {
    const { error } = await supabase.from('pipeline_stages').update({ is_active: !stage.is_active }).eq('id', stage.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Stage ${stage.is_active ? 'disabled' : 'enabled'}`);
    refresh();
  };

  const toggleSubStatusActive = async (ss: SubStatus) => {
    const { error } = await supabase.from('pipeline_sub_statuses').update({ is_active: !ss.is_active }).eq('id', ss.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Sub-status ${ss.is_active ? 'disabled' : 'enabled'}`);
    refresh();
  };

  const moveStage = async (stage: PipelineStage, direction: 'up' | 'down') => {
    const idx = stages.findIndex(s => s.id === stage.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= stages.length) return;
    const swap = stages[swapIdx];
    await Promise.all([
      supabase.from('pipeline_stages').update({ sort_order: swap.sort_order }).eq('id', stage.id),
      supabase.from('pipeline_stages').update({ sort_order: stage.sort_order }).eq('id', swap.id),
    ]);
    refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings2 className="h-4 w-4" />
          <span>{stages.length} stages configured</span>
        </div>
        <StageDialog onSaved={refresh} />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, idx) => (
            <Card key={stage.id} className={cn('p-4', !stage.is_active && 'opacity-50')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveStage(stage, 'up')}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs"
                  >▲</button>
                  <button
                    onClick={() => moveStage(stage, 'down')}
                    disabled={idx === stages.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs"
                  >▼</button>
                </div>
                <div className={cn('w-3 h-3 rounded-full shrink-0', stage.stage_color)} />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{stage.stage_label}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">{stage.stage_key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={stage.is_active} onCheckedChange={() => toggleStageActive(stage)} />
                  <StageDialog stage={stage} onSaved={refresh} />
                </div>
              </div>

              {/* Sub-statuses */}
              <div className="ml-8 space-y-1.5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Sub-Statuses</p>
                  <SubStatusDialog stageId={stage.id} onSaved={refresh} />
                </div>
                {stage.pipeline_sub_statuses.map(ss => (
                  <div key={ss.id} className={cn('flex items-center gap-2 py-1', !ss.is_active && 'opacity-40')}>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', ss.color_class)}>
                      {ss.sub_status_label}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{ss.sub_status_key}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <Switch checked={ss.is_active} onCheckedChange={() => toggleSubStatusActive(ss)} className="scale-75" />
                      <SubStatusDialog stageId={stage.id} subStatus={ss} onSaved={refresh} />
                    </div>
                  </div>
                ))}
                {stage.pipeline_sub_statuses.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic">No sub-statuses defined</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ---- Page (standalone route) ----
export default function AdminPipelineConfig() {
  return (
    <AdminGuard>
      <AdminLayout title="Pipeline Configuration" subtitle="Customize CRM stages and sub-statuses">
        <PipelineConfigContent />
      </AdminLayout>
    </AdminGuard>
  );
}
