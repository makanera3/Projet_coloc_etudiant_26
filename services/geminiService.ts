
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Annonce } from "../types";

// Fix: Initializing with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdDescription = async (details: Partial<Annonce>): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure your environment.";

  try {
    const prompt = `
      Write a compelling and attractive real estate ad description (max 150 words) in French based on these details:
      
      Type: ${details.typeBien}
      City: ${details.ville}
      Surface: ${details.surface} m2
      Rooms: ${details.pieces}
      Furnished: ${details.meuble ? 'Yes' : 'No'}
      Heating: ${details.chauffage} (${details.sourceEnergie})
      DPE Rating: ${details.dpeLettre}
      Rent: ${details.loyerBase}€ + ${details.charges}€ charges
      Availability: ${details.dateDisponibilite}
      
      Focus on the lifestyle, the benefits of the energy rating if good, and the convenience.
    `;

    // Fix: Updated model to gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Using response.text property (not a method)
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "An error occurred while generating the description.";
  }
};

export const calculateMatchScore = async (adDescription: string, userProfile: UserProfile): Promise<{ score: number, reason: string }> => {
    if (!process.env.API_KEY) return { score: 0, reason: "Clé API manquante." };

    try {
        const prompt = `
            Act as a roommate matchmaker. Compare the following ad description with the user profile.
            
            Ad Description: "${adDescription}"
            
            User Profile:
            - Budget: ${userProfile.budget}€
            - Smoker: ${userProfile.isSmoker ? 'Yes' : 'No'}
            - Pets: ${userProfile.hasPets ? 'Yes' : 'No'}
            - Cleanliness: ${userProfile.cleanliness}
            - Social Vibe: ${userProfile.socialVibe}
            - Bio: "${userProfile.bio}"

            Return a JSON object with:
            1. "score": a number between 0 and 100 representing compatibility.
            2. "reason": a concise sentence explaining why (in French).
            
            Example: {"score": 85, "reason": "Le budget correspond et l'ambiance calme convient à votre profil."}
            Only return the JSON.
        `;

        // Fix: Updated model to gemini-3-flash-preview
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        // Fix: Using response.text property (not a method)
        const text = response.text;
        if (!text) return { score: 0, reason: "Erreur d'analyse." };
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Match error", error);
        return { score: 0, reason: "Impossible de calculer la compatibilité." };
    }
}
