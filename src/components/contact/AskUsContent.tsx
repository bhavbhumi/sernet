import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Headphones, BarChart3, Receipt, Newspaper, Tag, Clock, CalendarDays, SunMedium, ChevronRight, ArrowUpRight, Loader2, ExternalLink, HelpCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const reasons = [
  { value: 'enquiry', label: 'General Enquiry', icon: HelpCircle, description: 'Questions about services, eligibility, documents, pricing, etc.' },
  { value: 'grievance', label: 'Grievance / Complaint', icon: AlertTriangle, description: 'Formal complaint for escalation per SEBI guidelines.' },
  { value: 'feedback', label: 'Feedback & Suggestion', icon: Lightbulb, description: 'Share your experience, ideas, or feature requests.' },
] as const;

type ReasonValue = typeof reasons[number]['value'];

const reasonToLeadType: Record<ReasonValue, string> = {
  enquiry: 'enquiry',
  grievance: 'grievance',
  feedback: 'feedback',
};

const departments = [
  {
    icon: Headphones,
    title: 'Support',
    phone: '+91-22-35000567',
    description: 'Resolve your support queries',
    email: 'support@sernetindia.com',
  },
  {
    icon: BarChart3,
    title: 'Call & Trade',
    phone: '+91-22-35000567',
    description: 'Call to place a trade',
    email: 'trade@sernetindia.com',
  },
  {
    icon: Receipt,
    title: 'Accounts',
    phone: '+91-22-35000567',
    description: 'Accounting & billing matters',
    email: 'accounts@sernetindia.com',
  },
  {
    icon: Newspaper,
    title: 'Media & Press',
    phone: '+91-22-35000567',
    description: 'Press enquiries & media relations',
    email: 'media@sernetindia.com',
  },
];

const escalationMatrix = [
  { level: 'Level 1', designation: 'Customer Support Executive', contact: 'support@sernetindia.com', phone: '+91-22-35000567', timeline: 'Within 24 hours' },
  { level: 'Level 2', designation: 'Team Lead', contact: 'escalation@sernetindia.com', phone: '+91-22-35000568', timeline: 'Within 3 working days' },
  { level: 'Level 3', designation: 'Compliance Officer', contact: 'compliance@sernetindia.com', phone: '+91-22-35000569', timeline: 'Within 7 working days' },
  { level: 'Level 4', designation: 'Managing Director', contact: 'md@sernetindia.com', phone: '+91-22-35000570', timeline: 'Within 15 working days' },
];

