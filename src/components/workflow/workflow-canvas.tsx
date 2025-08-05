"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowStep } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { WorkflowStepCard } from "./workflow-step-card";

type WorkflowCanvasProps = {
  steps: WorkflowStep[];
};

export function WorkflowCanvas({ steps }: WorkflowCanvasProps) {
  return (
    <Card className="shadow-lg min-h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Workflow</CardTitle>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Step Manually
        </Button>
      </CardHeader>
      <CardContent>
        {steps.length > 0 ? (
          <div className="relative">
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -z-10"
              aria-hidden="true"
            />
            <ul className="space-y-8">
              {steps.map((step, index) => (
                <li key={step.id} className="relative pl-12">
                   <span
                    className="absolute left-[18px] top-5 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-4 ring-background"
                    aria-hidden="true"
                  >
                    <span className="h-3 w-3 rounded-full bg-primary" />
                  </span>
                  <WorkflowStepCard step={step} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium text-muted-foreground">
              Your workflow is empty
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Use the AI assistant or add a step manually to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
