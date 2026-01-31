type HeroProps = {
  lines: string[];
};

export function Hero({ lines }: HeroProps) {
  return (
    <div className="space-y-2">
      {lines.slice(0, 3).map((line, i) => (
        <p
          key={i}
          className="font-statement text-2xl font-medium leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl lg:text-[2.5rem]"
        >
          {line}
        </p>
      ))}
    </div>
  );
}
