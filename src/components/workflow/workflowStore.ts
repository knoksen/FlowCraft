
import { create } from 'zustand';

type Node = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

type ConnectingFrom = {
    nodeId: string;
    handle: 'source' | 'target';
} | null;

type State = {
  nodes: Node[];
  edges: Edge[];
  hydrated: boolean;
  connectingFrom: ConnectingFrom;
  setNodes: (nodes: Node[]) => void;
  addNode: () => void;
  moveNode: (id: string, x: number, y: number) => void;
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  removeEdge: (id: string) => void;
  startConnection: (nodeId: string, handle: 'source' | 'target') => void;
  endConnection: () => void;
};

export const useWorkflowStore = create<State>((set) => ({
  nodes: [],
  edges: [],
  hydrated: false,
  connectingFrom: null,
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
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, { ...edge, id: `${edge.source}-${edge.target}` }],
    })),
  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
    startConnection: (nodeId, handle) => set(() => ({ connectingFrom: { nodeId, handle } })),
    endConnection: () => set(() => ({ connectingFrom: null })),
}));
