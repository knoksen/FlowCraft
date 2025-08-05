
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowStep } from "@/lib/types";
import { Play, PlusCircle, Loader2 } from "lucide-react";
import { WorkflowStepCard } from "./workflow-step-card";
import { useDrop } from "react-dnd";
import { NodeConnector } from "./node-connector";
import { useRef, Fragment } from "react";


type WorkflowCanvasProps = {
  steps: WorkflowStep[];
  moveStep: (id: string, x: number, y: number) => void;
  onExecute: () => void;
  isExecuting: boolean;
};

export function WorkflowCanvas({ steps, moveStep, onExecute, isExecuting }: WorkflowCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
  
    const [, drop] = useDrop(
        () => ({
          accept: "WORKFLOW_STEP",
          drop(item: { id: string; type: string, x: number, y: number }, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (!delta) return;
            const left = Math.round(item.x + delta.x);
            const top = Math.round(item.y + delta.y);
            moveStep(item.id, left, top);
            return undefined;
          },
        }),
        [moveStep]
      );

  return (
    <Card className="shadow-lg min-h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Workflow</CardTitle>
        <div className="flex items-center gap-2">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Step
            </Button>
            <Button onClick={onExecute} disabled={isExecuting || steps.length === 0}>
                {isExecuting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Play className="mr-2 h-4 w-4" />
                )}
                Execute
            </Button>
        </div>
      </CardHeader>
      <CardContent>
      <div ref={drop(canvasRef)} className="relative w-full h-[800px] border-2 border-dashed rounded-lg">
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              <WorkflowStepCard step={step} />
              {steps
                .filter(s => s.id !== step.id && s.position.y > step.position.y)
                .sort((a,b) => a.position.y - b.position.y)
                .slice(0, 1) // Connect to the next step vertically
                .map(nextStep => (
                  <NodeConnector key={`${step.id}-${nextStep.id}`} from={step} to={nextStep} />
                ))
              }
            </Fragment>
          ))}
          {steps.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-muted-foreground">
                    Your workflow is empty
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                    Use the AI assistant or add a step manually to get started.
                    </p>
                </div>
            </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
