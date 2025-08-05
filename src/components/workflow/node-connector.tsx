
"use client";

import type { WorkflowStep } from '@/lib/types';

type ConnectorProps = {
  from: WorkflowStep;
  to: WorkflowStep;
};

const NODE_WIDTH = 320; 
const NODE_HEIGHT = 84; // Adjusted for p-4 and text size

export function NodeConnector({ from, to }: ConnectorProps) {
  const fromX = from.position.x + NODE_WIDTH / 2;
  const fromY = from.position.y + NODE_HEIGHT / 2;
  
  const toX = to.position.x + NODE_WIDTH / 2;
  const toY = to.position.y + NODE_HEIGHT / 2;

  // Midpoints
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // Use a simple quadratic bezier for a gentle curve
  // Control point is offset from the midpoint
  const controlX = midX;
  const controlY = midY - 50;

  // Path from right side of 'from' node to left side of 'to' node
  const pathFromX = from.position.x + NODE_WIDTH;
  const pathFromY = from.position.y + NODE_HEIGHT / 2;
  const pathToX = to.position.x;
  const pathToY = to.position.y + NODE_HEIGHT / 2;

  const c1X = pathFromX + 75;
  const c1Y = pathFromY;
  const c2X = pathToX - 75;
  const c2Y = pathToY;

  const path = `M ${pathFromX} ${pathFromY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${pathToX} ${pathToY}`;

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
