
import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type StepType = 'http' | 'local_command' | 'placeholder' | 'trigger' | 'action' | 'delay';

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
  type: StepType;
  config: HttpStepConfig | LocalCommandStepConfig | null;
  selected?: boolean;
};

export type Edge = {
    id:string;
    source: string;
    target:string;
}

export type Workflow = {
    id: string;
    name: string;
    nodes: WorkflowStep[];
    edges: Edge[];
    userId: string;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
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
