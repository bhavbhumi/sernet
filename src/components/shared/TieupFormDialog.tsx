import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

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
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Proposal submitted', description: 'Thank you! Our partnerships team will review and get back to you shortly.' });
    setOpen(false);
    setMessage('');
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
            <Input id="orgName" type="text" placeholder="Enter organisation name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPerson" className="text-sm">Contact Person</Label>
            <Input id="contactPerson" type="text" placeholder="Full name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="you@org.com" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm">Product Category</Label>
            <Select required>
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
            <Textarea id="proposal" placeholder="Briefly describe the proposed tieup, products, and how it benefits both parties..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} required />
          </div>
          <Button type="submit" className="w-full">Submit Proposal</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
