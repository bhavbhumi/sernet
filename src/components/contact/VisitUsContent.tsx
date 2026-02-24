import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

const SERNET_MAP_EMBED = 'https://maps.google.com/maps?q=SERNET+Financial+Services+Pvt+Ltd,+B201+Hemu+Classic,+SV+Road,+Malad+West,+Mumbai+400064&t=&z=16&ie=UTF8&iwloc=&output=embed';
const SERNET_MAP_DIRECTIONS = 'https://www.google.com/maps/search/?api=1&query=SERNET+Financial+Services+Pvt+Ltd+B201+Hemu+Classic+SV+Road+Malad+West+Mumbai+400064';

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
      {/* Context Banner */}
      <section className="bg-primary/5 border-b border-primary/10">
        <div className="container-zerodha max-w-5xl py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Walk-in Welcome</p>
              <p className="text-xs text-muted-foreground">No appointment needed — visit us during business hours. We'd love to meet you in person.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-zerodha max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left — Office Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border rounded-lg p-6 flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">{office.name}</h3>
              <p className="text-sm text-muted-foreground mb-5">{office.address}</p>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${office.phone.replace(/-/g, '')}`} className="hover:text-primary transition-colors">{office.phone}</a>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{office.hours}</span>
                </div>
              </div>

              <div className="mt-auto">
                <a
                  href={SERNET_MAP_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full border border-primary text-primary py-2.5 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>

            {/* Right — Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-lg overflow-hidden border border-border h-full min-h-[360px]"
            >
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
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisitUsContent;
