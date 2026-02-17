import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

const offices = [
  {
    name: 'Head Office — Mumbai',
    address: '102, Sagar Shopping Centre, Dadar (W), Mumbai — 400 028, Maharashtra',
    phone: '+91-22-35000567',
    email: 'info@sernetindia.com',
    hours: 'Mon–Fri: 10 AM – 5 PM',
    mapQuery: 'Sagar+Shopping+Centre+Dadar+Mumbai',
  },
  {
    name: 'Branch Office — Pune',
    address: 'Office No. 12, 2nd Floor, Laxmi Plaza, FC Road, Pune — 411 004, Maharashtra',
    phone: '+91-20-35000567',
    email: 'pune@sernetindia.com',
    hours: 'Mon–Fri: 10 AM – 5 PM',
    mapQuery: 'FC+Road+Pune',
  },
  {
    name: 'Branch Office — Nashik',
    address: 'Shop No. 5, Ground Floor, Ashoka Marg, Nashik — 422 001, Maharashtra',
    phone: '+91-253-2350567',
    email: 'nashik@sernetindia.com',
    hours: 'Mon–Fri: 10 AM – 5 PM',
    mapQuery: 'Ashoka+Marg+Nashik',
  },
];

const VisitUsContent = () => {
  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[1.75rem] md:text-[2rem] font-normal text-foreground mb-3">
              Our <span className="text-primary font-medium">Offices</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Walk in to any of our offices during business hours. We'd love to meet you in person.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office, i) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-3">{office.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{office.address}</p>

                <div className="space-y-2 text-sm mb-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <a href={`tel:${office.phone.replace(/-/g, '')}`} className="hover:text-primary transition-colors">{office.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{office.hours}</span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${office.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full border border-primary text-primary py-2.5 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="bg-section-alt">
        <div className="container-zerodha max-w-5xl py-12">
          <h3 className="text-lg font-medium text-foreground mb-4">Head Office Location</h3>
          <div className="rounded-lg overflow-hidden border border-border aspect-[16/7]">
            <iframe
              title="Sernet Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8!2d72.84!3d19.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAxJzEyLjAiTiA3MsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v1600000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default VisitUsContent;
