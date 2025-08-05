
import { create } from "zustand";
import type { WorkflowStep } from "@/lib/types";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { nanoid } from "nanoid";
import { Bot } from "lucide-react";

export type Edge = {
    source: string;
    target: string;
}

type WorkflowState = {
  nodes: WorkflowStep[];
  edges: Edge[];
  addNode: (node?: Partial<WorkflowStep>) => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
};

const initialNodes: WorkflowStep[] = [
    {
        id: nanoid(),
        ...AVAILABLE_STEPS[0],
        position: { x: 50, y: 50 },
        config: null
    },
    {
        id: nanoid(),
        ...AVAILABLE_STEPS[1],
        position: { x: 450, y: 150 },
        config: null
    },
];

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: [],
  addNode: (node) =>
    set((state) => {
      const newNode: WorkflowStep = {
        id: node?.id || nanoid(),
        title: node?.title || "New Step",
        description: node?.description || "A new step in the workflow.",
        icon: node?.icon || Bot,
        type: node?.type || 'placeholder',
        position: node?.position || { x: 100 + 50 * (state.nodes.length % 5), y: 100 + 40 * (state.nodes.length % 5) },
        config: node?.config || null,
      };

      if (state.nodes.find(n => n.id === newNode.id)) {
        return state;
      }
      return {
        nodes: [...state.nodes, newNode],
      }
    }),
  moveNode: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
      ),
    })),
}));
