
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep, Edge, StepType } from '@/lib/types';
import { Play } from 'lucide-react';

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
  initializeDefaultWorkflow: () => void;
  addNode: (step: Omit<WorkflowStep, 'id' | 'position' | 'config'> & { position: { x: number, y: number } }) => void;
  moveNode: (id: string, delta: { x: number, y: number }) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (id: string, config: any) => void;
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  removeEdge: (id: string) => void;
  startConnection: (nodeId: string, handle: 'source' | 'target') => void;
  endConnection: (nodeId: string, handle: 'source' | 'target') => void;
};

export const useWorkflowStore = create<State>((set, get) => ({
  nodes: [],
  edges: [],
  hydrated: false,
  connectingFrom: null,
  selectedNodeId: null,
  initializeDefaultWorkflow: () => {
      const triggerNode: WorkflowStep = {
        id: 'start',
        title: 'Start Workflow',
        description: "The trigger that kicks off the workflow.",
        icon: Play,
        iconColor: 'text-green-500',
        position: {x: 60, y: 200},
        type: 'trigger',
        config: null,
      };
      set({ nodes: [triggerNode], hydrated: true });
  },
  addNode: (step) =>
    set((state) => {
      const newNode: WorkflowStep = {
        ...step,
        id: nanoid(),
        config: null,
      };
      return { nodes: [...state.nodes, newNode] };
    }),
  moveNode: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } } : node
      ),
    })),
  deleteNode: (id) => {
      if (id === 'start') return; // Prevent deleting the start node
      set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      }))
  },
  selectNode: (id) => set(state => {
      // If the same node is clicked, it will be deselected by the canvas click handler
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

        // Prevent connection to self
        if (edge.source === edge.target) return {};
        
        // Prevent connecting a source to another source (allow multiple targets from one source later if needed)
        const sourceHasOutgoing = state.edges.some(e => e.source === edge.source);
        if (sourceHasOutgoing) return {};
        
        // Prevent connecting a target that already has an incoming connection
        const targetHasIncoming = state.edges.some(e => e.target === edge.target);
        if (targetHasIncoming) return {};

        return {
            edges: [...state.edges, { ...edge, id: nanoid() }],
        }
    }),
  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
    startConnection: (nodeId, handle) => set(() => ({ connectingFrom: { nodeId, handle } })),
    endConnection: (nodeId, handle) => {
        const { connectingFrom, addEdge } = get();
        if (connectingFrom && connectingFrom.nodeId !== nodeId && connectingFrom.handle !== handle) {
            const source = connectingFrom.handle === 'source' ? connectingFrom.nodeId : nodeId;
            const target = connectingFrom.handle === 'target' ? connectingFrom.nodeId : nodeId;
            addEdge({ source, target });
        }
        set({ connectingFrom: null });
    },
}));
