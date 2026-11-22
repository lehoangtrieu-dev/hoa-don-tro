import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { LayoutHeaderCellsLarge } from "@gravity-ui/icons";
import { PeriodModal } from "./PeriodModal";
import { ReportModal } from "./ReportModal";
import { getRoomStatus, type PaymentStatus } from "../utils/roomStatus";
import { generateHouseBillingReport } from "../services/exportCsv";
import type { RentalData } from "../type";

interface Props {
  data: RentalData;
  houses: string[];
  house: string;
  setHouse: React.Dispatch<React.SetStateAction<string>>;
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  deleteMonthData: (houseName: string, targetMonth: string) => void;
  rooms: string[];
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

const formatVND = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const getStatusDotClass = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "bg-success";
    case "unpaid":
      return "bg-danger";
    case "unfilled":
    default:
      return "bg-muted/40";
  }
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return {
        label: "Đã thu",
        className: "bg-success-soft text-success-soft-foreground",
      };
    case "unpaid":
      return {
        label: "Chưa thu",
        className: "bg-danger-soft text-danger-soft-foreground",
      };
    case "unfilled":
    default:
      return {
        label: "Chưa ghi",
        className: "bg-default text-muted",
      };
  }
};

export const DesktopSidebar = ({
  data,
  houses,
  house,
  setHouse,
  month,
  setMonth,
  deleteMonthData,
  rooms,
  room,
  setRoom,
}: Props) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const summary = useMemo(() => {
    if (!house || rooms.length === 0) return null;

    const report = generateHouseBillingReport(house, month, data);
    let paidCount = 0;
    let paidRevenue = 0;

    if (report) {
      for (const row of report.rows) {
        if (data[house]?.rooms?.[row.room]?.months?.[month]?.paid) {
          paidCount += 1;
          paidRevenue += row.total;
        }
      }
    }

    return {
      paidCount,
      totalRooms: rooms.length,
      paidRevenue,
      totalRevenue: report?.totalRevenue ?? 0,
    };
  }, [data, house, month, rooms]);

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 xl:w-80 shrink-0 h-screen sticky top-0 border-r border-border/60 bg-surface/40">
      <div className="p-4 border-b border-border/60 flex flex-col gap-3">
        <PeriodModal
          data={data}
          houses={houses}
          house={house}
          setHouse={setHouse}
          month={month}
          setMonth={setMonth}
          deleteMonthData={deleteMonthData}
          triggerClassName="w-full justify-between rounded-xl"
        />

        {summary && (
          <div className="rounded-xl bg-default/50 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Tiến độ thu tiền</span>
              <span className="font-semibold">
                {summary.paidCount}/{summary.totalRooms} phòng
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-default overflow-hidden">
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{
                  width: `${
                    summary.totalRooms > 0
                      ? (summary.paidCount / summary.totalRooms) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-muted">Đã thu</span>
              <span className="font-semibold text-success-soft-foreground">
                {formatVND(summary.paidRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Tổng dự kiến</span>
              <span className="font-semibold">
                {formatVND(summary.totalRevenue)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Danh sách phòng ({rooms.length})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {rooms.length > 0 ? (
          <div className="flex flex-col">
            {rooms.map((roomName) => {
              const status = getRoomStatus(data, house, roomName, month);
              const badge = getStatusBadge(status);
              const isSelected = roomName === room;

              return (
                <button
                  key={roomName}
                  type="button"
                  onClick={() => setRoom(roomName)}
                  className={`w-full flex items-center justify-between gap-2 mt-1 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-default ring-1 ring-accent font-semibold"
                      : "hover:bg-default/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`size-2 rounded-full shrink-0 ${getStatusDotClass(status)}`}
                    />
                    <span className="truncate text-sm">{roomName}</span>
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted text-xs">
            Chưa có phòng trọ nào
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border/60">
        <Button
          variant="outline"
          className="w-full"
          isDisabled={!house || rooms.length === 0}
          onPress={() => setIsReportOpen(true)}
        >
          <LayoutHeaderCellsLarge />
          Xem báo cáo
        </Button>
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        house={house}
        month={month}
        data={data}
      />
    </aside>
  );
};
