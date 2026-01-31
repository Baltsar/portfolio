"use client";

import { useState, useMemo } from "react";
import { CenterCard } from "@/components/experiment/center-card";
import { ProjectOrb } from "@/components/experiment/project-orb";
import { ConnectionLines } from "@/components/experiment/connection-lines";
import { getOrbPositions } from "@/components/experiment/orb-layout";

const PROJECTS = [
  { id: 0, label: "DARK PENSION", icon: "◉", defaultOn: true },
  { id: 1, label: "FAVER", icon: "★", defaultOn: true },
  { id: 2, label: "DISCORDBOT", icon: "◆", defaultOn: false },
  { id: 3, label: "LIVE WORKBENCH", icon: "◈", defaultOn: true },
  { id: 4, label: "API SIDE", icon: "▸", defaultOn: true },
  { id: 5, label: "RAILS APP", icon: "/", defaultOn: false },
];

export function WorkbenchSection() {
  const [active, setActive] = useState<boolean[]>(() =>
    PROJECTS.map((p) => p.defaultOn)
  );

  const orbPositions = useMemo(
    () => getOrbPositions(PROJECTS.length),
    []
  );
  const endPoints = useMemo(
    () => orbPositions.map((p) => p.svg),
    [orbPositions]
  );

  const toggle = (i: number) => {
    setActive((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <section
      id="workbench"
      className="workbench-docs relative mt-20 rounded-lg border border-[var(--border-glass)] bg-[var(--bg-primary)]/40 py-10 sm:py-12"
      aria-label="Workbench overview"
    >
      <p className="mb-6 text-center font-statement text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
        Workbench — current state
      </p>
      <div className="flex flex-col items-center justify-center px-2">
        <div className="relative aspect-square w-full max-w-[420px] min-w-[240px] sm:min-w-[260px]">
          <ConnectionLines active={active} endPoints={endPoints} documentation />
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <CenterCard documentation />
          </div>
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: orbPositions[i].left,
                top: orbPositions[i].top,
              }}
            >
              <ProjectOrb
                label={p.label}
                icon={p.icon}
                isOn={active[i]}
                onToggle={() => toggle(i)}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] text-[var(--text-secondary)]">
          ●/× toggles on or off. Green line = on, red = off.
        </p>
      </div>
    </section>
  );
}
