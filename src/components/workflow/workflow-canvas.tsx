
'use client';

import { useEffect } from 'react';
import { useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';
import { NodeConnector } from './connector';
import { NodeConfigModal } from './node-config-modal';

export default function WorkflowCanvas() {
  const { nodes, edges, addNode, moveNode, selectNode, hydrated, initializeDefaultWorkflow } = useWorkflowStore(s => ({
    nodes: s.nodes,
    edges: s.edges,
    addNode: s.addNode,
    moveNode: s.moveNode,
    selectNode: s.selectNode,
    hydrated: s.hydrated,
    initializeDefaultWorkflow: s.initializeDefaultWorkflow,
  }));

  useEffect(() => {
    // The loadOrCreateWorkflow in page.tsx will handle hydration when using Firestore.
    // This is a fallback for when not using Firestore persistence.
    if (!hydrated && !useWorkflowStore.getState().workflow) {
      initializeDefaultWorkflow();
    }
  }, [hydrated, initializeDefaultWorkflow]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const nodeId = active.id as string;
    // Check if the dragged item is a node from the canvas
    if (nodes.some(n => n.id === nodeId)) {
      moveNode(nodeId, delta);
    }
  }

  return (
    <div className="relative w-full h-[70vh] rounded-xl bg-background shadow-inner overflow-hidden border border-border droppable-canvas" onClick={() => selectNode(null)}>
      <svg className="absolute w-full h-full" pointerEvents="none">
        {edges.map(edge => {
          const fromNode = nodes.find(n => n.id === edge.source);
          const toNode = nodes.find(n => n.id === edge.target);
          if (fromNode && toNode) {
            return <NodeConnector key={edge.id} from={fromNode} to={toNode} />;
          }
          return null;
        })}
      </svg>
      
      {nodes.map((node) => (
          <Node key={node.id} {...node} />
      ))}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          addNode();
        }}
        className="absolute bottom-6 right-6 z-10 bg-primary text-primary-foreground rounded-full shadow-xl p-3 hover:bg-primary/90 transition"
        aria-label="Add node"
      >
        <Plus size={28} />
      </button>

      <NodeConfigModal />
    </div>
  );
}
