
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseChargingImage = async (base64Image: string) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this image of an EV charging screen or receipt. 
    Extract the following data points precisely. If a value is missing, return 0 or null.
    - Energy charged (in kWh)
    - Charging duration (in minutes, convert hours to minutes if necessary)
    - Total cost (numeric)
    - Current balance (remaining account balance, numeric)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            energyKwh: { type: Type.NUMBER, description: "Energy in kWh" },
            durationMinutes: { type: Type.NUMBER, description: "Duration in minutes" },
            cost: { type: Type.NUMBER, description: "Cost amount" },
            balance: { type: Type.NUMBER, description: "Account balance" },
          },
          required: ["energyKwh", "durationMinutes", "cost"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw error;
  }
};
