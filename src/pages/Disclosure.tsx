import { Layout } from '@/components/layout/Layout';
import { FileText, Download } from 'lucide-react';

const Disclosure = () => {
  const documents = [
    { name: 'Risk Disclosure Document', description: 'Disclosure of risks associated with trading' },
    { name: 'Rights and Obligations', description: 'Rights and obligations of stock broker and client' },
    { name: 'Guidance Note', description: 'Guidance note for investors' },
    { name: 'Policies and Procedures', description: 'Internal policies and procedures' },
    { name: 'Investor Charter', description: 'SEBI prescribed investor charter' },
  ];

  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-xl text-foreground mb-4">Disclosure</h1>
          <p className="text-body mb-12">
            Important documents and disclosures as per SEBI regulations
          </p>

          {/* Documents */}
          <div className="space-y-4 mb-12">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary hover:underline">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Regulatory Information */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Registration Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Stock Broker SEBI Reg. No:</span>
                  <span className="block text-foreground font-medium">INZ000031633</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Depository Participant SEBI Reg. No:</span>
                  <span className="block text-foreground font-medium">IN-DP-431-2019</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Research Analyst SEBI Reg. No:</span>
                  <span className="block text-foreground font-medium">INH000000313</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Investment Adviser SEBI Reg. No:</span>
                  <span className="block text-foreground font-medium">INA100015082</span>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Exchange Membership</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <span className="block text-2xl font-bold text-primary">NSE</span>
                  <span className="text-muted-foreground">Member</span>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <span className="block text-2xl font-bold text-primary">BSE</span>
                  <span className="text-muted-foreground">Member</span>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <span className="block text-2xl font-bold text-primary">MCX</span>
                  <span className="text-muted-foreground">Member</span>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Depository Services</h2>
              <p className="text-muted-foreground mb-4">
                SERNET Financial Services Pvt. Ltd. offers depository services as a Depository Participant 
                with CDSL and NSDL.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <span className="block font-bold text-foreground">CDSL</span>
                  <span className="text-muted-foreground">DP ID: 12089600</span>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <span className="block font-bold text-foreground">NSDL</span>
                  <span className="text-muted-foreground">DP ID: IN302871</span>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Important Notice</h2>
              <p className="text-sm text-muted-foreground">
                Investments in securities market are subject to market risks. Read all the related 
                documents carefully before investing. Registration granted by SEBI and certification 
                from NISM in no way guarantee performance of the intermediary or provide any assurance 
                of returns to investors.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclosure;
