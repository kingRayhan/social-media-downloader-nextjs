"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const api = await fetch("/api/download-video", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    if (api.status === 200) {
      // setResponse(await api.json());

      // start downloading
      const response = await api.json();
      const anchor = document.createElement("a");
      anchor.href = response.downloadUrl;
      anchor.download = response.fileName;
      anchor.click();

      setUrl("");
      setError("");
    } else {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <main className=" max-w-4xl mx-auto border-t-4 border-primary px-10 md:p-0">
      <header className="max-w-7xl my-10 text-center">
        <h1 className=" text-4xl uppercase">Social Downloader</h1>
        <h3 className="text-xl mt-2">
          Download Video from your favorite social media platforms like Youtube,
          Instagram, Twitter, TikTok, Facebook, Snapchat, and more.
        </h3>
      </header>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          placeholder="Paste the link here"
          disabled={loading}
          className="border p-3 w-full disabled:bg-slate-50 disabled:cursor-wait"
        />

        <button className="bg-primary text-white px-4 py-2">
          {loading ? "Downloading..." : "Download"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 mt-10">
          <p>Something went wrong</p>
        </div>
      )}
    </main>
  );
}
