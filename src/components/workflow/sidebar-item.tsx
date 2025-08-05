
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
        id: `sidebar-item-${step.type}-${nanoid()}`,
        data: {
            step: step,
            isSidebarItem: true,
        },
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <Card className={cn("p-3 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all", isOverlay && "shadow-lg ring-2 ring-primary")}>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <step.icon className={cn("w-5 h-5", step.iconColor)} />
                </div>
                <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
            </Card>
        </div>
    )
}
