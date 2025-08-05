import React from 'react';
import type { WorkflowStep } from '@/lib/types';

type NodeConnectorProps = {
  from: WorkflowStep;
  to: WorkflowStep;
};

const CARD_WIDTH = 350;
const CARD_HEIGHT = 92; // Based on p-4 header and content inside

export function NodeConnector({ from, to }: NodeConnectorProps) {
  const fromX = from.position.x + CARD_WIDTH;
  const fromY = from.position.y + CARD_HEIGHT / 2;
  const toX = to.position.x;
  const toY = to.position.y + CARD_HEIGHT / 2;

  const path = `M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={path}
        stroke="hsl(var(--border))"
        strokeWidth="2"
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
    </svg>
  );
}
