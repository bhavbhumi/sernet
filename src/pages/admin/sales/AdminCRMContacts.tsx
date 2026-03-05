import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Building2, Eye, Users, Mail, Calendar, Shield, CreditCard, User, Plus, PhoneCall, FileText, Video, CheckSquare, MessageSquare } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ---- Log Activity from Contact ----
const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call', icon: PhoneCall },
  { value: 'meeting', label: 'Meeting', icon: Video },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'note', label: 'Note', icon: FileText },
  { value: 'task', label: 'Task', icon: CheckSquare },
] as const;

function LogActivityForm({ contactId, onLogged }: { contactId: string; onLogged: () => void }) {
  const [type, setType] = useState<string>('note');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!subject.trim()) { toast.error('Subject is required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_activities').insert({
        contact_id: contactId,
        activity_type: type as any,
        subject,
        description: description || null,
        outcome: outcome || null,
      });
      if (error) throw error;
      toast.success('Activity logged');
      setSubject(''); setDescription(''); setOutcome('');
      onLogged();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-1 flex-wrap">
          {ACTIVITY_TYPES.map(at => {
            const Icon = at.icon;
            return (
              <Button
                key={at.value}
                variant={type === at.value ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs gap-1 px-2"
                onClick={() => setType(at.value)}
              >
                <Icon className="h-3 w-3" /> {at.label}
              </Button>
            );
          })}
        </div>
        <Input placeholder="Subject *" value={subject} onChange={e => setSubject(e.target.value)} className="h-8 text-sm" />
        <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="text-sm min-h-[60px]" />
        <div className="flex items-center gap-2">
          <Input placeholder="Outcome (optional)" value={outcome} onChange={e => setOutcome(e.target.value)} className="h-8 text-sm flex-1" />
          <Button size="sm" className="h-8" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Log'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Add Deal from Contact ----
function AddDealFromContact({ contactId, contactName, onCreated }: {
  contactId: string; contactName: string; onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(`Deal - ${contactName}`);
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_deals').insert({
        title, contact_id: contactId,
        product_interest: product || null,
        deal_value: value ? parseFloat(value) : 0,
      });
      if (error) throw error;
      toast.success('Deal created');
      setOpen(false);
      setTitle(`Deal - ${contactName}`);
      setProduct(''); setValue('');
      onCreated();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <>
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setOpen(true)}>
        <Plus className="h-3 w-3 mr-1" /> Add Deal
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>New Deal for {contactName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Deal Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Product</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {['Mutual Funds', 'Insurance', 'Trading', 'PMS', 'AIF', 'Bonds', 'FD', 'Other'].map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Value (₹)</Label><Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" /></div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? 'Creating...' : 'Create Deal'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

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

const TAX_STATUS_LABELS: Record<string, string> = {
  resident_indian: 'Resident Indian',
  nri: 'NRI',
  foreign_national: 'Foreign National',
  pio_oci: 'PIO / OCI',
};

const ENTITY_SUB_TYPE_LABELS: Record<string, string> = {
  huf: 'HUF',
  company: 'Company',
  trust: 'Trust',
  partnership_firm: 'Partnership Firm',
};

function getAgeCategory(dob: string) {
  const age = differenceInYears(new Date(), new Date(dob));
  if (age < 18) return { age, label: 'Minor' };
  if (age >= 80) return { age, label: 'Super Senior Citizen' };
  if (age >= 60) return { age, label: 'Senior Citizen' };
  return { age, label: 'Adult' };
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <span className="text-muted-foreground">{label}: </span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ContactDetailDialog({ contactId, contactName, contactType, open, onClose }: {
  contactId: string;
  contactName: string;
  contactType: string;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  // Fetch full contact record
  const { data: contact } = useQuery({
    queryKey: ['contact-detail', contactId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('id', contactId)
        .single();
      return data;
    },
  });

  // Fetch linked deals
  const { data: linkedDeals = [] } = useQuery({
    queryKey: ['contact-deals', contactId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from('crm_deals')
        .select('id, title, stage, sub_status, deal_value, product_interest, created_at')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  // Fetch linked activities
  const { data: linkedActivities = [] } = useQuery({
    queryKey: ['contact-activities', contactId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from('crm_activities')
        .select('id, activity_type, subject, outcome, description, is_completed, created_at')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false })
        .limit(30);
      return data || [];
    },
  });

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

  const isNonIndividual = contactType === 'non_individual';

  const { data: kmpContacts = [] } = useQuery({
    queryKey: ['contact-kmp', contactId],
    enabled: open && isNonIndividual,
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_kmp')
        .select('*')
        .eq('contact_id', contactId)
        .order('sort_order');
      return (data || []) as KMPRow[];
    },
  });

  // Group branches by office type for non_individual
  const branchesByType = branches.reduce<Record<string, BranchRow[]>>((acc, b) => {
    const t = b.office_type || 'BO';
    if (!acc[t]) acc[t] = [];
    acc[t].push(b);
    return acc;
  }, {});

  const typeOrder = ['HO', 'ZO', 'RO', 'BO', 'INTL', 'IFSC'];

  const ageInfo = contact?.date_of_birth ? getAgeCategory(contact.date_of_birth) : null;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isNonIndividual ? <Building2 className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-primary" />}
            {contactName}
            {contact?.relationship_type && (
              <Badge variant="outline" className="ml-2 capitalize">{contact.relationship_type}</Badge>
            )}
            {isNonIndividual && contact?.entity_sub_type && (
              <Badge className="ml-1">{ENTITY_SUB_TYPE_LABELS[contact.entity_sub_type] || contact.entity_sub_type}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">
              Addresses ({branches.length})
            </TabsTrigger>
            {isNonIndividual && (
              <TabsTrigger value="kmp">
                KMP & Escalation ({kmpContacts.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="deals">
              Deals ({linkedDeals.length})
            </TabsTrigger>
            <TabsTrigger value="activities">
              Activities ({linkedActivities.length})
            </TabsTrigger>
          </TabsList>

          {/* ===== PROFILE TAB ===== */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            {contact ? (
              <>
                {/* Contact Info */}
                <Card>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <DetailRow icon={Phone} label="Phone" value={contact.phone} />
                    <DetailRow icon={Phone} label="Alt. Phone" value={contact.alternate_phone} />
                    <DetailRow icon={Mail} label="Email" value={contact.email} />
                    <DetailRow icon={MapPin} label="Location" value={[contact.city, contact.state].filter(Boolean).join(', ') || null} />
                  </CardContent>
                </Card>

                {/* KYC / Identity */}
                <Card>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm">
                      {isNonIndividual ? 'Registration & Identity' : 'KYC & Identity'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <DetailRow icon={CreditCard} label="PAN" value={contact.pan} />
                    {!isNonIndividual && (
                      <>
                        <DetailRow icon={Shield} label="Aadhaar" value={contact.aadhaar} />
                        <DetailRow icon={Shield} label="CKYC" value={contact.ckyc_number} />
                        <DetailRow icon={User} label="Gender" value={contact.gender ? contact.gender.charAt(0).toUpperCase() + contact.gender.slice(1) : null} />
                        <DetailRow icon={Shield} label="Tax Status" value={contact.tax_status ? TAX_STATUS_LABELS[contact.tax_status] || contact.tax_status : null} />
                        {ageInfo && (
                          <DetailRow icon={Calendar} label="DOB / Age" value={`${format(new Date(contact.date_of_birth!), 'dd MMM yyyy')} (${ageInfo.age}y — ${ageInfo.label})`} />
                        )}
                      </>
                    )}
                    {isNonIndividual && (
                      <>
                        <DetailRow icon={Shield} label="TAN" value={contact.tan as string} />
                        <DetailRow icon={Shield} label="CIN / LLPIN" value={contact.cin as string} />
                        <DetailRow icon={Shield} label="GSTIN" value={contact.gstin as string} />
                        {contact.date_of_incorporation && (
                          <DetailRow icon={Calendar} label="Incorporated" value={format(new Date(contact.date_of_incorporation as string), 'dd MMM yyyy')} />
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                {contact.notes && (
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 text-sm text-muted-foreground whitespace-pre-wrap">
                      {contact.notes}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            )}
          </TabsContent>

          {/* ===== ADDRESSES TAB ===== */}
          <TabsContent value="addresses" className="mt-4 space-y-4">
            {branches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No addresses found for this contact.</p>
            ) : isNonIndividual ? (
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

          {/* ===== KMP TAB ===== */}
          {isNonIndividual && (
            <TabsContent value="kmp" className="mt-4">
              {kmpContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No KMP / escalation contacts added yet.</p>
              ) : (
                <div className="space-y-3">
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

          {/* ===== DEALS TAB ===== */}
          <TabsContent value="deals" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{linkedDeals.length} deal(s) linked</p>
              <AddDealFromContact contactId={contactId} contactName={contactName} onCreated={() => {
                queryClient.invalidateQueries({ queryKey: ['contact-deals', contactId] });
                queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
              }} />
            </div>
            {linkedDeals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No deals yet. Create one above to start tracking opportunities.</p>
            ) : (
              <div className="space-y-2">
                {linkedDeals.map((deal: any) => (
                  <div key={deal.id} className="flex items-center gap-3 p-3 rounded-lg border text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] capitalize">{deal.stage}</Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">{deal.sub_status?.replace('_', ' ')}</Badge>
                        {deal.product_interest && <span className="text-xs text-muted-foreground">{deal.product_interest}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">₹{Number(deal.deal_value || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-muted-foreground">{format(new Date(deal.created_at), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== ACTIVITIES TAB ===== */}
          <TabsContent value="activities" className="mt-4 space-y-3">
            <LogActivityForm contactId={contactId} onLogged={() => {
              queryClient.invalidateQueries({ queryKey: ['contact-activities', contactId] });
            }} />
            {linkedActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No activities logged yet. Use the form above to log your first interaction.</p>
            ) : (
              <div className="relative pl-4 border-l-2 border-muted space-y-3">
                {linkedActivities.map((act: any) => {
                  const typeInfo = ACTIVITY_TYPES.find(t => t.value === act.activity_type);
                  const Icon = typeInfo?.icon || MessageSquare;
                  return (
                    <div key={act.id} className={cn('relative flex items-start gap-2.5 p-2.5 rounded-lg border text-sm', act.is_completed && 'opacity-50')}>
                      <div className="absolute -left-[calc(1rem+5px)] top-3 h-2 w-2 rounded-full bg-primary" />
                      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-xs">{act.subject}</span>
                          <Badge variant="outline" className="text-[9px] capitalize">{act.activity_type?.replace('_', ' ')}</Badge>
                          {act.outcome && <Badge variant="secondary" className="text-[9px]">{act.outcome}</Badge>}
                        </div>
                        {act.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{act.description}</p>}
                        <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(act.created_at), 'dd MMM yyyy HH:mm')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
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
          { key: 'contact_type', label: 'Type', type: 'select', options: ['individual', 'non_individual'] },
          { key: 'entity_sub_type', label: 'Entity Sub-Type', type: 'select', options: ['huf', 'company', 'trust', 'partnership_firm'], tip: 'Applicable for Non-Individual contacts' },
          { key: 'company_name', label: 'Entity / Company Name', type: 'text' },
          // Individual fields
          { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'], tip: 'Applicable for Individual contacts' },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
          { key: 'tax_status', label: 'Tax Status', type: 'select', options: ['resident_indian', 'nri', 'foreign_national', 'pio_oci'] },
          // Common contact
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'alternate_phone', label: 'Alternate Phone', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          // KYC - common
          { key: 'pan', label: 'PAN', type: 'text', placeholder: 'ABCDE1234F' },
          // Individual KYC
          { key: 'aadhaar', label: 'Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', tip: 'Individual only' },
          { key: 'ckyc_number', label: 'CKYC Number', type: 'text', placeholder: '14-digit CKYC ID', tip: 'Individual only' },
          // Non-individual registration
          { key: 'tan', label: 'TAN', type: 'text', placeholder: 'MUMX12345F', tip: 'Non-Individual only' },
          { key: 'cin', label: 'CIN / LLPIN', type: 'text', placeholder: 'U65999MH2015PTC123456', tip: 'Non-Individual only' },
          { key: 'gstin', label: 'GSTIN', type: 'text', placeholder: '27AABCW1234F1ZP', tip: 'Non-Individual only' },
          { key: 'date_of_incorporation', label: 'Date of Incorporation', type: 'date', tip: 'Non-Individual only' },
          // Location
          { key: 'city', label: 'City', type: 'text' },
          { key: 'state', label: 'State', type: 'text' },
          { key: 'source', label: 'Source', type: 'select', options: ['direct', 'referral', 'website', 'walk-in', 'campaign', 'import'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        emptyForm={{
          full_name: '', relationship_type: 'client', contact_type: 'individual', entity_sub_type: '',
          company_name: '', gender: '', date_of_birth: '', tax_status: 'resident_indian',
          phone: '', alternate_phone: '', email: '', pan: '', aadhaar: '', ckyc_number: '',
          tan: '', cin: '', gstin: '', date_of_incorporation: '',
          city: '', state: '', source: 'direct', notes: '',
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
