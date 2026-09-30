import Generator from "@/components/Generator";
import { SITE } from "@/lib/supabase";

export default function Home() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "Garçon Bonbon", url: SITE,
      potentialAction: { "@type": "SearchAction", target: `${SITE}/stories?q={q}`, "query-input": "required name=q" } },
    { "@context": "https://schema.org", "@type": "Person", name: "Garçon Bonbon", url: SITE,
      description: "Charismatic storyteller and protagonist of the Garçon Bonbon universe.",
      sameAs: [/* add your Instagram, X, TikTok, LinkedIn URLs */] },
  ];
  return (
    <main className="max-w-5xl mx-auto px-5 space-y-24 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-16 text-center space-y-4">
        <h1 className="font-serif text-6xl text-pink-300">Garçon Bonbon</h1>
        <p className="text-neutral-400">Stylish. Legendary. Spontaneous.</p>
      </section>
      <section id="lore" className="space-y-3">
        <h2 className="text-3xl font-serif">The Lore</h2>
        <p className="text-neutral-300">Write Garçon Bonbon&apos;s origin story here.</p>
      </section>
      <section id="president" className="rounded-3xl bg-gradient-to-br from-green-900/40 to-red-900/40 p-8 space-y-3">
        <h2 className="text-3xl font-serif">The President of Italy</h2>
        <p className="text-neutral-300">A nickname, a night, a legend. Spotlight copy goes here.</p>
      </section>
      <section className="space-y-6">
        <h2 className="text-3xl font-serif text-center">Write a New Chapter</h2>
        <Generator />
      </section>
    </main>
  );
}
