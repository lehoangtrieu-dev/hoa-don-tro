import type { ReactNode } from "react";
import { Input } from "@heroui/react";

interface Props {
  icon: ReactNode;
  label: string;
  value?: number;
  placeholder?: string;
  unit: ReactNode;
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
    <div className="flex items-center justify-between pl-3 py-1.5">
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
        <span className="text-[11px] text-muted min-w-14 w-fit whitespace-nowrap">
          {unit}
        </span>
      </div>
    </div>
  );
};
