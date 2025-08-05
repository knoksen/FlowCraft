import type { LucideIcon } from "lucide-react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  position: { x: number; y: number };
};
