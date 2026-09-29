import { Button, ListBox, Select } from "@heroui/react";
import { Gear } from "@gravity-ui/icons";

export const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <Button variant="outline" isIconOnly>
        <Gear />
      </Button>
      <Select aria-label="Chọn Nhà Trọ" defaultValue="1">
        <Select.Trigger className="shadow-none">
          <strong className="text-base md:text-sm me-2">Nhà trọ:</strong>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="1" textValue="1">
              1
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="2" textValue="2">
              2
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="3" textValue="3">
              3
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};
