"use client";

import { CENTER } from "./orb-layout";

type ConnectionLinesProps = {
  active: boolean[];
  endPoints: [number, number][];
  documentation?: boolean;
};

export function ConnectionLines({ active, endPoints, documentation }: ConnectionLinesProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {!documentation && (
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {endPoints.map((end, i) => {
        const isActive = active[i];
        return (
          <line
            key={i}
            x1={CENTER[0]}
            y1={CENTER[1]}
            x2={end[0]}
            y2={end[1]}
            stroke={isActive ? "var(--accent-green)" : "var(--accent-red)"}
            strokeWidth="0.8"
            strokeOpacity={documentation ? (isActive ? 0.65 : 0.4) : isActive ? 0.9 : 0.5}
            strokeLinecap="round"
            strokeDasharray={isActive ? "8 4" : "2 4"}
            filter={documentation ? undefined : isActive ? "url(#glow-green)" : "url(#glow-red)"}
            className={`transition-all duration-300 ${isActive ? "line-dash" : ""}`}
          />
        );
      })}
    </svg>
  );
}
