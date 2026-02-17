import { motion } from 'framer-motion';
import featuredImg from '@/assets/recognition-featured.png';
import thumbImg from '@/assets/recognition-thumb.webp';

const featured = {
  title: "Best Investment Advisory Firm",
  month: "November 2024",
  event: "Financial Excellence Awards",
  from: "India Finance Forum",
};

const recognitions = [
  { title: "Most Trusted Financial Partner", month: "August 2023", event: "National Finance Summit", from: "India Finance Forum" },
  { title: "Excellence in Customer Service", month: "March 2023", event: "BFSI Excellence Awards", from: "BFSI Awards Committee" },
  { title: "Best Wealth Management Services", month: "December 2022", event: "ET Financial Services Awards", from: "Economic Times" },
  { title: "Innovation in Financial Technology", month: "June 2022", event: "FinTech India Awards", from: "NASSCOM" },
  { title: "Top Emerging Financial Services Brand", month: "January 2022", event: "Brand Excellence Awards", from: "Business World" },
];

export const RecognitionContent = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Featured Recognition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
              {featured.title}
            </h2>
            <p className="text-body text-muted-foreground">
              {featured.month} · {featured.event}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              From <span className="text-foreground font-medium">{featured.from}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-end items-center"
          >
            <img src={featuredImg} alt={featured.title} className="rounded-xl max-w-[280px] w-full" />
          </motion.div>
        </div>

        {/* Section 2: List of Recognitions */}
        <div>
          <h3 className="heading-md mb-6">All Recognitions</h3>
          <div className="divide-y divide-border">
            {recognitions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="flex items-center gap-4 py-5"
              >
                <img src={thumbImg} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0 border border-border" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground mb-1">
                    <span>{item.month}</span><span>—</span><span>{item.event}</span>
                  </div>
                  <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground leading-snug">{item.title}</h3>
                  <p className="text-[0.875rem] text-muted-foreground mt-0.5">From <span className="font-medium text-foreground">{item.from}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
