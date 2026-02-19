
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, ArrowRight, Users, Calendar, Heart, Share2, CheckCircle2, Star, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

const getFingerprint = () => {
  let fp = localStorage.getItem('sernet_fp');
  if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('sernet_fp', fp); }
  return fp;
};

interface Survey {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  estimated_time: string | null;
  deadline_at: string | null;
}

interface Question {
  id: string;
  question: string;
  question_type: 'text' | 'single' | 'multiple' | 'rating';
  options: string[];
  required: boolean;
  sort_order: number;
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  closed: 'bg-muted text-muted-foreground',
  upcoming: 'bg-amber-500/10 text-amber-600',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  closed: 'Closed',
  upcoming: 'Coming Soon',
};

// ── Engagement buttons ──────────────────────────────────────────────────────
function SurveyEngagement({ surveyId }: { surveyId: string }) {
  const { toast } = useToast();
  const fp = getFingerprint();
  const qc = useQueryClient();

  const { data: likeData } = useQuery({
    queryKey: ['survey_likes', surveyId],
    queryFn: async () => {
      const { data } = await db('survey_likes').select('fingerprint').eq('survey_id', surveyId);
      return data ?? [];
    },
  });

  const liked = (likeData ?? []).some((l: { fingerprint: string }) => l.fingerprint === fp);
  const likeCount = (likeData ?? []).length;

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (liked) {
        await db('survey_likes').delete().eq('survey_id', surveyId).eq('fingerprint', fp);
      } else {
        await db('survey_likes').insert([{ survey_id: surveyId, fingerprint: fp }]);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['survey_likes', surveyId] }),
  });

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied!', description: 'Survey link copied to clipboard.' });
  };

  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
      <button
        onClick={() => toggleLike.mutate()}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
      >
        <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-rose-500' : ''}`} />
        {likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}
      </button>
      <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
    </div>
  );
}

// ── Survey form dialog ───────────────────────────────────────────────────────
function SurveyFormDialog({ survey, open, onClose }: { survey: Survey | null; open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!survey || !open) return;
    setAnswers({});
    setName('');
    setEmail('');
    setSubmitted(false);
    db('survey_questions').select('*').eq('survey_id', survey.id).order('sort_order').then(({ data }: { data: unknown[] | null }) => {
      setQuestions((data ?? []).map((q: Record<string, unknown>) => ({
        id: String(q.id),
        question: String(q.question),
        question_type: String(q.question_type) as Question['question_type'],
        options: Array.isArray(q.options) ? q.options as string[] : [],
        required: Boolean(q.required),
        sort_order: Number(q.sort_order),
      })));
    });
  }, [survey, open]);

  const setAnswer = (qId: string, val: unknown) => setAnswers(a => ({ ...a, [qId]: val }));
  const toggleMulti = (qId: string, opt: string) => {
    const cur = (answers[qId] as string[] | undefined) ?? [];
    setAnswers(a => ({ ...a, [qId]: cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt] }));
  };

  const handleSubmit = async () => {
    const missing = questions.filter(q => q.required && !answers[q.id]);
    if (missing.length > 0) {
      toast({ title: 'Please answer all required questions.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await db('survey_responses').insert([{
      survey_id: survey!.id,
      answers,
      respondent_name: name || null,
      respondent_email: email || null,
    }]);
    if (error) toast({ title: 'Error submitting', description: error.message, variant: 'destructive' });
    else setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{survey?.title}</DialogTitle>
          {survey?.description && <DialogDescription>{survey.description}</DialogDescription>}
        </DialogHeader>

        {submitted ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your response has been recorded.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : survey?.status === 'upcoming' ? (
          <div className="p-6 rounded-lg bg-amber-500/5 border border-amber-500/20 text-center">
            <p className="text-sm text-muted-foreground">This survey isn't open yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Your Name (optional)</label>
                <input className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Email (optional)</label>
                <input className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {questions.map((q, qi) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium text-foreground">{qi + 1}. {q.question}{q.required && <span className="text-destructive ml-1">*</span>}</p>

                {q.question_type === 'text' && (
                  <textarea
                    rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Your answer..."
                    value={String(answers[q.id] ?? '')}
                    onChange={e => setAnswer(q.id, e.target.value)}
                  />
                )}

                {q.question_type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button
                        key={r}
                        onClick={() => setAnswer(q.id, r)}
                        className={`flex flex-col items-center gap-0.5 ${answers[q.id] === r ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-400'}`}
                      >
                        <Star className={`h-6 w-6 ${answers[q.id] !== undefined && r <= Number(answers[q.id]) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span className="text-xs">{r}</span>
                      </button>
                    ))}
                  </div>
                )}

                {q.question_type === 'single' && (
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswer(q.id, opt)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === opt ? 'border-primary bg-primary/5 text-foreground font-medium' : 'border-border/50 hover:border-primary/30 text-muted-foreground'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.question_type === 'multiple' && (
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const sel = ((answers[q.id] as string[] | undefined) ?? []).includes(opt);
                      return (
                        <button
                          key={oi}
                          onClick={() => toggleMulti(q.id, opt)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${sel ? 'border-primary bg-primary/5 text-foreground font-medium' : 'border-border/50 hover:border-primary/30 text-muted-foreground'}`}
                        >
                          <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ${sel ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                            {sel && <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export const SurveysContent = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys_public'],
    queryFn: async () => {
      const { data } = await db('surveys').select('*').order('created_at', { ascending: false });
      return (data ?? []) as Survey[];
    },
  });

  useEffect(() => {
    if (surveys.length === 0) return;
    surveys.forEach(async (s) => {
      const { count } = await db('survey_responses').select('*', { count: 'exact', head: true }).eq('survey_id', s.id);
      setResponseCounts(prev => ({ ...prev, [s.id]: count ?? 0 }));
    });
  }, [surveys]);

  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Surveys</h2>
          </div>
          <p className="text-muted-foreground">Participate in our surveys to help us build better products and services for you.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-56 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : surveys.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No surveys available right now. Check back soon!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="bg-muted/30 rounded-lg p-6 border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{survey.category}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[survey.status] ?? statusStyles.closed}`}>
                    {statusLabels[survey.status] ?? survey.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{survey.title}</h3>
                {survey.description && <p className="text-sm text-muted-foreground mb-4 flex-1">{survey.description}</p>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  {survey.estimated_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {survey.estimated_time}</span>}
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {responseCounts[survey.id] ?? 0} responses</span>
                </div>
                <div className="flex items-center justify-between">
                  {survey.deadline_at && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(survey.deadline_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedSurvey(survey)}
                    disabled={survey.status === 'closed'}
                    className="flex items-center gap-1 text-primary text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    {survey.status === 'closed' ? 'Closed' : survey.status === 'upcoming' ? 'Upcoming' : 'Take Survey'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <SurveyEngagement surveyId={survey.id} />
              </motion.div>
            ))}
          </div>
        )}

        <SurveyFormDialog survey={selectedSurvey} open={!!selectedSurvey} onClose={() => setSelectedSurvey(null)} />
      </div>
    </section>
  );
};
