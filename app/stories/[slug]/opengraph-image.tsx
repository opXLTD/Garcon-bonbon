import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { data } = await supabase.from("stories").select("title").eq("slug", (await params).slug).single();
  return new ImageResponse(
    (<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%",
      background: "linear-gradient(135deg,#111,#4a1230)", color: "#f9a8d4", padding: 80 }}>
      <div style={{ fontSize: 30, color: "#aaa" }}>GARÇON BONBON</div>
      <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20 }}>{data?.title ?? "A Legendary Story"}</div>
    </div>), size);
}
