'use client'

import { useState } from "react";
import { useWorkflowStore } from "./workflowStore";
import { Node } from "./workflow-node";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);

  return (
    <div className="relative w-full h-[70vh] rounded-xl bg-muted/50 shadow-inner overflow-hidden">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute"
          style={{ top: node.y, left: node.x, minWidth: 180 }}
        >
          <Node {...node} />
        </motion.div>
      ))}
      <button
        onClick={() => addNode({ title: 'New Step', description: 'This is a new step.' })}
        className="absolute bottom-6 right-6 z-10 bg-primary text-primary-foreground rounded-full shadow-xl p-3 hover:bg-primary/90 transition"
        aria-label="Add node"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
