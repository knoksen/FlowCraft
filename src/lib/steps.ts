
import { Code, Database, Globe, Mail, UserPlus, Webhook } from "lucide-react";
import type { WorkflowStep } from "./types";

export const AVAILABLE_STEPS: Omit<WorkflowStep, 'id' | 'position' | 'config'>[] = [
  {
    title: "HTTP Request",
    description: "Make an HTTP request to an external API.",
    icon: Globe,
    iconColor: "text-sky-500",
    type: 'http',
  },
  {
    title: "Run Local Script",
    description: "Execute a command on a local machine.",
    icon: Code,
    iconColor: "text-orange-500",
    type: 'local_command',
  },
    {
    title: "Send Email",
    description: "Send a personalized welcome email.",
    icon: Mail,
    iconColor: "text-blue-500",
    type: 'placeholder',
  },
  {
    title: "Add to CRM",
    description: "Create a new contact in the CRM database.",
    icon: Database,
    iconColor: "text-purple-500",
    type: 'placeholder',
  },
];
