'use server';

/**
 * @fileOverview A Genkit flow for a local agent to update the status of an executed job.
 *
 * - updateJobStatus - The function the local agent calls to update the job.
 * - UpdateJobStatusInput - The input type for the updateJobStatus function.
 * - UpdateJobStatusOutput - The return type for the updateJobStatus function.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase-admin';
import { z } from 'genkit';
import { FieldValue } from 'firebase-admin/firestore';
import type { StepLog } from './execute-workflow';

const UpdateJobStatusInputSchema = z.object({
  jobId: z.string().describe('The ID of the job to update.'),
  executionId: z.string().describe('The ID of the overall workflow execution.'),
  status: z.enum(['success', 'failed']).describe('The final status of the job.'),
  output: z.any().optional().describe('The output of the job execution (e.g., stdout).'),
  error: z.string().optional().describe('Any error message if the job failed.'),
});
export type UpdateJobStatusInput = z.infer<typeof UpdateJobStatusInputSchema>;

const UpdateJobStatusOutputSchema = z.object({
  success: z.boolean(),
});
export type UpdateJobStatusOutput = z.infer<typeof UpdateJobStatusOutputSchema>;


export async function updateJobStatus(
  input: UpdateJobStatusInput
): Promise<UpdateJobStatusOutput> {
  return updateJobStatusFlow(input);
}

const updateJobStatusFlow = ai.defineFlow(
  {
    name: 'updateJobStatusFlow',
    inputSchema: UpdateJobStatusInputSchema,
    outputSchema: UpdateJobStatusOutputSchema,
  },
  async ({ jobId, executionId, status, output, error }) => {
    const jobRef = db.collection('jobs').doc(jobId);
    const executionLogRef = db.collection('executionLogs').doc(executionId);

    // Use a transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
        const jobDoc = await transaction.get(jobRef);
        if (!jobDoc.exists) {
            throw new Error(`Job with ID ${jobId} not found.`);
        }

        const executionLogDoc = await transaction.get(executionLogRef);
        if (!executionLogDoc.exists) {
            throw new Error(`Execution log with ID ${executionId} not found.`);
        }

        // 1. Update the job document
        transaction.update(jobRef, {
            status,
            output: output ?? null,
            error: error ?? null,
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        // 2. Update the specific step log within the execution log
        const logs: StepLog[] = executionLogDoc.data()?.logs || [];
        const updatedLogs = logs.map(log => {
            if (log.jobId === jobId) {
                return { ...log, status, output, error: error ?? undefined };
            }
            return log;
        });

        transaction.update(executionLogRef, { logs: updatedLogs });
        
        // 3. Check if the entire workflow is now complete
        const hasRunningJobs = updatedLogs.some(log => log.status === 'running');
        const hasFailedJobs = updatedLogs.some(log => log.status === 'failed');

        if (!hasRunningJobs) {
             const finalWorkflowStatus = hasFailedJobs ? 'failed' : 'success';
             transaction.update(executionLogRef, {
                 status: finalWorkflowStatus,
                 finishedAt: new Date(),
             });
        } else if (status === 'failed') {
            // If this job failed, the whole workflow fails
            transaction.update(executionLogRef, {
                status: 'failed',
                finishedAt: new Date(),
            });
        }
    });

    return { success: true };
  }
);
