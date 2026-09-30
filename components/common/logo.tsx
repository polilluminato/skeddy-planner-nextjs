import { APP_NAME } from "@/config/app";
import { cn } from "@/lib/utils";

/** Marchio: foglio di calendario con la "S", stesso disegno delle icone PWA. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="7" fill="#5645d4" />
      <rect x="6" y="6" width="20" height="20" rx="3" fill="#fff" />
      <path d="M6 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v0.8H6z" fill="#1a1a1a" />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
        fill="#5645d4"
      >
        S
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>{APP_NAME}</span>
    </span>
  );
}
