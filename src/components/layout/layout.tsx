
"use client";

import { Sidebar } from "../workflow/sidebar";
import { Header } from "./header";
import WorkflowCanvas from '../workflow/workflow-canvas';
import { ExecutionHistory } from '../workflow/execution-history';
import { useAuth } from '@/auth/auth-provider';
import DndWrapper from "../workflow/dnd-wrapper";
import { AiSuggestionPanel } from "../workflow/ai-suggestion-panel";
import { useWorkflowStore } from "../workflow/workflowStore";

export default function Layout() {
  const { user } = useAuth();
  const { nodes, addNode } = useWorkflowStore();
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <DndWrapper>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 h-full p-4 bg-muted/30 flex gap-4">
              <div className="flex-1 h-full">
                <WorkflowCanvas />
              </div>
              <div className="w-96 flex flex-col gap-4">
                 <AiSuggestionPanel currentSteps={nodes} addStep={addNode} />
                 <ExecutionHistory userId={user?.uid} />
              </div>
          </div>
        </div>
      </DndWrapper>
    </div>
  );
}
