import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, MessageCircle, User, Mail, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
];

const topics = [
  'Investment Planning', 'Mutual Funds', 'Stock Trading', 'Insurance',
  'Tax Planning', 'Retirement Planning', 'Portfolio Review', 'Other',
];

const ScheduleCallContent = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_type: 'appointment',
        source: 'schedule-call',
        context: {
          date: selectedDate,
          time: selectedTime,
          topic: selectedTopic || null,
          message: formData.message || null,
        },
      });

      if (error) {
        console.error('Submission error:', error);
        toast.error('Failed to schedule appointment. Please try again.');
        return;
      }

      setSubmitted(true);
      toast.success('Appointment scheduled successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/919206767670?text=${encodeURIComponent('Hi, I would like to schedule a consultation with Sernet.')}`;

  if (submitted) {
    return (
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-xl text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <Phone className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-[2rem] font-normal text-foreground mb-4">Call Scheduled!</h2>
            <p className="text-muted-foreground text-lg mb-2">
              We've received your request for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
            </p>
            <p className="text-muted-foreground mb-8">Our team will confirm your appointment shortly via email and phone.</p>
            <button onClick={() => setSubmitted(false)} className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors">
              Schedule Another
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left - Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Your Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Full Name *</label>
                    <input type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="tel" required maxLength={15} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Topic</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none">
                        <option value="">Select a topic</option>
                        {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Pick a Date & Time
                </h2>
                <div className="mb-5">
                  <label className="block text-sm text-muted-foreground mb-1.5">Preferred Date *</label>
                  <input type="date" required min={minDate} max={maxDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full max-w-xs px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Preferred Time Slot *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((slot) => (
                      <button key={slot} type="button" onClick={() => setSelectedTime(slot)} className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedTime === slot ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary hover:text-primary'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <label className="block text-sm text-muted-foreground mb-1.5">Additional Message (optional)</label>
                <textarea maxLength={500} rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="Tell us briefly what you'd like to discuss..." />
              </div>

              <button type="submit" disabled={isSubmitting || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone} className="w-full bg-primary text-primary-foreground py-3.5 rounded-md text-base font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Scheduling...</> : 'Confirm Appointment'}
              </button>
            </form>
          </motion.div>

          {/* Right - Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-5">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-14 h-14 rounded-lg bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-foreground font-medium mb-2">Chat on WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-4">Get instant answers from our team. Available Mon–Sat, 9 AM to 6 PM.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-green-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">Start Chat</a>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-14 h-14 rounded-lg bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-foreground font-medium mb-2">Call Us Directly</h3>
              <p className="text-sm text-muted-foreground mb-4">Speak to an advisor right away.</p>
              <a href="tel:+919206767670" className="inline-block w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">+91 920 676 7670</a>
            </div>

            <div className="bg-section-alt rounded-lg p-5">
              <h4 className="text-sm font-medium text-foreground mb-3">What to Expect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Confirmation via email & SMS</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>30-minute consultation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>No obligation, completely free</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Personalised recommendations</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleCallContent;
