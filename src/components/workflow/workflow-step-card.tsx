"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/types";
import { GripVertical } from "lucide-react";
import { useDrag } from "react-dnd";

type WorkflowStepCardProps = {
  step: WorkflowStep;
};

export function WorkflowStepCard({ step }: WorkflowStepCardProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "WORKFLOW_STEP",
      item: { id: step.id, ...step.position },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [step.id, step.position]
  );

  return (
    <div
      ref={dragPreview}
      style={{
        position: 'absolute',
        left: step.position.x,
        top: step.position.y,
        opacity: isDragging ? 0.5 : 1,
        width: 350,
      }}
    >
      <Card
        className="group transition-all hover:shadow-md hover:border-primary/50"
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
          <div ref={drag} className="flex items-center h-full cursor-move">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <step.icon className={cn("w-5 h-5", step.iconColor || "text-foreground")} />
            </div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{step.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{step.description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
