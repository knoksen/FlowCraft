
'use client';

import { useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { DraggableNode } from './workflow-node';
import { NodeConnector } from './node-connector';
import { NodeConfigModal } from './node-config-modal';
import { Loader2 } from 'lucide-react';

export default function WorkflowCanvas() {
  const { nodes, edges, hydrated, initialize, selectNode } = useWorkflowStore();
  const { setNodeRef } = useDroppable({
      id: 'droppable-canvas',
  });

  useEffect(() => {
    if (!hydrated) {
      initialize();
    }
  }, [hydrated, initialize]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect node if clicking on the canvas itself
    if (e.target === e.currentTarget) {
        selectNode(null);
    }
  }

  if (!hydrated) {
    return (
      <div className="w-full h-full bg-muted/30 rounded-xl border-dashed border-2 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
      <div 
        ref={setNodeRef} 
        className="droppable-canvas relative w-full h-full rounded-xl bg-background shadow-inner overflow-auto border border-border" 
        onClick={handleCanvasClick}
      >
        <div className="absolute top-0 left-0 w-[3000px] h-[2000px]">
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
        </div>

        <NodeConfigModal />
      </div>
  );
}
