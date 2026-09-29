import { Input } from "@heroui/react";

interface Props {
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
}

export const MonthPicker = ({ month, setMonth }: Props) => {
  return (
    <Input
      type="month"
      variant="secondary"
      className="rounded-full text-muted font-medium"
      value={month}
      onChange={(e) => setMonth(e.currentTarget.value)}
    />
  );
};
