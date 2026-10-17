import { Input } from "@heroui/react";

interface Props {
  value?: number;
  setValue: (val?: number) => void;
  unit: string;
}

export const MeterInput = ({ value, setValue, unit }: Props) => {
  return (
    <div className="mt-8">
      <Input
        className="field-sizing-content font-black text-4xl"
        value={value !== undefined ? String(value) : ""}
        onChange={(e) => {
          const text = e.target.value;
          if (text === "") {
            setValue(undefined);
            return;
          }
          const raw = Number(text);
          if (!isNaN(raw) && raw >= 0 && raw < 100000) {
            setValue(raw);
          }
        }}
        type="number"
        placeholder="Nhập số"
      />
      <span className="font-light text-4xl"> {unit}</span>
    </div>
  );
};
