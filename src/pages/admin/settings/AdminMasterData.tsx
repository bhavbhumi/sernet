
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { CategoryTreeManager } from '@/components/admin/CategoryTreeManager';
import { Package, Building2, Award, MapPin, Receipt, CalendarClock, Wallet, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// ── Products Tab (Tree View) ──────────────────────────────
function ProductsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hierarchical product catalogue. Parent brands → Sub-products. Referenced by CRM Deals, Pipeline Config, and Support modules.
      </p>
      <GenericCMSPage
        title=""
        table="products"
        columns={[
          { key: 'name', label: 'Product Name', type: 'text', required: true },
          { key: 'slug', label: 'Slug', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'icon_name', label: 'Icon Name', type: 'text' },
          { key: 'parent_id', label: 'Parent Product', type: 'text' },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'sort_order', label: 'Sort Order', type: 'number' },
        ]}
        filterField={{ key: 'is_active', label: 'Status', options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ]}}
        defaultSort="sort_order"
        defaultSortDirection="asc"
      />
    </div>
  );
}

// ── Departments Tab ───────────────────────────────────────
function DepartmentsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Organisation departments. Referenced by HR (Employees, Job Openings), CRM Contacts, and Reporting.
      </p>
      <GenericCMSPage
        title=""
        table="departments"
        columns={[
          { key: 'name', label: 'Department Name', type: 'text', required: true },
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'sort_order', label: 'Sort Order', type: 'number' },
        ]}
        filterField={{ key: 'is_active', label: 'Status', options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ]}}
        defaultSort="sort_order"
        defaultSortDirection="asc"
      />
    </div>
  );
}

// ── Designations Tab ──────────────────────────────────────
function DesignationsTab() {
  const { data: departments } = useQuery({
    queryKey: ['departments-list'],
    queryFn: async () => {
      const { data } = await supabase.from('departments').select('id, name').eq('is_active', true).order('sort_order');
      return data || [];
    }
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Job titles / designations. Referenced by HR Employees and CRM Contact KMPs.
      </p>
      <GenericCMSPage
        title=""
        table="designations"
        columns={[
          { key: 'title', label: 'Designation Title', type: 'text', required: true },
          { key: 'level', label: 'Level (Seniority)', type: 'number' },
          { key: 'department_id', label: 'Department', type: 'select', options: (departments || []).map(d => ({ label: d.name, value: d.id })) },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'sort_order', label: 'Sort Order', type: 'number' },
        ]}
        filterField={{ key: 'is_active', label: 'Status', options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ]}}
        defaultSort="sort_order"
        defaultSortDirection="asc"
      />
    </div>
  );
}

// ── Locations Tab ─────────────────────────────────────────
function LocationsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Office locations & branches. Referenced by HR (Job Openings), CRM Contacts, and Firm Profile.
      </p>
      <GenericCMSPage
        title=""
        table="locations"
        columns={[
          { key: 'name', label: 'Location Name', type: 'text', required: true },
          { key: 'city', label: 'City', type: 'text', required: true },
          { key: 'state', label: 'State', type: 'text' },
          { key: 'pincode', label: 'Pincode', type: 'text' },
          { key: 'address', label: 'Address', type: 'textarea' },
          { key: 'location_type', label: 'Type', type: 'select', options: [
            { label: 'Head Office', value: 'head_office' },
            { label: 'Branch', value: 'branch' },
            { label: 'Virtual', value: 'virtual' },
          ]},
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'sort_order', label: 'Sort Order', type: 'number' },
        ]}
        filterField={{ key: 'location_type', label: 'Type', options: [
          { label: 'Head Office', value: 'head_office' },
          { label: 'Branch', value: 'branch' },
          { label: 'Virtual', value: 'virtual' },
        ]}}
        defaultSort="sort_order"
        defaultSortDirection="asc"
      />
    </div>
  );
}

