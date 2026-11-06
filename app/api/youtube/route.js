import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { YoutubeTranscript } from "youtube-transcript";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function extractVideoId(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "URL YouTube invalide" },
        { status: 400 },
      );
    }

    let transcriptText = "";
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcriptData.map((item) => item.text).join(" ");
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Impossible de récupérer les sous-titres de cette vidéo (elle n'en a peut-être pas ou ils sont désactivés).",
        },
        { status: 400 },
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          text: `Voici la transcription d'une vidéo YouTube. Analyse-la et donne-moi un résumé structuré et percutant avec :
          1. Le sujet principal de la vidéo.
          2. Les informations les plus importante de la vidéo.
          3. Un ton clair et jeune.

          Transcription :
          ${transcriptText}`,
        },
      ],
    });

    const summary = response.text;
    return NextResponse.json({
      success: true,
      message: summary,
    });
  } catch (error) {
    console.error("ERREUR DETAILLEE :", error);
    return NextResponse.json({
      success: false,
      status: 500,
      error: error.message || "Erreur lors de l'analyse vidéo.",
    });
  }
}
