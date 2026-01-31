import Image from "next/image";

type CenterCardProps = {
  documentation?: boolean;
};

export function CenterCard({ documentation }: CenterCardProps) {
  return (
    <div
      className={
        documentation
          ? "card-experiment relative flex w-40 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border-glass)] bg-transparent shadow-none"
          : "card-experiment relative flex w-48 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--accent-green)] bg-transparent shadow-[0_0_20px_rgba(34,197,94,0.15)]"
      }
    >
      {/* Bild täcker hela kortet, croppad så handen syns */}
      <div className="absolute inset-0">
        <Image
          src="/images/center-card-bg.png"
          alt=""
          fill
          className={`object-cover object-[center_55%] ${documentation ? "opacity-90" : ""}`}
          sizes={documentation ? "160px" : "192px"}
          priority={!documentation}
        />
      </div>
      {/* Mörk gradient-overlay för läsbar text */}
      <div
        className={`absolute inset-0 ${documentation ? "bg-gradient-to-t from-black/85 via-black/40 to-transparent" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent"}`}
        aria-hidden
      />
      <div className="card-experiment-grain" aria-hidden />
      <div className="relative z-10 flex min-h-[160px] flex-col justify-end p-4">
        <span className="font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          BALTSAR
        </span>
      </div>
    </div>
  );
}
