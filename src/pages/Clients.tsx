import { Layout } from '@/components/layout/Layout';
import { Users, Building2, Briefcase, Globe } from 'lucide-react';

const clientStats = [
  { icon: Users, value: "1500+", label: "Families Served" },
  { icon: Building2, value: "200+", label: "Corporate Clients" },
  { icon: Briefcase, value: "₹500Cr+", label: "Assets Under Advisory" },
  { icon: Globe, value: "18", label: "Countries" },
];

const clientCategories = [
  {
    title: "Individual Investors",
    description: "From first-time investors to seasoned traders, we help individuals build and grow their wealth with personalized strategies."
  },
  {
    title: "High Net Worth Individuals",
    description: "Comprehensive wealth management solutions for HNIs including portfolio management, tax planning, and estate planning."
  },
  {
    title: "Corporate Clients",
    description: "Treasury management, employee benefit programs, and corporate investment solutions for businesses of all sizes."
  },
  {
    title: "NRI Clients",
    description: "Specialized investment services for Non-Resident Indians, helping them invest in Indian markets seamlessly."
  },
];

const Clients = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <h1 className="text-3xl font-medium text-foreground mb-4">Our Clients</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          For over 35 years, SERNET has been trusted by thousands of clients across the globe 
          for their financial planning and investment needs.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {clientStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-muted/30 rounded-lg">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Client Categories */}
        <h2 className="text-xl font-medium text-foreground mb-6">Who We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientCategories.map((category, index) => (
            <div 
              key={index}
              className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <h3 className="text-lg font-medium text-foreground mb-2">{category.title}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
