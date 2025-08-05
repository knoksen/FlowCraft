import { create } from 'zustand';
import { nanoid } from 'nanoid';

type Node = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
};

type State = {
  nodes: Node[];
  addNode: () => void;
};

export const useWorkflowStore = create<State>((set) => ({
  nodes: [
    { id: nanoid(), title: 'Trigger', x: 60, y: 70, type: 'trigger' }
  ],
  addNode: () =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: nanoid(),
          title: `Step ${state.nodes.length + 1}`,
          x: 100 + 60 * (state.nodes.length),
          y: 100 + 40 * (state.nodes.length),
          type: 'action'
        }
      ]
    }))
}));
