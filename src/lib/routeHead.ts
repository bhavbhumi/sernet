const SITE = "https://sernetindia.com";
const SITE_NAME = "SERNET Financial Services";

/** Server-rendered title, description and canonical for a public page (mirrors SEOHead). */
export function pageHead({ title, description, path }: { title: string; description: string; path: string }) {
  const rawTitle = `${title} | ${SITE_NAME}`;
  const fullTitle = rawTitle.length > 60 ? `${rawTitle.slice(0, 57)}…` : rawTitle;
  const url = `${SITE}${path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
