"use client";

import { AiSuggestionPanel } from "@/components/workflow/ai-suggestion-panel";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { ExecutionHistory } from "@/components/workflow/execution-history";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useTransition } from "react";
import type { Workflow, WorkflowStep } from "@/lib/types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";
import { executeWorkflow } from "@/ai/flows/execute-workflow";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import type { User } from 'firebase/auth';

const initialWorkflow: Workflow = {
  id: "default-workflow",
  name: "My First Workflow",
  steps: [],
  userId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Layout({ user }: { user: User }) {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [isExecuting, startExecution] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const workflowRef = doc(db, 'workflows', `${user.uid}-main`);
      const unsubscribe = onSnapshot(workflowRef, doc => {
        if (doc.exists()) {
          const data = doc.data();
          setWorkflow({ 
            ...data, 
            id: doc.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
          } as Workflow);
        } else {
          const newWorkflow = { ...initialWorkflow, userId: user.uid, id: `${user.uid}-main`, createdAt: new Date(), updatedAt: new Date()};
          setDoc(workflowRef, {
            ...newWorkflow,
            createdAt: Timestamp.fromDate(newWorkflow.createdAt),
            updatedAt: Timestamp.fromDate(newWorkflow.updatedAt),
          });
          setWorkflow(newWorkflow);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const updateWorkflow = (updatedSteps: WorkflowStep[]) => {
      if (!user) return;
      const updatedWorkflow = { ...workflow, steps: updatedSteps, updatedAt: new Date() };
      setWorkflow(updatedWorkflow);
      const workflowRef = doc(db, 'workflows', workflow.id);
      setDoc(workflowRef, {
          ...updatedWorkflow,
          createdAt: Timestamp.fromDate(updatedWorkflow.createdAt),
          updatedAt: Timestamp.fromDate(updatedWorkflow.updatedAt),
      }, { merge: true });
  }

  const addStep = (step: Omit<WorkflowStep, "id" | "position">) => {
    const newStep: WorkflowStep = {
      ...step,
      id: `step-${Date.now()}-${Math.random()}`,
      position: { x: 100, y: 100 },
    };
    updateWorkflow([...workflow.steps, newStep]);
    toast({
      title: "Step Added",
      description: `The step "${step.title}" has been added.`,
    });
  };
  
  const moveStep = (id: string, x: number, y: number) => {
    const updatedSteps = workflow.steps.map((step) => 
        (step.id === id ? { ...step, position: { x, y } } : step)
    );
    updateWorkflow(updatedSteps);
  };

  const handleExecute = () => {
    if (!workflow.id || !user) {
        toast({ variant: "destructive", title: "Cannot execute workflow", description: "No workflow or user found."});
        return;
    }
    startExecution(async () => {
        try {
            await executeWorkflow({ workflowId: workflow.id, userId: user.uid });
            toast({ title: "Workflow Execution Started", description: "Check the execution history for progress." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Execution Failed", description: "Could not start the workflow execution."});
        }
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 h-[calc(100vh-4rem)] bg-background">
        <aside className="col-span-3 border-r p-4">
            <ExecutionHistory userId={user.uid} />
        </aside>
        <main className="col-span-6 flex flex-col p-6">
          <ScrollArea className="h-full">
            <WorkflowCanvas steps={workflow.steps} moveStep={moveStep} onExecute={handleExecute} isExecuting={isExecuting}/>
          </ScrollArea>
        </main>
        <section className="col-span-3 border-l p-4">
          <ScrollArea className="h-full">
              <AiSuggestionPanel currentSteps={workflow.steps} addStep={addStep} />
          </ScrollArea>
        </section>
      </div>
    </DndProvider>
  );
}
