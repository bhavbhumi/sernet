
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Upload, Save, Globe, Palette, Type, Image as ImageIcon, RefreshCw,
  Layout, AlignJustify, Plus, Trash2, GripVertical, Twitter, Linkedin,
  Instagram, Youtube, Facebook, Shield, MapPin, Clock, Tag, ChevronRight,
  ChevronDown, Link2
} from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat',
  'Raleway', 'Playfair Display', 'Merriweather', 'Nunito', 'Source Sans 3',
];
const FONT_WEIGHTS = ['300', '400', '500', '600', '700', '800'];
const FONT_SIZES = ['13px', '14px', '15px', '16px', '17px', '18px'];

function useSettings(key: string) {
  return useQuery({
    queryKey: ['site_settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', key)
        .single();
      if (error) throw error;
      return (data as any).value as Record<string, string>;
    },
  });
}

function useSave(key: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: Record<string, string>) => {
      const { error } = await supabase.from('site_settings' as any).update({ value: form }).eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings', key] });
      toast.success('Settings saved');
      onSuccess?.();
    },
    onError: () => toast.error('Failed to save'),
  });
}

// ─── Shared: Upload helper ────────────────────────────────────────────────────
function useUpload() {
  const [uploading, setUploading] = useState<string | null>(null);
  const upload = async (field: string, file: File, cb: (url: string) => void) => {
    setUploading(field);
    const ext = file.name.split('.').pop();
    const path = `site/${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setUploading(null); return; }
    const { data } = supabase.storage.from('cms-media').getPublicUrl(path);
    cb(data.publicUrl);
    setUploading(null);
    toast.success('File uploaded');
  };
  return { uploading, upload };
}

// ─── Shared: Color Row ────────────────────────────────────────────────────────
function ColorRow({ label, fieldKey, form, setForm }: { label: string; fieldKey: string; form: any; setForm: any }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={form[fieldKey] || '#000000'}
        onChange={e => setForm((p: any) => ({ ...p, [fieldKey]: e.target.value }))}
        className="h-10 w-10 rounded-md border border-border cursor-pointer bg-transparent p-0.5 shrink-0"
      />
      <div className="flex-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Input
          value={form[fieldKey] || ''}
          onChange={e => setForm((p: any) => ({ ...p, [fieldKey]: e.target.value }))}
          className="h-8 mt-0.5 font-mono text-xs"
          placeholder="#000000"
        />
      </div>
      <div className="h-10 w-12 rounded-md border border-border shrink-0" style={{ backgroundColor: form[fieldKey] || 'transparent' }} />
    </div>
  );
}

// ─── Shared: Image Field ──────────────────────────────────────────────────────
function ImageField({ fieldKey, label, hint, form, setForm, darkBg = false }: {
  fieldKey: string; label: string; hint: string; form: any; setForm: any; darkBg?: boolean;
}) {
  const { uploading, upload } = useUpload();
  return (
    <Card className="p-4 space-y-3">
      <div>
        <Label className="font-medium text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      {form[fieldKey] ? (
        <div className={`rounded-lg border border-border flex items-center justify-center p-3 ${darkBg ? 'bg-zinc-900' : 'bg-muted/30'}`} style={{ minHeight: 72 }}>
          <img src={form[fieldKey]} alt={label} className="max-h-14 max-w-full object-contain" />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted/20" style={{ minHeight: 72 }}>
          <ImageIcon className="h-8 w-8 opacity-30" />
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={form[fieldKey] || ''}
          onChange={e => setForm((p: any) => ({ ...p, [fieldKey]: e.target.value }))}
          placeholder="Paste URL or upload…"
          className="h-8 text-xs"
        />
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" className="h-8 px-2 gap-1 text-xs pointer-events-none" asChild>
            <span>
              {uploading === fieldKey ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Upload
            </span>
          </Button>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) upload(fieldKey, e.target.files[0], url => setForm((p: any) => ({ ...p, [fieldKey]: url }))); }} />
        </label>
      </div>
    </Card>
  );
}

// ─── Shared: Font Zone Row ────────────────────────────────────────────────────
function FontZoneRow({ zoneKey, label, form, setForm }: { zoneKey: string; label: string; form: any; setForm: any }) {
  const fontKey = `${zoneKey}_font`;
  const weightKey = `${zoneKey}_font_weight`;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end py-3 border-b border-border last:border-0">
      <div>
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <p className="text-xs font-medium text-foreground mt-0.5" style={{ fontFamily: `${form[fontKey] || 'Inter'}, sans-serif`, fontWeight: form[weightKey] || '400' }}>
          Aa — The quick brown fox
        </p>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Font</Label>
        <select
          value={form[fontKey] || 'Inter'}
          onChange={e => setForm((p: any) => ({ ...p, [fontKey]: e.target.value }))}
          className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Weight</Label>
        <select
          value={form[weightKey] || '400'}
          onChange={e => setForm((p: any) => ({ ...p, [weightKey]: e.target.value }))}
          className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {FONT_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── IDENTITY TAB ─────────────────────────────────────────────────────────────
const SOCIAL_FIELDS = [
  { key: 'social_twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/sernet' },
  { key: 'social_linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/sernet' },
  { key: 'social_instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/sernet' },
  { key: 'social_youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@sernet' },
  { key: 'social_facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/sernet' },
];

const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Singapore', 'Asia/Tokyo'];

function IdentityTab() {
  const { data, isLoading } = useSettings('identity');
  const [form, setForm] = useState<Record<string, string>>({
    site_name: 'SERNET', tagline: 'Zero Brokerage. Total Trust.', site_url: 'https://sernet.lovable.app',
    region: 'IN', country: 'India', timezone: 'Asia/Kolkata',
    seo_title: '', seo_description: '', seo_keywords: '',
    schema_org_type: 'FinancialService', schema_org_name: 'SERNET Financial Services',
    schema_address: 'Mumbai, Maharashtra, India', schema_phone: '',
    social_twitter: '', social_linkedin: '', social_instagram: '', social_youtube: '', social_facebook: '',
    logo_url: '', logo_dark_url: '', favicon_url: '', og_image_url: '',
  });
  const save = useSave('identity');
  useEffect(() => { if (data) setForm(prev => ({ ...prev, ...data })); }, [data]);
  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Site Identity */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Site Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Site Name</Label>
            <Input value={form.site_name} onChange={e => setForm(p => ({ ...p, site_name: e.target.value }))} placeholder="SERNET" />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} placeholder="Zero Brokerage. Total Trust." />
          </div>
          <div className="space-y-1.5">
            <Label>Site URL</Label>
            <Input value={form.site_url} onChange={e => setForm(p => ({ ...p, site_url: e.target.value }))} placeholder="https://sernet.lovable.app" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Region & Locale */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Region & Locale</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Region Code</Label>
            <Input value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))} placeholder="IN" maxLength={4} />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="India" />
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <select
              value={form.timezone}
              onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
      </section>

      <Separator />

      {/* SEO & Meta */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> SEO & Meta</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Default SEO Title <span className="text-xs text-muted-foreground">(60 chars)</span></Label>
            <Input value={form.seo_title} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))} maxLength={60} placeholder="SERNET – Zero Brokerage Trading & Investment Services" />
            <p className="text-xs text-muted-foreground text-right">{(form.seo_title || '').length}/60</p>
          </div>
          <div className="space-y-1.5">
            <Label>Default Meta Description <span className="text-xs text-muted-foreground">(160 chars)</span></Label>
            <Textarea value={form.seo_description} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))} maxLength={160} rows={3} placeholder="SERNET offers zero brokerage trading…" />
            <p className="text-xs text-muted-foreground text-right">{(form.seo_description || '').length}/160</p>
          </div>
          <div className="space-y-1.5">
            <Label>Keywords <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input value={form.seo_keywords} onChange={e => setForm(p => ({ ...p, seo_keywords: e.target.value }))} placeholder="zero brokerage, stock trading, mutual funds…" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Schema.org */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Schema.org / Structured Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Schema Type</Label>
            <select
              value={form.schema_org_type}
              onChange={e => setForm(p => ({ ...p, schema_org_type: e.target.value }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {['FinancialService', 'Organization', 'LocalBusiness', 'Corporation'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Organisation Name</Label>
            <Input value={form.schema_org_name} onChange={e => setForm(p => ({ ...p, schema_org_name: e.target.value }))} placeholder="SERNET Financial Services" />
          </div>
          <div className="space-y-1.5">
            <Label>Business Address</Label>
            <Input value={form.schema_address} onChange={e => setForm(p => ({ ...p, schema_address: e.target.value }))} placeholder="Mumbai, Maharashtra, India" />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.schema_phone} onChange={e => setForm(p => ({ ...p, schema_phone: e.target.value }))} placeholder="+91-XXXXXXXXXX" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Social Media */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Social Media Links</h3>
        <div className="space-y-3">
          {SOCIAL_FIELDS.map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center bg-muted/30 shrink-0">
                <f.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">{f.label}</Label>
                <Input value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="h-8 text-xs" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Identity Settings
      </Button>
    </div>
  );
}

// ─── BRANDING TAB ─────────────────────────────────────────────────────────────
function BrandingTab() {
  const { data, isLoading } = useSettings('branding');
  const [form, setForm] = useState<Record<string, string>>({
    logo_url: '', logo_dark_url: '', favicon_url: '', og_image_url: '',
    logo_light_width: '160', logo_light_height: '40',
    logo_dark_width: '160', logo_dark_height: '40',
    favicon_size: '32', og_image_width: '1200', og_image_height: '630',
    primary_color_1: '#1B3F77', primary_color_2: '#1a56db',
    secondary_color_1: '#D4AF37', secondary_color_2: '#B8962E',
    accent_color_1: '#0694a2', accent_color_2: '#7e3af2',
    neutral_color: '#6B7280',
  });
  const save = useSave('branding');
  useEffect(() => { if (data) setForm(prev => ({ ...prev, ...data })); }, [data]);
  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  const imageFields = [
    { key: 'logo_url', label: 'Logo (Light Mode)', hint: 'SVG or PNG, transparent background', wKey: 'logo_light_width', hKey: 'logo_light_height', darkBg: false },
    { key: 'logo_dark_url', label: 'Logo (Dark Mode)', hint: 'White/inverted version for dark backgrounds', wKey: 'logo_dark_width', hKey: 'logo_dark_height', darkBg: true },
    { key: 'favicon_url', label: 'Favicon', hint: 'ICO or PNG, 32×32 px minimum', wKey: 'favicon_size', hKey: 'favicon_size', darkBg: false },
    { key: 'og_image_url', label: 'OG / Social Share Image', hint: '1200×630 px PNG or JPG', wKey: 'og_image_width', hKey: 'og_image_height', darkBg: false },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Logos & Images */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><ImageIcon className="h-4 w-4 text-primary" /> Logos & Images</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground mb-4">
          <img src={sernetLogo} alt="Current Logo" className="h-6 object-contain" />
          <p>Currently using built-in logo asset. Upload new files below to override.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {imageFields.map(f => (
            <div key={f.key} className="space-y-3">
              <ImageField fieldKey={f.key} label={f.label} hint={f.hint} form={form} setForm={setForm} darkBg={f.darkBg} />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Width (px)</Label>
                  <Input value={form[f.wKey] || ''} onChange={e => setForm(p => ({ ...p, [f.wKey]: e.target.value }))} className="h-7 text-xs" placeholder="160" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Height (px)</Label>
                  <Input value={form[f.hKey] || ''} onChange={e => setForm(p => ({ ...p, [f.hKey]: e.target.value }))} className="h-7 text-xs" placeholder="40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Color Palette */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Colour Palette</h3>
        <p className="text-xs text-muted-foreground mb-4">Reference values for your brand guide. To apply live, update CSS variables in index.css.</p>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Primary Colours</p>
          <ColorRow label="Primary 1 (Navy)" fieldKey="primary_color_1" form={form} setForm={setForm} />
          <ColorRow label="Primary 2 (Blue)" fieldKey="primary_color_2" form={form} setForm={setForm} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Secondary Colours</p>
          <ColorRow label="Secondary 1 (Gold)" fieldKey="secondary_color_1" form={form} setForm={setForm} />
          <ColorRow label="Secondary 2 (Dark Gold)" fieldKey="secondary_color_2" form={form} setForm={setForm} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Accent Colours</p>
          <ColorRow label="Accent 1 (Teal)" fieldKey="accent_color_1" form={form} setForm={setForm} />
          <ColorRow label="Accent 2 (Violet)" fieldKey="accent_color_2" form={form} setForm={setForm} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Neutral</p>
          <ColorRow label="Neutral / Grey" fieldKey="neutral_color" form={form} setForm={setForm} />
        </div>

        {/* Swatch preview row */}
        <div className="flex gap-2 mt-4">
          {['primary_color_1','primary_color_2','secondary_color_1','secondary_color_2','accent_color_1','accent_color_2','neutral_color'].map(k => (
            <div key={k} title={k} className="h-8 flex-1 rounded-md border border-border" style={{ backgroundColor: form[k] || '#ccc' }} />
          ))}
        </div>
      </section>

      <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Branding
      </Button>
    </div>
  );
}

// ─── TYPOGRAPHY TAB ───────────────────────────────────────────────────────────
const FONT_ZONES = [
  { key: 'site', label: 'Site Default' },
  { key: 'header', label: 'Header / Nav' },
  { key: 'footer', label: 'Footer' },
  { key: 'page_title', label: 'Page Title / H1' },
  { key: 'section_title', label: 'Section Title / H2' },
  { key: 'subtitle', label: 'Subtitle / H3' },
  { key: 'body', label: 'Body Text' },
  { key: 'tab', label: 'Tabs & Labels' },
  { key: 'other', label: 'Other / Misc' },
];

function TypographyTab() {
  const { data, isLoading } = useSettings('typography');
  const [form, setForm] = useState<Record<string, string>>({
    site_font: 'Montserrat', site_font_weight: '400',
    header_font: 'Montserrat', header_font_weight: '600',
    footer_font: 'Inter', footer_font_weight: '400',
    page_title_font: 'Montserrat', page_title_font_weight: '700',
    section_title_font: 'Montserrat', section_title_font_weight: '600',
    subtitle_font: 'Inter', subtitle_font_weight: '400',
    body_font: 'Inter', body_font_weight: '400',
    tab_font: 'Inter', tab_font_weight: '500',
    other_font: 'Inter', other_font_weight: '400',
    base_font_size: '14px', heading_scale: '1.25',
  });
  const save = useSave('typography');
  useEffect(() => { if (data) setForm(prev => ({ ...prev, ...data })); }, [data]);
  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-200 text-xs text-yellow-700 dark:text-yellow-400">
        Typography selections are saved as brand reference values. To apply fonts live, update the font imports and Tailwind config accordingly.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Base Font Size</Label>
          <select value={form.base_font_size} onChange={e => setForm(p => ({ ...p, base_font_size: e.target.value }))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Heading Scale Ratio</Label>
          <select value={form.heading_scale} onChange={e => setForm(p => ({ ...p, heading_scale: e.target.value }))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {['1.125','1.2','1.25','1.333','1.414','1.5'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Separator />

      <div>
        <div className="grid grid-cols-3 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
          <span>Zone</span>
          <span>Font Family</span>
          <span>Weight</span>
        </div>
        {FONT_ZONES.map(z => <FontZoneRow key={z.key} zoneKey={z.key} label={z.label} form={form} setForm={setForm} />)}
      </div>

      <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Typography
      </Button>
    </div>
  );
}

// ─── HEADER TAB ───────────────────────────────────────────────────────────────
function HeaderTab() {
  const { data, isLoading } = useSettings('header');
  const [form, setForm] = useState<Record<string, string>>({
    show_logo: 'true', show_site_name: 'true', show_nav: 'true',
    show_theme_toggle: 'true', show_language_switcher: 'true',
    show_cta_button: 'true', cta_label: 'Open Account', cta_url: '/open-account',
    sticky: 'true', transparent_on_hero: 'false',
    border_bottom: 'true', height: '64', bg_color: '', text_color: '',
  });
  const save = useSave('header');
  useEffect(() => { if (data) setForm(prev => ({ ...prev, ...data })); }, [data]);
  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  const bool = (k: string) => form[k] === 'true';
  const toggle = (k: string) => setForm(p => ({ ...p, [k]: p[k] === 'true' ? 'false' : 'true' }));

  const toggleRow = (k: string, label: string, hint: string) => (
    <div key={k} className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={bool(k)} onCheckedChange={() => toggle(k)} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-0">
        {toggleRow('show_logo', 'Show Logo', 'Display the site logo in the header')}
        {toggleRow('show_site_name', 'Show Site Name', 'Display "SERNET" text alongside logo')}
        {toggleRow('show_nav', 'Show Navigation', 'Show the main navigation menu')}
        {toggleRow('show_theme_toggle', 'Theme Toggle', 'Light/dark mode switcher button')}
        {toggleRow('show_language_switcher', 'Language Switcher', 'Multi-language dropdown')}
        {toggleRow('show_cta_button', 'CTA Button', 'Primary call-to-action button')}
        {toggleRow('sticky', 'Sticky Header', 'Header stays fixed on scroll')}
        {toggleRow('transparent_on_hero', 'Transparent on Hero', 'Transparent header over hero sections')}
        {toggleRow('border_bottom', 'Border Bottom', 'Show separator line below header')}
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>CTA Button Label</Label>
          <Input value={form.cta_label} onChange={e => setForm(p => ({ ...p, cta_label: e.target.value }))} placeholder="Open Account" />
        </div>
        <div className="space-y-1.5">
          <Label>CTA URL</Label>
          <Input value={form.cta_url} onChange={e => setForm(p => ({ ...p, cta_url: e.target.value }))} placeholder="/open-account" />
        </div>
        <div className="space-y-1.5">
          <Label>Header Height (px)</Label>
          <Input value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} placeholder="64" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label>Background Colour <span className="text-xs text-muted-foreground">(leave blank = theme default)</span></Label>
          <Input value={form.bg_color} onChange={e => setForm(p => ({ ...p, bg_color: e.target.value }))} placeholder="e.g. #ffffff" />
        </div>
        <div className="space-y-1.5">
          <Label>Text Colour</Label>
          <Input value={form.text_color} onChange={e => setForm(p => ({ ...p, text_color: e.target.value }))} placeholder="e.g. #1B3F77" />
        </div>
      </div>

      <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Header Settings
      </Button>
    </div>
  );
}

// ─── FOOTER TAB ───────────────────────────────────────────────────────────────
function FooterTab() {
  const { data, isLoading } = useSettings('footer');
  const [form, setForm] = useState<Record<string, string>>({
    show_logo: 'true', show_tagline: 'true', show_social_icons: 'true',
    show_newsletter: 'false', show_sebi_reg: 'true',
    sebi_reg_text: 'SEBI Registered Investment Adviser',
    disclaimer: 'Investments in securities market are subject to market risks. Read all the related documents carefully before investing.',
    copyright_text: '© 2025 SERNET Financial Services Pvt. Ltd. All rights reserved.',
    show_quick_links: 'true', show_services_links: 'true', show_legal_links: 'true',
    footer_columns: '4', bg_color: '', text_color: '',
  });
  const save = useSave('footer');
  useEffect(() => { if (data) setForm(prev => ({ ...prev, ...data })); }, [data]);
  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  const bool = (k: string) => form[k] === 'true';
  const toggle = (k: string) => setForm(p => ({ ...p, [k]: p[k] === 'true' ? 'false' : 'true' }));
  const toggleRow = (k: string, label: string, hint: string) => (
    <div key={k} className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={bool(k)} onCheckedChange={() => toggle(k)} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-0">
        {toggleRow('show_logo', 'Show Logo', 'Display logo in footer')}
        {toggleRow('show_tagline', 'Show Tagline', 'Display tagline below logo')}
        {toggleRow('show_social_icons', 'Social Media Icons', 'Show social links row')}
        {toggleRow('show_newsletter', 'Newsletter Signup', 'Email subscription form in footer')}
        {toggleRow('show_sebi_reg', 'SEBI Registration', 'Show regulatory registration badge')}
        {toggleRow('show_quick_links', 'Quick Links Column', 'Display quick navigation links')}
        {toggleRow('show_services_links', 'Services Links Column', 'Display services navigation links')}
        {toggleRow('show_legal_links', 'Legal Links Column', 'Display legal/compliance links')}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>SEBI Reg. Text</Label>
          <Input value={form.sebi_reg_text} onChange={e => setForm(p => ({ ...p, sebi_reg_text: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Footer Disclaimer</Label>
          <Textarea value={form.disclaimer} onChange={e => setForm(p => ({ ...p, disclaimer: e.target.value }))} rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label>Copyright Text</Label>
          <Input value={form.copyright_text} onChange={e => setForm(p => ({ ...p, copyright_text: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Number of Columns</Label>
            <select value={form.footer_columns} onChange={e => setForm(p => ({ ...p, footer_columns: e.target.value }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {['2','3','4','5'].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Background Colour</Label>
            <Input value={form.bg_color} onChange={e => setForm(p => ({ ...p, bg_color: e.target.value }))} placeholder="#0f172a" />
          </div>
        </div>
      </div>

      <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Footer Settings
      </Button>
    </div>
  );
}

// ─── PAGE HIERARCHY TAB ───────────────────────────────────────────────────────
interface HierarchyItem {
  path: string;
  page_name: string;
  tab_name: string;
  parent: string | null;
  order: number;
}

function PageHierarchyTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettings('page_hierarchy');
  const [items, setItems] = useState<HierarchyItem[]>([]);
  const [addForm, setAddForm] = useState<HierarchyItem>({ path: '', page_name: '', tab_name: '', parent: null, order: 0 });
  const [adding, setAdding] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data) {
      const h = (data as any).hierarchy;
      if (Array.isArray(h)) setItems(h);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async (hierarchy: HierarchyItem[]) => {
      const { error } = await supabase.from('site_settings' as any).update({ value: { hierarchy } }).eq('key', 'page_hierarchy');
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_settings', 'page_hierarchy'] }); toast.success('Hierarchy saved'); },
    onError: () => toast.error('Failed to save'),
  });

  const roots = items.filter(i => !i.parent).sort((a, b) => a.order - b.order);
  const children = (parentPath: string) => items.filter(i => i.parent === parentPath).sort((a, b) => a.order - b.order);

  const deleteItem = (path: string) => {
    const updated = items.filter(i => i.path !== path && i.parent !== path);
    setItems(updated);
    save.mutate(updated);
  };

  const addItem = () => {
    if (!addForm.path || !addForm.page_name) return toast.error('Path and Page Name are required');
    const updated = [...items, { ...addForm, order: items.length + 1 }];
    setItems(updated);
    save.mutate(updated);
    setAddForm({ path: '', page_name: '', tab_name: '', parent: null, order: 0 });
    setAdding(false);
  };

  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{items.length} pages in hierarchy</p>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => setAdding(!adding)}>
          <Plus className="h-3.5 w-3.5" /> Add Page
        </Button>
      </div>

      {adding && (
        <Card className="p-4 space-y-3 border-primary/30 bg-primary/5">
          <p className="text-sm font-semibold text-foreground">Add New Page</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Path *</Label><Input value={addForm.path} onChange={e => setAddForm(p => ({ ...p, path: e.target.value }))} placeholder="/my-page" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Page Name *</Label><Input value={addForm.page_name} onChange={e => setAddForm(p => ({ ...p, page_name: e.target.value }))} placeholder="My Page" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Tab Name</Label><Input value={addForm.tab_name} onChange={e => setAddForm(p => ({ ...p, tab_name: e.target.value }))} placeholder="My Tab" className="h-8 text-xs" /></div>
            <div className="space-y-1 sm:col-span-2"><Label className="text-xs">Parent Path (leave blank for top-level)</Label>
              <select value={addForm.parent || ''} onChange={e => setAddForm(p => ({ ...p, parent: e.target.value || null }))}
                className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">— Top Level —</option>
                {roots.map(r => <option key={r.path} value={r.path}>{r.page_name} ({r.path})</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Order</Label><Input value={addForm.order} onChange={e => setAddForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} type="number" className="h-8 text-xs" /></div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-xs" onClick={addItem}>Add</Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Tree view */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span className="col-span-5">Page / Path</span>
          <span className="col-span-3">Tab Name</span>
          <span className="col-span-4 text-right">Actions</span>
        </div>
        {roots.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No hierarchy defined yet.</p>
        ) : roots.map(root => {
          const kids = children(root.path);
          const isOpen = !collapsed.has(root.path);
          return (
            <div key={root.path}>
              {/* Root row */}
              <div className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-border hover:bg-muted/20">
                <div className="col-span-5 flex items-center gap-2">
                  {kids.length > 0 && (
                    <button onClick={() => { const s = new Set(collapsed); isOpen ? s.add(root.path) : s.delete(root.path); setCollapsed(s); }} className="text-muted-foreground hover:text-foreground">
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  {kids.length === 0 && <span className="w-3.5" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{root.page_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{root.path}</p>
                  </div>
                </div>
                <span className="col-span-3 text-xs text-muted-foreground">{root.tab_name || '—'}</span>
                <div className="col-span-4 flex justify-end gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => setEditIdx(items.indexOf(root))}>Edit</Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive gap-1" onClick={() => deleteItem(root.path)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              {/* Children */}
              {isOpen && kids.map(child => (
                <div key={child.path} className="grid grid-cols-12 gap-2 items-center px-4 py-2 border-b border-border hover:bg-muted/10 bg-muted/5">
                  <div className="col-span-5 flex items-center gap-2 pl-8">
                    <GripVertical className="h-3 w-3 text-muted-foreground/40" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{child.page_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{child.path}</p>
                    </div>
                  </div>
                  <span className="col-span-3 text-xs text-muted-foreground">{child.tab_name || '—'}</span>
                  <div className="col-span-4 flex justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setEditIdx(items.indexOf(child))}>Edit</Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => deleteItem(child.path)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Inline edit */}
      {editIdx !== null && items[editIdx] && (
        <Card className="p-4 space-y-3 border-primary/30 bg-primary/5">
          <p className="text-sm font-semibold">Editing: {items[editIdx].page_name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['path','page_name','tab_name'] as const).map(k => (
              <div key={k} className="space-y-1">
                <Label className="text-xs capitalize">{k.replace('_',' ')}</Label>
                <Input value={items[editIdx][k] || ''} onChange={e => {
                  const updated = [...items];
                  updated[editIdx] = { ...updated[editIdx], [k]: e.target.value };
                  setItems(updated);
                }} className="h-8 text-xs" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-xs" onClick={() => { save.mutate(items); setEditIdx(null); }}>Save</Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditIdx(null)}>Cancel</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminSiteSettings() {
  return (
    <AdminLayout
      title="Site Settings"
      subtitle="Global configuration — identity, branding, typography, header, footer and page hierarchy"
    >
      <Tabs defaultValue="identity">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1 mb-6">
          <TabsTrigger value="identity" className="gap-1.5 text-xs"><Globe className="h-3.5 w-3.5" /> Identity</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" /> Branding</TabsTrigger>
          <TabsTrigger value="typography" className="gap-1.5 text-xs"><Type className="h-3.5 w-3.5" /> Typography</TabsTrigger>
          <TabsTrigger value="header" className="gap-1.5 text-xs"><Layout className="h-3.5 w-3.5" /> Header</TabsTrigger>
          <TabsTrigger value="footer" className="gap-1.5 text-xs"><AlignJustify className="h-3.5 w-3.5" /> Footer</TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-1.5 text-xs"><GripVertical className="h-3.5 w-3.5" /> Page Hierarchy</TabsTrigger>
        </TabsList>
        <TabsContent value="identity"><IdentityTab /></TabsContent>
        <TabsContent value="branding"><BrandingTab /></TabsContent>
        <TabsContent value="typography"><TypographyTab /></TabsContent>
        <TabsContent value="header"><HeaderTab /></TabsContent>
        <TabsContent value="footer"><FooterTab /></TabsContent>
        <TabsContent value="hierarchy"><PageHierarchyTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
