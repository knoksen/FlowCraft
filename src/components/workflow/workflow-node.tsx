'use client';

import { FC } from 'react';
import { GripVertical, Play, Trash } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { WorkflowStep } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type NodeProps = WorkflowStep & {
  isOverlay?: boolean;
  selected?: boolean;
};

export const Node: FC<NodeProps> = ({ id, title, description, icon: Icon, iconColor, position, isOverlay, selected }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: id,
        data: {
            node: { id, title, description, icon: Icon, iconColor, position },
            isSidebarItem: false,
        }
    });

  return (
    <div
      ref={setNodeRef}
      className={cn("w-80 z-10", isOverlay && "z-50")}
    >
      <Card
        className={cn(
            "group transition-all hover:shadow-lg",
            selected ? "ring-2 ring-primary" : "hover:border-primary/50",
            isOverlay && "shadow-2xl"
        )}
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
          <div {...listeners} {...attributes} className="flex items-center h-full cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className={cn("w-5 h-5", iconColor || "text-foreground")} />
            </div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{description}</CardDescription>
          </div>
           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-muted-foreground hover:text-primary p-1 rounded-md"><Play size={16}/></button>
                <button className="text-muted-foreground hover:text-destructive p-1 rounded-md"><Trash size={16}/></button>
            </div>
        </CardHeader>
      </Card>
    </div>
  );
};
