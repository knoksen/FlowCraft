
import { create } from 'zustand';

type Node = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
};

type State = {
  nodes: Node[];
  hydrated: boolean;
  setNodes: (nodes: Node[]) => void;
  addNode: () => void;
  moveNode: (id: string, x: number, y: number) => void;
};

export const useWorkflowStore = create<State>((set) => ({
  nodes: [],
  hydrated: false,
  setNodes: (nodes) => set(() => ({ nodes, hydrated: true })),
  addNode: () =>
    set((state) => {
      const count = state.nodes.length;
      return {
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            title: `Step ${count + 1}`,
            x: 100 + 60 * count,
            y: 100 + 40 * count,
            type: 'action',
          },
        ],
      };
    }),
  moveNode: (id, x, y) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, x, y } : node
      ),
    })),
}));
