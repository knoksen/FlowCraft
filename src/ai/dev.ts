import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-workflow-steps.ts';
import '@/ai/flows/execute-workflow.ts';
import '@/ai/flows/update-job-status.ts';
