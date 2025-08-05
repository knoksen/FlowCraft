
'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Play, Trash } from 'lucide-react';
import { useWorkflowStore, Node as NodeType } from './workflowStore';
import { cn } from '@/lib/utils';

export type NodeProps = NodeType & {
  selected?: boolean;
};

export function Node({ id, title, description, x, y, selected }: NodeProps) {
  const updateNodePosition = useWorkflowStore((s) => s.updateNodePosition);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateNodePosition(id, x + info.offset.x, y + info.offset.y);
      }}
      className={cn(
        "p-4 rounded-2xl shadow-md bg-gradient-to-tr from-card to-muted/50 border text-card-foreground",
        selected ? "ring-2 ring-primary" : ""
      )}
    >
      <div className="flex items-center gap-2 mb-2 cursor-grab">
        <GripVertical className="text-muted-foreground" size={18} />
        <span className="font-semibold text-lg">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <button className="text-primary hover:text-primary/80"><Play size={18}/></button>
        <button className="text-destructive hover:text-destructive/80"><Trash size={18}/></button>
      </div>
    </motion.div>
  );
};

export const Handle = ({ position = "right" }) => (
  <div
    className={cn(
      "absolute w-3 h-3 rounded-full bg-primary border-2 border-card shadow",
      position === "right" ? "right-[-6px] top-1/2 -translate-y-1/2" : "left-[-6px] top-1/2 -translate-y-1/2"
    )}
  />
);
