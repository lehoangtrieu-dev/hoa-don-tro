import { Table } from "@heroui/react";
import type { RentalData } from "../type";

const getPreviousMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-").map(Number);
  const prevDate = new Date(year, month - 2, 1);
  const yyyy = prevDate.getFullYear();
  const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

const getConsumption = (currentValue?: number, previousValue?: number) => {
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
  const currentRecord = data[house]?.[room]?.[month];

  const prevMonth = getPreviousMonth(month);
  const previousRecord = data[house]?.[room]?.[prevMonth];

  const previousDien = previousRecord?.dien?.value;
  const currentDien = currentRecord?.dien?.value;

  const previousNuoc = previousRecord?.nuoc?.value;
  const currentNuoc = currentRecord?.nuoc?.value;

  const consumptionDien = getConsumption(currentDien, previousDien);
  const consumptionNuoc = getConsumption(currentNuoc, previousNuoc);

  const pricePerKwh = 3500;
  const pricePerM3 = 28000;

  const dienPrice = consumptionDien * pricePerKwh;
  const nuocPrice = consumptionNuoc * pricePerM3;
  const servicePrice = 30000;
  const roomPrice = 2000000;

  const totalPrice = nuocPrice + dienPrice + roomPrice + servicePrice;

  return (
    <Table className="mt-8">
      <Table.ScrollContainer>
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
              <Table.Cell>Số Điện</Table.Cell>
              <Table.Cell>{currentDien ?? "-"}</Table.Cell>
              <Table.Cell>{previousDien ?? "-"}</Table.Cell>
              <Table.Cell>{consumptionDien}</Table.Cell>
              <Table.Cell>{formatVND(dienPrice)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Số Nước</Table.Cell>
              <Table.Cell>{currentNuoc ?? "-"}</Table.Cell>
              <Table.Cell>{previousNuoc ?? "-"}</Table.Cell>
              <Table.Cell>{consumptionNuoc}</Table.Cell>
              <Table.Cell>{formatVND(nuocPrice)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Rác / Dịch vụ</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>{formatVND(servicePrice)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Tiền phòng</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>{formatVND(roomPrice)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Tổng cộng</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>{formatVND(totalPrice)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
