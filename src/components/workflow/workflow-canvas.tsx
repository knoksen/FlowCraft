'use client';

import { useEffect } from 'react';
import { DndContext, useDraggable, type DragEndEvent } from '@dnd-kit/core';
import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { Plus } from 'lucide-react';

function DraggableNode({ node }: { node: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { node },
  });

  // Calculate drag position offset
  const x = transform ? node.x + transform.x : node.x;
  const y = transform ? node.y + transform.y : node.y;

  return (
    <div
      ref={setNodeRef}
      style={{
        top: y,
        left: x,
        minWidth: 180,
        position: 'absolute',
        zIndex: node.selected ? 10 : 1,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <Node {...node} />
    </div>
  );
}

export default function WorkflowCanvas() {
  const { nodes, hydrated, setNodes, addNode, moveNode } = useWorkflowStore(s => ({
    nodes: s.nodes,
    hydrated: s.hydrated,
    setNodes: s.setNodes,
    addNode: s.addNode,
    moveNode: s.moveNode
  }));

  // Ensure initial state is only set on the client!
  useEffect(() => {
    if (!hydrated) {
      setNodes([
        { id: crypto.randomUUID(), title: 'Trigger', x: 60, y: 70, type: 'trigger' },
      ]);
    }
  }, [hydrated, setNodes]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const node = nodes.find((n) => n.id === active.id);
    if (node) {
      moveNode(node.id, node.x + delta.x, node.y + delta.y);
    }
  }

  if (!hydrated) {
    // Avoid rendering until store is ready to prevent hydration error!
    return <div className="w-full h-[70vh] bg-background rounded-xl" />;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative w-full h-[70vh] rounded-xl bg-background shadow-inner overflow-hidden border border-border">
        {nodes.map((node) => (
          <DraggableNode node={node} key={node.id} />
        ))}
        <button
          onClick={addNode}
          className="absolute bottom-6 right-6 z-10 bg-primary text-primary-foreground rounded-full shadow-xl p-3 hover:bg-primary/90 transition"
          aria-label="Add node"
        >
          <Plus size={28} />
        </button>
      </div>
    </DndContext>
  );
}
