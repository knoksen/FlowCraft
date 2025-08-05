
"use client";

import { Sidebar } from "../workflow/sidebar";
import { Header } from "./header";
import WorkflowCanvas from '../workflow/workflow-canvas';
import { ExecutionHistory } from '../workflow/execution-history';
import { useAuth } from '@/auth/auth-provider';
import DndWrapper from "../workflow/dnd-wrapper";

export default function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <DndWrapper>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-96 border-r bg-background p-4">
            <Sidebar />
          </div>
          <div className="flex-1 h-full p-4 bg-muted/30">
            <WorkflowCanvas />
          </div>
          <div className="w-96 border-l bg-background p-4">
            <ExecutionHistory userId={user?.uid} />
          </div>
        </div>
      </DndWrapper>
    </div>
  );
}
