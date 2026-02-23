/**
 * Converts HTML table content from clipboard paste into markdown pipe-table syntax.
 */
export function htmlTableToMarkdown(html: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tables = doc.querySelectorAll('table');
  if (tables.length === 0) return null;

  const results: string[] = [];

  tables.forEach((table) => {
    const rows: string[][] = [];
    table.querySelectorAll('tr').forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll('th, td').forEach((cell) => {
        cells.push((cell.textContent ?? '').trim().replace(/\|/g, '\\|'));
      });
      if (cells.length > 0) rows.push(cells);
    });

    if (rows.length < 1) return;

    const maxCols = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      const padded = [...r];
      while (padded.length < maxCols) padded.push('');
      return padded;
    });

    const headerRow = `| ${normalized[0].join(' | ')} |`;
    const separatorRow = `| ${normalized[0].map(() => '---').join(' | ')} |`;
    const dataRows = normalized.slice(1).map(r => `| ${r.join(' | ')} |`);

    results.push([headerRow, separatorRow, ...dataRows].join('\n'));
  });

  return results.length > 0 ? results.join('\n\n') : null;
}

/**
 * Converts tab-separated plain text into markdown pipe-table syntax.
 */
export function tabTextToMarkdown(text: string): string | null {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return null;

  // Check if lines are consistently tab-separated with 2+ columns
  const splitLines = lines.map(l => l.split('\t').map(c => c.trim()));
  const colCounts = splitLines.map(r => r.filter(c => c.length > 0).length);

  // Need at least 2 columns consistently
  if (colCounts[0] < 2) return null;
  // At least 60% of rows should have similar column count (allow some variance)
  const expectedCols = colCounts[0];
  const matching = colCounts.filter(c => c >= 2 && Math.abs(c - expectedCols) <= 1).length;
  if (matching / colCounts.length < 0.6) return null;

  const maxCols = Math.max(...splitLines.map(r => r.length));
  const normalized = splitLines.map(r => {
    const padded = [...r];
    while (padded.length < maxCols) padded.push('');
    return padded.map(c => c.replace(/\|/g, '\\|'));
  });

  const headerRow = `| ${normalized[0].join(' | ')} |`;
  const separatorRow = `| ${normalized[0].map(() => '---').join(' | ')} |`;
  const dataRows = normalized.slice(1).map(r => `| ${r.join(' | ')} |`);

  return [headerRow, separatorRow, ...dataRows].join('\n');
}

/**
 * Creates an onPaste handler for a textarea that auto-converts tables to markdown.
 * Handles both HTML tables (from web) and tab-separated text (from Excel/Sheets).
 */
export function createTablePasteHandler(
  setForm: (updater: (prev: any) => any) => void,
  fieldKey: string = 'body'
) {
  return (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Try HTML clipboard first (web tables)
    const htmlData = e.clipboardData.getData('text/html');
    let markdownTable: string | null = null;

    if (htmlData) {
      markdownTable = htmlTableToMarkdown(htmlData);
    }

    // If no HTML table found, try plain text with tabs (Excel/Sheets)
    if (!markdownTable) {
      const plainText = e.clipboardData.getData('text/plain');
      if (plainText && plainText.includes('\t')) {
        markdownTable = tabTextToMarkdown(plainText);
      }
    }

    if (!markdownTable) return; // No table detected, let default paste happen

    e.preventDefault();

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const prefix = currentValue.substring(0, start);
    const suffix = currentValue.substring(end);
    const newValue = prefix + (prefix.length > 0 ? '\n' : '') + markdownTable + '\n' + suffix;

    setForm((f: any) => ({ ...f, [fieldKey]: newValue }));

    // Restore cursor position after the inserted table
    requestAnimationFrame(() => {
      const newPos = start + markdownTable!.length + 2;
      textarea.selectionStart = textarea.selectionEnd = newPos;
    });
  };
}
