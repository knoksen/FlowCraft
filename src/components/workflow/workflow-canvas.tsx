'use client';

import { useWorkflowStore } from './workflowStore';
import { Node } from './workflow-node';
import { DndContext, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const moveNode = useWorkflowStore((s) => s.moveNode);

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
      <div className="relative w-full h-[70vh] rounded-xl bg-white shadow-inner overflow-hidden border border-gray-200">
        {nodes.map((node) => (
            <Node key={node.id} {...node} />
        ))}
      </div>
    </DndContext>
  );
}
