import sanitizeHtml from 'sanitize-html';

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions & { allowedEmptyAttributes: string[] } = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'h1', 'h2', 'h3', 'h4', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    'span', 'u', 's', 'sup', 'sub', 'del', 'ins', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'width', 'height', 'loading'],
    td: ['colspan', 'rowspan', 'scope'],
    th: ['colspan', 'rowspan', 'scope'],
  },
  allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  allowedEmptyAttributes: ['alt'],
};

/** Sanitizes CMS rich text at the HTML rendering boundary for both SSR and browser output. */
export function sanitizeRichText(value: string | null | undefined): string {
  return sanitizeHtml(value ?? '', RICH_TEXT_OPTIONS);
}