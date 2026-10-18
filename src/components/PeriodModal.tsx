import {
  Modal,
  Button,
  Label,
  ListBox,
  Select,
  TextField,
  Input,
} from "@heroui/react";
import { House, ChevronDown } from "@gravity-ui/icons";

interface Props {
  houses: string[];
  house: string;
  setHouse: React.Dispatch<React.SetStateAction<string>>;
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
}

export const PeriodModal = ({
  houses,
  house,
  setHouse,
  month,
  setMonth,
}: Props) => {
  return (
    <Modal>
      <Button variant="outline" className="rounded-full">
        <House className="size-4" />
        <span>
          {house || "Chọn nhà"} • {month}
        </span>
        <ChevronDown className="size-4 text-muted" />
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header className="flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <House className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Chọn nhà & tháng</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Select
                className="mt-2"
                variant="secondary"
                aria-label="Chọn Nhà Trọ"
                placeholder="—"
                value={house}
                onChange={(key) => {
                  if (key) setHouse(String(key));
                }}
              >
                <Label>Nhà trọ</Label>
                <Select.Trigger>
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
              <TextField
                className="w-full mt-4"
                type="month"
                variant="secondary"
              >
                <Label>Tháng ghi số</Label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.currentTarget.value)}
                />
              </TextField>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" slot="close">
                Xong
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
