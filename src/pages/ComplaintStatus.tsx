import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const sampleComplaints = [
  {
    id: 'ZRD2024010001',
    subject: 'Fund withdrawal delay',
    status: 'resolved',
    date: 'Jan 15, 2024',
    resolution: 'Jan 16, 2024',
  },
  {
    id: 'ZRD2024010002',
    subject: 'Account opening issue',
    status: 'in-progress',
    date: 'Jan 18, 2024',
    resolution: null,
  },
  {
    id: 'ZRD2023120015',
    subject: 'Contract note discrepancy',
    status: 'resolved',
    date: 'Dec 20, 2023',
    resolution: 'Dec 22, 2023',
  },
];

const ComplaintStatus = () => {
  const [ticketId, setTicketId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-xl mb-4">
              Complaint Status
            </h1>
            <p className="text-body">
              Track the status of your complaints and grievances
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSearch}
            className="flex gap-4 mb-12"
          >
            <Input
              placeholder="Enter your ticket ID (e.g., ZRD2024010001)"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="heading-md mb-6">Your Complaints</h2>
            <div className="space-y-4">
              {sampleComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-muted/50 rounded-lg p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-primary">{complaint.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          complaint.status === 'resolved' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {complaint.status === 'resolved' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {complaint.status === 'resolved' ? 'Resolved' : 'In Progress'}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground">{complaint.subject}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Filed: {complaint.date}</p>
                      {complaint.resolution && (
                        <p>Resolved: {complaint.resolution}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Can't find your complaint? Make sure you're using the correct ticket ID.
            </p>
            <Button variant="outline" asChild>
              <a href="/support">Contact Support</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ComplaintStatus;
