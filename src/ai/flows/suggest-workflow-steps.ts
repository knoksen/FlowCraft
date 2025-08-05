'use server';

/**
 * @fileOverview AI agent that suggests workflow steps based on the current workflow and a short description of what the user wants to achieve.
 *
 * - suggestWorkflowSteps - A function that suggests the next workflow step.
 * - SuggestWorkflowStepsInput - The input type for the suggestWorkflowSteps function.
 * - SuggestWorkflowStepsOutput - The return type for the suggestWorkflowSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkflowStepsInputSchema = z.object({
  currentWorkflow: z
    .string()
    .describe('The current workflow in a text format.'),
  desiredOutcome: z
    .string()
    .describe('A short description of what the user wants to achieve.'),
});
export type SuggestWorkflowStepsInput = z.infer<typeof SuggestWorkflowStepsInputSchema>;

const SuggestWorkflowStepsOutputSchema = z.object({
  suggestedStep: z
    .string()
    .describe('The suggested next step for the workflow.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested step.'),
});
export type SuggestWorkflowStepsOutput = z.infer<typeof SuggestWorkflowStepsOutputSchema>;

export async function suggestWorkflowSteps(
  input: SuggestWorkflowStepsInput
): Promise<SuggestWorkflowStepsOutput> {
  return suggestWorkflowStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkflowStepsPrompt',
  input: {schema: SuggestWorkflowStepsInputSchema},
  output: {schema: SuggestWorkflowStepsOutputSchema},
  prompt: `You are an AI assistant that suggests the next step in a workflow.

  Given the current workflow and the desired outcome, suggest the next logical step.

  Current Workflow:
  {{{currentWorkflow}}}

  Desired Outcome:
  {{{desiredOutcome}}}

  Respond with the suggested step and the reasoning behind it.
  `,
});

const suggestWorkflowStepsFlow = ai.defineFlow(
  {
    name: 'suggestWorkflowStepsFlow',
    inputSchema: SuggestWorkflowStepsInputSchema,
    outputSchema: SuggestWorkflowStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
