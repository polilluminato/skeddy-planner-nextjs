import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Telemetry } from "@/components/common/telemetry";
import { APP_DESCRIPTION, APP_NAME, APP_SHORT_NAME } from "@/config/app";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_SHORT_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_SHORT_NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const telemetryAppId = process.env.TELEMETRY_DECK_APP_ID;
  return (
    <html lang="it" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
        {telemetryAppId && (
          <Telemetry appId={telemetryAppId} testMode={process.env.NODE_ENV !== "production"} />
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
