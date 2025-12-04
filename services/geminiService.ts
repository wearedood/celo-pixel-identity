import { GoogleGenAI } from "@google/genai";
import { CRYPTO_PERSONAS, PixelArtResult } from '../types';

export const generatePixelArtIdentity = async (): Promise<PixelArtResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Select a random persona
  const randomIndex = Math.floor(Math.random() * CRYPTO_PERSONAS.length);
  const selectedPersona = CRYPTO_PERSONAS[randomIndex];

  // 2. Generate Image
  const prompt = `Generate a high-quality, cute, vibrant 8-bit pixel art icon representing the cryptocurrency "${selectedPersona.name}". 
  The style should be nostalgic, retro video game aesthetic. 
  The image should be centered on a solid dark background. 
  Do not include text in the image. 
  Make it look like a collectible trading card avatar.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    // Extract image
    let imageUrl = '';
    // The response might be complex, we iterate to find the inline data
    if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) {
        throw new Error("No image generated.");
    }

    return {
      cryptoName: selectedPersona.name,
      trait: selectedPersona.trait,
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate pixel art identity.");
  }
};