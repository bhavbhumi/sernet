import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface TieupFormDialogProps {
  trigger: React.ReactNode;
}

const categories = [
  'Stock Broking & Depositories',
  'Mutual Fund / AMC',
  'Insurance',
  'Fixed Deposits / NBFC',
  'Bonds / Debt Securities',
  'Bullion / Precious Metals',
  'Estate Planning',
  'Lending / Loan Products',
  'Credit Counselling',
  'Other',
];

export const TieupFormDialog = ({ trigger }: TieupFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) {
      toast({ title: 'Please select a product category', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const { error } = await supabase.from('leads').insert({
        name: (data.get('contactPerson') as string).trim(),
        phone: (data.get('phone') as string).trim(),
        email: (data.get('email') as string).trim() || null,
        source: 'tieup',
        lead_type: 'tieup',
        context: {
          org_name: (data.get('orgName') as string).trim(),
          category,
          proposal: message || undefined,
        },
      });

      if (error) throw error;

      toast({ title: 'Proposal submitted', description: 'Thank you! Our partnerships team will review and get back to you shortly.' });
      setOpen(false);
      setMessage('');
      setCategory('');
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
          <DialogTitle className="text-lg">Propose a Tieup</DialogTitle>
          <p className="text-sm text-muted-foreground">Share your organisation details and we'll explore partnership opportunities together.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="orgName" className="text-sm">Organisation Name</Label>
            <Input id="orgName" name="orgName" type="text" placeholder="Enter organisation name" required maxLength={200} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPerson" className="text-sm">Contact Person</Label>
            <Input id="contactPerson" name="contactPerson" type="text" placeholder="Full name" required maxLength={100} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required maxLength={15} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@org.com" required maxLength={255} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm">Product Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proposal" className="text-sm">Proposal Details</Label>
            <Textarea
              id="proposal"
              placeholder="Briefly describe the proposed tieup, products, and how it benefits both parties…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</> : 'Submit Proposal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
