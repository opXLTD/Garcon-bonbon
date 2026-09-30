// Serves the IndexNow verification key so no file in /public is needed.
export function GET() {
  return new Response(process.env.INDEXNOW_KEY ?? "", { headers: { "Content-Type": "text/plain" } });
}
