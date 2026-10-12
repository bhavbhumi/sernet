import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OrgNode {
  id: string;
  full_name: string;
  designation: string;
  department: string;
  photo_url: string | null;
  children: OrgNode[];
}

function buildTree(employees: any[]): OrgNode[] {
  const map = new Map<string, OrgNode>();
  employees.forEach(e =>
    map.set(e.id, { id: e.id, full_name: e.full_name, designation: e.designation, department: e.department, photo_url: e.photo_url, children: [] })
  );

  const roots: OrgNode[] = [];
  map.forEach(node => {
    const parent = employees.find(e => e.id === node.id)?.reporting_to;
    const parentNode = parent ? map.get(parent) : undefined;
    if (parentNode && parentNode !== node) parentNode.children.push(node);
    else roots.push(node);
  });
  return roots;
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

function OrgCard({ node, root }: { node: OrgNode; root?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center text-center rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow ${
        root ? 'border-primary/30 px-6 py-5 min-w-[200px]' : 'border-border px-4 py-4 min-w-[150px]'
      }`}
    >
      {node.photo_url ? (
        <img
          src={node.photo_url}
          alt={node.full_name}
          className={`${root ? 'w-16 h-16' : 'w-12 h-12'} rounded-full object-cover border border-border mb-2`}
        />
      ) : (
        <div
          className={`${root ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/20`}
        >
          <span className={`${root ? 'text-lg' : 'text-sm'} font-semibold text-primary`}>{initials(node.full_name)}</span>
        </div>
      )}
      <p className={`${root ? 'text-base' : 'text-sm'} font-semibold text-foreground leading-tight`}>{node.full_name}</p>
      <p className={`${root ? 'text-sm' : 'text-xs'} text-primary font-medium mt-0.5`}>{node.designation}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{node.department}</p>
    </div>
  );
}

/** Desktop: recursive connector tree */
function TreeNode({ node }: { node: OrgNode }) {
  const hasChildren = node.children.length > 0;
  return (
    <div className="flex flex-col items-center">
      <OrgCard node={node} />
      {hasChildren && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-6 relative">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border"
                style={{ width: `calc(100% - 150px)` }}
              />
            )}
            {node.children.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const TeamContent = () => {
  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['public-team'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees' as any)
        .select('id, full_name, designation, department, photo_url, reporting_to, sort_order')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return buildTree(data || []);
    },
  });

  const root = tree[0];
  const flat = tree.flatMap(function flatten(node): OrgNode[] {
    return [node, ...node.children.flatMap(flatten)];
  });

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-sernet">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-3 text-center"
          >
            Leadership & Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body text-muted-foreground mb-12 text-center max-w-2xl mx-auto"
          >
            How our leadership and operations are organised — a compact team serving clients, partners and principals across 54 cities.
          </motion.p>

          {isLoading ? (
            <div className="flex justify-center py-16" role="status" aria-label="Loading team chart">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !root ? (
            <div className="text-center py-12 text-muted-foreground">Team profiles will appear here once published.</div>
          ) : (
            <>
              {/* Desktop / tablet: connector tree */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="hidden md:block overflow-x-auto pb-4"
              >
                <div className="flex flex-col items-center min-w-max mx-auto">
                  <TreeNode node={root} />
                </div>
              </motion.div>

              {/* Mobile: stacked reporting list */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="md:hidden flex flex-col items-center"
              >
                <OrgCard node={root} root />
                <div className="relative mt-6 pl-5 border-l-2 border-border/70 space-y-5 self-stretch ml-6">
                  {flat.slice(1).map(node => (
                    <div key={node.id} className="relative">
                      <span className="absolute -left-[27px] top-6 w-5 h-px bg-border/70" />
                      <div className="inline-block">
                        <OrgCard node={node} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  );
};
