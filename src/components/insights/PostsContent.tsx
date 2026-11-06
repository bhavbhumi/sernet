import { useMemo, useState } from 'react';
import { Link, useSearchParams } from '@/lib/router-compat';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Loader2, Search, ChevronLeft, ChevronRight, ArrowRight, BookOpen, PlayCircle, Headphones, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { POST_TYPES, postPath, mediaGroupOf, MEDIA_GROUPS, type PostType, type MediaGroup } from '@/lib/insightsTaxonomy';

const FORMAT_ICON: Record<MediaGroup, typeof BookOpen> = { Read: BookOpen, Watch: PlayCircle, Listen: Headphones };

const PAGE_SIZE = 12;

type Post = {
  id: string; title: string; excerpt: string | null; category: string; sub_category: string | null;
  tags: string[]; post_type: string | null; content_type: string; thumbnail_url: string | null;
  media_url: string | null; media_kind: string | null; is_featured: boolean | null; item_date: string | null; published_at: string | null; read_time: string | null;
};

async function fetchAll(): Promise<Post[]> {
  const out: Post[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('articles')
      .select('id,title,excerpt,category,sub_category,tags,post_type,content_type,thumbnail_url,media_url,media_kind,is_featured,item_date,published_at,read_time')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(from, from + 999);
    if (error) throw error;
    out.push(...(data as Post[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
        active ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export function PostsContent({ type }: { type: PostType | 'All' }) {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'All';
  const sub = params.get('sub') ?? 'All';
  const tag = params.get('tag');
  const fmtRaw = params.get('format');
  const format = (MEDIA_GROUPS as readonly string[]).includes(fmtRaw ?? '') ? (fmtRaw as MediaGroup) : 'All';
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const [q, setQ] = useState('');

  const { data: posts = [], isLoading } = useQuery({ queryKey: ['insights-posts'], queryFn: fetchAll, staleTime: 5 * 60_000 });

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v && v !== 'All' ? p.set(k, v) : p.delete(k)));
    if (!('page' in next)) p.delete('page');
    setParams(p, { replace: true });
  };

  const byType = useMemo(() => posts.filter((p) => (type === 'All' || p.post_type === type) && (format === 'All' || mediaGroupOf(p.media_kind) === format)), [posts, type, format]);
  const formatCounts = useMemo(() => {
    const c: Record<string, number> = {};
    posts.forEach((p) => { if (type === 'All' || p.post_type === type) { const g = mediaGroupOf(p.media_kind); c[g] = (c[g] ?? 0) + 1; } });
    return c;
  }, [posts, type]);
  const picks = useMemo(() => byType.filter((p) => p.is_featured).slice(0, 3), [byType]);
  const categories = useMemo(() => [...new Set(byType.map((p) => p.category))].sort(), [byType]);
  const byCat = category === 'All' ? byType : byType.filter((p) => p.category === category);
  const subs = useMemo(() => [...new Set(byCat.map((p) => p.sub_category).filter(Boolean) as string[])].sort(), [byCat]);
  const bySub = sub === 'All' ? byCat : byCat.filter((p) => p.sub_category === sub);
  const ql = q.trim().toLowerCase();
  const filtered = bySub.filter((p) => (!tag || p.tags?.includes(tag)) && (!ql || p.title.toLowerCase().includes(ql)));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="section-padding">
      <div className="container-sernet">
        <div className="flex flex-col gap-4 mb-8">
          <div className="inline-flex self-start rounded-lg border border-border p-1 bg-muted/30" role="group" aria-label="Format">
            {(['All', ...MEDIA_GROUPS] as const).map((g) => {
              const Icon = g === 'All' ? null : FORMAT_ICON[g];
              const n = g === 'All' ? null : formatCounts[g] ?? 0;
              if (n === 0) return null;
              return (
                <button key={g} aria-pressed={format === g} onClick={() => update({ format: g === 'All' ? null : g, category: null, sub: null })}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-md transition-colors ${format === g ? 'bg-background text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {Icon && <Icon className="h-4 w-4" />}{g === 'All' ? 'All formats' : g}
                </button>
              );
            })}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); update({}); }} placeholder="Search posts by title" className="pl-9" aria-label="Search posts" />
          </div>
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} aria-label="Category">
              <Chip active={category === 'All'} onClick={() => update({ category: null, sub: null })}>All categories</Chip>
              {categories.map((c) => <Chip key={c} active={category === c} onClick={() => update({ category: c, sub: null })}>{c}</Chip>)}
            </div>
          )}
          {category !== 'All' && subs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} aria-label="Subcategory">
              <Chip active={sub === 'All'} onClick={() => update({ sub: null })}>All</Chip>
              {subs.map((s) => <Chip key={s} active={sub === s} onClick={() => update({ sub: s })}>{s}</Chip>)}
            </div>
          )}
          {tag && (
            <div className="text-sm text-muted-foreground">
              Tag: <span className="font-medium text-foreground">#{tag}</span>{' '}
              <button className="text-primary hover:underline ml-2" onClick={() => update({ tag: null })}>Clear</button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">No posts match these filters.</p>
        ) : (
          <>
            {picks.length > 0 && page === 1 && category === 'All' && !tag && !ql && (
              <div className="mb-10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"><Star className="h-5 w-5 text-primary" />Editor's Pick</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {picks.map((p) => (
                    <Link key={p.id} to={postPath(p)} className="surface-elevated flex gap-3 items-start p-4 rounded-md border border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
                      {p.thumbnail_url && <img src={p.thumbnail_url} alt="" loading="lazy" className="w-20 h-14 object-contain rounded bg-muted/30 shrink-0" />}
                      <div className="min-w-0">
                        <span className="text-xs text-primary font-medium">{p.category}</span>
                        <p className="text-sm font-semibold text-foreground line-clamp-2">{p.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mb-4">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((p) => {
                const img = p.thumbnail_url || (p.media_url && /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(p.media_url) ? p.media_url : null);
                const d = p.item_date || p.published_at;
                const href = postPath(p);
                const grp = mediaGroupOf(p.media_kind);
                const FIcon = FORMAT_ICON[grp];
                return (
                  <article key={p.id} className="bg-card rounded-lg overflow-hidden border border-border/60 hover:shadow-lg transition-shadow flex flex-col">
                    {img && (
                      <Link to={href} className="block aspect-[16/9] bg-muted/30">
                        <img src={img} alt={p.title} loading="lazy" className="w-full h-full object-contain" />
                      </Link>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground" title={grp}><FIcon className="h-3.5 w-3.5" />{grp}</span>
                        {type === 'All' && p.post_type && <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{p.post_type}</span>}
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{p.category}</span>
                        {p.sub_category && <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{p.sub_category}</span>}
                      </div>
                      <Link to={href}><h3 className="text-lg font-semibold text-foreground mb-2 break-words hover:text-primary transition-colors">{p.title}</h3></Link>
                      {p.excerpt && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{p.excerpt}</p>}
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-xs">
                          {p.tags.slice(0, 4).map((t) => (
                            <button key={t} onClick={() => update({ tag: t })} className="text-muted-foreground hover:text-primary">#{t}</button>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {d && <><Calendar className="h-3 w-3" />{new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>}
                        </span>
                        <Link to={href} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">{grp === 'Read' ? 'Read' : grp === 'Watch' ? 'Watch' : 'Listen'} <ArrowRight className="h-4 w-4" /></Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10 text-sm">
                <button disabled={page === 1} onClick={() => { update({ page: String(page - 1) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Prev</button>
                <span className="text-muted-foreground">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => { update({ page: String(page + 1) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export { POST_TYPES };
