type StackProps = {
  tech: string[];
  attributes: string;
};

export function Stack({ tech, attributes }: StackProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className="rounded-md border border-[var(--border-glass)] bg-transparent px-2 py-1 text-xs text-[var(--text-secondary)] opacity-80"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="font-statement text-[10px] uppercase tracking-widest text-[var(--text-secondary)] opacity-70">
        {attributes}
      </p>
    </div>
  );
}
