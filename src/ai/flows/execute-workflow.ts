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
import type { WorkflowStep, HttpStepConfig, LocalCommandStepConfig } from '@/lib/types';
import axios from 'axios';
import { z } from 'genkit';
import { FieldValue } from 'firebase-admin/firestore';

const ExecuteWorkflowInputSchema = z.object({
  workflowId: z.string().describe('The ID of the workflow to execute.'),
  userId: z.string().describe('The ID of the user initiating the execution.'),
});
export type ExecuteWorkflowInput = z.infer<typeof ExecuteWorkflowInputSchema>;

const ExecuteWorkflowOutputSchema = z.object({
  executionId: z.string().describe('The ID of the execution log document.'),
  status: z.enum(['success', 'failed', 'running']).describe('The final status of the workflow execution.'),
});
export type ExecuteWorkflowOutput = z.infer<typeof ExecuteWorkflowOutputSchema>;

// This type is internal to the flow and doesn't need to be exported.
export type StepLog = {
  stepId: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  output?: any;
  error?: string;
  jobId?: string; // To link to a job for local execution
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

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflowDoc = await workflowRef.get();
    if (!workflowDoc.exists) {
      throw new Error(`Workflow with ID ${workflowId} not found.`);
    }
    const workflow = workflowDoc.data() as { steps: WorkflowStep[] };

    const steps = workflow.steps.sort((a, b) => a.position.y - b.position.y);

    const executionLogRef = db.collection('executionLogs').doc();
    await executionLogRef.set({
      workflowId,
      userId,
      startedAt,
      status: 'running',
      logs: [],
    });

    let overallStatus: 'success' | 'failed' | 'running' = 'running';
    let pendingJobs = 0;

    for (const step of steps) {
        const stepLog: Partial<StepLog> & { stepId: string } = {
            stepId: step.id,
            status: 'pending',
        };

        try {
            switch (step.type) {
                case 'http':
                    const httpConfig = step.config as HttpStepConfig;
                    const response = await axios(httpConfig);
                    stepLog.status = 'success';
                    stepLog.output = response.data;
                    break;
                
                case 'local_command':
                    const localConfig = step.config as LocalCommandStepConfig;
                    const jobRef = db.collection('jobs').doc();
                    
                    await jobRef.set({
                        workflowId,
                        executionId: executionLogRef.id,
                        stepId: step.id,
                        userId,
                        config: localConfig,
                        status: 'pending',
                        createdAt: FieldValue.serverTimestamp(),
                    });

                    stepLog.status = 'running';
                    stepLog.jobId = jobRef.id;
                    pendingJobs++;
                    break;

                case 'placeholder':
                    stepLog.status = 'success';
                    stepLog.output = 'This is a placeholder step and was skipped.';
                    break;

                default:
                    throw new Error(`Unsupported step type: ${step.type}`);
            }
        } catch (error: any) {
            stepLog.status = 'failed';
            stepLog.error = error.message;
            overallStatus = 'failed';
        }

        await executionLogRef.update({
            logs: FieldValue.arrayUnion(stepLog),
        });

        if (overallStatus === 'failed') {
            break; 
        }
    }
    
    if (overallStatus !== 'failed') {
        overallStatus = pendingJobs > 0 ? 'running' : 'success';
    }

    await executionLogRef.update({
        status: overallStatus,
        finishedAt: overallStatus !== 'running' ? new Date() : null,
    });
    
    return {
      executionId: executionLogRef.id,
      status: overallStatus,
    };
  }
);
