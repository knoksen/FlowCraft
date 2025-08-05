import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep, Edge } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

type ConnectingFrom = {
    nodeId: string;
    handle: 'source' | 'target';
} | null;

type State = {
  nodes: WorkflowStep[];
  edges: Edge[];
  hydrated: boolean;
  connectingFrom: ConnectingFrom;
  selectedNodeId: string | null;
  setNodes: (nodes: WorkflowStep[]) => void;
  addNode: (step: Omit<WorkflowStep, 'id' | 'position'>) => void;
  moveNode: (id: string, delta: { x: number, y: number }) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (id: string, config: any) => void;
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
  selectedNodeId: null,
  setNodes: (nodes) => set(() => ({ nodes, hydrated: true })),
  addNode: (step) =>
    set((state) => {
      const newNode: WorkflowStep = {
        ...step,
        id: nanoid(),
        position: { x: 200, y: 150 },
      };
      return { nodes: [...state.nodes, newNode] };
    }),
  moveNode: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
      ),
    })),
  deleteNode: (id) => set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
  })),
  selectNode: (id) => set(state => {
      if (state.selectedNodeId === id) {
          return { selectedNodeId: null, nodes: state.nodes.map(n => ({...n, selected: false})) };
      }
      return { 
          selectedNodeId: id,
          nodes: state.nodes.map(n => ({...n, selected: n.id === id}))
      };
  }),
  updateNodeConfig: (id, config) => set(state => ({
      nodes: state.nodes.map(n => n.id === id ? {...n, config} : n)
  })),
  addEdge: (edge) =>
    set((state) => {
        // Prevent duplicate edges
        const edgeExists = state.edges.some(e => e.source === edge.source && e.target === edge.target);
        if (edgeExists) return {};

        return {
            edges: [...state.edges, { ...edge, id: nanoid() }],
        }
    }),
  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
    startConnection: (nodeId, handle) => set(() => ({ connectingFrom: { nodeId, handle } })),
    endConnection: () => set(() => ({ connectingFrom: null })),
}));
