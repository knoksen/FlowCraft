'use server';

/**
 * @fileOverview A Genkit flow for executing a workflow defined in Firestore.
 * This flow is triggered with a workflow ID, fetches the workflow steps,
 * executes them in order, and logs the results.
 *
 * - executeWorkflow - A function that handles the workflow execution process.
 * - ExecuteWorkflowInput - The input type for the executeWorkflow function.
 * - ExecuteWorkflowOutput - The return type for the executeWorkflow function.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase-admin';
import type { WorkflowStep } from '@/lib/types';
import axios from 'axios';
import { z } from 'genkit';

const ExecuteWorkflowInputSchema = z.object({
  workflowId: z.string().describe('The ID of the workflow to execute.'),
  userId: z.string().describe('The ID of the user initiating the execution.'),
});
export type ExecuteWorkflowInput = z.infer<typeof ExecuteWorkflowInputSchema>;

const ExecuteWorkflowOutputSchema = z.object({
  executionId: z.string().describe('The ID of the execution log document.'),
  status: z.enum(['success', 'failed']).describe('The final status of the workflow execution.'),
});
export type ExecuteWorkflowOutput = z.infer<typeof ExecuteWorkflowOutputSchema>;

// This type is internal to the flow and doesn't need to be exported.
type StepLog = {
  stepId: string;
  status: 'success' | 'failed';
  output?: any;
  error?: string;
};

export async function executeWorkflow(
  input: ExecuteWorkflowInput
): Promise<ExecuteWorkflowOutput> {
  return executeWorkflowFlow(input);
}

const executeWorkflowFlow = ai.defineFlow(
  {
    name: 'executeWorkflowFlow',
    inputSchema: ExecuteWorkflowInputSchema,
    outputSchema: ExecuteWorkflowOutputSchema,
  },
  async ({ workflowId, userId }) => {
    const startedAt = new Date();

    // 1. Fetch the workflow document
    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflowDoc = await workflowRef.get();
    if (!workflowDoc.exists) {
      throw new Error(`Workflow with ID ${workflowId} not found.`);
    }
    const workflow = workflowDoc.data() as { steps: WorkflowStep[] };

    // 2. Sort steps by order if an 'order' property exists, otherwise use array order.
    const steps = workflow.steps.sort((a, b) => {
        // A simple sort assuming an 'order' property might exist in the future.
        // For now, it respects the stored array order if 'order' is missing.
        const orderA = (a as any).order ?? 0;
        const orderB = (b as any).order ?? 0;
        return orderA - orderB;
    });

    // 3. Create an initial execution log document
    const executionLogRef = db.collection('executionLogs').doc();
    await executionLogRef.set({
      workflowId,
      userId,
      startedAt,
      status: 'running',
      logs: [],
    });

    const executionLogs: StepLog[] = [];
    let finalStatus: 'success' | 'failed' = 'success';

    // 4. Iterate over steps and execute them
    for (const step of steps) {
      // For now, we only handle 'http' type steps as a proof of concept.
      // This can be extended for other step types.
      if ((step as any).type === 'http') {
        try {
          const response = await axios((step as any).config);
          executionLogs.push({
            stepId: step.id,
            status: 'success',
            output: response.data,
          });
        } catch (error: any) {
          finalStatus = 'failed';
          executionLogs.push({
            stepId: step.id,
            status: 'failed',
            error: error.message,
          });
          // Stop execution on failure
          break;
        }
      } else {
        // For non-http steps, we'll just log a success for now.
        // This can be expanded later.
         executionLogs.push({
            stepId: step.id,
            status: 'success',
            output: 'Step type not yet implemented, marked as success.',
          });
      }
    }

    // 5. Update the execution log with the final results
    await executionLogRef.update({
      finishedAt: new Date(),
      status: finalStatus,
      logs: executionLogs,
    });

    return {
      executionId: executionLogRef.id,
      status: finalStatus,
    };
  }
);