const AskUsContent = () => {
  const [reason, setReason] = useState<ReasonValue | ''>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        lead_type: reasonToLeadType[reason],
        source: 'ask-us',
        context: {
          reason: reasons.find(r => r.value === reason)?.label,
          topic: formData.topic,
          message: formData.message,
        },
      });

      if (error) {
        console.error('Submission error:', error);
        toast.error('Failed to send your message. Please try again.');
        return;
      }

      setSubmitted(true);
      toast.success(
        reason === 'grievance'
          ? 'Your grievance has been registered. We will respond as per the escalation timeline.'
          : 'Your message has been submitted successfully!'
      );
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReason('');
    setFormData({ name: '', email: '', phone: '', topic: '', message: '' });
  };

  return (
    <>
      {/* Support Portal Banner */}
      <section className="bg-primary/5 border-b border-primary/10">
        <div className="container-zerodha max-w-5xl py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Existing Client?</p>
                <p className="text-xs text-muted-foreground">For account, trading & service issues, use our dedicated Support Portal.</p>
              </div>
            </div>
            <a
              href="https://support.sernetindia.com/portal/en/home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
            >
              Go to Support Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Ask Form + Contact Info */}
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
              <h2 className="text-[1.75rem] md:text-[2rem] font-normal text-foreground mb-2">
                Have something to <span className="text-primary font-medium underline underline-offset-4">Ask?</span>
              </h2>
              <p className="text-muted-foreground mb-6">For enquiries, complaints, or feedback — we're here to help.</p>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {reason === 'grievance' ? 'Grievance Registered' : 'Message Sent!'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {reason === 'grievance'
                      ? 'Your complaint has been registered. Our team will respond as per the escalation timeline below.'
                      : "We'll get back to you within 24 hours."}
                  </p>
                  <button onClick={handleReset} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm hover:bg-primary/90 transition-colors">
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                  {/* Reason Selection */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">What would you like to do? *</label>
                    <div className="grid grid-cols-1 gap-2">
                      {reasons.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setReason(r.value)}
                          className={`flex items-start gap-3 p-3 rounded-md border text-left transition-all ${
                            reason === r.value
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-primary/30 hover:bg-muted/30'
                          }`}
                        >
                          <r.icon className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${reason === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className={`text-sm font-medium ${reason === r.value ? 'text-primary' : 'text-foreground'}`}>{r.label}</p>
                            <p className="text-xs text-muted-foreground">{r.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields - show after reason selected */}
                  {reason && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 flex-1 flex flex-col">
                      <div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Enter your name" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Valid email ID" />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="tel" maxLength={15} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder={reason === 'grievance' ? 'Mobile Number *' : 'Mobile Number (Optional)'} required={reason === 'grievance'} />
                        </div>
                      </div>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" required maxLength={150} value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder={reason === 'grievance' ? 'Subject of your complaint' : reason === 'feedback' ? 'What is your feedback about?' : 'Topic of your enquiry'} />
                      </div>
                      <textarea required maxLength={1000} rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none flex-1 min-h-[100px]" placeholder={reason === 'grievance' ? 'Describe your grievance in detail...' : reason === 'feedback' ? 'Share your thoughts...' : 'Your question or message...'} />
                      <button type="submit" disabled={isSubmitting || !formData.name || !formData.email || !formData.topic || !formData.message} className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : reason === 'grievance' ? 'Register Complaint' : 'Submit'}
                      </button>
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col">
              <div className="bg-card border border-border rounded-lg p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-4">Contact Us</h3>
                  <p className="text-muted-foreground mb-6">
                    Call us on <a href="tel:+912235000567" className="text-primary hover:underline font-medium">+91-22-35000567</a>
                  </p>
                </div>
                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Week Days</h4>
                      <p className="text-muted-foreground">Monday to Friday</p>
                      <p className="text-muted-foreground">10:00 am to 6:00 pm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Weekend</h4>
                      <p className="text-muted-foreground">All Saturdays</p>
                      <p className="text-muted-foreground">10:00 am to 3:00 pm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <SunMedium className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Holidays</h4>
                      <p className="text-muted-foreground">All Sundays, Public Holidays</p>
                      <Link to="/calendars" className="text-primary text-sm hover:underline inline-flex items-center gap-1 mt-1">
                        View Market Holidays <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Department Cards */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha max-w-5xl">
          <h3 className="text-xl md:text-2xl font-normal text-foreground mb-8">
            Reach the right <span className="text-primary font-medium">department</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <dept.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">{dept.title}</h4>
                <a href={`tel:${dept.phone.replace(/-/g, '')}`} className="text-primary text-sm hover:underline block mb-1">{dept.phone}</a>
                <p className="text-xs text-muted-foreground mb-2">{dept.description}</p>
                <a href={`mailto:${dept.email}`} className="text-primary text-sm hover:underline">{dept.email}</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Escalation Matrix */}
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <h3 className="text-xl md:text-2xl font-normal text-foreground mb-2">
            Escalation <span className="text-primary font-medium">Matrix</span>
          </h3>
          <p className="text-muted-foreground mb-8 text-sm">If your concern is not resolved satisfactorily, you may escalate as follows.</p>

          <div className="space-y-4">
            {escalationMatrix.map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4 sm:w-48 shrink-0">
                  <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.level}</p>
                    <p className="font-medium text-foreground text-sm">{item.designation}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 text-sm">
                  <a href={`mailto:${item.contact}`} className="text-primary hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {item.contact}
                  </a>
                  <a href={`tel:${item.phone.replace(/-/g, '')}`} className="text-primary hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {item.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:w-44 shrink-0 justify-end">
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>{item.timeline}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AskUsContent;