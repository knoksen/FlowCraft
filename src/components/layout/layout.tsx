"use client";

import { AiSuggestionPanel } from "@/components/workflow/ai-suggestion-panel";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import type { WorkflowStep } from "@/lib/types";
import { Bot, Database, Mail, UserPlus, Webhook } from "lucide-react";

const initialSteps: WorkflowStep[] = [
  {
    id: "1",
    title: "New User Signup",
    description: "Triggered when a new user signs up.",
    icon: UserPlus,
    iconColor: "text-green-500",
  },
  {
    id: "2",
    title: "Send Welcome Email",
    description: "Send a personalized welcome email.",
    icon: Mail,
    iconColor: "text-blue-500",
  },
  {
    id: "3",
    title: "Add to CRM",
    description: "Create a new contact in the CRM database.",
    icon: Database,
    iconColor: "text-purple-500",
  },
  {
    id: "4",
    title: "Notify Sales Team",
    description: "Send a webhook notification to Slack.",
    icon: Webhook,
    iconColor: "text-slate-500",
  },
];


export default function Layout({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);

  const addStep = (step: Omit<WorkflowStep, "id">) => {
    setSteps((prev) => [
      ...prev,
      { ...step, id: `step-${Date.now()}-${Math.random()}` },
    ]);
  };
  return (
    <div className="grid grid-cols-12 h-screen bg-background">
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
         <WorkflowCanvas steps={steps} />
        </ScrollArea>
      </main>
      <section className="col-span-3 border-l p-4">
        <ScrollArea className="h-full">
            <AiSuggestionPanel currentSteps={steps} addStep={addStep} />
        </ScrollArea>
      </section>
    </div>
  );
}
