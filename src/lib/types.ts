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
