import { create } from 'zustand';

export type Node = {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
};

type WorkflowState = {
  nodes: Node[];
  addNode: (node: Omit<Node, 'id' | 'x' | 'y'>) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [
    {
      id: '1',
      title: 'Initial Step',
      description: 'This is the first step in your workflow.',
      x: 100,
      y: 150,
    },
    {
      id: '2',
      title: 'Second Step',
      description: 'This is another step.',
      x: 400,
      y: 250,
    },
  ],
  addNode: (newNode) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          ...newNode,
          id: `node_${Date.now()}`,
          x: 200,
          y: 200,
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
