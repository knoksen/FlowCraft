
'use server';

/**
 * @fileOverview A Genkit flow for saving a user's workflow to Firestore.
 *
 * - saveWorkflow - Saves or updates a workflow document in Firestore.
 * - SaveWorkflowInput - The input type for the saveWorkflow function.
 * - SaveWorkflowOutput - The return type for the saveWorkflow function.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase-admin';
import type { WorkflowStep, Edge } from '@/lib/types';
import { z } from 'genkit';
import { FieldValue } from 'firebase-admin/firestore';

// We need to define Zod schemas for complex types used in the input.
const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// We can't use LucideIcon directly in Zod, so we'll omit it for validation.
// The icon component itself is not stored, only its name might be, but here we just pass it through.
const WorkflowStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  iconColor: z.string().optional(),
  position: PositionSchema,
  type: z.enum(['http', 'local_command', 'placeholder', 'trigger', 'action', 'delay']),
  config: z.any().nullable(),
  selected: z.boolean().optional(),
  // We can't serialize the icon component, so it's handled client-side.
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

const SaveWorkflowInputSchema = z.object({
  userId: z.string().describe('The ID of the user saving the workflow.'),
  workflowId: z.string().optional().describe('The ID of the existing workflow, if any.'),
  name: z.string().describe('The name of the workflow.'),
  nodes: z.array(WorkflowStepSchema).describe('The array of nodes in the workflow.'),
  edges: z.array(EdgeSchema).describe('The array of edges connecting the nodes.'),
});
export type SaveWorkflowInput = z.infer<typeof SaveWorkflowInputSchema>;

const SaveWorkflowOutputSchema = z.object({
  workflowId: z.string().describe('The ID of the saved workflow.'),
  status: z.enum(['success', 'failed']).describe('The status of the save operation.'),
  message: z.string().describe('A message indicating the result.'),
});
export type SaveWorkflowOutput = z.infer<typeof SaveWorkflowOutputSchema>;

export async function saveWorkflow(
  input: SaveWorkflowInput
): Promise<SaveWorkflowOutput> {
  return saveWorkflowFlow(input);
}

const saveWorkflowFlow = ai.defineFlow(
  {
    name: 'saveWorkflowFlow',
    inputSchema: SaveWorkflowInputSchema,
    outputSchema: SaveWorkflowOutputSchema,
  },
  async ({ userId, workflowId, name, nodes, edges }) => {
    try {
      const workflowData = {
        userId,
        name,
        nodes,
        edges,
        updatedAt: FieldValue.serverTimestamp(),
      };

      let docRef;
      if (workflowId) {
        docRef = db.collection('workflows').doc(workflowId);
        await docRef.update(workflowData);
      } else {
        docRef = db.collection('workflows').doc();
        await docRef.set({
          ...workflowData,
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      return {
        workflowId: docRef.id,
        status: 'success',
        message: 'Workflow saved successfully!',
      };
    } catch (error: any) {
      console.error('Error saving workflow:', error);
      return {
        workflowId: workflowId || '',
        status: 'failed',
        message: `Failed to save workflow: ${error.message}`,
      };
    }
  }
);
