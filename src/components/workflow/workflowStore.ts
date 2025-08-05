
import { create } from "zustand";
import { nanoid } from "nanoid";

export type Node = {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
};

export type Edge = {
    source: string;
    target: string;
}

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Omit<Node, 'id' | 'x' | 'y'>) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
};

const initialNodes: Node[] = [
    {
      id: "1",
      title: "Initial Step",
      description: "This is the first step in your workflow.",
      x: 100,
      y: 150,
    },
    {
      id: "2",
      title: "Second Step",
      description: "This is another step.",
      x: 400,
      y: 250,
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
          id: nanoid(),
          x: 100 + 50 * (state.nodes.length % 5),
          y: 100 + 30 * (state.nodes.length % 5),
        },
      ],
    })),
  updateNodePosition: (id, x, y) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, x, y } : node
      ),
    })),
}));
