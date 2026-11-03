import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2, AlertTriangle, Download, Loader2 } from 'lucide-react';

interface FieldMapping {
  csvHeader: string;
  dbColumn: string;
  required?: boolean;
}

interface BulkImportDialogProps {
  open: boolean;
  onClose: (imported?: boolean) => void;
  tableName: string;
  title: string;
  fieldMappings: FieldMapping[];
  defaultValues?: Record<string, any>;
  sampleCsvUrl?: string;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.match(/("([^"]|"")*"|[^,]*)/g) || [];
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] || '').trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    });
    return row;
  });
}

export function BulkImportDialog({ open, onClose, tableName, title, fieldMappings, defaultValues = {} }: BulkImportDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const errors: string[] = [];
    let success = 0;

    try {
      const reader = new FileReader();
      const text = await new Promise<string>((res) => {
        reader.onload = (ev) => res(ev.target?.result as string);
        reader.readAsText(file);
      });

      const rows = parseCSV(text);
      // Batch insert in chunks of 50
      const BATCH = 50;
      for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH).map((row, idx) => {
          const record: Record<string, any> = { ...defaultValues };
          for (const mapping of fieldMappings) {
            const val = row[mapping.csvHeader]?.trim();
            if (mapping.required && !val) {
              errors.push(`Row ${i + idx + 2}: Missing required field "${mapping.csvHeader}"`);
              return null;
            }
            if (val) record[mapping.dbColumn] = val;
          }
          return record;
        }).filter(Boolean);

        if (batch.length > 0) {
          const { error } = await supabase.from(tableName as any).insert(batch as any);
          if (error) {
            errors.push(`Batch ${Math.floor(i / BATCH) + 1}: ${error.message}`);
          } else {
            success += batch.length;
          }
        }
      }

      setResult({ success, failed: rows.length - success, errors: errors.slice(0, 10) });
      if (success > 0) toast.success(`${success} records imported`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = () => {
    const headers = fieldMappings.map(m => m.csvHeader).join(',');
    const sample = fieldMappings.map(m => m.required ? 'required' : 'optional').join(',');
    const blob = new Blob([headers + '\n' + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${tableName}_import_template.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={() => { setFile(null); setPreview([]); setResult(null); onClose(!!result?.success); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Bulk Import {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Download CSV template with required columns</p>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={downloadSample}>
              <Download className="h-3 w-3 mr-1" /> Template
            </Button>
          </div>

          {/* File upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <Badge variant="secondary" className="text-[10px]">{preview.length > 0 ? `Preview: ${preview.length} rows` : ''}</Badge>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload CSV file</p>
              </>
            )}
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="rounded-lg border overflow-x-auto max-h-40">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    {Object.keys(preview[0]).slice(0, 5).map(h => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t">
                      {Object.values(row).slice(0, 5).map((v, j) => (
                        <td key={j} className="px-2 py-1 truncate max-w-[120px]">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {result.success > 0 && (
                  <div className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> {result.success} imported</div>
                )}
                {result.failed > 0 && (
                  <div className="flex items-center gap-1 text-red-500 text-xs"><AlertTriangle className="h-3.5 w-3.5" /> {result.failed} failed</div>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="bg-destructive/10 rounded p-2 space-y-1 max-h-24 overflow-y-auto">
                  {result.errors.map((e, i) => <p key={i} className="text-[10px] text-destructive">{e}</p>)}
                </div>
              )}
            </div>
          )}

          {/* Import button */}
          <Button onClick={handleImport} disabled={!file || importing} className="w-full">
            {importing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Importing...</> : `Import ${title}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
