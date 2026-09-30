import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase, SITE } from "@/lib/supabase";

type P = { params: Promise<{ slug: string }> };
const get = async (slug: string) =>
  (await supabase.from("stories").select("*").eq("slug", slug).eq("published", true).single()).data;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = await get((await params).slug);
  if (!s) return {};
  const desc = s.story.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  return {
    title: s.title, description: desc,
    alternates: { canonical: `/stories/${s.slug}` },
    openGraph: { title: s.title, description: desc, type: "article", publishedTime: s.created_at, url: `${SITE}/stories/${s.slug}` },
    twitter: { card: "summary_large_image", title: s.title, description: desc },
  };
}

export default async function StoryPage({ params }: P) {
  const s = await get((await params).slug);
  if (!s) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: s.title,
    datePublished: s.created_at, author: { "@type": "Person", name: "Garçon Bonbon" },
    mainEntityOfPage: `${SITE}/stories/${s.slug}` };
  return (
    <article className="max-w-2xl mx-auto px-5 pb-20 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="font-serif text-4xl text-pink-300">{s.title}</h1>
      {s.story.split("\n").filter(Boolean).map((p: string, i: number) => (
        <p key={i} className="leading-relaxed text-neutral-200">{p}</p>
      ))}
    </article>
  );
}
