"use client";

type ProjectOrbProps = {
  label: string;
  icon: string;
  isOn: boolean;
  onToggle: () => void;
};

export function ProjectOrb({ label, icon, isOn, onToggle }: ProjectOrbProps) {
  return (
    <div className="card-experiment relative flex w-20 flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all sm:w-24 sm:gap-2 sm:p-3">
      <div className="card-experiment-grain" aria-hidden />
      <div className="relative z-10 flex w-full flex-col items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-1 -top-1 flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--bg-card)] transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-blue)] sm:-right-1.5 sm:-top-1.5 sm:h-6 sm:w-6 sm:min-h-0 sm:min-w-0"
          aria-label={isOn ? "Turn off" : "Turn on"}
        >
          {isOn ? (
            <span
              className="h-2 w-2 rounded-full bg-[var(--accent-green)] shadow-[0_0_6px_var(--accent-green)]"
              aria-hidden
            />
          ) : (
            <span className="text-[10px] font-bold text-[var(--accent-red)]">
              ×
            </span>
          )}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-hover)] text-sm sm:h-10 sm:w-10 sm:text-lg">
          {icon}
        </div>
        <span className="text-center text-[9px] font-medium leading-tight text-[var(--text-primary)] sm:text-[10px]">
          {label}
        </span>
      </div>
    </div>
  );
}
