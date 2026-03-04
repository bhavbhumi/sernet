import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

const DEPARTMENTS = ['Admin', 'HR', 'Finance & Accounts', 'Marketing', 'Sales', 'Ops', 'Support', 'Legal & Compliance'];

const emptyForm = {
  full_name: '',
  employee_code: '',
  email: '',
  phone: '',
  department: 'Admin',
  designation: 'Associate',
  employment_type: 'full_time',
  status: 'active',
  photo_url: '',
  date_of_joining: '',
  date_of_leaving: '',
  bio: '',
  sort_order: 0,
  is_public: false,
};

const AdminEmployees = () => (
  <GenericCMSPage
    title="Employee Directory"
    subtitle="Manage employee profiles, public team profiles, and organizational structure"
    tableName="employees"
    fields={[
      { key: 'full_name', label: 'Full Name', type: 'text', required: true },
      { key: 'employee_code', label: 'Employee Code', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
      { key: 'designation', label: 'Designation', type: 'text', required: true },
      { key: 'employment_type', label: 'Employment Type', type: 'select', options: ['full_time', 'part_time', 'contract', 'intern'] },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'on_leave', 'terminated'] },
      { key: 'is_public', label: 'Show on Website', type: 'select', options: ['true', 'false'] },
      { key: 'sort_order', label: 'Display Order', type: 'number', placeholder: '0', tip: 'Controls ordering on the public team page when "Show on Website" is enabled' },
      { key: 'date_of_joining', label: 'Date of Joining', type: 'date' },
      { key: 'date_of_leaving', label: 'Date of Leaving', type: 'date' },
      { key: 'photo_url', label: 'Photo URL', type: 'url', colSpan: 2 },
      { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short biography...', colSpan: 2 },
    ]}
    emptyForm={emptyForm}
    tableColumns={[
      { key: 'full_name', label: 'Name' },
      { key: 'employee_code', label: 'Code' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' },
      { key: 'employment_type', label: 'Type' },
      { key: 'is_public', label: 'Public' },
      { key: 'status', label: 'Status' },
    ]}
    hasStatus={false}
    orderBy={{ column: 'full_name', ascending: true }}
  />
);

export default AdminEmployees;
