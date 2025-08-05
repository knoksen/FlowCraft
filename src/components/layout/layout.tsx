"use client";

import { AiSuggestionPanel } from "@/components/workflow/ai-suggestion-panel";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import type { WorkflowStep } from "@/lib/types";
import { Bot, Database, Mail, UserPlus, Webhook } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/hooks/use-toast";

const initialSteps: WorkflowStep[] = [
  {
    id: "1",
    title: "New User Signup",
    description: "Triggered when a new user signs up.",
    icon: UserPlus,
    iconColor: "text-green-500",
    position: { x: 50, y: 50 },
    type: "placeholder",
    config: null,
  },
  {
    id: "2",
    title: "Send Welcome Email",
    description: "Send a personalized welcome email.",
    icon: Mail,
    iconColor: "text-blue-500",
    position: { x: 450, y: 150 },
    type: "placeholder",
    config: null,
  },
  {
    id: "3",
    title: "Add to CRM",
    description: "Create a new contact in the CRM database.",
    icon: Database,
    iconColor: "text-purple-500",
    position: { x: 50, y: 250 },
    type: "placeholder",
    config: null,
  },
  {
    id: "4",
    title: "Notify Sales Team",
    description: "Send a webhook notification to Slack.",
    icon: Webhook,
    iconColor: "text-slate-500",
    position: { x: 450, y: 350 },
    type: "placeholder",
    config: null,
  },
];


export default function Layout({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const { toast } = useToast();

  const addStep = (step: Omit<WorkflowStep, "id" | "position">) => {
    setSteps((prev) => [
      ...prev,
      {
        ...step,
        id: `step-${Date.now()}-${Math.random()}`,
        position: { x: 100, y: 100 },
      },
    ]);
     toast({
      title: "Step Added",
      description: `The step "${step.title}" has been added to your workflow.`,
    });
  };
  
  const moveStep = (id: string, x: number, y: number) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, position: { x, y } } : step))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 h-[calc(100vh-4rem)] bg-background">
        <aside className="col-span-2 border-r p-4">
          <Card className="h-full">
              <CardHeader>
                  <CardTitle>Node Library</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">Drag nodes to the canvas.</p>
              </CardContent>
          </Card>
        </aside>
        <main className="col-span-7 flex flex-col p-6">
          <ScrollArea className="h-full">
          <WorkflowCanvas steps={steps} moveStep={moveStep} />
          </ScrollArea>
        </main>
        <section className="col-span-3 border-l p-4">
          <ScrollArea className="h-full">
              <AiSuggestionPanel currentSteps={steps} addStep={addStep} />
          </ScrollArea>
        </section>
      </div>
    </DndProvider>
  );
}
