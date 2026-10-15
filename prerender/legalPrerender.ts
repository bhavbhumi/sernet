// Build-time prerender for compliance pages.
// Writes dist/<route>/index.html with the real page content inside #root so crawlers and
// AI readers get substantive text in the first HTML response. React replaces it on load.
// Sources are the SAME ones the live pages use: legal_pages CMS rows and shared content modules.
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { distributorRegistrations, distributorScope, regulatoryLimits, legalEntityName, pageReviewDates, formatReviewDate } from '../src/lib/regulatoryIdentity';
import * as tf from '../src/content/tickfunds';

const SITE = 'https://sernetindia.com';
const LEGAL_TABS = [
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'policies', label: 'Policies & Procedures' },
  { key: 'disclosures', label: 'Disclosures' },
  { key: 'grievances', label: 'Grievance Redressal' },
];

type Row = { slug: string; title: string; body: string; last_reviewed_on: string | null };

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const identityHtml = () => `
<aside aria-label="SERNET regulatory status" class="rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
  <p><strong class="text-foreground">${esc(legalEntityName)}</strong></p>
  <ul>${distributorRegistrations.map(r => `<li>${r.authority} · ${r.role}: ${r.registration} / EUIN ${r.euin} — first registered ${r.firstRegistered}, valid until ${r.validUntil}</li>`).join('')}</ul>
  <p>${esc(distributorScope)} ${esc(regulatoryLimits)}</p>
</aside>`;

const reviewed = (d?: string | null) => d ? `<p class="text-xs text-muted-foreground">Last reviewed: <time datetime="${d.slice(0, 10)}">${formatReviewDate(d)}</time></p>` : '';

function page(template: string, opts: { title: string; description: string; canonical: string; body: string }) {
  const fullTitle = `${opts.title} | SERNET Financial Services`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(opts.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${SITE}${opts.canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(opts.description)}" />`)
    .replace('</head>', `  <link rel="canonical" href="${SITE}${opts.canonical}" data-prerender="true" />\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"><main data-prerendered="true" class="container-sernet section-padding prose max-w-none">${opts.body}</main></div>`);
  return html;
}

function write(dist: string, route: string, html: string) {
  const dir = path.join(dist, route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

export function legalPrerender(env: Record<string, string>): Plugin {
  let outDir = 'dist';
  return {
    name: 'sernet-legal-prerender',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    async closeBundle() {
      const templatePath = path.join(outDir, 'index.html');
      if (!fs.existsSync(templatePath)) return;
      const template = fs.readFileSync(templatePath, 'utf8');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { JSDOM } = (await import('jsdom' as string)) as any;
      const createDOMPurify = (await import('dompurify')).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const window: any = new JSDOM('').window;
      const purify = createDOMPurify(window);
      // Mirror LegalDocument: sanitize, then stabilise h2 anchors.
      const clean = (body: string) => {
        const doc = new window.DOMParser().parseFromString(purify.sanitize(body), 'text/html');
        const used = new Set<string>();
        doc.querySelectorAll("h2").forEach((h: { id: string }, i: number) => {
          let id = /^legal-section-\d+$/.test(h.id) && !used.has(h.id) ? h.id : `legal-section-${i + 1}`;
          while (used.has(id)) id = `legal-section-${Number(id.replace('legal-section-', '')) + 1}`;
          used.add(id); h.id = id;
        });
        return doc.body.innerHTML;
      };

      // Tick Funds (code-maintained content) — always available.
      const tfBody = `
<h1>${esc(tf.tickfundsHero.heading)}</h1>
<p>${esc(tf.tickfundsHero.intro)}</p>
<ul>${tf.tickfundsHero.hooks.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
<ul>${tf.tickfundsStats.map(s => `<li>${esc(s.value)} — ${esc(s.label)}</li>`).join('')}</ul>
<h2>Why Tick Funds?</h2><ul>${tf.tickfundsFeatures.map(f => `<li><strong>${esc(f.title)}</strong>: ${esc(f.description)}</li>`).join('')}</ul>
<h2>Investment products we distribute</h2><ul>${tf.tickfundsProducts.map(p => `<li><strong>${esc(p.name)}</strong>: ${esc(p.description)}</li>`).join('')}</ul>
<h2>What our investors say</h2><ul>${tf.tickfundsTestimonials.map(t => `<li>“${esc(t.text)}” — ${esc(t.name)}, ${esc(t.role)}</li>`).join('')}</ul>
<h2>Begin your investment journey</h2><ol>${tf.tickfundsSteps.map(s => `<li><strong>${esc(s.title)}</strong>: ${esc(s.description)}</li>`).join('')}</ol>
<h2>Frequently Asked Questions</h2>${tf.tickfundsFaqs.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
<p><strong>Disclaimer:</strong> ${esc(tf.tickfundsDisclaimer)}</p>
${identityHtml()}
${reviewed(pageReviewDates.tickfunds)}`;
      write(outDir, '/tickfunds', page(template, { title: tf.tickfundsSeo.title, description: tf.tickfundsSeo.description, canonical: '/tickfunds', body: tfBody }));

      // CMS documents.
      const url = env.VITE_SUPABASE_URL; const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) { console.warn('[prerender] backend env missing; legal pages left client-rendered'); return; }
      let rows: Row[] = [];
      try {
        const res = await fetch(`${url}/rest/v1/legal_pages?select=slug,title,body,last_reviewed_on`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        rows = (await res.json()) as Row[];
      } catch (e) { console.warn('[prerender] could not fetch legal_pages:', e); return; }
      const bySlug = Object.fromEntries(rows.map(r => [r.slug, r]));

      const charter = bySlug['investor-charter'];
      if (charter?.body) {
        write(outDir, '/investor-charter', page(template, {
          title: 'Investor Charter', canonical: '/investor-charter',
          description: 'SERNET investor rights, responsibilities, onboarding, suitability, portfolio review and customer lifecycle guidance.',
          body: `<h1>Investor Charter</h1>${identityHtml()}${reviewed(charter.last_reviewed_on)}${clean(charter.body)}`,
        }));
      }

      const legalSections = LEGAL_TABS.filter(t => bySlug[t.key]?.body).map(t =>
        `<section id="tab-${t.key}" aria-label="${esc(t.label)}"><h1>${esc(t.label)}</h1><p><a href="/legal?tab=${t.key}">/legal?tab=${t.key}</a></p>${reviewed(bySlug[t.key].last_reviewed_on)}${clean(bySlug[t.key].body)}</section>`).join('<hr />');
      if (legalSections) {
        const legalHtml = page(template, {
          title: 'Legal & Compliance', canonical: '/legal',
          description: 'SERNET terms, privacy, IT & HR policies, disclosures and grievance redressal — AMFI mutual fund and APMI PMS distributor.',
          body: `${identityHtml()}${legalSections}`,
        });
        write(outDir, '/legal', legalHtml);
        write(outDir, '/disclosure', legalHtml.replace(`href="${SITE}/legal" data-prerender`, `href="${SITE}/legal?tab=disclosures" data-prerender`));
      }
      console.log(`[prerender] wrote tickfunds${charter ? ', investor-charter' : ''}${legalSections ? ', legal, disclosure' : ''}`);
    },
  };
}
