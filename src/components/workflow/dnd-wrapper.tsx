
"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useWorkflowStore } from "./workflowStore";
import { useEffect, useState } from "react";
import type { WorkflowStep } from "@/lib/types";
import { SidebarItem } from "./sidebar-item";
import { createPortal } from "react-dom";

export default function DndWrapper({ children }: { children: React.ReactNode }) {
    const { moveNode, addNode } = useWorkflowStore();
    const [activeStep, setActiveStep] = useState<Omit<WorkflowStep, "id" | "position" | "config"> | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );
    
    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.isSidebarItem) {
            setActiveStep(event.active.data.current.step);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;
        setActiveStep(null);

        if (active.data.current?.isSidebarItem && over?.id === 'droppable-canvas') {
            const step = active.data.current.step;
            const dropPosition = event.activatorEvent as MouseEvent;
            
            // Note: this position is relative to viewport, you might need to adjust
            // it based on the canvas's position and zoom level in a real app.
            addNode({ ...step, position: { x: dropPosition.clientX - 350, y: dropPosition.clientY - 100 }});
        } else if (active.id !== over?.id && over?.id === 'droppable-canvas') {
            moveNode(active.id as string, delta);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
            {children}
            {isMounted ? createPortal(
                 <DragOverlay>
                    {activeStep ? <SidebarItem step={activeStep} isOverlay /> : null}
                </DragOverlay>,
                document.body
            ) : null}
        </DndContext>
    );
}
