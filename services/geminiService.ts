import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SongGenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const songSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    songs: {
      type: Type.ARRAY,
      description: "A list of exactly 10 generated songs.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The creative title of the song."
          },
          stylePrompt: {
            type: Type.STRING,
            description: "A specific, comma-separated style prompt optimized for Suno AI (e.g., 'Dark Techno, 140bpm, Male Vocals')."
          },
          lyrics: {
            type: Type.STRING,
            description: "The full lyrics of the song, structured with [Verse], [Chorus], [Bridge], [Outro] tags."
          }
        },
        required: ["title", "stylePrompt", "lyrics"]
      }
    }
  },
  required: ["songs"]
};

export const generateSongs = async (
  topic: string,
  rhythm: string
): Promise<SongGenerationResponse> => {
  try {
    const userPrompt = `
      Act as a world-class Suno AI Architect. I need 10 distinct songs based on these parameters:
      
      CORE THEME (What is it about): "${topic}"
      RHYTHM/STYLE TARGET: "${rhythm}"

      For each of the 10 songs, provide:
      1. A Creative Title.
      2. High-Quality Lyrics: formatted strictly for Suno AI with tags like [Verse 1], [Chorus], [Bridge], [Outro]. Ensure good rhyme schemes and flow.
      3. A Suno Style Prompt: Based on the user's rhythm request, create a highly optimized string of keywords (Genre, Vibe, Instruments, BPM, Vocal Type) that yields the best results.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: "You are an expert music producer specializing in Generative Audio (Suno AI). Your output must be production-ready. Avoid generic lyrics. Focus on structure, metatags, and precise style definitions.",
        responseMimeType: "application/json",
        responseSchema: songSchema,
        temperature: 0.85, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const parsedData = JSON.parse(jsonText) as SongGenerationResponse;
    return parsedData;

  } catch (error) {
    console.error("Error generating songs:", error);
    throw error;
  }
};