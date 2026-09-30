"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Generator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; title: string } | null>(null);
  const [err, setErr] = useState("");

  async function go() {
    setLoading(true); setErr(""); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (res.ok) setResult(data); else setErr(data.error ?? "Something went wrong");
    } catch {
      setErr("Network error. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <input value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={200}
        placeholder="A rainy night in Rome..."
        className="w-full rounded-full bg-white/10 border border-pink-300/30 px-5 py-3 outline-none" />
      <button onClick={go} disabled={loading || topic.length < 3}
        className="w-full rounded-full bg-pink-500 py-3 font-semibold disabled:opacity-50">
        {loading ? "Writing legend..." : "Generate & Publish Story"}
      </button>
      {err && <p className="text-red-300 text-sm">{err}</p>}
      {result && (
        <motion.a initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} href={result.url}
          className="block rounded-xl bg-white/10 p-4 underline">
          Live now: {result.title}
        </motion.a>
      )}
    </div>
  );
}
