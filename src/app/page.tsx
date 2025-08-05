
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/auth/auth-provider';
import Layout from '@/components/layout/layout';
import { useWorkflowStore } from '@/components/workflow/workflowStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { workflow, loading: workflowLoading, loadOrCreateWorkflow } = useWorkflowStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrCreateWorkflow(user.uid, 'default_workflow');
    }
  }, [user, loadOrCreateWorkflow]);

  if (authLoading || workflowLoading || !workflow) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return <Layout user={user} />;
}
