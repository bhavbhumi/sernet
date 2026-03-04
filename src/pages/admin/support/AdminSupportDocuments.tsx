import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { supabase } from '@/integrations/supabase/client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSupportDocuments() {
  return (
    <GenericCMSPage
      title="Support Documents"
      subtitle="Manage downloadable documents for the public support portal."
      tableName="support_documents"
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'file_type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'title', label: 'Document Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'category', label: 'Category', type: 'select', options: ['General', 'Account Opening', 'KYC', 'Trading', 'Mutual Funds', 'Insurance', 'Compliance', 'Other'] },
        { key: 'file_url', label: 'File URL', type: 'url', tip: 'Upload file to Media Library and paste the URL here, or use the support-documents storage bucket.' },
        { key: 'file_name', label: 'File Name', type: 'text' },
        { key: 'file_type', label: 'File Type', type: 'select', options: ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG'] },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
      ]}
      emptyForm={{
        title: '',
        description: '',
        category: 'General',
        file_url: '',
        file_name: '',
        file_type: 'PDF',
        file_size_kb: 0,
        sort_order: 0,
        status: 'published',
      }}
      categoryField="category"
      hasStatus
    />
  );
}
