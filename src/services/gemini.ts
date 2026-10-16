import { GoogleGenAI } from "@google/genai";

export async function scanMeterWithGemini(
  file?: string,
): Promise<number | null> {
  const apiKey = localStorage.getItem("apiKey");
  const model = localStorage.getItem("model");

  if (!apiKey || !model) {
    throw new Error("Chưa cấu hình Gemini API Key trong Cài đặt!");
  }

  const ai = new GoogleGenAI({ apiKey });

  const mimeType = file?.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const data = file?.split(",")[1] || "";

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        inlineData: {
          mimeType: mimeType,
          data: data,
        },
      },
      `Identify and read the utility meter reading (electricity or water meter) in this image.
- Read only the main counter digits representing the current consumption.
- For mechanical meters, read the black integer digits and ignore red decimal digits or sub-dials.
- Ignore serial numbers, model labels, barcodes, or voltage/frequency ratings.
- Return ONLY the numeric digits. Do not include any units (e.g., kWh, m3), words, symbols, markdown formatting, or explanations.`,
    ],
  });

  const cleanText = response.text?.trim().replace(/[^0-9.]/g, "");
  return cleanText ? Number(cleanText) : null;
}
