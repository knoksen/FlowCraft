
"use client";

import type { WorkflowStep } from '@/lib/types';

type ConnectorProps = {
  from: WorkflowStep;
  to: WorkflowStep;
};

const NODE_WIDTH = 320; 
const NODE_HEIGHT = 92;

export function NodeConnector({ from, to }: ConnectorProps) {
  const fromX = from.position.x + NODE_WIDTH;
  const fromY = from.position.y + NODE_HEIGHT / 2;
  
  const toX = to.position.x;
  const toY = to.position.y + NODE_HEIGHT / 2;

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
