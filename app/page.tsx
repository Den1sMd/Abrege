"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const handleAbreger = async () => {
    if (!url || loading) return;

    setLoading(true);
    setText("");

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.success) {
        setText(data.message);
      } else {
        setText("Erreur : " + (data.error || "Une erreur est survenue."));
      }
    } catch (error) {
      setText("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-4 py-12 select-none overflow-x-hidden">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <h1 className="text-6xl sm:text-8xl md:text-[160px] font-black tracking-widest h-50 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-gray-300 to-slate-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] text-center leading-none">
          Abrege
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-3 tracking-wide">
          Résume n'importe quelle vidéo YouTube en un clin d'œil.
        </p>

        <div className="w-full max-w-xl relative flex items-center mt-10">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAbreger()}
            className="w-full h-14 rounded-full pl-6 pr-32 text-white bg-gray-950/80 border border-gray-700 focus:outline-none focus:border-slate-300 transition-all placeholder:text-gray-600 text-sm sm:text-base shadow-inner"
            placeholder="https://www.youtube.com/watch?v=..."
            type="text"
          />
          <button
            onClick={handleAbreger}
            disabled={loading}
            className="absolute right-1.5 font-medium text-sm cursor-pointer bg-slate-200 hover:bg-white text-black px-5 h-11 rounded-full transition-all duration-200 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-1 h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyse...
              </span>
            ) : (
              "Abréger"
            )}
          </button>
        </div>

        {text && (
          <div className="w-full max-w-2xl mt-10 p-6 sm:p-8 bg-gray-900/60 border border-gray-800 rounded-3xl shadow-2xl backdrop-blur-md animate-fadeIn">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              Résumé de la vidéo
            </h3>
            <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {text}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
