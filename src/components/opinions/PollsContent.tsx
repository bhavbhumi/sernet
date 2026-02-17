import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, BarChart3, CheckCircle2, Users, Clock } from 'lucide-react';

interface PollOption {
  label: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
  category: string;
  endsIn: string;
}

const polls: Poll[] = [
  {
    id: 1,
    question: 'Which asset class will outperform in 2026?',
    options: [
      { label: 'Large-Cap Equities', votes: 340 },
      { label: 'Mid & Small-Cap', votes: 520 },
      { label: 'Gold & Commodities', votes: 180 },
      { label: 'Fixed Income / Bonds', votes: 95 },
    ],
    totalVotes: 1135,
    status: 'active',
    category: 'Markets',
    endsIn: '5 days',
  },
  {
    id: 2,
    question: 'What feature would you like next on our platform?',
    options: [
      { label: 'Advanced Charting Tools', votes: 412 },
      { label: 'AI-Powered Alerts', votes: 678 },
      { label: 'Social / Community Feed', votes: 230 },
      { label: 'Portfolio Analytics Dashboard', votes: 390 },
    ],
    totalVotes: 1710,
    status: 'active',
    category: 'Platform',
    endsIn: '3 days',
  },
  {
    id: 3,
    question: 'How often do you review your investment portfolio?',
    options: [
      { label: 'Daily', votes: 890 },
      { label: 'Weekly', votes: 1250 },
      { label: 'Monthly', votes: 640 },
      { label: 'Quarterly or less', votes: 320 },
    ],
    totalVotes: 3100,
    status: 'closed',
    category: 'Habits',
    endsIn: 'Ended',
  },
  {
    id: 4,
    question: 'Which learning format do you prefer?',
    options: [
      { label: 'Short Videos (< 10 min)', votes: 560 },
      { label: 'Live Webinars', votes: 340 },
      { label: 'Written Articles', votes: 280 },
      { label: 'Interactive Quizzes', votes: 190 },
    ],
    totalVotes: 1370,
    status: 'active',
    category: 'Education',
    endsIn: '7 days',
  },
];

export const PollsContent = () => {
  const [votedPolls, setVotedPolls] = useState<Record<number, number>>({});

  const handleVote = (pollId: number, optionIndex: number) => {
    setVotedPolls((prev) => ({ ...prev, [pollId]: optionIndex }));
  };

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
            <Vote className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Quick Polls</h2>
          </div>
          <p className="text-muted-foreground">Cast your vote on trending topics — see how the community thinks.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {polls.map((poll, index) => {
            const hasVoted = votedPolls[poll.id] !== undefined;
            const showResults = hasVoted || poll.status === 'closed';

            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="bg-muted/30 rounded-lg p-6 border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {poll.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {poll.status === 'closed' ? (
                      <><CheckCircle2 className="h-3 w-3" /> Closed</>
                    ) : (
                      <><Clock className="h-3 w-3" /> Ends in {poll.endsIn}</>
                    )}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-4">{poll.question}</h3>

                <div className="space-y-2.5">
                  {poll.options.map((option, optIdx) => {
                    const percentage = Math.round((option.votes / poll.totalVotes) * 100);
                    const isSelected = votedPolls[poll.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !showResults && poll.status === 'active' && handleVote(poll.id, optIdx)}
                        disabled={showResults || poll.status === 'closed'}
                        className={`w-full text-left relative rounded-lg overflow-hidden border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 hover:border-primary/30'
                        } ${!showResults && poll.status === 'active' ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {showResults && (
                          <div
                            className="absolute inset-0 bg-primary/10 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between px-4 py-3">
                          <span className="text-sm font-medium text-foreground flex items-center gap-2">
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            {option.label}
                          </span>
                          {showResults && (
                            <span className="text-sm font-semibold text-foreground">{percentage}%</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{poll.totalVotes.toLocaleString()} votes</span>
                  {showResults && !hasVoted && (
                    <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Final results</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
