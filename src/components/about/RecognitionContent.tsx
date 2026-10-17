import { useState } from 'react';
import { Expand } from 'lucide-react';
import featuredImg from '@/assets/recognition-featured.png';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const caption = 'Recognition at a CNBC TV18 event sponsored by UTI Mutual Fund, 2016.';
const provenance = 'From the SERNET family archive; event details confirmed by management.';

export const RecognitionContent = () => {
  const [expanded, setExpanded] = useState(false);
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
        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent className="max-w-3xl max-h-[95dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Recognition · 2016</DialogTitle>
              <DialogDescription>{caption} {provenance}</DialogDescription>
            </DialogHeader>
            <img src={featuredImg} alt="Full original illustrated recognition keepsake showing BEST IFA AWARDS and Financial Advisor Forum 2016–17 branding" width={768} height={1086} className="w-full h-auto max-h-[75dvh] object-contain" />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
