import type { ReactNode } from "react";
import { Input } from "@heroui/react";

interface Props {
  icon: ReactNode;
  label: string;
  value?: number;
  placeholder?: string;
  unit: string;
  onChange: (value: string) => void;
}

export const PriceInputItem = ({
  icon,
  label,
  value,
  placeholder,
  unit,
  onChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-3 py-1.5">
      <div className="flex items-center gap-2 text-xs font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          className="w-24 text-right text-xs h-7"
          value={value?.toString() ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="text-[11px] text-muted w-9">{unit}</span>
      </div>
    </div>
  );
};
