import type { RentalData } from "../type";

export interface BillingRow {
  room: string;
  roomPrice: number;
  elecNew?: number;
  elecOld?: number;
  elecUsage: number;
  elecCost: number;
  waterNew?: number;
  waterOld?: number;
  waterUsage: number;
  peopleCount: number;
  waterCost: number;
  trashCost: number;
  total: number;
}

export interface HouseBillingReport {
  house: string;
  month: string;
  isWaterByPerson: boolean;
  rows: BillingRow[];
  totalRoomPrice: number;
  totalElecUsage: number;
  totalElecCost: number;
  totalWaterUsage: number;
  totalWaterCost: number;
  totalTrashCost: number;
  totalRevenue: number;
}

const getPreviousMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-").map(Number);
  const prevDate = new Date(year, month - 2, 1);
  const yyyy = prevDate.getFullYear();
  const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

export const generateHouseBillingReport = (
  house: string,
  month: string,
  data: RentalData,
): HouseBillingReport | null => {
  const houseData = data[house];
  if (!houseData) return null;

  const houseConfig = houseData.config;
  const isWaterByPerson = houseConfig?.waterBillingType === "person";
  const electricityRate = houseConfig?.electricityRate ?? 3500;
  const waterRate =
    houseConfig?.waterRate ?? (isWaterByPerson ? 100000 : 28000);
  const defaultTrash = houseConfig?.defaultTrashFee ?? 30000;
  const defaultRoomPrice = houseConfig?.defaultRoomPrice ?? 0;

  const prevMonth = getPreviousMonth(month);
  const roomList = houseData.roomOrder ?? Object.keys(houseData.rooms || {});

  let totalRevenue = 0;
  let totalElecUsage = 0;
  let totalElecCost = 0;
  let totalWaterUsage = 0;
  let totalWaterCost = 0;
  let totalTrashCost = 0;
  let totalRoomPrice = 0;

  const rows: BillingRow[] = roomList.map((room) => {
    const roomData = houseData.rooms[room];
    const roomConfig = roomData?.config;

    const currentRecord = roomData?.months[month];
    const previousRecord = roomData?.months[prevMonth];

    const elecNew = currentRecord?.electricity?.value;
    const elecOld = previousRecord?.electricity?.value;
    const elecUsage =
      elecNew !== undefined && elecOld !== undefined
        ? Math.max(0, elecNew - elecOld)
        : 0;
    const elecCost = elecUsage * electricityRate;

    const waterNew = currentRecord?.water?.value;
    const waterOld = previousRecord?.water?.value;
    const waterUsage =
      waterNew !== undefined && waterOld !== undefined
        ? Math.max(0, waterNew - waterOld)
        : 0;

    const peopleCount = roomConfig?.peopleCount ?? 1;
    const waterCost = isWaterByPerson
      ? peopleCount * waterRate
      : waterUsage * waterRate;

    const roomPrice = roomConfig?.roomPrice ?? defaultRoomPrice;
    const trashCost = roomConfig?.trashFee ?? defaultTrash;
    const total = roomPrice + elecCost + waterCost + trashCost;

    totalRevenue += total;
    totalElecUsage += elecUsage;
    totalElecCost += elecCost;
    if (!isWaterByPerson) {
      totalWaterUsage += waterUsage;
    }
    totalWaterCost += waterCost;
    totalTrashCost += trashCost;
    totalRoomPrice += roomPrice;

    return {
      room,
      roomPrice,
      elecNew,
      elecOld,
      elecUsage,
      elecCost,
      waterNew,
      waterOld,
      waterUsage,
      peopleCount,
      waterCost,
      trashCost,
      total,
    };
  });

  return {
    house,
    month,
    isWaterByPerson,
    rows,
    totalRoomPrice,
    totalElecUsage,
    totalElecCost,
    totalWaterUsage,
    totalWaterCost,
    totalTrashCost,
    totalRevenue,
  };
};

export const downloadBillingReportCSV = (report: HouseBillingReport) => {
  const headers = [
    "Tên phòng",
    "Tiền phòng",
    "Điện Mới",
    "Điện Cũ",
    "Điện sử dụng",
    "Tiền điện",
    "Nước Mới",
    "Nước Cũ",
    report.isWaterByPerson ? "Số người" : "Nước sd",
    "Tiền nước",
    "Tiền rác",
    "Tổng Tiền",
  ];

  const rows = report.rows.map((row) =>
    [
      `"${row.room.replace(/"/g, '""')}"`,
      row.roomPrice,
      row.elecNew ?? "",
      row.elecOld ?? "",
      row.elecUsage,
      row.elecCost,
      report.isWaterByPerson ? "" : (row.waterNew ?? ""),
      report.isWaterByPerson ? "" : (row.waterOld ?? ""),
      report.isWaterByPerson ? `${row.peopleCount} ng` : row.waterUsage,
      row.waterCost,
      row.trashCost,
      row.total,
    ].join(","),
  );

  const summaryRow = [
    '"TỔNG CỘNG"',
    report.totalRoomPrice,
    '""',
    '""',
    report.totalElecUsage,
    report.totalElecCost,
    '""',
    '""',
    report.isWaterByPerson ? '""' : report.totalWaterUsage,
    report.totalWaterCost,
    report.totalTrashCost,
    report.totalRevenue,
  ].join(",");

  const csvContent = [headers.join(","), ...rows, summaryRow].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `HoaDonTro-${report.house}-${report.month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportHouseBillingCSV = (
  house: string,
  month: string,
  data: RentalData,
) => {
  const report = generateHouseBillingReport(house, month, data);
  if (report) {
    downloadBillingReportCSV(report);
  }
};
