'use client';

import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';

export function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);

  return (
    <div className="relative w-full h-[70vh] rounded-xl bg-white shadow-inner overflow-hidden border border-gray-200 droppable-canvas">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ top: node.position.y, left: node.position.x, minWidth: 180 }}
        >
          <Node {...node} />
        </div>
      ))}
    </div>
  );
}
