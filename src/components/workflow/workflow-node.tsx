'use client';

import type { FC } from 'react';
import { GripVertical, Play, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from './workflowStore';

export type NodeProps = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
  selected?: boolean;
  onStartConnection: (nodeId: string, handle: 'source' | 'target') => void;
  onEndConnection: (nodeId: string, handle: 'source' | 'target') => void;
};

export const Node: FC<NodeProps> = ({ id, title, selected, onStartConnection, onEndConnection }) => {
    const isConnecting = useWorkflowStore(state => !!state.connectingFrom);

    return (
        <div
            className={cn(
            "p-4 rounded-lg shadow-md bg-card border transition-all w-60",
            selected && "ring-2 ring-primary border-primary"
            )}
        >
            <div className="flex items-center gap-2 mb-2">
            <GripVertical className="text-muted-foreground cursor-grab" size={18} />
            <span className="font-semibold text-lg text-card-foreground">{title}</span>
            </div>
            <div className="flex items-center gap-2">
            <button className="text-primary hover:text-primary/80 transition-colors">
                <Play size={18}/>
            </button>
            <button className="text-destructive hover:text-destructive/80 transition-colors">
                <Trash size={18}/>
            </button>
            </div>

            {/* Connection Handles */}
            <div 
                className={cn(
                    "absolute top-1/2 -left-2 h-4 w-4 rounded-full bg-background border-2 border-primary cursor-crosshair -translate-y-1/2 transition-all",
                    isConnecting ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
                )}
                onMouseDown={() => onStartConnection(id, 'target')}
                onMouseUp={() => onEndConnection(id, 'target')}
            />
             <div 
                className={cn(
                    "absolute top-1/2 -right-2 h-4 w-4 rounded-full bg-primary border-2 border-background cursor-crosshair -translate-y-1/2 transition-all",
                    isConnecting ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
                )}
                onMouseDown={() => onStartConnection(id, 'source')}
                onMouseUp={() => onEndConnection(id, 'source')}
            />
        </div>
    );
};
