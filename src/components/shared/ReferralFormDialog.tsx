import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ReferralFormDialogProps {
  type: 'client' | 'partner';
  trigger: React.ReactNode;
}

const formConfig = {
  client: {
    title: 'Refer a Friend',
    subtitle: 'Share their details and we\'ll get in touch with them.',
    refereeLabel: 'Friend',
    referralType: 'client',
  },
  partner: {
    title: 'Refer a Partner',
    subtitle: 'Know someone who could be a great partner? Share their details below.',
    refereeLabel: 'Partner',
    referralType: 'partner',
  },
};

export const ReferralFormDialog = ({ type, trigger }: ReferralFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const config = formConfig[type];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const yourName = (data.get('yourName') as string).trim();
    const yourPhone = (data.get('yourPhone') as string).trim();
    const refereeName = (data.get('refereeName') as string).trim();
    const refereePhone = (data.get('refereePhone') as string).trim();
    const refereeEmail = (data.get('refereeEmail') as string | null)?.trim() ?? '';

    try {
      const { error } = await supabase.from('leads').insert({
        name: yourName,
        phone: yourPhone,
        source: 'referral',
        lead_type: `referral_${config.referralType}`,
        context: {
          referee_name: refereeName,
          referee_phone: refereePhone,
          referee_email: refereeEmail || undefined,
          referral_type: config.referralType,
          message: message || undefined,
        },
      });

      if (error) throw error;

      toast({ title: 'Referral submitted', description: 'Thank you! We\'ll be in touch shortly.' });
      setOpen(false);
      setMessage('');
      form.reset();
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{config.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{config.subtitle}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="yourName" className="text-sm">Your Name</Label>
              <Input id="yourName" name="yourName" type="text" placeholder="Enter your name" required maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yourPhone" className="text-sm">Your Phone</Label>
              <Input id="yourPhone" name="yourPhone" type="tel" placeholder="+91 XXXXX XXXXX" required maxLength={15} />
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{config.refereeLabel}'s Details</p>
            <div className="space-y-1.5">
              <Label htmlFor="refereeName" className="text-sm">{config.refereeLabel}'s Name</Label>
              <Input id="refereeName" name="refereeName" type="text" placeholder={`Enter ${config.refereeLabel.toLowerCase()}'s name`} required maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="refereePhone" className="text-sm">{config.refereeLabel}'s Phone</Label>
                <Input id="refereePhone" name="refereePhone" type="tel" placeholder="+91 XXXXX XXXXX" required maxLength={15} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="refereeEmail" className="text-sm">Email (optional)</Label>
                <Input id="refereeEmail" name="refereeEmail" type="email" placeholder="email@example.com" maxLength={255} />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">Message (optional)</Label>
            <Textarea id="message" placeholder="Any additional details…" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500} />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</> : 'Submit Referral'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
