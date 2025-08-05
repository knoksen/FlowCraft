
'use client';

import { useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { NodeConnector } from './node-connector';
import type { WorkflowStep } from '@/lib/types';
import { NodeConfigModal } from './node-config-modal';

function DraggableNode({ node }: { node: WorkflowStep; }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { node },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const { startConnection, endConnection } = useWorkflowStore(s => ({
      startConnection: s.startConnection,
      endConnection: s.endConnection,
  }));

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        zIndex: node.selected ? 10 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <Node {...node} onStartConnection={startConnection} onEndConnection={endConnection} />
    </div>
  );
}

export default function WorkflowCanvas() {
  const { nodes, edges, hydrated, initializeDefaultWorkflow, selectNode } = useWorkflowStore(s => s);
  const { setNodeRef } = useDroppable({
      id: 'droppable-canvas',
  });

  useEffect(() => {
    if (!hydrated) {
      initializeDefaultWorkflow();
    }
  }, [hydrated, initializeDefaultWorkflow]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect node if clicking on the canvas itself
    if (e.target === e.currentTarget) {
        selectNode(null);
    }
  }

  if (!hydrated) {
    return <div className="w-full h-full bg-muted/30 rounded-xl border-dashed border-2" />;
  }

  return (
      <div ref={setNodeRef} className="droppable-canvas relative w-full h-full rounded-xl bg-background shadow-inner overflow-hidden border border-border" onClick={handleCanvasClick}>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
          <DraggableNode 
            node={node} 
            key={node.id}
          />
        ))}

        <NodeConfigModal />
      </div>
  );
}
