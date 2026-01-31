import type { RuntimeStatus } from "./status-tag";

type StatusIndicatorProps = {
  status: RuntimeStatus;
};

/** Pause icon — static yellow (PAUSED: exists conceptually, not running) */
function PauseIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="status-icon-paused shrink-0"
      aria-hidden
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

/** Sleep icon — static gray (ARCHIVED: closed, inactive) */
function SleepIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="status-icon-archived shrink-0"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === "paused") {
    return <PauseIcon />;
  }
  if (status === "archived") {
    return <SleepIcon />;
  }
  return (
    <span
      className="status-dot status-dot-running"
      aria-hidden
    />
  );
}
