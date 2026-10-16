import { useEffect, useState } from "react";
import { CircleExclamation } from "@gravity-ui/icons";
import { Select, ListBox, Label, Description } from "@heroui/react";
import { GoogleGenAI } from "@google/genai";

interface GeminiModel {
  name: string;
  description?: string;
  supportedGenerationMethods?: string[];
}

interface Props {
  apiKey: string;
}

export const ModelSelector = ({ apiKey }: Props) => {
  const [models, setModels] = useState<GeminiModel[]>([]);
  const [model, setModel] = useState(() => {
    const savedModel = localStorage.getItem("model");
    return savedModel ? savedModel : "";
  });

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!apiKey.trim()) {
          throw new Error("Vui lòng cấu hình API Key");
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.list();
        const list: GeminiModel[] = [];

        for await (const m of response) {
          list.push(m as unknown as GeminiModel);
        }

        const geminiModels = list.filter(
          (m) => m.name.includes("gemma") || m.name.includes("gemini"),
        );

        setModels(geminiModels.length > 0 ? geminiModels : list);
      } catch (err) {
        if (err instanceof Error) {
          const msg =
            err.message?.match(/"message":\s*"([^"]+)"/)?.[1] || err.message;
          setError(msg || "Đã xảy ra lỗi khi tải danh sách model.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [apiKey]);

  if (loading) {
    return (
      <Select isDisabled placeholder="Đang tải danh sách model...">
        <Label>Model:</Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
      </Select>
    );
  }

  if (error)
    return (
      <div className="text-danger flex items-center gap-2">
        <CircleExclamation />
        {error}
      </div>
    );

  if (models.length === 0) return null;

  return (
    <Select
      value={model}
      onChange={(key) => {
        if (key) setModel(String(key));
      }}
    >
      <Label>Model:</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Description />
      <Select.Popover>
        <ListBox>
          {models.map((model) => (
            <ListBox.Item
              id={model.name}
              key={model.name}
              textValue={model.name}
            >
              {model.name.replace("models/", "")}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
