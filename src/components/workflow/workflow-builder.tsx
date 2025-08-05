"use client";

import type { WorkflowStep } from "@/lib/types";
import { Database, Mail, UserPlus, Webhook } from "lucide-react";
import { useState } from "react";
import { AiSuggestionPanel } from "./ai-suggestion-panel";
import { WorkflowCanvas } from "./workflow-canvas";

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

export function WorkflowBuilder() {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);

  const addStep = (step: Omit<WorkflowStep, "id">) => {
    setSteps((prev) => [
      ...prev,
      { ...step, id: `step-${Date.now()}-${Math.random()}` },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <AiSuggestionPanel currentSteps={steps} addStep={addStep} />
      </div>
      <div className="lg:col-span-2">
        <WorkflowCanvas steps={steps} />
      </div>
    </div>
  );
}
