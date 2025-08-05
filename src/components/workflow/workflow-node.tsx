
'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowStep } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type NodeProps = WorkflowStep & {
  isOverlay?: boolean;
};

export function Node({ id, title, description, icon: Icon, iconColor, position, isOverlay }: NodeProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            node: { id, title, description, icon: Icon, iconColor, position },
            isSidebarItem: false,
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: 'absolute',
        left: position.x,
        top: position.y,
    } : {
        position: 'absolute',
        left: position.x,
        top: position.y,
    };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("w-80", isOverlay ? "z-50" : "z-10")}
    >
      <Card
        className={cn(
            "group transition-all hover:shadow-lg hover:border-primary/50",
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
        </CardHeader>
      </Card>
    </div>
  );
};
