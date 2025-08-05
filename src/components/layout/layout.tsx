
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
import type { StepType } from "@/lib/types";

export default function Layout({ user }: { user: User }) {
  const { addNode, moveNode, nodes } = useWorkflowStore();
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
    setActiveDrag(null);
    
    if (!over) return;

    // Handle dropping sidebar item onto canvas
    if (active.data.current?.isSidebarItem && over.id === 'droppable-canvas') {
      const stepType = active.data.current.step.type as StepType;
      const stepDetails = AVAILABLE_STEPS.find(s => s.type === stepType);
      
      if (stepDetails) {
          const canvasRect = document.querySelector('.droppable-canvas')?.getBoundingClientRect();
          let dropPosition = { x: 200, y: 100 };

          if (canvasRect) {
            dropPosition = {
              x: (event.activatorEvent as MouseEvent).clientX - canvasRect.left - 160, // Adjust for node center
              y: (event.activatorEvent as MouseEvent).clientY - canvasRect.top - 40,
            };
          }
          
          addNode({
              ...stepDetails,
              id: nanoid(),
              position: dropPosition,
              config: null
          });
      }
    } 
    // Handle moving an existing node on the canvas
    else if (nodes.some(n => n.id === active.id)) {
        moveNode(active.id as string, delta);
    }
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
