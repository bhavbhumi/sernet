
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ClipboardList, X, Eye, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

interface Survey {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  estimated_time: string | null;
  deadline_at: string | null;
  created_at: string;
}

interface Question {
  id?: string;
  question: string;
  question_type: 'text' | 'single' | 'multiple' | 'rating';
  options: string[];
  required: boolean;
  sort_order: number;
}

interface Response {
  id: string;
  respondent_name: string | null;
  respondent_email: string | null;
  submitted_at: string;
  answers: Record<string, unknown>;
}

const CATEGORIES = ['Platform', 'Support', 'Products', 'Education', 'General'];
const STATUSES = ['active', 'closed', 'upcoming'];

const emptyQuestion = (): Question => ({
  question: '',
  question_type: 'text',
  options: ['', ''],
  required: true,
  sort_order: 0,
});

export default function AdminSurveys() {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Survey | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', status: 'active', estimated_time: '5 mins', deadline_at: '' });
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [responsesFor, setResponsesFor] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [responseQuestions, setResponseQuestions] = useState<Question[]>([]);

  const fetchSurveys = async () => {
    setLoading(true);
    const { data } = await db('surveys').select('*').order('created_at', { ascending: false });
    setSurveys(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSurveys(); }, []);

  const openNew = () => {
    setEditItem(null);
    setForm({ title: '', description: '', category: 'General', status: 'active', estimated_time: '5 mins', deadline_at: '' });
    setQuestions([emptyQuestion()]);
    setDialogOpen(true);
  };

  const openEdit = async (survey: Survey) => {
    setEditItem(survey);
    setForm({
      title: survey.title,
      description: survey.description ?? '',
      category: survey.category,
      status: survey.status,
      estimated_time: survey.estimated_time ?? '5 mins',
      deadline_at: survey.deadline_at ? survey.deadline_at.slice(0, 10) : '',
    });
    const { data } = await db('survey_questions').select('*').eq('survey_id', survey.id).order('sort_order');
    const qs: Question[] = (data ?? []).map((q: Record<string, unknown>) => ({
      id: String(q.id),
      question: String(q.question),
      question_type: String(q.question_type) as Question['question_type'],
      options: Array.isArray(q.options) ? (q.options as string[]) : [],
      required: Boolean(q.required),
      sort_order: Number(q.sort_order),
    }));
    setQuestions(qs.length > 0 ? qs : [emptyQuestion()]);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Validation error', description: 'Title is required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      status: form.status,
      estimated_time: form.estimated_time || null,
      deadline_at: form.deadline_at ? new Date(form.deadline_at).toISOString() : null,
    };

    let surveyId = editItem?.id;
    if (editItem) {
      await db('surveys').update(payload).eq('id', editItem.id);
      await db('survey_questions').delete().eq('survey_id', editItem.id);
    } else {
      const { data } = await db('surveys').insert([payload]).select().single();
      surveyId = data?.id;
    }

    if (surveyId) {
      const validQs = questions
        .filter(q => q.question.trim())
        .map((q, i) => ({
          survey_id: surveyId,
          question: q.question,
          question_type: q.question_type,
          options: ['single', 'multiple'].includes(q.question_type) ? q.options.filter(o => o.trim()) : [],
          required: q.required,
          sort_order: i,
        }));
      if (validQs.length > 0) await db('survey_questions').insert(validQs);
    }

    toast({ title: editItem ? 'Survey updated' : 'Survey created' });
    setSaving(false);
    setDialogOpen(false);
    fetchSurveys();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this survey and all responses?')) return;
    await db('survey_questions').delete().eq('survey_id', id);
    await db('survey_responses').delete().eq('survey_id', id);
    await db('surveys').delete().eq('id', id);
    fetchSurveys();
  };

  const viewResponses = async (survey: Survey) => {
    const { data: rData } = await db('survey_responses').select('*').eq('survey_id', survey.id).order('submitted_at', { ascending: false });
    const { data: qData } = await db('survey_questions').select('*').eq('survey_id', survey.id).order('sort_order');
    setResponses((rData ?? []) as Response[]);
    setResponseQuestions((qData ?? []).map((q: Record<string, unknown>) => ({
      id: String(q.id),
      question: String(q.question),
      question_type: String(q.question_type) as Question['question_type'],
      options: Array.isArray(q.options) ? q.options as string[] : [],
      required: Boolean(q.required),
      sort_order: Number(q.sort_order),
    })));
    setResponsesFor(survey);
  };

  const updateQuestion = (i: number, patch: Partial<Question>) => {
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, ...patch } : q));
  };

  const addQuestion = () => setQuestions(qs => [...qs, { ...emptyQuestion(), sort_order: qs.length }]);
  const removeQuestion = (i: number) => setQuestions(qs => qs.filter((_, idx) => idx !== i));

  const updateOption = (qi: number, oi: number, val: string) => {
    setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q));
  };

  const addOption = (qi: number) => {
    setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ''] } : q));
  };

  const removeOption = (qi: number, oi: number) => {
    setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q));
  };

  return (
    <AdminLayout
      title="Surveys"
      subtitle="Create surveys with dynamic questions — view and export responses"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Survey</Button>}
    >
      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)
        ) : surveys.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No surveys yet. Create one!</div>
        ) : surveys.map(survey => (
          <div key={survey.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="secondary">{survey.category}</Badge>
              <Badge variant={survey.status === 'active' ? 'default' : 'secondary'}>{survey.status}</Badge>
              {survey.estimated_time && <span className="text-xs text-muted-foreground">⏱ {survey.estimated_time}</span>}
            </div>
            <p className="font-medium text-foreground">{survey.title}</p>
            {survey.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{survey.description}</p>}
            {survey.deadline_at && <p className="text-xs text-muted-foreground mt-1">Deadline: {new Date(survey.deadline_at).toLocaleDateString()}</p>}
            {/* Horizontal action bar */}
            <div className="flex items-center gap-1 pt-2 mt-2 border-t border-border/60 flex-wrap">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5" onClick={() => viewResponses(survey)}>
                <MessageSquare className="h-3 w-3" /> Responses
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5" onClick={() => openEdit(survey)}>
                <Pencil className="h-3 w-3" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5 text-destructive hover:text-destructive ml-auto" onClick={() => handleDelete(survey.id)}>
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Survey' : 'New Survey'}</DialogTitle></DialogHeader>
          <div className="space-y-5 mt-2">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Title *</Label>
                <Input placeholder="Survey title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Time</Label>
                <Input placeholder="5 mins" value={form.estimated_time} onChange={e => setForm(f => ({ ...f, estimated_time: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline_at} onChange={e => setForm(f => ({ ...f, deadline_at: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea placeholder="What this survey is about..." rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Questions</Label>
                <Button variant="outline" size="sm" onClick={addQuestion}><Plus className="h-3.5 w-3.5 mr-1" /> Add Question</Button>
              </div>
              {questions.map((q, qi) => (
                <div key={qi} className="border border-border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-muted-foreground mt-2.5 w-5 shrink-0">{qi + 1}.</span>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Question text"
                        value={q.question}
                        onChange={e => updateQuestion(qi, { question: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={q.question_type} onValueChange={v => updateQuestion(qi, { question_type: v as Question['question_type'] })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Short Text</SelectItem>
                            <SelectItem value="single">Single Choice</SelectItem>
                            <SelectItem value="multiple">Multiple Choice</SelectItem>
                            <SelectItem value="rating">Rating (1-5)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={q.required ? 'required' : 'optional'} onValueChange={v => updateQuestion(qi, { required: v === 'required' })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="required">Required</SelectItem>
                            <SelectItem value="optional">Optional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {['single', 'multiple'].includes(q.question_type) && (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex gap-2">
                              <Input className="h-8 text-xs" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} />
                              {q.options.length > 2 && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeOption(qi, oi)}><X className="h-3.5 w-3.5" /></Button>
                              )}
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => addOption(qi)}><Plus className="h-3 w-3 mr-1" /> Add option</Button>
                        </div>
                      )}
                    </div>
                    {questions.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeQuestion(qi)}><X className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Responses Dialog */}
      <Dialog open={!!responsesFor} onOpenChange={() => setResponsesFor(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Responses — {responsesFor?.title}
            </DialogTitle>
          </DialogHeader>
          {responses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No responses yet.</div>
          ) : (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">{responses.length} response{responses.length !== 1 ? 's' : ''} received</p>
              {responses.map((r, ri) => (
                <div key={r.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{r.respondent_name ?? 'Anonymous'} {r.respondent_email ? `(${r.respondent_email})` : ''}</span>
                    <span>{new Date(r.submitted_at).toLocaleString()}</span>
                  </div>
                  <div className="space-y-1.5">
                    {responseQuestions.map((q, qi) => {
                      const answers = r.answers as Record<string, unknown>;
                      const ans = answers?.[q.id ?? qi] ?? answers?.[String(qi)];
                      return (
                        <div key={qi} className="text-sm">
                          <span className="font-medium text-foreground">{q.question}: </span>
                          <span className="text-muted-foreground">{Array.isArray(ans) ? ans.join(', ') : String(ans ?? '—')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
