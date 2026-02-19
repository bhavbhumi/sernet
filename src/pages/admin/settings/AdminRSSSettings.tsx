
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Rss, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedEntry { url: string; label: string; }

export default function AdminRSSSettings() {
  const { toast } = useToast();
  const [newsFeeds, setNewsFeeds] = useState<FeedEntry[]>([]);
  const [circularFeeds, setCircularFeeds] = useState<FeedEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('cms_settings') as any).select('key, value').in('key', ['news_source', 'circulars_source']);
      if (data) {
        const newsRow = data.find((d: { key: string }) => d.key === 'news_source');
        const circRow = data.find((d: { key: string }) => d.key === 'circulars_source');
        setNewsFeeds(newsRow?.value?.rss_urls ?? []);
        setCircularFeeds(circRow?.value?.rss_urls ?? []);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const save = async () => {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('cms_settings') as any).update({ value: { type: 'cloud', rss_urls: newsFeeds } }).eq('key', 'news_source');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('cms_settings') as any).update({ value: { type: 'cloud', rss_urls: circularFeeds } }).eq('key', 'circulars_source');
    toast({ title: 'RSS feeds saved' });
    setSaving(false);
  };

  const FeedList = ({
    feeds, setFeeds, title, examples
  }: { feeds: FeedEntry[]; setFeeds: (f: FeedEntry[]) => void; title: string; examples: string[] }) => (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary">{feeds.length} feeds</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={() => setFeeds([...feeds, { url: '', label: '' }])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Feed
        </Button>
      </div>

      {feeds.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
          No RSS feeds configured. Add a feed URL to start syncing content.
          <div className="mt-2 text-xs space-y-0.5">
            {examples.map(e => <div key={e} className="font-mono text-muted-foreground/60">{e}</div>)}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {feeds.map((feed, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Feed label (e.g. SEBI RSS)"
                  value={feed.label}
                  onChange={e => setFeeds(feeds.map((f, j) => j === i ? { ...f, label: e.target.value } : f))}
                />
                <Input
                  className="col-span-2 font-mono text-xs"
                  placeholder="https://rss.feed.url/..."
                  value={feed.url}
                  onChange={e => setFeeds(feeds.map((f, j) => j === i ? { ...f, url: e.target.value } : f))}
                />
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => setFeeds(feeds.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout
      title="RSS Feeds"
      subtitle="Configure RSS feed URLs for News and Circulars — feeds pull in content automatically"
      actions={<Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-1.5" /> {saving ? 'Saving...' : 'Save All'}</Button>}
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-5">
          <FeedList
            feeds={newsFeeds}
            setFeeds={setNewsFeeds}
            title="News RSS Feeds"
            examples={['https://economictimes.indiatimes.com/markets/rss.cms', 'https://feeds.reuters.com/reuters/INtopNews']}
          />
          <FeedList
            feeds={circularFeeds}
            setFeeds={setCircularFeeds}
            title="Circulars RSS Feeds"
            examples={['https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecent=yes&type=circ&format=rss']}
          />

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">How RSS Sync Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• RSS feeds are fetched via a backend function that runs periodically</li>
              <li>• New items are automatically added as <strong>draft</strong> entries in the database</li>
              <li>• Admin can review and publish or delete synced items</li>
              <li>• Manual entries and RSS entries coexist in the same table</li>
            </ul>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
