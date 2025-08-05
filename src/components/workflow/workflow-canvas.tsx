'use client';

import { useEffect, useState }from 'react';
import { useDraggable, DndContext, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';
import { NodeConnector } from './connector';
import type { WorkflowStep } from '@/lib/types';

function DraggableNode({ node, onStartConnection, onEndConnection }: { node: WorkflowStep; onStartConnection: (nodeId: string, handle: 'source' | 'target') => void; onEndConnection: (nodeId: string, handle: 'source' | 'target') => void; }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { node },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


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
      <Node {...node} onStartConnection={onStartConnection} onEndConnection={onEndConnection} />
    </div>
  );
}

export default function WorkflowCanvas() {
    const { nodes, edges, hydrated, setNodes, addNode, moveNode, addEdge, startConnection, endConnection, connectingFrom, selectNode } = useWorkflowStore(s => s);
  const { setNodeRef: setDroppableRef } = useDroppable({
      id: 'droppable-canvas',
  });

  useEffect(() => {
    if (!hydrated) {
      setNodes([
        { id: '1', title: 'Trigger', description: "Starts the workflow", icon: Play, position: {x: 60, y: 70}, type: 'trigger', config: null },
      ]);
    }
  }, [hydrated, setNodes]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const node = nodes.find((n) => n.id === active.id);
    if (node) {
      moveNode(node.id, delta);
    }
  }

  const handleStartConnection = (nodeId: string, handle: 'source' | 'target') => {
      startConnection(nodeId, handle);
  };

  const handleEndConnection = (nodeId: string, handle: 'source' | 'target') => {
      if (connectingFrom && connectingFrom.nodeId !== nodeId) {
          const sourceNode = connectingFrom.handle === 'source' ? connectingFrom.nodeId : nodeId;
          const targetNode = connectingFrom.handle === 'source' ? nodeId : connectingFrom.nodeId;
          
          addEdge({ source: sourceNode, target: targetNode });
      }
      endConnection();
  };

  const handleCanvasClick = () => {
    selectNode(null);
  }

  if (!hydrated) {
    return <div className="w-full h-[70vh] bg-background rounded-xl" />;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setDroppableRef} className="relative w-full h-[70vh] rounded-xl bg-background shadow-inner overflow-hidden border border-border" onClick={handleCanvasClick}>
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
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}
        <button
          onClick={() => addNode({title: "New Step", description: "An action to be performed", type: 'action', config: null, icon: Play})}
          className="absolute bottom-6 right-6 z-10 bg-primary text-primary-foreground rounded-full shadow-xl p-3 hover:bg-primary/90 transition"
          aria-label="Add node"
        >
          <Plus size={28} />
        </button>
      </div>
    </DndContext>
  );
}
