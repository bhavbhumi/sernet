import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BranchRow {
  id: string;
  branch_city: string;
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  pincode: string | null;
  phone: string | null;
}

interface PrincipalWithBranches {
  id: string;
  full_name: string;
  phone: string | null;
  relationship_meta: any;
  branches: BranchRow[];
}

export default function AdminPrincipalBranches() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: principals = [], isLoading } = useQuery({
    queryKey: ['principal-branches'],
    queryFn: async () => {
      // Get all principal contacts
      const { data: contacts, error: cErr } = await supabase
        .from('crm_contacts')
        .select('id, full_name, phone, relationship_meta')
        .eq('relationship_type', 'principal')
        .order('full_name');
      if (cErr) throw cErr;

      // Get all branches
      const { data: branches, error: bErr } = await supabase
        .from('contact_branches')
        .select('id, contact_id, branch_city, address_line1, address_line2, address_line3, pincode, phone')
        .order('branch_city');
      if (bErr) throw bErr;

      // Group branches by contact
      const branchMap = new Map<string, BranchRow[]>();
      for (const b of (branches || [])) {
        const cid = (b as any).contact_id;
        if (!branchMap.has(cid)) branchMap.set(cid, []);
        branchMap.get(cid)!.push(b as BranchRow);
      }

      return (contacts || []).map(c => ({
        ...c,
        branches: branchMap.get(c.id) || [],
      })) as PrincipalWithBranches[];
    },
  });

  const filtered = principals.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.branches.some(b => b.branch_city.toLowerCase().includes(search.toLowerCase()))
  );

  const totalBranches = principals.reduce((sum, p) => sum + p.branches.length, 0);

  return (
    <AdminGuard>
      <AdminLayout title="Principal Network" subtitle="AMC / Fund House branch offices across India · ARN 35275">
        <div className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="text-2xl font-bold">{principals.length}</div>
                <div className="text-xs text-muted-foreground">Fund Houses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="text-2xl font-bold">{totalBranches.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Branches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="text-2xl font-bold">{new Set(principals.flatMap(p => p.branches.map(b => b.branch_city))).size}</div>
                <div className="text-xs text-muted-foreground">Cities Covered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="text-2xl font-bold">ARN 35275</div>
                <div className="text-xs text-muted-foreground">AMFI Registration</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by fund house or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Principals list */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading principal network...</div>
          ) : (
            <div className="space-y-2">
              {filtered.map(p => {
                const isExpanded = expandedId === p.id;
                const meta = p.relationship_meta as any;
                return (
                  <Card key={p.id} className="overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      <Building2 className="h-4 w-4 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{p.full_name}</div>
                        {p.phone && <div className="text-xs text-muted-foreground">{p.phone}</div>}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {p.branches.length} {p.branches.length === 1 ? 'branch' : 'branches'}
                      </Badge>
                      {meta?.products && (
                        <div className="hidden md:flex gap-1">
                          {(meta.products as string[]).map((prod: string) => (
                            <Badge key={prod} variant="outline" className="text-[10px]">{prod}</Badge>
                          ))}
                        </div>
                      )}
                    </button>
                    {isExpanded && p.branches.length > 0 && (
                      <div className="border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 max-h-96 overflow-y-auto">
                          {p.branches.map(b => (
                            <div key={b.id} className="px-4 py-2.5 border-b border-r text-xs space-y-0.5">
                              <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <MapPin className="h-3 w-3 text-primary shrink-0" />
                                {b.branch_city}
                                {b.pincode && <span className="text-muted-foreground">— {b.pincode}</span>}
                              </div>
                              <div className="text-muted-foreground leading-snug pl-[18px]">
                                {[b.address_line1, b.address_line2, b.address_line3].filter(Boolean).join(', ')}
                              </div>
                              {b.phone && (
                                <div className="flex items-center gap-1 text-muted-foreground pl-[18px]">
                                  <Phone className="h-2.5 w-2.5" /> {b.phone}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No principals found matching "{search}"</div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
