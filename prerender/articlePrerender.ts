import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { ARTICLE_SITE, articlePath, articleShareImage } from '../src/lib/articleMetadata';

type Article = { id: string; title: string; excerpt: string | null; thumbnail_url: string | null; media_url: string | null };
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function articleHtml(template: string, article: Article): string {
  const title = `${article.title} | SERNET Financial Services`;
  const description = (article.excerpt || article.title).replace(/<[^>]+>/g, '').slice(0, 160);
  const url = `${ARTICLE_SITE}${articlePath(article.id)}`;
  const image = articleShareImage(article.thumbnail_url || (/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(article.media_url || '') ? article.media_url : null));
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" data-prerender="true" />`,
    ...Object.entries({ 'og:title': title, 'og:description': description, 'og:url': url, 'og:type': 'article', 'og:site_name': 'SERNET Financial Services', ...(image ? { 'og:image': image, 'og:image:width': '1200', 'og:image:height': '630' } : {}) }).map(([property, value]) => `<meta property="${property}" content="${esc(value)}" />`),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, ...(image ? { 'twitter:image': image } : {}) }).map(([name, value]) => `<meta name="${name}" content="${esc(value)}" />`),
  ].join('\n');
  return template.replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name=["'](?:description|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '')
    .replace('</head>', `${tags}\n</head>`);
}

export function articlePrerender(env: Record<string, string>): Plugin {
  let outDir = 'dist';
  return {
    name: 'sernet-article-prerender', apply: 'build',
    configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
    async closeBundle() {
      const url = env.VITE_SUPABASE_URL;
      const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error('[article prerender] Missing backend configuration');
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      let count = 0;
      for (let offset = 0; ; offset += 500) {
        const response = await fetch(`${url}/rest/v1/articles?select=id,title,excerpt,thumbnail_url,media_url&status=eq.published&order=id.asc&limit=500&offset=${offset}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
        if (!response.ok) throw new Error(`[article prerender] CMS read failed: ${response.status}`);
        const articles = await response.json() as Article[];
        for (const article of articles) {
          const dir = path.join(outDir, articlePath(article.id));
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'index.html'), articleHtml(template, article));
          count++;
        }
        if (articles.length < 500) break;
      }
      console.log(`[article prerender] Wrote sharing metadata for ${count} published articles`);
    },
  };
}