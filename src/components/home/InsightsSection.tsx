import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Heart, MessageCircle, Share2, Mail, BookOpen, FileText, Megaphone, Newspaper, FolderOpen, Send, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface InsightCard {
  id: string;
  type: 'article' | 'analysis' | 'report';
  category: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  readTime?: string | null;
  url?: string | null;
  imageUrl?: string | null;
}

const TYPE_BADGE: Record<string, { label: string; route: (id: string) => string }> = {
  article: { label: 'Article', route: (id) => `/insights/articles/${id}` },
  analysis: { label: 'Analysis', route: (id) => `/insights/analysis/${id}` },
  report: { label: 'Report', route: (id) => `/insights?tab=Reports` },
};

function useLatestInsights() {
  return useQuery({
    queryKey: ['home-insights'],
    queryFn: async (): Promise<InsightCard[]> => {
      const [articlesRes, analysisRes, reportsRes] = await Promise.all([
        supabase
          .from('articles')
          .select('id, category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url')
          .eq('status', 'published')
          .order('item_date', { ascending: false, nullsFirst: false })
          .limit(1),
        supabase
          .from('analyses')
          .select('id, category, title, excerpt, item_date, published_at')
          .eq('status', 'published')
          .order('item_date', { ascending: false, nullsFirst: false })
          .limit(1),
        supabase
          .from('reports')
          .select('id, report_type, title, description, published_at, file_url')
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(1),
      ]);

      const cards: InsightCard[] = [];

      if (articlesRes.data?.[0]) {
        const a = articlesRes.data[0];
        cards.push({ id: a.id, type: 'article', category: a.category, title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at, readTime: a.read_time, imageUrl: a.thumbnail_url || a.media_url });
      }
      if (analysisRes.data?.[0]) {
        const a = analysisRes.data[0];
        cards.push({ id: a.id, type: 'analysis', category: a.category, title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at });
      }
      if (reportsRes.data?.[0]) {
        const r = reportsRes.data[0];
        cards.push({ id: r.id, type: 'report', category: r.report_type, title: r.title, excerpt: r.description, date: r.published_at });
      }

      return cards;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export const InsightsSection = () => {
  const { t } = useTranslation();
  const { data: cards = [], isLoading } = useLatestInsights();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="heading-lg text-foreground">{t('insights.heading')}</h2>
          </div>
          <Link
            to="/insights"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border/50 p-5 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            cards.map((card, index) => {
              const meta = TYPE_BADGE[card.type];
              const TypeIcon = card.type === 'analysis' ? BarChart3 : card.type === 'report' ? FileText : Newspaper;
              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  {card.imageUrl && (
                    <Link to={meta.route(card.id)}>
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{meta.label}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{card.category}</span>
                    </div>
                    <Link to={meta.route(card.id)}>
                      <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {card.title}
                      </h3>
                    </Link>
                    {card.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {card.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {card.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {format(new Date(card.date), 'MMM d, yyyy')}
                          </span>
                        )}
                        {card.readTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {card.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-10 rounded-2xl bg-muted/50 border border-primary/30 p-5 md:p-6 text-center overflow-hidden shadow-[0_0_25px_-5px_hsl(var(--primary)/0.3),0_0_10px_-5px_hsl(var(--sernet-yellow)/0.2)]"
        >
          {/* Background watermark elements */}
          {/* Background visual elements - Resources */}
          <FolderOpen className="absolute top-5 left-8 w-12 h-12 text-primary/[0.07] rotate-[-12deg] pointer-events-none" />
          <BookOpen className="absolute top-3 left-24 w-8 h-8 text-primary/[0.05] rotate-[8deg] pointer-events-none" />
          
          {/* Background visual elements - Articles */}
          <Newspaper className="absolute top-4 right-10 w-14 h-14 text-sernet-yellow/[0.08] rotate-[10deg] pointer-events-none" />
          <FileText className="absolute top-1/2 -translate-y-1/2 right-8 w-10 h-10 text-primary/[0.06] rotate-[-6deg] pointer-events-none" />
          
          {/* Background visual elements - Promotion */}
          <Megaphone className="absolute bottom-4 left-10 w-12 h-12 text-sernet-yellow/[0.07] rotate-[15deg] pointer-events-none" />
          <Send className="absolute bottom-5 right-16 w-9 h-9 text-primary/[0.06] rotate-[-20deg] pointer-events-none" />
          <Mail className="absolute top-1/2 left-6 w-8 h-8 text-sernet-yellow/[0.05] -translate-y-1/2 rotate-[5deg] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">{t('insights.newsletter')}</h3>
            </div>
            <div className="flex items-center justify-center gap-6 mb-4">
              {[
                { key: 'insights.resources', label: t('insights.resources') },
                { key: 'insights.articles', label: t('insights.articles') },
                { key: 'insights.promotion', label: t('insights.promotion') },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox defaultChecked />
                  {item.label}
                </label>
              ))}
            </div>
            <NewsletterForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const NewsletterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const isValidEmail = (e: string) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { error: dbError } = await supabase
        .from('newsletter_subscribers' as any)
        .upsert(
          { first_name: firstName, last_name: lastName || null, email, status: 'active', subscribed_at: new Date().toISOString() } as any,
          { onConflict: 'email' }
        );
      if (dbError) throw dbError;
      setSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder={t('insights.firstName')}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="flex-1 h-10"
      />
      <Input
        type="text"
        placeholder={t('insights.lastName')}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="flex-1 h-10"
      />
      <Input
        type="email"
        placeholder={t('insights.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-[2] h-12 text-base"
      />
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? '...' : submitted ? t('testimonials.subscribed') : t('insights.subscribe')}
      </Button>
      {error && <p className="text-xs text-destructive w-full text-center">{error}</p>}
    </form>
  );
};
