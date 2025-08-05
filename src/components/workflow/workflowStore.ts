import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep } from '@/lib/types';
import { AVAILABLE_STEPS } from '@/lib/steps';

type WorkflowState = {
  nodes: WorkflowStep[];
  edges: { id: string; from: string; to: string }[];
  addNode: (step: Omit<WorkflowStep, 'id' | 'position'>, position: { x: number; y: number }) => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
};

const initialNodes: WorkflowStep[] = [
  {
    ...AVAILABLE_STEPS[0],
    id: '1',
    position: { x: 50, y: 50 },
  },
  {
    ...AVAILABLE_STEPS[1],
    id: '2',
    position: { x: 450, y: 150 },
  },
];

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: [
    { id: 'e1-2', from: '1', to: '2' }
  ],
  addNode: (step, position) => {
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          ...step,
          id: nanoid(),
          position,
        },
      ],
    }));
  },
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
