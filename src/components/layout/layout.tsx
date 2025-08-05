
"use client";

import WorkflowCanvas from "@/components/workflow/workflow-canvas";
import { DndContext, type DragEndEvent, type DragOverlay, useSensor, useSensors, PointerSensor, type Active, type DragStartEvent } from '@dnd-kit/core';
import { Sidebar } from "../workflow/sidebar";
import { useState } from "react";
import { useWorkflowStore } from "../workflow/workflowStore";
import { SidebarItem } from "../workflow/sidebar-item";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { Node } from "../workflow/workflow-node";
import type { User } from "firebase/auth";
import { nanoid } from "nanoid";
import { Header } from "./header";

export default function Layout({ user }: { user: User }) {
  const { addNode, moveNode } = useWorkflowStore();
  const [activeDrag, setActiveDrag] = useState<Active | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDrag(event.active);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    if (active.data.current && over) {
        // This is the case where we are dragging from the sidebar
        if (over.id === 'droppable-canvas' && active.data.current.isSidebarItem) {
            const stepType = active.data.current.step.type;
            const stepDetails = AVAILABLE_STEPS.find(s => s.type === stepType);
            
            const canvasRect = document.querySelector('.droppable-canvas')?.getBoundingClientRect();
            
            let dropX = 100;
            let dropY = 100;

            if (canvasRect) {
              dropX = (event.activatorEvent as MouseEvent).clientX - canvasRect.left;
              dropY = (event.activatorEvent as MouseEvent).clientY - canvasRect.top;
            }

            if (stepDetails) {
                addNode({
                    id: nanoid(),
                    ...stepDetails,
                    position: { x: dropX - 160, y: dropY - 40 }, // Adjust for node center
                    config: null
                });
            }
        } else if (!active.data.current.isSidebarItem && active.id) {
            // This is the case where we are moving a node on the canvas
            moveNode(active.id as string, { x: delta.x, y: delta.y });
        }
    }

    setActiveDrag(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 h-full p-4">
            <WorkflowCanvas />
          </main>
        </div>
      </div>
      <DragOverlay>
        {activeDrag?.data?.current?.isSidebarItem ? (
          <SidebarItem step={activeDrag.data.current.step} isOverlay />
        ) : activeDrag?.data.current?.node ? (
           <Node {...(activeDrag.data.current.node)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
