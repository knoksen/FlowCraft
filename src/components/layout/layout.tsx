
"use client";

import { Sidebar } from "../workflow/sidebar";
import { Header } from "./header";
import WorkflowCanvas from '../workflow/workflow-canvas';
import { ExecutionHistory } from '../workflow/execution-history';
import { useAuth } from '@/auth/auth-provider';
import DndWrapper from "../workflow/dnd-wrapper";

export default function Layout() {
  const { user, loading } = useAuth();
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <DndWrapper>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 h-full p-4 bg-muted/30">
            <WorkflowCanvas />
          </main>
          <aside className="w-96 border-l bg-background p-4">
            <ExecutionHistory userId={user?.uid} />
          </aside>
        </div>
      </DndWrapper>
    </div>
  );
}
