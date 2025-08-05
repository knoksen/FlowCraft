
'use client';

import { FC, MouseEvent } from 'react';
import { GripVertical, Settings, Trash, Bot, Play } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { WorkflowStep } from '@/lib/types';
import { useWorkflowStore } from './workflowStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export const Node: FC<WorkflowStep> = (node) => {
    const { id, title, position, selected, icon: Icon, iconColor, description, type } = node;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { node },
    });
    
    const selectNode = useWorkflowStore(s => s.selectNode);
    const selectedNodeId = useWorkflowStore(s => s.selectedNodeId);

    const isSelected = selectedNodeId === id;
    
    const style = transform ? {
        transform: `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`,
    } : {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    };

    const handleNodeClick = (e: MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={cn("absolute w-80")}
            onClick={handleNodeClick}
        >
            <Card
                className={cn(
                    "group transition-all hover:shadow-lg border-2 border-transparent",
                    isSelected && "border-primary shadow-lg"
                )}
            >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                    <div className="flex-shrink-0" {...listeners} {...attributes}>
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center cursor-grab active:cursor-grabbing">
                        <Icon className={cn("w-5 h-5", iconColor || "text-foreground")} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base flex justify-between items-center">
                            {title}
                            <Badge variant={type === 'trigger' ? 'default' : 'secondary'} className="capitalize text-xs">
                                {type.replace('_', ' ')}
                            </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">{description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
};
