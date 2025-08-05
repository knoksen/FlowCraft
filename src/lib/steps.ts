
import { Code, Database, Mail, UserPlus, Webhook } from "lucide-react";
import type { WorkflowStep } from "./types";

export const AVAILABLE_STEPS: Omit<WorkflowStep, 'id' | 'position'>[] = [
  {
    title: "New User Signup",
    description: "Triggered when a new user signs up.",
    icon: UserPlus,
    iconColor: "text-green-500",
    type: 'trigger',
    config: null,
  },
  {
    title: "Send Welcome Email",
    description: "Send a personalized welcome email.",
    icon: Mail,
    iconColor: "text-blue-500",
    type: 'action',
    config: null,
  },
  {
    title: "Add to CRM",
    description: "Create a new contact in the CRM database.",
    icon: Database,
    iconColor: "text-purple-500",
    type: 'action',
    config: null,
  },
  {
    title: "Notify Sales Team",
    description: "Send a webhook notification to Slack.",
    icon: Webhook,
    iconColor: "text-slate-500",
    type: 'action',
    config: null,
  },
    {
    title: "Run Local Script",
    description: "Execute a command on a local machine.",
    icon: Code,
    iconColor: "text-orange-500",
    type: 'local_command',
    config: null,
  },
];
