
'use client'

import { useWorkflowStore } from "./workflowStore";
import { Node } from "./workflow-node";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Connector } from "./connector";

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const addNode = useWorkflowStore((s) => s.addNode);

  return (
    <div className="relative w-full h-[70vh] rounded-xl bg-muted/50 shadow-inner overflow-hidden">
        <svg className="absolute w-full h-full pointer-events-none">
            {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (sourceNode && targetNode) {
                    return <Connector key={`${edge.source}-${edge.target}`} from={sourceNode} to={targetNode} />
                }
                return null;
            })}
        </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10"
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
