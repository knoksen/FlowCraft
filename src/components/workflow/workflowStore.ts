
import { create } from "zustand";
import type { WorkflowStep } from "@/lib/types";
import { AVAILABLE_STEPS } from "@/lib/steps";

export type Edge = {
    source: string;
    target: string;
}

type WorkflowState = {
  nodes: WorkflowStep[];
  edges: Edge[];
  addNode: (node: Omit<WorkflowStep, "position"> & { position?: { x: number; y: number } }) => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
};

const initialNodes: WorkflowStep[] = [
    {
        id: "1",
        ...AVAILABLE_STEPS[0],
        position: { x: 50, y: 50 },
        config: null
    },
    {
        id: "2",
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
      // Check if a node with this ID already exists from the drag operation
      if (state.nodes.find(n => n.id === node.id)) {
        return state;
      }
      return {
        nodes: [
          ...state.nodes,
          {
            ...node,
            position: node.position ?? {
                x: 100 + 50 * (state.nodes.length % 5),
                y: 100 + 30 * (state.nodes.length % 5),
            },
          },
        ],
      }
    }),
  moveNode: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
      ),
    })),
}));
