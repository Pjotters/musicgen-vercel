import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateMusic() {
    setLoading(true);
    setAudioUrl(null);

    const res = await fetch("/api/generate-music", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      alert("Error: " + (await res.json()).error);
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>MusicGen API demo</h1>
      <textarea
        rows={4}
        placeholder="Type your music prompt here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", fontSize: 16 }}
      />
      <button onClick={generateMusic} disabled={loading || !prompt} style={{ marginTop: 10 }}>
        {loading ? "Generating..." : "Generate Music"}
      </button>
      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl} />
          <p>Right click → Save as to download</p>
        </div>
      )}
    </main>
  );
}
