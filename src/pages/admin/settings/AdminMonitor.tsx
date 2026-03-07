import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ScrollText, Activity } from 'lucide-react';
import { AIUsageContent } from './AdminAIUsage';
import { AuditLogContent } from './AdminAuditLog';
import { HealthContent } from './AdminHealth';

export default function AdminMonitor() {
  return (
    <AdminLayout
      title="Monitor"
      subtitle="AI usage, audit trail, and system diagnostics in one place"
    >
      <Tabs defaultValue="ai-usage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ai-usage" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> AI Usage
          </TabsTrigger>
          <TabsTrigger value="audit-log" className="gap-1.5">
            <ScrollText className="h-3.5 w-3.5" /> Audit Log
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" /> System Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-usage">
          <AIUsageContent />
        </TabsContent>

        <TabsContent value="audit-log">
          <AuditLogContent />
        </TabsContent>

        <TabsContent value="health">
          <HealthContent />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
