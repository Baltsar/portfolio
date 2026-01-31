const ACTIVITY = [
  { icon: "⌘", text: "npm test completed", time: "Just now" },
  { icon: "#", text: "PR #234 merged", time: "Just now" },
  { icon: "@", text: "Asked about metrics", time: "2m ago" },
  { icon: "📄", text: "Weekly report updated", time: "5m ago" },
  { icon: "#", text: "Posting summary to #dev", time: "In progress" },
];

export function ActivityFeed() {
  return (
    <div className="card-glass flex w-56 flex-shrink-0 flex-col rounded-xl p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Activity
      </h3>
      <ul className="flex flex-col gap-2">
        {ACTIVITY.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg py-1.5 text-xs"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[var(--bg-hover)] text-[10px]">
              {item.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[var(--text-primary)]">{item.text}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {item.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
