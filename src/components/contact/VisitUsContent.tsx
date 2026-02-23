import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

const SERNET_MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.2!2d72.8453!3d19.1789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6f8a3a3a3a3%3A0x0!2sSERNET+Financial+Services+Pvt+Ltd!5e0!3m2!1sen!2sin';
const SERNET_MAP_DIRECTIONS = 'https://www.google.com/maps/search/?api=1&query=SERNET+Financial+Services+Pvt+Ltd+Malad+West+Mumbai';

const office = {
  name: 'Head Office — Mumbai',
  address: 'B/201, Hemu Classic Premises CS Ltd, 67, S V Road, Opp Newera Cinema, Malad (West), Mumbai, Maharashtra 400064',
  phone: '+91-920-676-7670',
  email: 'contact@sernetindia.com',
  hours: 'Mon–Fri: 9:30 AM – 5:30 PM | Sat: 10 AM – 3 PM',
};

const VisitUsContent = () => {
  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[1.75rem] md:text-[2rem] font-normal text-foreground mb-3">
              Our <span className="text-primary font-medium">Office</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Walk in to our office during business hours. We'd love to meet you in person.
            </p>
          </motion.div>

          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border rounded-lg p-6 flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-3">{office.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{office.address}</p>

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
                href={SERNET_MAP_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full border border-primary text-primary py-2.5 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="bg-section-alt">
        <div className="container-zerodha max-w-5xl py-12">
          <h3 className="text-lg font-medium text-foreground mb-4">Our Location</h3>
          <div className="rounded-lg overflow-hidden border border-border aspect-[16/7]">
            <iframe
              title="SERNET Head Office — Malad West, Mumbai"
              src={SERNET_MAP_EMBED}
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
