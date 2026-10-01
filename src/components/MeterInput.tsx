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
          const raw = e.target.value;
          setValue(raw === "" ? undefined : Number(raw));
        }}
        type="number"
        placeholder="Nhập số"
      />
      <span className="font-light text-4xl"> {unit}</span>
    </div>
  );
};
