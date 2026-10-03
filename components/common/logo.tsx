import { APP_NAME, BRAND_COLOR } from "@/config/app";
import { cn } from "@/lib/utils";

// "S" di Inter 800 come tracciato: identica ovunque, senza dipendere dal font caricato.
const S_PATH =
  "M17.41 16.89Q17.37 16.42 17.04 16.16Q16.7 15.9 16.09 15.9Q15.68 15.9 15.4 16Q15.13 16.11 14.99 16.29Q14.86 16.48 14.85 16.72Q14.85 16.91 14.93 17.06Q15.02 17.21 15.19 17.33Q15.36 17.44 15.6 17.52Q15.83 17.61 16.13 17.67L16.88 17.84Q17.53 17.98 18.03 18.22Q18.52 18.45 18.86 18.78Q19.2 19.1 19.38 19.52Q19.55 19.94 19.55 20.47Q19.55 21.3 19.14 21.89Q18.72 22.48 17.95 22.8Q17.18 23.11 16.09 23.11Q14.99 23.11 14.18 22.78Q13.36 22.45 12.91 21.79Q12.46 21.12 12.45 20.09H14.47Q14.49 20.52 14.69 20.8Q14.89 21.08 15.24 21.22Q15.6 21.37 16.06 21.37Q16.49 21.37 16.79 21.25Q17.09 21.14 17.25 20.93Q17.41 20.73 17.41 20.46Q17.41 20.22 17.26 20.04Q17.11 19.86 16.8 19.73Q16.49 19.6 16.02 19.49L15.11 19.28Q13.97 19.02 13.32 18.44Q12.67 17.86 12.67 16.86Q12.67 16.05 13.11 15.44Q13.55 14.84 14.32 14.49Q15.1 14.15 16.09 14.15Q17.1 14.15 17.85 14.5Q18.6 14.84 19.01 15.46Q19.43 16.08 19.43 16.89Z";

/**
 * Marchio: foglio di calendario con la "S". Unica fonte anche per le icone PWA (`lib/app-icon.tsx`):
 * `padding` (0–0.5) allarga lo sfondo attorno al disegno per la safe zone delle icone maskable.
 */
export function LogoMark({
  className,
  size,
  padding = 0,
  rounded = true,
}: {
  className?: string;
  size?: number;
  padding?: number;
  rounded?: boolean;
}) {
  const box = 32 / (1 - padding * 2);
  const origin = (32 - box) / 2;
  return (
    <svg
      viewBox={`${origin} ${origin} ${box} ${box}`}
      width={size}
      height={size}
      className={cn("size-8", className)}
      aria-hidden
    >
      <rect x={origin} y={origin} width={box} height={box} rx={rounded && !padding ? 7 : 0} fill={BRAND_COLOR} />
      <rect x="6" y="6" width="20" height="20" rx="3" fill="#fff" />
      <path d="M6 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v0.8H6z" fill="#1a1a1a" />
      <path d={S_PATH} fill={BRAND_COLOR} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-heading font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>{APP_NAME}</span>
    </span>
  );
}
