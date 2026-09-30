import { appIcon } from "@/lib/app-icon";

const VARIANTS = {
  "192": () => appIcon(192),
  "512": () => appIcon(512),
  // Safe zone maskable: il disegno sta nel cerchio centrale all'80%.
  maskable: () => appIcon(512, { padding: 0.1 }),
} as const;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(_request: Request, ctx: RouteContext<"/pwa-icon/[variant]">) {
  const { variant } = await ctx.params;
  const render = VARIANTS[variant as keyof typeof VARIANTS];
  if (!render) return new Response("Not found", { status: 404 });
  return render();
}
