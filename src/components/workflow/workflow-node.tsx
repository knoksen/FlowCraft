
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
        "p-4 rounded-2xl shadow-md bg-gradient-to-tr from-gray-50 to-gray-100 border text-card-foreground",
        "dark:from-gray-800 dark:to-gray-900",
        selected ? "ring-2 ring-blue-400" : ""
      )}
    >
      <div className="flex items-center gap-2 mb-2 cursor-grab">
        <GripVertical className="text-gray-400" size={18} />
        <span className="font-semibold text-lg">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <button className="text-blue-500 hover:text-blue-700"><Play size={18}/></button>
        <button className="text-red-400 hover:text-red-700"><Trash size={18}/></button>
      </div>
    </motion.div>
  );
};

export const Handle = ({ position = "right" }) => (
  <div
    className={cn(
      "absolute w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow",
      position === "right" ? "right-[-6px] top-1/2 -translate-y-1/2" : "left-[-6px] top-1/2 -translate-y-1/2"
    )}
  />
);