// ── Financial Masters Tabs ────────────────────────────────
function LeaveTypesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Leave categories for HR Leave Management. Referenced by Leave Requests.
      </p>
      <GenericCMSPage
        title=""
        table="leave_types"
        columns={[
          { key: 'name', label: 'Leave Type', type: 'text', required: true },
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'default_days', label: 'Default Days', type: 'number' },
          { key: 'is_paid', label: 'Paid Leave', type: 'boolean' },
          { key: 'is_active', label: 'Active', type: 'boolean' },
        ]}
        defaultSort="name"
        defaultSortDirection="asc"
      />
    </div>
  );
}

function TaxRatesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tax rate definitions for Invoicing and Accounts. Referenced by Invoice line items.
      </p>
      <GenericCMSPage
        title=""
        table="tax_rates"
        columns={[
          { key: 'name', label: 'Tax Name', type: 'text', required: true },
          { key: 'rate', label: 'Rate (%)', type: 'number', required: true },
          { key: 'tax_type', label: 'Type', type: 'select', options: [
            { label: 'GST', value: 'gst' },
            { label: 'TDS', value: 'tds' },
            { label: 'Other', value: 'other' },
          ]},
          { key: 'is_active', label: 'Active', type: 'boolean' },
        ]}
        defaultSort="name"
        defaultSortDirection="asc"
      />
    </div>
  );
}

function SalaryComponentsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Salary structure components for Payroll. Referenced by Payroll Register.
      </p>
      <GenericCMSPage
        title=""
        table="salary_components"
        columns={[
          { key: 'name', label: 'Component', type: 'text', required: true },
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'component_type', label: 'Type', type: 'select', options: [
            { label: 'Earning', value: 'earning' },
            { label: 'Deduction', value: 'deduction' },
          ]},
          { key: 'is_taxable', label: 'Taxable', type: 'boolean' },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'sort_order', label: 'Sort Order', type: 'number' },
        ]}
        defaultSort="sort_order"
        defaultSortDirection="asc"
      />
    </div>
  );
}

function ServiceCatalogTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Services offered by the firm. Referenced by Invoicing and Accounts.
      </p>
      <GenericCMSPage
        title=""
        table="service_catalog"
        columns={[
          { key: 'name', label: 'Service Name', type: 'text', required: true },
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'default_rate', label: 'Default Rate', type: 'number' },
          { key: 'billing_type', label: 'Billing Type', type: 'select', options: [
            { label: 'Fixed', value: 'fixed' },
            { label: 'Percentage', value: 'percentage' },
            { label: 'Hourly', value: 'hourly' },
          ]},
          { key: 'is_active', label: 'Active', type: 'boolean' },
        ]}
        defaultSort="name"
        defaultSortDirection="asc"
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
const tabs = [
  { value: 'products', label: 'Products', icon: Package },
  { value: 'departments', label: 'Departments', icon: Building2 },
  { value: 'designations', label: 'Designations', icon: Award },
  { value: 'locations', label: 'Locations', icon: MapPin },
  { value: 'leave-types', label: 'Leave Types', icon: CalendarClock },
  { value: 'tax-rates', label: 'Tax Rates', icon: Receipt },
  { value: 'salary', label: 'Salary Components', icon: Wallet },
  { value: 'services', label: 'Service Catalog', icon: ClipboardList },
];

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <AdminLayout
      title="Master Data"
      subtitle="Central source of truth — referenced across all modules"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs">
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="departments"><DepartmentsTab /></TabsContent>
        <TabsContent value="designations"><DesignationsTab /></TabsContent>
        <TabsContent value="locations"><LocationsTab /></TabsContent>
        <TabsContent value="leave-types"><LeaveTypesTab /></TabsContent>
        <TabsContent value="tax-rates"><TaxRatesTab /></TabsContent>
        <TabsContent value="salary"><SalaryComponentsTab /></TabsContent>
        <TabsContent value="services"><ServiceCatalogTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
