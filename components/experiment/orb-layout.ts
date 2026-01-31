/**
 * Orb positions runt center (50, 50).
 * radius i procent av container; 0° = top, sedan medurs.
 */
const RADIUS = 42;

function polarToXY(angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + RADIUS * Math.sin(rad);
  const y = 50 - RADIUS * Math.cos(rad);
  return [Math.round(x), Math.round(y)];
}

export type OrbPosition = {
  left: string;
  top: string;
  svg: [number, number];
};

export function getOrbPositions(count: number): OrbPosition[] {
  if (count <= 0) return [];
  if (count === 1) {
    const [x, y] = polarToXY(0);
    return [{ left: `${x}%`, top: `${y}%`, svg: [x, y] }];
  }
  const step = 360 / count;
  const positions: OrbPosition[] = [];
  for (let i = 0; i < count; i++) {
    const [x, y] = polarToXY(i * step);
    positions.push({ left: `${x}%`, top: `${y}%`, svg: [x, y] });
  }
  return positions;
}

export const CENTER: [number, number] = [50, 50];
