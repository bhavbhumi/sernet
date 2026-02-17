import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Headphones, BarChart3, Receipt, Newspaper } from 'lucide-react';
import { useState } from 'react';

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

const AskUsContent = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Ask Form + Illustration */}
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-[1.75rem] md:text-[2rem] font-normal text-foreground mb-2">
                Have something to <span className="text-primary font-medium underline underline-offset-4">Ask?</span>
              </h2>
              <p className="text-muted-foreground mb-8">Fill the form! We will be happy to get back to you.</p>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm hover:bg-primary/90 transition-colors">
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      <input type="tel" maxLength={15} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Mobile Number (Optional)" />
                    </div>
                  </div>
                  <textarea required maxLength={1000} rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="Message us" />
                  <button type="submit" disabled={!formData.name || !formData.email || !formData.message} className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium text-foreground mb-4">Contact Us</h3>
                <p className="text-muted-foreground mb-4">
                  Call us on <a href="tel:+912235000567" className="text-primary hover:underline font-medium">+91-22-35000567</a>
                </p>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Working hours</h4>
                    <p className="text-muted-foreground">Monday to Friday</p>
                    <p className="text-muted-foreground">10.00 am to 5.00 pm</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">4th Saturday</h4>
                    <p className="text-muted-foreground">10.00 am to 1.00 pm</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Regular Holidays</h4>
                    <p className="text-muted-foreground">All Sundays, 2nd & 4th Saturdays, and public holidays.</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card border border-border rounded-lg p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
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
    </>
  );
};

export default AskUsContent;
