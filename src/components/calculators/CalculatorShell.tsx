import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Send, Loader2, Bot, User, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProposalDialog } from './ProposalDialog';

export type CalcMode = 'form' | 'ai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CalculatorResult {
  label: string;
  primary?: { label: string; value: string };
  metrics: { label: string; value: string; highlight?: boolean }[];
  commentary?: string;
}

interface CalculatorShellProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  // Form mode: the actual calculator inputs
  formInputs: React.ReactNode;
  // Result panel: always shown on the right
  result: CalculatorResult;
  // AI context: the current calculator type and params for AI parsing
  calcType: string;
  // Callback when AI returns params to update the form
  onAIParams?: (params: Record<string, number>) => void;
  // Context about what this calculator does, for the AI system prompt
  aiContext: string;
}

const formatMessageContent = (content: string) => {
  // Simple formatting: bold numbers, new lines
  return content.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < content.split('\n').length - 1 && <br />}
    </span>
  ));
};

export const CalculatorShell = ({
  title,
  description,
  icon,
  formInputs,
  result,
  calcType,
  onAIParams,
  aiContext,
}: CalculatorShellProps) => {
  const [mode, setMode] = useState<CalcMode>('form');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: userText };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const { data, error } = await supabase.functions.invoke('calculator-chat', {
        body: {
          messages: nextMessages,
          calcType,
          aiContext,
        },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.status === 429) throw new Error('Rate limit reached. Please wait a moment.');
        if (data.status === 402) throw new Error('AI usage limit reached.');
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);

      // If AI returned params, update the form
      if (data.params && onAIParams) {
        onAIParams(data.params);
      }

      scrollToBottom();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, calcType, aiContext, onAIParams]);

  const resetChat = () => {
    setMessages([]);
    setInput('');
  };

  const switchToAI = () => {
    setMode('ai');
    if (messages.length === 0) {
      // Seed with a welcome
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your AI assistant for the ${title}. Tell me about your financial goal or situation and I'll help you calculate the right numbers. You can say things like:\n\n• "I want to save ₹1 Crore in 15 years"\n• "I earn ₹15L a year, what insurance do I need?"\n• "What SIP should I start with ₹10,000 per month?"`
      }]);
    }
  };

  return (
    <div className="container-zerodha py-6">
      {/* Header + toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          {icon && <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">{icon}</div>}
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setMode('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'form'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Form
          </button>
          <button
            onClick={switchToAI}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'ai'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Chat
          </button>
        </div>
      </div>

      {/* Main split layout */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: Form or AI Chat */}
        <div className="flex flex-col min-h-[480px]">
          <AnimatePresence mode="wait">
            {mode === 'form' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 flex-1"
              >
                {formInputs}
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 h-full border border-border rounded-xl bg-background overflow-hidden"
                style={{ minHeight: 480 }}
              >
                {/* Chat header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">AI Assistant</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Updates calculator live</span>
                  </div>
                  {messages.length > 1 && (
                    <button onClick={resetChat} className="text-muted-foreground hover:text-foreground transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 340 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      }`}>
                        {formatMessageContent(msg.content)}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="bg-muted px-3 py-2 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-3 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ask me anything about your calculation…"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-40 hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Live Result + Commentary + CTA */}
        <div className="space-y-4">
          {/* Result card */}
          <motion.div
            key={result.primary?.value}
            initial={{ opacity: 0.8, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-muted/40 border border-border rounded-xl p-6 space-y-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground">{result.label}</h3>

            {result.primary && (
              <div className="text-center py-4 bg-primary/8 rounded-lg border border-primary/15">
                <p className="text-xs text-muted-foreground mb-1">{result.primary.label}</p>
                <motion.p
                  key={result.primary.value}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-primary tracking-tight"
                >
                  {result.primary.value}
                </motion.p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {result.metrics.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-center ${
                    m.highlight ? 'bg-green-500/10 border border-green-500/20' : 'bg-background border border-border'
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground mb-0.5">{m.label}</p>
                  <p className={`text-sm font-semibold ${m.highlight ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Commentary */}
          {result.commentary && (
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">AI Rationale</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.commentary}</p>
            </div>
          )}

          {/* Proposal CTA */}
          <button
            onClick={() => setShowProposal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Create Proposal
          </button>
        </div>
      </div>

      <ProposalDialog
        open={showProposal}
        onOpenChange={setShowProposal}
        calculatorTitle={title}
        result={result}
        aiContext={aiContext}
        calcType={calcType}
      />
    </div>
  );
};
