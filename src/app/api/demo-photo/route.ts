/**
 * Demo mode only: draws a placeholder "product photo" as an SVG so the site
 * can be previewed with photos and no storage. Remove together with
 * src/lib/demo-data.ts before production.
 */
const esc = (s: string) => s.replace(/[<>&"']/g, "");

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = esc((params.get("t") ?? "Part").slice(0, 40));
  const sub = esc((params.get("s") ?? "").slice(0, 50));
  const n = Math.max(1, Number(params.get("n")) || 1);
  const hue = (Number(params.get("h")) || 20) % 360;
  const angle = ["Front view", "Back view", "Close-up", "Side view", "Label", "In use"][(n - 1) % 6];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 70% 92%)"/><stop offset="1" stop-color="hsl(${(hue + 30) % 360} 60% 78%)"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#g)"/>
<g transform="translate(400 255)" fill="none" stroke="hsl(${hue} 45% 32%)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".55">
<rect x="-130" y="-90" width="260" height="180" rx="22"/><circle cx="0" cy="0" r="46"/><path d="M-130 -40h-30M-130 40h-30M130 -40h30M130 40h30"/></g>
<text x="400" y="440" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="40" font-weight="700" fill="hsl(${hue} 50% 22%)">${title}</text>
<text x="400" y="487" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="26" fill="hsl(${hue} 35% 30%)">${sub}</text>
<text x="400" y="560" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="20" letter-spacing="3" fill="hsl(${hue} 35% 30%)" opacity=".7">${angle.toUpperCase()} · SAMPLE PHOTO ${n}</text>
</svg>`;

  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" } });
}
