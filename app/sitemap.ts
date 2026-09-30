import type { MetadataRoute } from "next";
import { supabase, SITE } from "@/lib/supabase";
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("stories").select("slug,created_at").eq("published", true);
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/stories`, changeFrequency: "daily", priority: 0.9 },
    ...(data ?? []).map((s) => ({ url: `${SITE}/stories/${s.slug}`, lastModified: s.created_at, priority: 0.7 })),
  ];
}
