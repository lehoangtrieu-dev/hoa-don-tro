import { ListBox, Select } from "@heroui/react";
import { SettingsModal } from "./settings/SettingsModal";
import { type RentalData } from "../type";

interface Props {
  data: RentalData;
  setData: React.Dispatch<React.SetStateAction<RentalData>>;
  houses: string[];
  house: string;
  setHouse: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar = ({ data, setData, houses, house, setHouse }: Props) => {
  return (
    <div className="w-full flex justify-between items-center">
      <SettingsModal data={data} setData={setData} houses={houses} />
      <Select
        aria-label="Chọn Nhà Trọ"
        placeholder="—"
        value={house}
        onChange={(key) => {
          if (key) setHouse(String(key));
        }}
      >
        <Select.Trigger className="shadow-none">
          <strong className="text-base md:text-sm me-2">Nhà trọ:</strong>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {houses.map((value) => (
              <ListBox.Item id={value} key={value} textValue={value}>
                {value}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};
