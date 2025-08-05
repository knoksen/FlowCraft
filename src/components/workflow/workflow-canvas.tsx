'use client';

import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';

export function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);

  return (
    <div className="relative w-full h-full rounded-xl bg-muted/30 shadow-inner overflow-auto droppable-canvas">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ top: node.position.y, left: node.position.x, minWidth: 180 }}
        >
          <Node {...node} />
        </div>
      ))}
       <button
        onClick={() => addNode()}
        className="absolute bottom-6 right-6 z-10 bg-primary text-primary-foreground rounded-full shadow-xl p-3 hover:bg-primary/90 transition"
        aria-label="Add node"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
