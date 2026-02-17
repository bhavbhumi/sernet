import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ReferralFormDialogProps {
  type: 'client' | 'partner';
  trigger: React.ReactNode;
}

const formConfig = {
  client: {
    title: 'Refer a Friend',
    subtitle: 'Share their details and we\'ll get in touch with them.',
    fields: [
      { id: 'yourName', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
      { id: 'yourPhone', label: 'Your Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
      { id: 'friendName', label: 'Friend\'s Name', type: 'text', placeholder: 'Enter friend\'s name' },
      { id: 'friendPhone', label: 'Friend\'s Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
      { id: 'friendEmail', label: 'Friend\'s Email', type: 'email', placeholder: 'friend@email.com' },
    ],
  },
  partner: {
    title: 'Refer a Partner',
    subtitle: 'Know someone who could be a great partner? Share their details below.',
    fields: [
      { id: 'yourName', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
      { id: 'yourPhone', label: 'Your Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
      { id: 'partnerName', label: 'Partner\'s Name', type: 'text', placeholder: 'Enter partner\'s name' },
      { id: 'partnerPhone', label: 'Partner\'s Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
      { id: 'partnerEmail', label: 'Partner\'s Email', type: 'email', placeholder: 'partner@email.com' },
    ],
  },
};

export const ReferralFormDialog = ({ type, trigger }: ReferralFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const config = formConfig[type];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Referral submitted', description: 'Thank you! We\'ll be in touch shortly.' });
    setOpen(false);
    setMessage('');
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
          {config.fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
              <Input id={field.id} type={field.type} placeholder={field.placeholder} required />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">Message (optional)</Label>
            <Textarea id="message" placeholder="Any additional details..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
          </div>
          <Button type="submit" className="w-full">Submit Referral</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
