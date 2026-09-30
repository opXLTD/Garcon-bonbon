import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, SITE } from "@/lib/supabase";

export const maxDuration = 30;

const MODEL = "gemini-2.5-flash"; // swap to a Flash-Lite model if you hit limits

const SYSTEM = `You write short, witty, stylish stories (250-400 words) starring two fictional characters:
"Garçon Bonbon", a charismatic, legendary protagonist, and "The President of Italy", his playful nickname for a
spontaneous, casual fling. Tone: lighthearted, flirty-but-PG-13, fun, never a serious romance, never explicit.
Do not use any real people's names. Respond ONLY with JSON: {"title": string, "story": string}.`;

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);

const safety = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
].map((category) => ({ category, threshold: "BLOCK_LOW_AND_ABOVE" }));

async function pingIndexNow(url: string) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: new URL(SITE).host, key, keyLocation: `${SITE}/indexnow-key`,
      urlList: [url, `${SITE}/stories`],
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const db = supabaseAdmin();

  // Rate limit: 5 stories/hour/IP, stored in Supabase (free)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await db.from("rate_limits")
    .select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
  if ((count ?? 0) >= 5)
    return NextResponse.json({ error: "Too many stories. Try later." }, { status: 429 });
  await db.from("rate_limits").insert({ ip });

  const { topic } = await req.json().catch(() => ({}));
  if (typeof topic !== "string" || topic.trim().length < 3 || topic.length > 200)
    return NextResponse.json({ error: "Topic must be 3-200 characters." }, { status: 400 });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: `Topic: ${topic}` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: { title: { type: "STRING" }, story: { type: "STRING" } },
            required: ["title", "story"],
          },
        },
        safetySettings: safety,
      }),
    }
  );

  if (res.status === 429)
    return NextResponse.json({ error: "Daily free quota reached. Try again tomorrow." }, { status: 429 });
  if (!res.ok) return NextResponse.json({ error: "AI error." }, { status: 502 });

  const data = await res.json();
  if (data.promptFeedback?.blockReason || data.candidates?.[0]?.finishReason === "SAFETY")
    return NextResponse.json({ error: "Topic or story not allowed." }, { status: 400 });

  let parsed: { title: string; story: string };
  try { parsed = JSON.parse(data.candidates[0].content.parts[0].text); }
  catch { return NextResponse.json({ error: "Bad AI output." }, { status: 502 }); }

  const slug = `${slugify(parsed.title)}-${Math.random().toString(36).slice(2, 6)}`;
  const { error } = await db.from("stories")
    .insert({ title: parsed.title, story: parsed.story, slug, topic, published: true });
  if (error) return NextResponse.json({ error: "Save failed." }, { status: 500 });

  const url = `${SITE}/stories/${slug}`;
  revalidatePath("/stories");
  revalidatePath("/sitemap.xml");
  await pingIndexNow(url);

  return NextResponse.json({ url, slug, title: parsed.title });
}
