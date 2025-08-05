import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep, Edge } from '@/lib/types';
import { AVAILABLE_STEPS } from '@/lib/steps';

type WorkflowState = {
  nodes: WorkflowStep[];
  edges: Edge[];
  addNode: () => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
};

const initialNodes: WorkflowStep[] = [
  {
    ...AVAILABLE_STEPS[0],
    id: 'start-node',
    position: { x: 50, y: 150 },
    config: null
  },
  {
    ...AVAILABLE_STEPS[1],
    id: 'email-node',
    position: { x: 450, y: 150 },
    config: null
  },
];

const initialEdges: Edge[] = [
    { id: 'e-start-email', source: 'start-node', target: 'email-node' }
];


export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  addNode: () =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: nanoid(),
          title: `Step ${state.nodes.length + 1}`,
          description: "A new step in the workflow.",
          icon: AVAILABLE_STEPS[3].icon, // Default icon
          type: 'action',
          position: {
             x: 100 + 60 * (state.nodes.length % 5),
             y: 100 + 40 * (state.nodes.length % 2)
          },
          config: null,
        }
      ]
    })),
  moveNode: (id, delta) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } }
          : node
      ),
    }));
  },
}));
