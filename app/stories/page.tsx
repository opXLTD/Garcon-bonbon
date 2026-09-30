import { supabase } from "@/lib/supabase";
export const revalidate = 60;
export const metadata = { title: "Stories Archive", description: "Every legendary Garçon Bonbon story." };

export default async function Stories() {
  const { data } = await supabase.from("stories").select("title,slug,story,created_at")
    .eq("published", true).order("created_at", { ascending: false });
  return (
    <main className="max-w-5xl mx-auto px-5 grid gap-4 sm:grid-cols-2 pb-20">
      {data?.map((s) => (
        <a key={s.slug} href={`/stories/${s.slug}`} className="rounded-2xl bg-white/5 p-5 hover:bg-white/10">
          <h2 className="font-serif text-xl text-pink-300">{s.title}</h2>
          <p className="text-sm text-neutral-400 mt-2 line-clamp-3">{s.story}</p>
        </a>
      ))}
    </main>
  );
}
