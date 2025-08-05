
import { create } from "zustand";
import { nanoid } from "nanoid";
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
        ...AVAILABLE_STEPS[0], // New User Signup
        position: { x: 50, y: 50 },
    },
    {
        id: "2",
        ...AVAILABLE_STEPS[1], // Send Welcome Email
        position: { x: 50, y: 200 },
    },
];

const initialEdges: Edge[] = [
    { source: "1", target: "2"}
]

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  addNode: (node) =>
    set((state) => ({
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
    })),
  moveNode: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
      ),
    })),
}));
