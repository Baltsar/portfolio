import type { Project } from "./project-card";
import type { RuntimeStatus } from "./status-tag";
import { StatusTag } from "./status-tag";
import type { Messages } from "@/lib/i18n";

type ProjectCardForkProps = {
  project: Project;
  messages: Messages;
};

export function ProjectCardFork({ project, messages }: ProjectCardForkProps) {
  const { runtimeStatusLabels, projectCard } = messages;
  const runtimeStatus = project.runtime_status as RuntimeStatus;
  return (
    <div className="card-glass card-fork min-w-0 p-5 pb-7 sm:p-6 sm:pb-8 md:p-6 md:pb-8">
      <div className="card-fork-grain" aria-hidden />
      <div className="card-fork-dots" aria-hidden />

      <div className="relative z-10 min-w-0">
        <div className="flex flex-nowrap items-center gap-2 border-b border-[var(--border-glass)] pb-4">
          <StatusTag
            runtimeStatus={runtimeStatus}
            label={runtimeStatusLabels[runtimeStatus]}
            focusState={project.focus_state}
          />
        </div>
        {/* Title + body — Status → [Logo/placeholder] Title → Description → Update */}
        <div className="space-y-1 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border-glass)] bg-[var(--bg-hover)]">
              {project.image ? (
                <img src={project.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-secondary)]/50" aria-hidden>
                  ?
                </span>
              )}
            </div>
            <h2 className="min-w-0 break-words font-statement text-lg font-semibold text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-[1.02] md:text-xl">
              {project.title}
            </h2>
          </div>
          <p className="break-words pt-5 text-sm leading-relaxed text-[var(--text-secondary)]/85">
            {project.description}
          </p>
          <p className="update-line break-words font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
            {project.latestUpdate}
          </p>
          {project.href && (
            <div className="pt-3">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-glass)] bg-transparent px-3 py-2 text-xs text-[var(--text-secondary)] transition-colors hover:border-[rgba(255,255,255,0.15)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-blue)]"
                aria-label={projectCard.goToAria}
              >
                <span>{projectCard.goTo}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
