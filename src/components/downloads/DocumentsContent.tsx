import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
