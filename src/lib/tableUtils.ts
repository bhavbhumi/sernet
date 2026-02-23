/**
 * Converts HTML table content from clipboard paste into markdown pipe-table syntax.
 * Call this in the onPaste handler of body textareas.
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

    // Normalize column count
    const maxCols = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      while (r.length < maxCols) r.push('');
      return r;
    });

    // Build markdown table
    const headerRow = `| ${normalized[0].join(' | ')} |`;
    const separatorRow = `| ${normalized[0].map(() => '---').join(' | ')} |`;
    const dataRows = normalized.slice(1).map(r => `| ${r.join(' | ')} |`);

    results.push([headerRow, separatorRow, ...dataRows].join('\n'));
  });

  return results.length > 0 ? results.join('\n\n') : null;
}

/**
 * Creates an onPaste handler for a textarea that auto-converts HTML tables to markdown.
 * Preserves the rest of the pasted content as plain text.
 */
export function createTablePasteHandler(
  setForm: (updater: (prev: any) => any) => void,
  fieldKey: string = 'body'
) {
  return (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlData = e.clipboardData.getData('text/html');
    if (!htmlData) return; // Let default paste handle plain text

    const markdownTable = htmlTableToMarkdown(htmlData);
    if (!markdownTable) return; // No tables found, let default paste happen

    e.preventDefault();

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const newValue =
      currentValue.substring(0, start) +
      '\n' + markdownTable + '\n' +
      currentValue.substring(end);

    setForm((f: any) => ({ ...f, [fieldKey]: newValue }));

    // Restore cursor position after the inserted table
    requestAnimationFrame(() => {
      const newPos = start + markdownTable.length + 2;
      textarea.selectionStart = textarea.selectionEnd = newPos;
    });
  };
}
