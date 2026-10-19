import { GoogleGenAI } from "@google/genai";

async function urlToBase64(
  url: string,
): Promise<{ mimeType: string; data: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || "image/jpeg";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1] || "";
      resolve({ mimeType, data: base64String });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function scanMeterWithGemini(
  file?: string,
): Promise<number | null> {
  const apiKey = localStorage.getItem("apiKey");
  const model = localStorage.getItem("model");

  if (!apiKey || !model) {
    throw new Error("Chưa cấu hình Gemini API Key trong Cài đặt!");
  }

  if (!file) {
    throw new Error("Không có ảnh để nhận diện!");
  }

  const ai = new GoogleGenAI({ apiKey });

  let mimeType = "image/jpeg";
  let data = "";

  if (file.startsWith("data:")) {
    mimeType = file.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
    data = file.split(",")[1] || "";
  } else if (file.startsWith("http://") || file.startsWith("https://")) {
    const fetched = await urlToBase64(file);
    mimeType = fetched.mimeType;
    data = fetched.data;
  }

  if (!data) {
    throw new Error("Dữ liệu ảnh không hợp lệ. Vui lòng chụp lại ảnh.");
  }

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
