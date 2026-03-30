import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface EmpNode {
  id: string;
  full_name: string;
  designation: string;
  department: string;
  photo_url: string | null;
  reporting_to: string | null;
  children: EmpNode[];
}

function buildTree(employees: any[]): EmpNode[] {
  const map = new Map<string, EmpNode>();
  employees.forEach(e => map.set(e.id, { ...e, children: [] }));

  const roots: EmpNode[] = [];
  map.forEach(node => {
    if (node.reporting_to && map.has(node.reporting_to)) {
      map.get(node.reporting_to)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function OrgNode({ node, depth = 0 }: { node: EmpNode; depth?: number }) {
  return (
    <div className="flex flex-col items-center">
      <Card className="p-3 min-w-[160px] text-center border-border bg-card hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center gap-1.5">
          {node.photo_url ? (
            <img src={node.photo_url} alt={node.full_name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          )}
          <p className="text-sm font-semibold text-foreground leading-tight">{node.full_name}</p>
          <p className="text-xs text-muted-foreground">{node.designation}</p>
          <Badge variant="outline" className="text-[10px]">{node.department}</Badge>
        </div>
      </Card>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-5 bg-border" />
          <div className="flex gap-6 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{
                width: `calc(100% - 160px)`,
              }} />
            )}
            {node.children.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                {node.children.length > 1 && <div className="w-px h-5 bg-border" />}
                <OrgNode node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrgChart() {
  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['org-chart'],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, designation, department, photo_url, reporting_to')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      return buildTree(data || []);
    },
  });

  return (
    <AdminLayout title="Organisation Chart" subtitle="Reporting hierarchy">
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : tree.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No employees found. Add employees and set reporting relationships to see the org chart.</div>
      ) : (
        <div className="overflow-auto py-8">
          <div className="flex flex-col items-center gap-0 min-w-max mx-auto">
            {tree.map(root => (
              <OrgNode key={root.id} node={root} />
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
