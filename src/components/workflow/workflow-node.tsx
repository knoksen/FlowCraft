'use client';

import { FC } from 'react';
import { GripVertical, Play, Trash } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { WorkflowStep } from '@/lib/types';


export const Node: FC<WorkflowStep & { isOverlay?: boolean }> = (node) => {
    const { id, title, position, selected, isOverlay } = node;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { node, isSidebarItem: false }
    });
    
    const style = transform && !isOverlay ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div 
            ref={setNodeRef}
            style={isOverlay ? {} : {...style, top: position.y, left: position.x }}
            className={cn("absolute", isOverlay && "z-50")}
        >
            <div
                className={cn("w-72 p-4 rounded-2xl shadow bg-gradient-to-tr from-gray-50 to-gray-100 border transition-all",
                selected ? "ring-2 ring-blue-400" : "",
                isOverlay && "scale-105 shadow-2xl"
                )}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="text-gray-400" size={18} />
                    </div>
                    <span className="font-semibold text-lg">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                <button className="text-blue-500 hover:text-blue-700"><Play size={18}/></button>
                <button className="text-red-400 hover:text-red-700"><Trash size={18}/></button>
                </div>
            </div>
        </div>
    );
};
