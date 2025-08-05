
'use client';

import type { FC } from 'react';
import { GripVertical, Play, Trash, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from './workflowStore';
import type { WorkflowStep } from '@/lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export type NodeProps = WorkflowStep & {
  onStartConnection: (nodeId: string, handle: 'source' | 'target') => void;
  onEndConnection: (nodeId: string, handle: 'source' | 'target') => void;
};

export const Node: FC<NodeProps> = ({ id, title, description, icon: Icon, iconColor, selected, onStartConnection, onEndConnection, type }) => {
    const { isConnecting, connectingFrom, selectNode, deleteNode } = useWorkflowStore(state => ({
        isConnecting: !!state.connectingFrom,
        connectingFrom: state.connectingFrom,
        selectNode: state.selectNode,
        deleteNode: state.deleteNode,
    }));
    
    const isPotentialTarget = isConnecting && connectingFrom?.nodeId !== id && connectingFrom?.handle === 'source';
    
    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    }
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNode(id);
    }
    
    const handleCogClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    }

    return (
        <Card
            onClick={handleNodeClick}
            onMouseUp={(e) => { 
                e.stopPropagation(); 
                if (isPotentialTarget) onEndConnection(id, 'target');
            }}
            className={cn(
                "w-80 border-2 transition-all cursor-grab active:cursor-grabbing group",
                selected ? "border-primary ring-2 ring-primary/30" : "border-border",
                isPotentialTarget && "border-dashed border-primary ring-2 ring-primary/30"
            )}
        >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCogClick}>
                        <Cog className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDeleteClick}>
                        <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                 </div>
            </CardHeader>

            {/* Connection Handles */}
            {type !== 'trigger' && (
                <div 
                    className={cn(
                        "absolute top-1/2 -left-3 h-5 w-5 rounded-full bg-background border-2 border-primary cursor-crosshair -translate-y-1/2 transition-all",
                        isConnecting ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
                    )}
                    onMouseUp={(e) => { e.stopPropagation(); onEndConnection(id, 'target'); }}
                />
            )}
             <div 
                className={cn(
                    "absolute top-1/2 -right-3 h-5 w-5 rounded-full bg-primary border-2 border-background cursor-crosshair -translate-y-1/2 transition-all",
                    isConnecting ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
                )}
                onMouseDown={(e) => { e.stopPropagation(); onStartConnection(id, 'source'); }}
            />
        </Card>
    );
};
