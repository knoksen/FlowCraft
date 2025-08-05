import type { LucideIcon } from "lucide-react";

export type HttpStepConfig = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, any>;
};

export type LocalCommandStepConfig = {
    command: string;
    args?: string[];
    // e.g., powershell, vscode, cli
    executor: string;
};

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  position: { x: number; y: number };
  // Adding type and config for different step types
  type: 'http' | 'local_command' | 'placeholder';
  config: HttpStepConfig | LocalCommandStepConfig | null;
};

export type Workflow = {
    id: string;
    name: string;
    steps: WorkflowStep[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ExecutionLog = {
    id: string;
    workflowId: string;
    userId: string;
    startedAt: Date; 
    finishedAt?: Date; 
    status: 'running' | 'success' | 'failed';
    logs: {
        stepId: string;
        status: 'success' | 'failed' | 'running' | 'pending';
        output?: any;
        error?: string;
        jobId?: string;
    }[];
};
