import { ImageResponse } from "next/og";

export const BRAND_COLOR = "#5645d4";

/**
 * Icona dell'app generata da codice: un foglio di calendario con una "S".
 * `padding` (0–0.5) riduce il disegno per la safe zone delle icone maskable.
 */
export function appIcon(size: number, { padding = 0, rounded = true } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const unit = inner / 100;
  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLOR,
          borderRadius: rounded && padding === 0 ? size * 0.22 : 0,
        }}
      >
        <div
          style={{
            width: inner * 0.62,
            height: inner * 0.62,
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            borderRadius: 12 * unit,
            overflow: "hidden",
          }}
        >
          <div style={{ height: 14 * unit, background: "#1a1a1a", display: "flex" }} />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND_COLOR,
              fontSize: 40 * unit,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            S
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
