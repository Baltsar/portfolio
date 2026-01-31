"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

type ExperimentContentProps = {
  backHref: string;
  backLabel: string;
  experimentLabel: string;
  hint: string;
};

export function ExperimentContent({
  backHref,
  backLabel,
  experimentLabel,
  hint,
}: ExperimentContentProps) {
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
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={backHref}
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-blue)]"
          >
            {backLabel}
          </Link>
          <span className="rounded-full border border-[var(--border-glass)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
            {experimentLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative aspect-square w-full max-w-[480px] min-w-[260px] sm:min-w-[280px]">
            <ConnectionLines active={active} endPoints={endPoints} />
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <CenterCard />
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
        </div>

        <p className="mt-4 text-center text-[10px] text-[var(--text-secondary)]">
          {hint}
        </p>
      </div>
    </div>
  );
}
