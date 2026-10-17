import { useRef } from "react";
import { Table } from "@heroui/react";
import { ShareButton } from "./ShareButton";
import { EditModal } from "./EditModal";
import type { RentalData } from "../type";

const getPreviousMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-").map(Number);
  const prevDate = new Date(year, month - 2, 1);
  const yyyy = prevDate.getFullYear();
  const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

const calculateUsage = (currentValue?: number, previousValue?: number) => {
  return currentValue !== undefined && previousValue !== undefined
    ? currentValue - previousValue
    : 0;
};

const formatVND = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface Props {
  month: string;
  data: RentalData;
  house: string;
  room: string;
}

export const MeterOutput = ({ month, data, house, room }: Props) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const currentRecord = data[house]?.[room]?.[month];

  const prevMonth = getPreviousMonth(month);
  const previousRecord = data[house]?.[room]?.[prevMonth];

  const previousElectricity = previousRecord?.electricity?.value;
  const currentElectricity = currentRecord?.electricity?.value;

  const previousWater = previousRecord?.water?.value;
  const currentWater = currentRecord?.water?.value;

  const electricityUsage = calculateUsage(
    currentElectricity,
    previousElectricity,
  );
  const waterUsage = calculateUsage(currentWater, previousWater);

  const electricityRate = 3500;
  const waterRate = 28000;
  const trashFee = 30000;
  const roomPrice = 2000000;

  const electricityCost = electricityUsage * electricityRate;
  const waterCost = waterUsage * waterRate;

  const totalCost = electricityCost + waterCost + roomPrice + trashFee;

  return (
    <>
      <Table>
        <Table.ScrollContainer ref={exportRef}>
          <Table.Content aria-label={room} className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader>
                {room} / {month}
              </Table.Column>
              <Table.Column>Mới</Table.Column>
              <Table.Column>Cũ</Table.Column>
              <Table.Column>Sử dụng</Table.Column>
              <Table.Column>Thành tiền</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Số điện</Table.Cell>
                <Table.Cell>{currentElectricity ?? "-"}</Table.Cell>
                <Table.Cell>{previousElectricity ?? "-"}</Table.Cell>
                <Table.Cell>{electricityUsage}</Table.Cell>
                <Table.Cell>{formatVND(electricityCost)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Số nước</Table.Cell>
                <Table.Cell>{currentWater ?? "-"}</Table.Cell>
                <Table.Cell>{previousWater ?? "-"}</Table.Cell>
                <Table.Cell>{waterUsage}</Table.Cell>
                <Table.Cell>{formatVND(waterCost)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Tiền rác</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{formatVND(trashFee)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Tiền phòng</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{formatVND(roomPrice)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-bold">Tổng cộng</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="font-bold text-primary">
                  {formatVND(totalCost)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <div className="flex gap-2">
        <ShareButton room={room} month={month} exportRef={exportRef} />
        <EditModal />
      </div>
    </>
  );
};
