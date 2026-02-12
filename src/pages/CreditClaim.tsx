import { Layout } from '@/components/layout/Layout';
import { FileText, Shield, Scale } from 'lucide-react';

const CreditClaim = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <h1 className="heading-lg text-foreground mb-4">Credit and Claim Rights</h1>
        <p className="text-body mb-8 max-w-2xl">
          Information about your rights regarding credits, claims, and investor protection.
        </p>

        <div className="space-y-8">
          <section className="p-6 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium text-foreground">Investor Protection</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              As a SEBI registered intermediary, SERNET is committed to protecting investor interests. 
              All client funds and securities are held in segregated accounts as per regulatory requirements.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Client funds are kept separate from company funds</li>
              <li>Securities held in depository accounts under client names</li>
              <li>Regular audits and compliance checks</li>
              <li>Investor grievance redressal mechanism in place</li>
            </ul>
          </section>

          <section className="p-6 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium text-foreground">Claim Process</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              In case of any claims or disputes, investors can follow the process outlined below:
            </p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Submit a written complaint to our compliance officer</li>
              <li>If unresolved within 30 days, escalate to SEBI SCORES portal</li>
              <li>Approach the Stock Exchange's investor grievance cell</li>
              <li>Use Smart ODR platform for online dispute resolution</li>
            </ol>
          </section>

          <section className="p-6 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium text-foreground">Arbitration</h2>
            </div>
            <p className="text-muted-foreground">
              For disputes that cannot be resolved through the grievance mechanism, 
              arbitration as per Exchange rules is available. The arbitration process 
              is governed by the Arbitration and Conciliation Act, 1996.
            </p>
          </section>

          <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-medium text-foreground mb-2">Need Assistance?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              For any queries regarding your rights or claim process, please contact our compliance team.
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              <a href="mailto:compliance@sernetindia.com" className="text-primary hover:underline">
                compliance@sernetindia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreditClaim;
