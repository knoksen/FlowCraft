
'use client';

import { DndContext, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';
import { NodeConnector } from './node-connector';
import { NodeConfigModal } from './node-config-modal';

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const addNode = useWorkflowStore((s) => s.addNode);
  const moveNode = useWorkflowStore((s) => s.moveNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    moveNode(active.id as string, delta);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div 
        className="relative w-full h-[70vh] rounded-xl bg-background shadow-inner overflow-hidden border border-border"
        onClick={() => selectNode(null)}
      >
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
      </div>
      <NodeConfigModal />
    </DndContext>
  );
}
