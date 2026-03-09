import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Upload, Copy, Search, Image, FileText, Film, Music,
  RefreshCw, ExternalLink, FolderOpen, CheckCircle2
} from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const BUCKET = 'cms-media';
const MAX_SIZE_MB = 5;

type MediaFile = {
  name: string;
  id: string;
  updated_at: string;
  metadata?: { size?: number; mimetype?: string };
  publicUrl: string;
};

function fileIcon(mime?: string) {
  if (!mime) return <FileText className="h-8 w-8 text-muted-foreground" />;
  if (mime.startsWith('image/')) return null; // show thumbnail
  if (mime.startsWith('video/')) return <Film className="h-8 w-8 text-muted-foreground" />;
  if (mime.startsWith('audio/')) return <Music className="h-8 w-8 text-muted-foreground" />;
  return <FileText className="h-8 w-8 text-muted-foreground" />;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaLibrary() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'document' | 'video'>('all');

  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ['media_library'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'updated_at', order: 'desc' },
      });
      if (error) throw error;
      return (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          ...f,
          publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        })) as MediaFile[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.storage.from(BUCKET).remove([name]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media_library'] });
      toast.success('File deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let success = 0;
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_SIZE_MB}MB limit`);
        continue;
      }
      const ext = file.name.split('.').pop();
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, { upsert: false });
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      success++;
    }
    setUploading(false);
    if (success > 0) { toast.success(`${success} file(s) uploaded`); refetch(); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    toast.success('URL copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const mimeType = (f: MediaFile) => f.metadata?.mimetype ?? '';

  const filtered = files.filter(f => {
    const mime = mimeType(f);
    const matchFilter =
      filter === 'all' ||
      (filter === 'image' && mime.startsWith('image/')) ||
      (filter === 'document' && (mime.includes('pdf') || mime.includes('word') || mime.includes('sheet') || mime.includes('text'))) ||
      (filter === 'video' && (mime.startsWith('video/') || mime.startsWith('audio/')));
    const matchSearch = search === '' || f.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Stats
  const total = files.length;
  const images = files.filter(f => mimeType(f).startsWith('image/')).length;
  const docs = files.filter(f => { const m = mimeType(f); return m.includes('pdf') || m.includes('word') || m.includes('sheet'); }).length;
  const totalSize = files.reduce((acc, f) => acc + (f.metadata?.size ?? 0), 0);

  return (
    <AdminLayout
      title="Media Library"
      subtitle="Upload, browse and manage all site media assets"
    >
      {/* Stat chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Total Files', value: total, color: 'bg-muted/60 text-foreground border-border' },
          { label: 'Images', value: images, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200' },
          { label: 'Documents', value: docs, color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200' },
          { label: 'Storage Used', value: formatBytes(totalSize), color: 'bg-muted text-muted-foreground border-border' },
        ].map(chip => (
          <span key={chip.label} className={`text-xs font-medium px-3 py-1 rounded-full border ${chip.color}`}>
            {chip.label}: <span className="font-bold">{chip.value}</span>
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1">
          {(['all', 'image', 'document', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-8 gap-1.5 text-xs"
          >
            {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*,audio/*"
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Drop zone hint */}
      <div
        className="mb-5 border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
      >
        <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p>Drag & drop files here or <span className="text-primary underline">browse</span></p>
        <p className="text-xs mt-1">Max {MAX_SIZE_MB}MB per file · Images, PDFs, Office docs, Video, Audio</p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Loading media…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Image className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No files found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(file => {
            const mime = mimeType(file);
            const isImage = mime.startsWith('image/');
            const isCopied = copied === file.publicUrl;
            return (
              <div
                key={file.id}
                className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                {/* Preview */}
                <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 p-2">
                      {fileIcon(mime)}
                      <span className="text-xs text-muted-foreground uppercase font-mono">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs text-foreground font-medium truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.metadata?.size)}</p>
                </div>

                {/* Actions – shown on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-full text-xs gap-1"
                    onClick={() => copyUrl(file.publicUrl)}
                  >
                    {isCopied ? <><CheckCircle2 className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy URL</>}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-full text-xs gap-1"
                    onClick={() => window.open(file.publicUrl, '_blank')}
                  >
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono text-xs break-all">{deleteTarget?.name}</span> will be permanently removed from the media library. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.name)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
