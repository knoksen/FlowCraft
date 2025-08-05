import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/types";
import { MoreVertical, GripVertical } from "lucide-react";

type WorkflowStepCardProps = {
  step: WorkflowStep;
};

export function WorkflowStepCard({ step }: WorkflowStepCardProps) {
  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex items-center h-full">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab group-hover:text-foreground transition-colors" />
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <step.icon className={cn("w-6 h-6", step.iconColor || "text-foreground")} />
          </div>
        </div>
        <div className="flex-1">
          <CardTitle>{step.title}</CardTitle>
          <CardDescription className="mt-1">{step.description}</CardDescription>
        </div>
        <div className="flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
