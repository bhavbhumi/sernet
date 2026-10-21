import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { PostsContent } from '@/components/insights/PostsContent';
import { BulletinContent } from '@/components/insights/BulletinContent';
import { POST_TYPES, typeSlug, typeFromSlug } from '@/lib/insightsTaxonomy';

const tabs = [
  { slug: 'all', label: 'All Posts' },
  ...POST_TYPES.map((t) => ({ slug: typeSlug(t), label: t })),
  { slug: 'bulletin', label: 'Bulletin' },
];

const Insights = () => {
  const [params, setParams] = useSearchParams();
  const raw = (params.get('tab') ?? 'all').toLowerCase();
  const active = tabs.some((t) => t.slug === raw) ? raw : 'all';
  const activeLabel = tabs.find((t) => t.slug === active)!.label;

  return (
    <Layout>
      <SEOHead
        title={active === 'all' ? 'Insights' : `${activeLabel} Insights`}
        description="Articles and market updates on macro & markets, investment, insurance, trading, credit and personal finance from SERNET Financial Services."
        path={active === 'all' ? '/insights' : `/insights?tab=${active}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'SERNET Insights',
          url: 'https://sernetindia.com/insights',
          isPartOf: { '@type': 'WebSite', name: 'SERNET Financial Services', url: 'https://sernetindia.com' },
          about: [...POST_TYPES],
        }}
      />
      <PageHero
        title="Stay ahead with expert"
        highlight="Insights"
        description="Markets, investment, insurance, trading, credit and personal finance — organised so you can find what matters."
      />

      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                role="tab"
                aria-selected={active === tab.slug}
                onClick={() => setParams(tab.slug === 'all' ? {} : { tab: tab.slug })}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  active === tab.slug ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {active === tab.slug && (
                  <motion.div layoutId="insights-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {active === 'bulletin' ? <BulletinContent /> : <PostsContent key={active} type={typeFromSlug(active)} />}
    </Layout>
  );
};

export default Insights;
