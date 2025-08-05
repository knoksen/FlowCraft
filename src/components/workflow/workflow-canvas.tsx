
'use client'

import { useWorkflowStore } from "./workflowStore";
import { Node } from "./workflow-node";
import { NodeConnector } from "./node-connector";
import { useDroppable } from "@dnd-kit/core";

export function WorkflowCanvas() {
  const { nodes } = useWorkflowStore();
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  return (
    <div ref={setNodeRef} className="relative w-full h-full rounded-xl bg-muted/30 shadow-inner overflow-auto">
        <svg className="absolute w-full h-full pointer-events-none">
            {sortedNodes.map((node, index) => {
                if (index < sortedNodes.length - 1) {
                    const fromNode = node;
                    const toNode = sortedNodes[index + 1];
                    if (fromNode && toNode) {
                        return <NodeConnector key={`${fromNode.id}-${toNode.id}`} from={fromNode} to={toNode} />
                    }
                }
                return null;
            })}
        </svg>

      {nodes.map((node) => (
         <Node key={node.id} {...node} />
      ))}
    </div>
  );
}
