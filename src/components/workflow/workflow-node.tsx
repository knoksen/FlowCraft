'use client';

import type { FC } from 'react';
import { GripVertical, Play, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NodeProps = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
  selected?: boolean;
};

export const Node: FC<NodeProps> = ({ title, selected }) => (
  <div
    className={cn(
      "p-4 rounded-lg shadow-md bg-card border transition-all",
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
  </div>
);
