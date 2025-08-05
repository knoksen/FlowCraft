
import React from 'react';
import type { WorkflowStep } from '@/lib/types';

const CARD_WIDTH = 320; // w-80
const CARD_HEIGHT = 92; // Based on p-4 header and content inside

export function NodeConnector({ from, to }: { from: WorkflowStep; to: WorkflowStep }) {
  const fromX = from.position.x + CARD_WIDTH;
  const fromY = from.position.y + CARD_HEIGHT / 2;
  const toX = to.position.x;
  const toY = to.position.y + CARD_HEIGHT / 2;

  // Bezier curve control points for a nice smooth curve
  const c1X = fromX + 60;
  const c1Y = fromY;
  const c2X = toX - 60;
  const c2Y = toY;

  const path = `M ${fromX} ${fromY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${toX} ${toY}`;

  return (
    <>
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
    </>
  );
}
