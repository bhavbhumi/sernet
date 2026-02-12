import { Layout } from '@/components/layout/Layout';
import { Handshake, Shield, TrendingUp, Building } from 'lucide-react';

const partnerCategories = [
  {
    title: "Stock Brokers",
    partners: ["NSE", "BSE", "MCX"],
    icon: TrendingUp
  },
  {
    title: "Depositories",
    partners: ["NSDL", "CDSL"],
    icon: Shield
  },
  {
    title: "Mutual Fund Houses",
    partners: ["HDFC MF", "SBI MF", "ICICI Prudential", "Axis MF", "Kotak MF", "Nippon India"],
    icon: Building
  },
  {
    title: "Insurance Partners",
    partners: ["LIC", "HDFC Life", "ICICI Prudential", "Max Life", "Bajaj Allianz"],
    icon: Shield
  },
];

const Partners = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <h1 className="heading-lg text-foreground mb-4">Our Partners</h1>
        <p className="text-body mb-8 max-w-2xl">
          SERNET works with leading financial institutions and service providers to offer 
          comprehensive solutions to our clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerCategories.map((category, index) => (
            <div 
              key={index}
              className="p-6 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.partners.map((partner, pIndex) => (
                  <span 
                    key={pIndex}
                    className="px-3 py-1 bg-muted/50 text-sm text-muted-foreground rounded-full"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <Handshake className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium text-foreground">Become a Partner</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Interested in partnering with SERNET? We're always looking to collaborate with 
            like-minded organizations to serve our clients better.
          </p>
          <a 
            href="mailto:partners@sernetindia.com"
            className="text-primary hover:underline"
          >
            Contact our partnerships team →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
