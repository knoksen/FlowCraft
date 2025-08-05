
"use client";

import { Sidebar } from "../workflow/sidebar";
import { Header } from "./header";
import WorkflowCanvas from '../workflow/workflow-canvas';
import { ExecutionHistory } from '../workflow/execution-history';
import { useAuth } from '@/auth/auth-provider';

export default function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full p-4 bg-muted/30">
          <WorkflowCanvas />
        </main>
        <aside className="w-96 border-l bg-background p-4">
          {user ? <ExecutionHistory userId={user.uid} /> : <div className="text-center text-muted-foreground pt-10">Please sign in to view execution history.</div>}
        </aside>
      </div>
    </div>
  );
}
