import { StatusIndicator } from "./status-indicator";

/**
 * Runtime status: does the project exist and run in the world?
 * Independent of focus_state (whether you're actively working on it).
 */
export type RuntimeStatus = "running" | "paused" | "archived";

const TAG_STYLES: Record<
  RuntimeStatus,
  { textClassName: string }
> = {
  running: {
    textClassName:
      "live-text text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]",
  },
  paused: {
    textClassName:
      "text-xs font-medium uppercase tracking-wider text-[var(--accent-amber)]",
  },
  archived: {
    textClassName:
      "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]/80",
  },
};

type StatusTagProps = {
  runtimeStatus: RuntimeStatus;
  label: string;
  /** Optional focus state: your current relationship to the project. Text only, never combined with label. */
  focusState?: string;
};

export function StatusTag({ runtimeStatus, label, focusState }: StatusTagProps) {
  const { textClassName } = TAG_STYLES[runtimeStatus];

  return (
    <span className="inline-flex flex-nowrap items-center gap-1.5">
      <StatusIndicator status={runtimeStatus} />
      <span className="min-w-0 shrink-0 whitespace-nowrap">
        <span className={textClassName}>{label}</span>
        {focusState !== undefined && focusState !== "" && (
          <>
            <span className="mx-1 text-[var(--text-secondary)]/50" aria-hidden>·</span>
            <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--text-secondary)]/80">
              {focusState}
            </span>
          </>
        )}
      </span>
    </span>
  );
}
