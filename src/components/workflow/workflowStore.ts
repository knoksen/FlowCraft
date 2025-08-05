import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep, Edge, StepType } from '@/lib/types';
import { AVAILABLE_STEPS } from '@/lib/steps';

type WorkflowState = {
  nodes: WorkflowStep[];
  edges: Edge[];
  selectedNodeId: string | null;
  addNode: () => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (id: string, config: any) => void;
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
    config: {
        url: 'https://api.sendgrid.com/v3/mail/send',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_SENDGRID_API_KEY',
            'Content-Type': 'application/json'
        },
        body: {
            personalizations: [{ to: [{ email: '{{trigger.email}}' }] }],
            from: { email: 'welcome@example.com' },
            subject: 'Welcome to our service!',
            content: [{ type: 'text/plain', value: 'Hello, {{trigger.name}}!' }]
        }
    }
  },
];

const initialEdges: Edge[] = [
    { id: 'e-start-email', source: 'start-node', target: 'email-node' }
];


export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  addNode: () =>
    set((state) => {
        const newNodeType = AVAILABLE_STEPS.find(s => s.type === 'local_command') || AVAILABLE_STEPS[3];
        const newNode: WorkflowStep = {
            id: nanoid(),
            title: `New ${newNodeType.title}`,
            description: newNodeType.description,
            icon: newNodeType.icon,
            iconColor: newNodeType.iconColor,
            type: newNodeType.type as StepType,
            position: {
                x: 100 + 60 * (state.nodes.length % 5),
                y: 100 + 40 * (state.nodes.length % 2)
            },
            config: null,
        }
      return { nodes: [...state.nodes, newNode] }
    }),
  moveNode: (id, delta) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } }
          : node
      ),
    }));
  },
  selectNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },
  updateNodeConfig: (id: string, config: any) => {
    set((state) => ({
        nodes: state.nodes.map((node) => 
            node.id === id ? { ...node, config } : node
        ),
    }));
  }
}));
