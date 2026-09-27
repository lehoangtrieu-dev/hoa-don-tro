import { Input } from "@heroui/react";

interface Props {
  unit: string;
}

export const MeterInput = ({ unit }: Props) => {
  return (
    <div>
      <Input
        className="field-sizing-content font-black text-4xl"
        type="number"
        placeholder="Nhập số"
      />
      <span className="font-light text-4xl"> {unit}</span>
    </div>
  );
};
