
"use client";

import type { WorkflowStep } from '@/lib/types';

type ConnectorProps = {
  from: WorkflowStep;
  to: WorkflowStep;
};

const NODE_WIDTH = 320; 
const NODE_HEIGHT = 84; 

export function NodeConnector({ from, to }: ConnectorProps) {
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
