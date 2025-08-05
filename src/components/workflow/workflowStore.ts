
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkflowStep, Edge, StepType, Workflow } from '@/lib/types';
import { AVAILABLE_STEPS } from '@/lib/steps';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  FieldValue,
  arrayRemove,
} from 'firebase/firestore';

type WorkflowState = {
  workflow: Workflow | null;
  nodes: WorkflowStep[];
  edges: Edge[];
  selectedNodeId: string | null;
  loading: boolean;
  unsubscribe: () => void;
  loadOrCreateWorkflow: (userId: string, workflowId: string) => Promise<void>;
  addNode: () => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (id: string, config: any) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  removeEdge: (id: string) => void;
};

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  loading: true,
  unsubscribe: () => {},

  loadOrCreateWorkflow: async (userId, workflowId) => {
    const { unsubscribe } = get();
    unsubscribe(); // Unsubscribe from any previous listener

    set({ loading: true });
    const workflowRef = doc(db, 'workflows', workflowId);
    
    // Set up the real-time listener
    const newUnsubscribe = onSnapshot(workflowRef, (docSnap) => {
      if (docSnap.exists()) {
        const workflowData = docSnap.data() as Workflow;
        set({
          workflow: workflowData,
          nodes: workflowData.steps,
          edges: workflowData.edges,
          loading: false,
        });
      } else {
        // Document doesn't exist, create it
        const newWorkflow: Workflow = {
          id: workflowId,
          name: 'My First Workflow',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          steps: [
            {
              ...AVAILABLE_STEPS[0],
              id: 'start-node',
              position: { x: 50, y: 150 },
              config: null
            },
          ],
          edges: [],
        };
        setDoc(workflowRef, newWorkflow).then(() => {
           set({
            workflow: newWorkflow,
            nodes: newWorkflow.steps,
            edges: newWorkflow.edges,
            loading: false,
          });
        });
      }
    }, (error) => {
        console.error("Error listening to workflow:", error);
        set({ loading: false });
    });

    set({ unsubscribe: newUnsubscribe });
  },

  addNode: async () => {
    const { workflow } = get();
    if (!workflow) return;

    const newNodeType = AVAILABLE_STEPS.find(s => s.type === 'local_command') || AVAILABLE_STEPS[3];
    const newNode: WorkflowStep = {
        id: nanoid(),
        title: `New ${newNodeType.title}`,
        description: newNodeType.description,
        icon: newNodeType.icon,
        iconColor: newNodeType.iconColor,
        type: newNodeType.type as StepType,
        position: { x: 100, y: 100 },
        config: null,
    };
    
    const workflowRef = doc(db, 'workflows', workflow.id);
    await updateDoc(workflowRef, {
      steps: arrayUnion(newNode),
      updatedAt: new Date(),
    });
  },

  moveNode: async (id, delta) => {
    const { workflow, nodes } = get();
    if (!workflow) return;

    const targetNode = nodes.find(n => n.id === id);
    if (!targetNode) return;

    const newPosition = {
        x: targetNode.position.x + delta.x,
        y: targetNode.position.y + delta.y,
    };
    
    const updatedNodes = nodes.map(n => 
        n.id === id ? { ...n, position: newPosition } : n
    );

    const workflowRef = doc(db, 'workflows', workflow.id);
    await updateDoc(workflowRef, {
      steps: updatedNodes,
      updatedAt: new Date(),
    });
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  updateNodeConfig: async (id, config) => {
    const { workflow, nodes } = get();
    if (!workflow) return;

    const updatedNodes = nodes.map(n => 
        n.id === id ? { ...n, config } : n
    );
    
    const workflowRef = doc(db, 'workflows', workflow.id);
    await updateDoc(workflowRef, {
      steps: updatedNodes,
      updatedAt: new Date(),
    });
  },

  removeNode: async (id) => {
      // Implement logic to remove node and associated edges from firestore
  },

  addEdge: async (edge) => {
      // Implement logic to add edge to firestore
  },
  
  removeEdge: async (id) => {
      // Implement logic to remove edge from firestore
  },

}));

export { useWorkflowStore };
