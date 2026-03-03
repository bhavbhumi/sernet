import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Building2, Eye, Users, ChevronDown, ChevronRight } from 'lucide-react';

interface BranchRow {
  id: string;
  branch_city: string;
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  pincode: string | null;
  phone: string | null;
  office_type: string | null;
  is_head_office: boolean | null;
  address_type: string | null;
  ownership: string | null;
}

interface KMPRow {
  id: string;
  full_name: string;
  designation: string;
  department: string | null;
  email: string | null;
  phone: string | null;
  is_escalation: boolean;
  escalation_level: number;
}

const OFFICE_TYPE_COLORS: Record<string, string> = {
  HO: 'bg-primary text-primary-foreground',
  ZO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  RO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  BO: 'bg-muted text-muted-foreground',
  INTL: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  IFSC: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const OFFICE_TYPE_LABELS: Record<string, string> = {
  HO: 'Head Office',
  ZO: 'Zonal Office',
  RO: 'Regional Office',
  BO: 'Branch Office',
  INTL: 'International',
  IFSC: 'IFSC',
};

function ContactDetailDialog({ contactId, contactName, contactType, open, onClose }: {
  contactId: string;
  contactName: string;
  contactType: string;
  open: boolean;
  onClose: () => void;
}) {
  const { data: branches = [] } = useQuery({
    queryKey: ['contact-branches', contactId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_branches')
        .select('*')
        .eq('contact_id', contactId)
        .order('office_type')
        .order('branch_city');
      return (data || []) as BranchRow[];
    },
  });

  const { data: kmpContacts = [] } = useQuery({
    queryKey: ['contact-kmp', contactId],
    enabled: open && contactType === 'company',
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_kmp')
        .select('*')
        .eq('contact_id', contactId)
        .order('sort_order');
      return (data || []) as KMPRow[];
    },
  });

  const isCompany = contactType === 'company';

  // Group branches by office type for company
  const branchesByType = branches.reduce<Record<string, BranchRow[]>>((acc, b) => {
    const t = b.office_type || 'BO';
    if (!acc[t]) acc[t] = [];
    acc[t].push(b);
    return acc;
  }, {});

  const typeOrder = ['HO', 'ZO', 'RO', 'BO', 'INTL', 'IFSC'];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompany ? <Building2 className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
            {contactName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="addresses" className="mt-2">
          <TabsList>
            <TabsTrigger value="addresses">
              Addresses ({branches.length})
            </TabsTrigger>
            {isCompany && (
              <TabsTrigger value="kmp">
                KMP & Escalation ({kmpContacts.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="addresses" className="mt-4 space-y-4">
            {branches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No addresses found for this contact.</p>
            ) : isCompany ? (
              /* Company: grouped by office type */
              typeOrder.filter(t => branchesByType[t]).map(type => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={OFFICE_TYPE_COLORS[type] || ''}>
                      {OFFICE_TYPE_LABELS[type] || type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{branchesByType[type].length} locations</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {branchesByType[type].map(b => (
                      <div key={b.id} className="border rounded-lg p-3 text-xs space-y-1">
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
              ))
            ) : (
              /* Individual: show with address_type and ownership */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {branches.map(b => (
                  <div key={b.id} className="border rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      {b.branch_city}
                      {b.pincode && <span className="text-muted-foreground">— {b.pincode}</span>}
                    </div>
                    <div className="flex gap-1.5 pl-[18px]">
                      <Badge variant="outline" className="text-[10px]">{b.address_type || 'Domestic'}</Badge>
                      <Badge variant="outline" className="text-[10px]">{b.ownership || 'Own'}</Badge>
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
            )}
          </TabsContent>

          {isCompany && (
            <TabsContent value="kmp" className="mt-4">
              {kmpContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No KMP / escalation contacts added yet.</p>
              ) : (
                <div className="space-y-3">
                  {/* Escalation matrix first */}
                  {kmpContacts.filter(k => k.is_escalation).length > 0 && (
                    <Card>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm">Escalation Matrix</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3">
                        <div className="space-y-2">
                          {kmpContacts.filter(k => k.is_escalation).sort((a, b) => a.escalation_level - b.escalation_level).map(k => (
                            <div key={k.id} className="flex items-center gap-3 text-xs border rounded-md p-2">
                              <Badge variant="outline" className="shrink-0">L{k.escalation_level}</Badge>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium">{k.full_name}</span>
                                <span className="text-muted-foreground ml-1.5">· {k.designation}</span>
                              </div>
                              {k.phone && <span className="text-muted-foreground shrink-0">{k.phone}</span>}
                              {k.email && <span className="text-muted-foreground shrink-0">{k.email}</span>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* KMP list */}
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm">Key Management Personnel</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="space-y-2">
                        {kmpContacts.filter(k => !k.is_escalation).map(k => (
                          <div key={k.id} className="flex items-center gap-3 text-xs border rounded-md p-2">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium">{k.full_name}</span>
                              <span className="text-muted-foreground ml-1.5">· {k.designation}</span>
                              {k.department && <span className="text-muted-foreground ml-1.5">({k.department})</span>}
                            </div>
                            {k.phone && <span className="text-muted-foreground shrink-0">{k.phone}</span>}
                            {k.email && <span className="text-muted-foreground shrink-0">{k.email}</span>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCRMContacts() {
  const [viewContact, setViewContact] = useState<{ id: string; name: string; type: string } | null>(null);

  return (
    <AdminGuard>
      <GenericCMSPage
        title="CRM Contacts"
        subtitle="Manage clients, partners & principals"
        tableName="crm_contacts"
        tableColumns={[
          { key: 'full_name', label: 'Name' },
          { key: 'relationship_type', label: 'Relationship' },
          { key: 'contact_type', label: 'Type' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'city', label: 'City' },
          { key: 'source', label: 'Source' },
          { key: 'created_at', label: 'Created', format: 'date' },
        ]}
        fields={[
          { key: 'full_name', label: 'Full Name', type: 'text', required: true },
          { key: 'relationship_type', label: 'Relationship', type: 'select', options: ['client', 'partner', 'principal'] },
          { key: 'contact_type', label: 'Type', type: 'select', options: ['individual', 'company'] },
          { key: 'company_name', label: 'Company Name', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'alternate_phone', label: 'Alternate Phone', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'pan', label: 'PAN', type: 'text' },
          { key: 'city', label: 'City', type: 'text' },
          { key: 'state', label: 'State', type: 'text' },
          { key: 'source', label: 'Source', type: 'select', options: ['direct', 'referral', 'website', 'walk-in', 'campaign', 'import'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        emptyForm={{
          full_name: '', relationship_type: 'client', contact_type: 'individual', company_name: '', phone: '', alternate_phone: '',
          email: '', pan: '', city: '', state: '', source: 'direct', notes: '',
        }}
        hasStatus={false}
        categoryField="relationship_type"
        orderBy={{ column: 'created_at', ascending: false }}
        onRowAction={(item) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setViewContact({
              id: String(item.id),
              name: String(item.full_name || ''),
              type: String(item.contact_type || 'individual'),
            })}
          >
            <Eye className="h-3 w-3" /> View
          </Button>
        )}
      />

      {viewContact && (
        <ContactDetailDialog
          contactId={viewContact.id}
          contactName={viewContact.name}
          contactType={viewContact.type}
          open={!!viewContact}
          onClose={() => setViewContact(null)}
        />
      )}
    </AdminGuard>
  );
}
