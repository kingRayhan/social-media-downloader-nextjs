import Image from "next/image";

export default function Home() {
  return (
    <main className=" max-w-4xl mx-auto border-t-4 border-primary">
      <header className="max-w-7xl my-10 text-center">
        <h1 className=" text-4xl uppercase">Social Downloader</h1>
        <h3 className="text-xl mt-2">
          Download Video from your favorite social media platforms like Youtube,
          Instagram, Twitter, TikTok, Facebook, Snapchat, and more.
        </h3>
      </header>

      <div className="flex">
        <input
          type="text"
          name=""
          id=""
          placeholder="Paste the link here"
          className="border p-3 w-full"
        />

        <button className="bg-primary text-white px-4 py-2">Download</button>
      </div>
    </main>
  );
}
