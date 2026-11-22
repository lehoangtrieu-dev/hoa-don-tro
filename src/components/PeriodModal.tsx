import { useState } from "react";
import {
  Modal,
  Button,
  Label,
  ListBox,
  Select,
  TextField,
  Input,
} from "@heroui/react";
import {
  House,
  Calendar,
  ChevronDown,
  LayoutHeaderCellsLarge,
  TrashBin,
} from "@gravity-ui/icons";
import { ReportModal } from "./ReportModal";
import type { RentalData } from "../type";

interface Props {
  data: RentalData;
  houses: string[];
  house: string;
  setHouse: React.Dispatch<React.SetStateAction<string>>;
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  deleteMonthData: (houseName: string, targetMonth: string) => void;
  triggerClassName?: string;
}

export const PeriodModal = ({
  houses,
  house,
  setHouse,
  month,
  setMonth,
  data,
  deleteMonthData,
  triggerClassName = "rounded-full",
}: Props) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const handleDeleteMonth = () => {
    if (!house || !month) return;
    if (
      confirm(
        `Bạn có chắc muốn xóa toàn bộ dữ liệu tháng ${month} của "${house}" không?`,
      )
    ) {
      deleteMonthData(house, month);
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      setMonth(currentMonth);
      setIsPeriodOpen(false);
    }
  };

  return (
    <>
      <Modal isOpen={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
        <Button
          variant="outline"
          className={triggerClassName}
          onPress={() => setIsPeriodOpen(true)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <House className="size-4 shrink-0" />
            <span className="truncate">
              {house || "Chọn nhà"} • {month}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted" />
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
                  <Label className="flex items-center gap-1.5">
                    <House className="size-4" />
                    Nhà trọ
                  </Label>
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
                <div className="flex items-end gap-1.5 mt-4">
                  <TextField
                    className="w-full"
                    type="month"
                    variant="secondary"
                  >
                    <Label className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      Tháng ghi số
                    </Label>
                    <Input
                      value={month}
                      onChange={(e) => setMonth(e.currentTarget.value)}
                    />
                  </TextField>
                  <Button
                    variant="danger"
                    className="aspect-square"
                    isIconOnly
                    aria-label="Xóa dữ liệu tháng này"
                    isDisabled={!house || !month}
                    onPress={handleDeleteMonth}
                  >
                    <TrashBin />
                  </Button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline"
                  onPress={() => {
                    setIsPeriodOpen(false);
                    setIsReportOpen(true);
                  }}
                >
                  <LayoutHeaderCellsLarge /> Xem báo cáo
                </Button>
                <Button
                  className="w-full"
                  slot="close"
                  onPress={() => setIsPeriodOpen(false)}
                >
                  Xong
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        house={house}
        month={month}
        data={data}
      />
    </>
  );
};
