
"use client";

import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { DndContext, type DragEndEvent, type DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Sidebar } from "../workflow/sidebar";
import { useState } from "react";
import { useWorkflowStore } from "../workflow/workflowStore";
import { SidebarItem } from "../workflow/sidebar-item";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { Node } from "../workflow/workflow-node";
import { nanoid } from "nanoid";

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
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (over && active.data.current?.isSidebarItem) {
        const stepType = active.data.current.step.type;
        const stepDetails = AVAILABLE_STEPS.find(s => s.type === stepType);
        if (stepDetails) {
            addNode({
                id: nanoid(),
                ...stepDetails,
                position: { x: (active.activatorEvent.clientX) - 300, y: active.activatorEvent.clientY - 100 },
                config: null
            });
        }
    } else if (!active.data.current?.isSidebarItem) {
      moveNode(active.id as string, { x: delta.x, y: delta.y });
    }

    setActiveDrag(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
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
