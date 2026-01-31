"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";

type ProjectStatus = "deleted" | "failed";

type LearnedProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  lesson?: string;
};

function getStripProjects(m: Messages): LearnedProject[] {
  const arr = m.projectStripProjects.map((p, i) => ({
    id: String(i + 1),
    name: p.name,
    status: p.status as ProjectStatus,
    lesson: p.lesson,
  }));
  return [...arr, arr[0], arr[1]];
}

const CODE_SNIPPETS = [
  "// deleted · learned",
  "export const lesson = 'ship';",
  "if (failed) retry();",
  "const clarity = systems();",
];

function generateFakeCode(width: number, height: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz{}();,= ";
  const lines: string[] = [];
  const cols = Math.floor(width / 6);
  const rows = Math.floor(height / 14);
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

function ProjectStripCard({
  project,
  index,
  clipRightPercent,
  clipLeftPercent,
  deletedLabel,
  failedLabel,
}: {
  project: LearnedProject;
  index: number;
  clipRightPercent: number;
  clipLeftPercent: number;
  deletedLabel: string;
  failedLabel: string;
}) {
  const [code, setCode] = useState("");
  useEffect(() => {
    setCode(generateFakeCode(320, 160));
  }, [index]);

  const statusLabel = project.status === "deleted" ? deletedLabel : failedLabel;
  const statusColor =
    project.status === "deleted"
      ? "text-[var(--accent-amber)]"
      : "text-[var(--accent-red)]";

  return (
    <div className="project-strip-card relative h-[180px] w-[320px] flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] shadow-lg">
      {/* Normal face — project info */}
      <div
        className="absolute inset-0 z-[2] flex flex-col justify-between p-4 text-[var(--text-primary)]"
        style={{ clipPath: `inset(0 0 0 ${clipRightPercent}%)` }}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-wider ${statusColor}`}
        >
          {statusLabel}
        </span>
        <div>
          <p className="font-statement text-lg font-medium">{project.name}</p>
          {project.lesson && (
            <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
              → {project.lesson}
            </p>
          )}
        </div>
      </div>
      {/* Code overlay — revealed by "scanner" */}
      <div
        className="absolute inset-0 z-[1] overflow-hidden rounded-xl font-mono text-[10px] leading-tight text-[var(--text-mono)] opacity-80"
        style={{
          clipPath: `inset(0 ${100 - clipLeftPercent}% 0 0)`,
          whiteSpace: "pre",
          padding: "12px",
          wordBreak: "break-all",
        }}
      >
        {code || CODE_SNIPPETS[index % CODE_SNIPPETS.length]}
      </div>
    </div>
  );
}

type ProjectStripProps = {
  messages: Messages;
};

export function ProjectStrip({ messages }: ProjectStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(80);
  const directionRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef(0);
  const mouseVelRef = useRef(0);
  const cardGap = 24;
  const cardWidth = 320;
  const LEARNED_PROJECTS = getStripProjects(messages);
  const totalWidth = LEARNED_PROJECTS.length * (cardWidth + cardGap);
  const [clips, setClips] = useState<Map<number, { right: number; left: number }>>(new Map());

  const updateClipping = useCallback(() => {
    const rect = stripContainerRef.current?.getBoundingClientRect();
    const center = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const scanHalf = 6;
    const left = center - scanHalf;
    const right = center + scanHalf;
    const pos = positionRef.current;
    const next = new Map<number, { right: number; left: number }>();
    for (let i = 0; i < LEARNED_PROJECTS.length; i++) {
      const cardLeft = pos + i * (cardWidth + cardGap);
      const cardRight = cardLeft + cardWidth;
      if (cardRight < left) {
        next.set(i, { right: 100, left: 100 });
      } else if (cardLeft > right) {
        next.set(i, { right: 0, left: 0 });
      } else {
        const intersectLeft = Math.max(left - cardLeft, 0);
        const intersectRight = Math.min(right - cardLeft, cardWidth);
        next.set(i, {
          right: (intersectLeft / cardWidth) * 100,
          left: (intersectRight / cardWidth) * 100,
        });
      }
    }
    setClips(next);
  }, []);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      if (!stripRef.current) {
        raf = requestAnimationFrame(animate);
        return;
      }
      if (!isDraggingRef.current) {
        let v = velocityRef.current;
        if (v > 35) v *= 0.98;
        velocityRef.current = Math.max(35, v);
        positionRef.current += velocityRef.current * directionRef.current * 0.016;
        const w = totalWidth;
        if (positionRef.current < -w) positionRef.current = window.innerWidth;
        if (positionRef.current > window.innerWidth) positionRef.current = -w;
      }
      stripRef.current.style.transform = `translateX(${positionRef.current}px)`;
      updateClipping();
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [totalWidth, updateClipping]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = e.clientX;
    mouseVelRef.current = 0;
    if (stripRef.current) {
      const t = stripRef.current.style.transform;
      const m = t ? new DOMMatrix(t) : new DOMMatrix();
      positionRef.current = m.m41;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current;
    positionRef.current += dx;
    mouseVelRef.current = dx * 8;
    lastMouseRef.current = e.clientX;
    if (stripRef.current) stripRef.current.style.transform = `translateX(${positionRef.current}px)`;
    updateClipping();
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (Math.abs(mouseVelRef.current) > 40) {
      velocityRef.current = Math.min(200, Math.abs(mouseVelRef.current));
      directionRef.current = mouseVelRef.current > 0 ? 1 : -1;
    }
  };

  return (
    <section
      id="learned"
      className="relative mt-16 overflow-hidden py-8"
      aria-label={messages.sections.learned}
    >
      <h2 className="mb-4 font-statement text-base font-semibold uppercase tracking-widest text-[var(--text-primary)] sm:text-lg">
        {messages.projectStrip.title}
      </h2>
      <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)]/50">
        {messages.projectStrip.codepenCredit}
      </p>
      <div
        ref={stripContainerRef}
        className="flex h-[200px] items-center overflow-visible"
        style={{ width: "100%" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={stripRef}
          className="flex cursor-grab items-center gap-6 will-change-transform active:cursor-grabbing"
          style={{ position: "absolute", left: 0 }}
        >
          {LEARNED_PROJECTS.map((project, i) => (
            <ProjectStripCard
              key={project.id + i}
              project={project}
              index={i}
              clipRightPercent={clips.get(i)?.right ?? 0}
              clipLeftPercent={clips.get(i)?.left ?? 0}
              deletedLabel={messages.projectStrip.deleted}
              failedLabel={messages.projectStrip.failed}
            />
          ))}
        </div>
      </div>
      {/* Center scanner line */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-[var(--accent-blue)] to-transparent opacity-60"
        aria-hidden
      />
    </section>
  );
}
