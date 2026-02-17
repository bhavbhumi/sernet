import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle2, ArrowRight, Users, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Survey {
  id: number;
  title: string;
  description: string;
  questions: number;
  estimatedTime: string;
  respondents: number;
  deadline: string;
  status: 'active' | 'closed' | 'upcoming';
  category: string;
}

const surveys: Survey[] = [
  {
    id: 1,
    title: 'Trading Platform Experience Survey',
    description: 'Help us improve your trading experience by sharing feedback on platform features, speed, and usability.',
    questions: 12,
    estimatedTime: '5 mins',
    respondents: 842,
    deadline: 'Mar 15, 2026',
    status: 'active',
    category: 'Platform',
  },
  {
    id: 2,
    title: 'Customer Support Satisfaction',
    description: 'Rate your recent interactions with our support team and suggest areas of improvement.',
    questions: 8,
    estimatedTime: '3 mins',
    respondents: 1203,
    deadline: 'Mar 10, 2026',
    status: 'active',
    category: 'Support',
  },
  {
    id: 3,
    title: 'Investment Products Feedback',
    description: 'Tell us which investment products matter most to you and what new offerings you\'d like to see.',
    questions: 15,
    estimatedTime: '7 mins',
    respondents: 567,
    deadline: 'Mar 20, 2026',
    status: 'active',
    category: 'Products',
  },
  {
    id: 4,
    title: 'Mobile App Usability Study',
    description: 'Share your experience using our mobile trading app — navigation, performance, and feature requests.',
    questions: 10,
    estimatedTime: '4 mins',
    respondents: 2100,
    deadline: 'Feb 28, 2026',
    status: 'closed',
    category: 'Platform',
  },
  {
    id: 5,
    title: 'Financial Education Needs Assessment',
    description: 'Help us design better learning programs by telling us what topics and formats work best for you.',
    questions: 14,
    estimatedTime: '6 mins',
    respondents: 0,
    deadline: 'Apr 1, 2026',
    status: 'upcoming',
    category: 'Education',
  },
];

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  closed: 'bg-muted text-muted-foreground',
  upcoming: 'bg-amber-500/10 text-amber-600',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  closed: 'Closed',
  upcoming: 'Coming Soon',
};

export const SurveysContent = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Surveys</h2>
          </div>
          <p className="text-muted-foreground">Participate in our surveys to help us build better products and services for you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
              className="bg-muted/30 rounded-lg p-6 border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {survey.category}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[survey.status]}`}>
                  {statusLabels[survey.status]}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{survey.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{survey.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {survey.estimatedTime}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {survey.respondents} responses</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Deadline: {survey.deadline}
                </span>
                <button
                  onClick={() => setSelectedSurvey(survey)}
                  disabled={survey.status === 'closed'}
                  className="flex items-center gap-1 text-primary text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {survey.status === 'closed' ? 'View Results' : survey.status === 'upcoming' ? 'Notify Me' : 'Take Survey'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Survey Dialog */}
        <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedSurvey?.title}</DialogTitle>
              <DialogDescription>{selectedSurvey?.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><ClipboardList className="h-4 w-4" /> {selectedSurvey?.questions} questions</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {selectedSurvey?.estimatedTime}</span>
              </div>
              {selectedSurvey?.status === 'active' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Survey form will be embedded here. For now, this is a placeholder.</p>
                  <div className="p-8 rounded-lg border-2 border-dashed border-border flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-primary/30" />
                    <p className="text-sm text-muted-foreground text-center">Survey form integration coming soon</p>
                  </div>
                </div>
              )}
              {selectedSurvey?.status === 'upcoming' && (
                <div className="p-6 rounded-lg bg-amber-500/5 border border-amber-500/20 text-center">
                  <p className="text-sm text-muted-foreground">This survey will open soon. Click "Notify Me" to receive an alert when it's live.</p>
                  <button className="mt-3 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Get Notified
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
