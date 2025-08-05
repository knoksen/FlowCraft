
"use client";

import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { DndContext, type DragEndEvent, type DragOverEvent, type DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Sidebar } from "../workflow/sidebar";
import { useState } from "react";
import { useWorkflowStore } from "../workflow/workflowStore";
import { SidebarItem } from "../workflow/sidebar-item";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { Node } from "../workflow/workflow-node";

export default function Layout({ user }: { user: any }) {
  const { addNode, moveNode } = useWorkflowStore();
  const [activeDrag, setActiveDrag] = useState<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveDrag(event.active);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over && active.data.current?.isSidebarItem) {
      const stepType = active.data.current.step.type;
      const stepDetails = AVAILABLE_STEPS.find(s => s.type === stepType);
      if (stepDetails && !useWorkflowStore.getState().nodes.find(n => n.id === active.id)) {
         addNode({
          id: active.id as string,
          ...stepDetails,
          position: { x: (over.rect.left - over.rect.width / 2) - 250, y: over.rect.top - 50 },
        });
      }
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    if (!active.data.current?.isSidebarItem) {
      moveNode(active.id as string, { x: delta.x, y: delta.y });
    }

    setActiveDrag(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 h-full">
          <WorkflowCanvas />
        </main>
      </div>
      <DragOverlay>
        {activeDrag?.data?.current?.isSidebarItem ? (
          <SidebarItem step={activeDrag.data.current.step} isOverlay />
        ) : activeDrag ? (
           <Node id={activeDrag.id} {...activeDrag.data.current.node} isOverlay/>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
