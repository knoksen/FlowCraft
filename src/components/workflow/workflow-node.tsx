'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useWorkflowStore, Node as NodeType } from './workflowStore';

export type NodeProps = NodeType;

export function Node({ id, title, description, x, y }: NodeProps) {
  const updateNodePosition = useWorkflowStore((s) => s.updateNodePosition);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateNodePosition(id, info.point.x, info.point.y);
      }}
      className="bg-card text-card-foreground rounded-lg shadow-md border border-border"
    >
      <div className="p-3 flex items-start gap-2">
        <div className="cursor-grab p-1">
            <GripVertical size={18} className="text-muted-foreground" />
        </div>
        <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
