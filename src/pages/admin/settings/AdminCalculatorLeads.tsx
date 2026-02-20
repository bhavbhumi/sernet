import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Calculator, Phone, Mail, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const AdminCalculatorLeads = () => {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['calculator-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calculator_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const productBadge: Record<string, string> = {
    sip: 'bg-primary/10 text-primary',
    lumpsum: 'bg-green-500/10 text-green-600',
    brokerage: 'bg-amber-500/10 text-amber-600',
    margin: 'bg-purple-500/10 text-purple-600',
    insurance: 'bg-red-500/10 text-red-600',
  };

  const formatResult = (result: Record<string, number> | null) => {
    if (!result) return '—';
    const fv = result.futureValue ?? result.requiredMonthly;
    if (!fv) return '—';
    if (fv >= 10000000) return `₹${(fv / 10000000).toFixed(2)} Cr`;
    if (fv >= 100000) return `₹${(fv / 100000).toFixed(2)} L`;
    return `₹${fv.toLocaleString('en-IN')}`;
  };

  return (
    <AdminLayout title="Calculator Leads">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calculator Leads</h1>
            <p className="text-sm text-muted-foreground">Leads captured via the AI Goal Planner on /calculators</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {leads.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Loading leads…</div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border border-dashed border-border rounded-lg">
            <Target className="w-8 h-8 opacity-30" />
            <p className="text-sm">No leads yet. They'll appear here once users submit via the AI Calculator.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Goal</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">AI Result</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="w-3 h-3" /> {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <p className="text-foreground line-clamp-2">{lead.goal_text}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${productBadge[lead.product_type] ?? 'bg-muted text-muted-foreground'}`}>
                        <TrendingUp className="w-3 h-3" />
                        {lead.product_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatResult(lead.calculated_result as Record<string, number> | null)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {format(new Date(lead.created_at), 'dd MMM yyyy, HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCalculatorLeads;
