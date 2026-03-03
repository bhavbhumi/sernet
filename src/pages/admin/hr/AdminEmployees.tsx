import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

const emptyForm = {
  full_name: '',
  employee_code: '',
  email: '',
  phone: '',
  department: 'General',
  designation: 'Associate',
  employment_type: 'full_time',
  status: 'active',
  photo_url: '',
  date_of_joining: '',
  date_of_leaving: '',
};

const AdminEmployees = () => (
  <GenericCMSPage
    title="Employee Directory"
    subtitle="Manage employee profiles and organizational structure"
    tableName="employees"
    fields={[
      { key: 'full_name', label: 'Full Name', type: 'text', required: true },
      { key: 'employee_code', label: 'Employee Code', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'department', label: 'Department', type: 'text', required: true },
      { key: 'designation', label: 'Designation', type: 'text', required: true },
      { key: 'employment_type', label: 'Employment Type', type: 'select', options: ['full_time', 'part_time', 'contract', 'intern'] },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'on_leave', 'terminated'] },
      { key: 'date_of_joining', label: 'Date of Joining', type: 'text' },
      { key: 'date_of_leaving', label: 'Date of Leaving', type: 'text' },
      { key: 'photo_url', label: 'Photo URL', type: 'url' },
    ]}
    emptyForm={emptyForm}
    tableColumns={[
      { key: 'full_name', label: 'Name' },
      { key: 'employee_code', label: 'Code' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' },
      { key: 'employment_type', label: 'Type' },
      { key: 'status', label: 'Status' },
    ]}
    hasStatus={false}
    orderBy={{ column: 'full_name', ascending: true }}
  />
);

export default AdminEmployees;
