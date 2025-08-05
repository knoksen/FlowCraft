"use client";

import { suggestWorkflowSteps } from "@/ai/flows/suggest-workflow-steps";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowStep } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Lightbulb, Plus, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AISuggestionPanelProps = {
  currentSteps: WorkflowStep[];
  addStep: (step: Omit<WorkflowStep, "id">) => void;
};

const formSchema = z.object({
  desiredOutcome: z
    .string()
    .min(10, {
      message: "Please describe what you want to achieve in at least 10 characters.",
    }),
});

type Suggestion = {
  suggestedStep: string;
  reasoning: string;
};

export function AiSuggestionPanel({
  currentSteps,
  addStep,
}: AISuggestionPanelProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desiredOutcome: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setSuggestion(null);
      const currentWorkflow = currentSteps
        .map((step, index) => `${index + 1}. ${step.title}: ${step.description}`)
        .join("\n");

      try {
        const result = await suggestWorkflowSteps({
          currentWorkflow: currentWorkflow || "The workflow is empty.",
          desiredOutcome: values.desiredOutcome,
        });
        setSuggestion(result);
      } catch (error) {
        console.error("Failed to get suggestion:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not get a suggestion from the AI. Please try again.",
        });
      }
    });
  }
  
  const handleAddStep = () => {
    if (suggestion) {
      addStep({
        title: suggestion.suggestedStep,
        description: suggestion.reasoning,
        icon: Bot,
        iconColor: "text-orange-500",
      });
      setSuggestion(null);
    }
  };

  return (
    <Card className="sticky top-24 shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-accent" />
          <span>AI Step Suggestion</span>
        </CardTitle>
        <CardDescription>
          Describe what you want to do next, and AI will suggest a step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="desiredOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Outcome</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'notify the user on their mobile phone' or 'add a 5-day delay'"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Suggestion
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {isPending && (
         <CardFooter className="flex flex-col items-start gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardFooter>
      )}
      {suggestion && !isPending && (
        <CardFooter className="flex flex-col items-start gap-4 rounded-b-lg bg-primary/5 p-4">
          <div className="w-full">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="text-accent h-5 w-5"/>
                Suggested Step
            </h3>
            <p className="text-primary font-medium mt-1">{suggestion.suggestedStep}</p>
          </div>
          <div className="w-full">
            <h4 className="font-semibold">Reasoning</h4>
            <p className="text-sm text-muted-foreground mt-1">{suggestion.reasoning}</p>
          </div>
          <Button onClick={handleAddStep} className="w-full mt-2" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add to Workflow
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
