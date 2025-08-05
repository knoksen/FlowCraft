
"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import type { StepType } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import { nanoid } from "nanoid";

type SidebarItemProps = {
    step: {
        type: StepType;
        title: string;
        description: string;
        icon: LucideIcon;
        iconColor?: string;
    };
    isOverlay?: boolean;
}

export function SidebarItem({ step, isOverlay }: SidebarItemProps) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: nanoid(),
        data: {
            step: step,
            isSidebarItem: true,
        },
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <Card className={cn("p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-primary/50", isOverlay && "shadow-lg")}>
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <step.icon className={cn("w-4 h-4", step.iconColor)} />
                </div>
                <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
            </Card>
        </div>
    )
}
