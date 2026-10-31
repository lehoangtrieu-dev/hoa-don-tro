import { useRef } from "react";
import { Button, Table, TextArea } from "@heroui/react";
import { CircleCheck, CircleCheckFill } from "@gravity-ui/icons";
import { ShareButton } from "./ShareButton";
import { EditModal } from "./EditModal";
import type { RentalData, RoomConfig } from "../type";

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

const formatNumber = (val?: number) =>
  val !== undefined ? val.toLocaleString("vi-VN") : "-";

const formatVND = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface Props {
  month: string;
  data: RentalData;
  house: string;
  room: string;
  updateRoomConfig: (fields: Partial<RoomConfig>) => void;
  updateMonthPaid: (paid: boolean) => void;
}

export const MeterOutput = ({
  month,
  data,
  house,
  room,
  updateRoomConfig,
  updateMonthPaid,
}: Props) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const currentRecord = data[house]?.rooms[room]?.months[month];

  const prevMonth = getPreviousMonth(month);
  const previousRecord = data[house]?.rooms[room]?.months[prevMonth];

  const previousElectricity = previousRecord?.electricity?.value;
  const currentElectricity = currentRecord?.electricity?.value;

  const previousWater = previousRecord?.water?.value;
  const currentWater = currentRecord?.water?.value;

  const electricityUsage = calculateUsage(
    currentElectricity,
    previousElectricity,
  );
  const waterUsage = calculateUsage(currentWater, previousWater);

  const houseConfig = data[house]?.config;
  const roomConfig = data[house]?.rooms[room]?.config;

  const isWaterByPerson = houseConfig?.waterBillingType === "person";
  const peopleCount = roomConfig?.peopleCount ?? 1;

  const electricityRate = houseConfig?.electricityRate ?? 3500;
  const waterRate =
    houseConfig?.waterRate ?? (isWaterByPerson ? 100000 : 28000);

  const roomPrice = roomConfig?.roomPrice ?? houseConfig?.defaultRoomPrice ?? 0;
  const trashFee =
    roomConfig?.trashFee ?? houseConfig?.defaultTrashFee ?? 30000;

  const electricityCost = electricityUsage * electricityRate;
  const waterCost = isWaterByPerson
    ? peopleCount * waterRate
    : waterUsage * waterRate;

  const totalCost = electricityCost + waterCost + roomPrice + trashFee;

  const isPaid = !!currentRecord?.paid;

  return (
    <>
      <Table className="[&_td]:text-2xl [&_th]:text-2xl [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap [&_th]:px-8 [&_td]:px-8">
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
                <Table.Cell>
                  <input
                    defaultValue="Số điện"
                    className="text-2xl field-sizing-content outline-0"
                  />
                </Table.Cell>
                <Table.Cell>{formatNumber(currentElectricity)}</Table.Cell>
                <Table.Cell>{formatNumber(previousElectricity)}</Table.Cell>
                <Table.Cell>{formatNumber(electricityUsage)}</Table.Cell>
                <Table.Cell>{formatVND(electricityCost)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <input
                    defaultValue={isWaterByPerson ? "Tiền nước" : "Số nước"}
                    className="text-2xl field-sizing-content outline-0"
                  />
                </Table.Cell>
                <Table.Cell>
                  {isWaterByPerson ? "-" : formatNumber(currentWater)}
                </Table.Cell>
                <Table.Cell>
                  {isWaterByPerson ? "-" : formatNumber(previousWater)}
                </Table.Cell>
                <Table.Cell>
                  {isWaterByPerson
                    ? `${formatNumber(peopleCount)} người`
                    : formatNumber(waterUsage)}
                </Table.Cell>
                <Table.Cell>{formatVND(waterCost)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <input
                    defaultValue="Tiền rác"
                    className="text-2xl field-sizing-content outline-0"
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{formatVND(trashFee)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <input
                    defaultValue="Tiền phòng"
                    className="text-2xl field-sizing-content outline-0"
                  />
                </Table.Cell>
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
      <TextArea
        aria-label="Ghi chú"
        className="w-full"
        placeholder="Ghi chú"
        value={roomConfig?.note ?? ""}
        onChange={(e) => updateRoomConfig({ note: e.target.value })}
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant={isPaid ? "primary" : "danger-soft"}
          className={
            isPaid
              ? "bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
              : ""
          }
          onPress={() => updateMonthPaid(!isPaid)}
        >
          {isPaid ? <CircleCheckFill /> : <CircleCheck />}
          <span>{isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</span>
        </Button>
        <ShareButton room={room} month={month} exportRef={exportRef} />
        <EditModal
          key={`${room}-${roomConfig?.peopleCount ?? ""}`}
          config={roomConfig}
          houseConfig={houseConfig}
          onSave={updateRoomConfig}
        />
      </div>
    </>
  );
};
