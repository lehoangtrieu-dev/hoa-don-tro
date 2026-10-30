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
      `Analyze the provided image of the utility meter and extract the full numeric reading from the primary mechanical counter window according to these strict rules:

      1. Orientation Check: Determine the correct upright orientation of the meter before reading. Meter markings (such as ACTARIS, m³, or bar) and numbers must be right-side up. In the correct upright orientation, the black digits are on the left and the red digits are on the right. If the photo is upside down, tilted, or sideways, adjust the orientation before reading.

      2. Target Counter: Focus exclusively on the rectangular odometer roller window inside the dark frame. Ignore all circular needle dials, multiplier gauges (such as x0.1 or x0.0001), model names, serial numbers, and pressure ratings.

      3. Complete Digit Capture: Read every digit wheel inside the rectangular counter from left to right, clearly distinguishing the black digits on the left from the red digits on the right. Look through reflections, water droplets, condensation, or dirt on the glass. If a roller is caught halfway between two numbers, read the digit that has settled into view.

      4. Decimal Separation and Leading Zero Removal:
      - Separate the black digits (whole units) and the red digits (fractional units) with a dot/decimal point (.) in the format: [black_digits].[red_digits].
      - Remove all leading zeros from the black digits before the decimal point. For example, 0792 with red 19 becomes 792.19; 0665 with red 89 becomes 665.89; 0865 with red 80 becomes 865.80.
      - If all black digits are zeros, retain a single 0 before the decimal point (e.g., 0.59).
      - Do not alter, round, or omit any red digits after the decimal point.

      5. Output Constraint: Return only the final formatted number as plain raw text. Do not include markdown formatting, code blocks, JSON, spaces, units (like m³), or explanatory text.`,
    ],
  });

  const cleanText = response.text?.trim().replace(/[^0-9.]/g, "");
  return cleanText ? Math.trunc(Number(cleanText)) : null;
}
