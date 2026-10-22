export const ARTICLE_SITE = 'https://sernetindia.com';

export function articlePath(id: string, contentType?: string | null): string {
  return contentType === 'analysis' ? `/insights/analysis/${id}` : `/insights/articles/${id}`;
}

export function articleShareImage(image?: string | null): string | undefined {
  if (!image) return undefined;
  const url = new URL(image, ARTICLE_SITE);
  if (url.protocol !== 'https:') return undefined;
  if (url.pathname.includes('/storage/v1/object/public/')) {
    url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    url.searchParams.set('width', '600');
    url.searchParams.set('height', '315');
    url.searchParams.set('resize', 'cover');
    url.searchParams.set('quality', '60');
  }
  return url.href;
}