import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/common/logo";

/** Icone dell'app generate dallo stesso SVG del logo. */
export function appIcon(size: number, options: { padding?: number; rounded?: boolean } = {}) {
  return new ImageResponse(<LogoMark size={size} {...options} />, { width: size, height: size });
}
