
"use client";

import type { Node } from './workflowStore';

type ConnectorProps = {
  from: Node;
  to: Node;
};

const NODE_WIDTH = 212; // Approximation of the node width (minWidth: 180 + padding)
const NODE_HEIGHT = 124; // Approximation of the node height

export function Connector({ from, to }: ConnectorProps) {
  // Right center of the 'from' node
  const fromX = from.x + NODE_WIDTH;
  const fromY = from.y + NODE_HEIGHT / 2;
  
  // Left center of the 'to' node
  const toX = to.x;
  const toY = to.y + NODE_HEIGHT / 2;

  // Bezier curve control points
  const c1X = fromX + 75;
  const c1Y = fromY;
  const c2X = toX - 75;
  const c2Y = toY;

  const path = `M ${fromX} ${fromY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${toX} ${toY}`;

  return (
    <>
      <path
        d={path}
        stroke="hsl(var(--border))"
        strokeWidth="2.5"
        fill="none"
        markerEnd="url(#arrow)"
      />
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
        </marker>
      </defs>
    </>
  );
}
