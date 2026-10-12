import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const regulatoryLinks = [
  { name: 'Monthly Factsheets', source: 'AMFI', href: 'https://www.amfiindia.com/online-center/download-factsheets' },
  { name: 'MF Scheme Master Documents', source: 'SEBI', href: 'https://www.sebi.gov.in/filings/mutual-funds.html' },
];

const documents = [
  { name: 'Account Opening Form', type: 'PDF' },
  { name: 'Tariff Sheet', type: 'PDF' },
  { name: 'Rights and Obligations', type: 'PDF' },
  { name: 'Risk Disclosure Document', type: 'PDF' },
  { name: "Do's and Don'ts", type: 'PDF' },
  { name: 'Policies and Procedures', type: 'PDF' },
  { name: 'Client Master Report', type: 'PDF' },
  { name: 'KYC Form', type: 'PDF' },
  { name: 'Nomination Form', type: 'PDF' },
];

const DocumentsContent = () => {
  return (
    <div className="section-padding">
      <div className="container-sernet space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="heading-lg mb-6">Mutual Fund Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulatoryLinks.map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="bg-muted/50 rounded-lg p-4 flex items-center justify-between gap-2 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm">{l.name}</p>
                    <p className="text-xs text-muted-foreground">Download from {l.source}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h2 className="heading-lg mb-6">Important Documents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsContent;
