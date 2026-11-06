import { useState } from 'react';
import { Expand } from 'lucide-react';
import featuredImg from '@/assets/recognition-featured.webp';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { recognitionRecords, type RecognitionKind, type RecognitionRecord } from './recognitionRecords';

const caption = 'Recognition at a CNBC TV18 event sponsored by UTI Mutual Fund, 2016.';
const provenance = 'From the SERNET family archive; event details confirmed by management.';
const groups: RecognitionKind[] = ['Award', 'Partner appreciation', 'Membership & credentials'];
const groupTitle: Record<RecognitionKind, string> = {
  Award: 'Awards',
  'Partner appreciation': 'Partner appreciation',
  'Membership & credentials': 'Memberships & credentials',
};

const byDate = (a: RecognitionRecord, b: RecognitionRecord) => (b.sortYear ?? -1) - (a.sortYear ?? -1);

export const RecognitionContent = () => {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<RecognitionRecord | null>(null);
  return (
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="heading-lg text-foreground mb-4">Recognition & <span className="text-primary">Awards</span></h2>
            <p className="text-primary font-medium mb-3">2016 · CNBC TV18</p>
            <h3 className="heading-md text-foreground mb-4">{caption}</h3>
            <p className="text-body mb-6">An illustrated keepsake from a moment in our family practice’s journey.</p>
            <p className="text-small mb-6">{provenance}</p>
            <Button variant="outline" onClick={() => setExpanded(true)} className="gap-2">
              <Expand className="h-4 w-4" /> View archival image
            </Button>
          </div>
          <figure className="min-w-0">
            <img src={featuredImg} alt="Original illustrated SERNET recognition keepsake with CNBC TV18 and UTI Mutual Fund event branding" width={768} height={1086} loading="lazy" className="w-full max-w-sm max-h-[560px] h-auto object-contain mx-auto rounded-lg" />
            <figcaption className="text-small text-center mt-4">SERNET family archive · 2016</figcaption>
          </figure>
        </div>

        <p className="text-small mt-12 mb-2">Every entry below is shown as photographed from the original certificate, plaque or trophy in our office. Dates are given only where printed on the record.</p>

        {groups.map((g) => {
          const items = recognitionRecords.filter((r) => r.kind === g).sort(byDate);
          if (!items.length) return null;
          return (
            <div key={g} className="mt-10">
              <h3 className="heading-md text-foreground mb-5">{groupTitle[g]}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((r) => (
                  <button key={r.id} type="button" onClick={() => setOpen(r)} className="group text-left rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center p-3">
                      <img src={r.image} alt={`${r.issuer}: ${r.title}`} width={r.width} height={r.height} loading="lazy" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-primary mb-1">{r.period}</p>
                      <p className="font-semibold text-foreground leading-snug">{r.title}</p>
                      <p className="text-small mt-1">{r.issuer}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent className="max-w-3xl max-h-[95dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Recognition · 2016</DialogTitle>
              <DialogDescription>{caption} {provenance}</DialogDescription>
            </DialogHeader>
            <img src={featuredImg} alt="Full original illustrated recognition keepsake showing BEST IFA AWARDS and Financial Advisor Forum 2016–17 branding" width={768} height={1086} className="w-full h-auto max-h-[75dvh] object-contain" />
          </DialogContent>
        </Dialog>

        <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
          <DialogContent className="max-w-3xl max-h-[95dvh] overflow-y-auto">
            {open && (
              <>
                <DialogHeader>
                  <DialogTitle>{open.title}</DialogTitle>
                  <DialogDescription>{open.issuer} · {open.period}. {open.detail}</DialogDescription>
                </DialogHeader>
                <img src={open.image} alt={`${open.issuer}: ${open.title}`} width={open.width} height={open.height} className="w-full h-auto max-h-[75dvh] object-contain" />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
