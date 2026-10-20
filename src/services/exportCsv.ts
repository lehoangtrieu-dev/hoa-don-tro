import type { RentalData } from "../type";

const getPreviousMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-").map(Number);
  const prevDate = new Date(year, month - 2, 1);
  const yyyy = prevDate.getFullYear();
  const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

export const exportHouseBillingCSV = (
  house: string,
  month: string,
  data: RentalData,
) => {
  const houseData = data[house];
  if (!houseData) return;

  const houseConfig = houseData.config;
  const isWaterByPerson = houseConfig?.waterBillingType === "person";
  const electricityRate = houseConfig?.electricityRate ?? 3500;
  const waterRate =
    houseConfig?.waterRate ?? (isWaterByPerson ? 100000 : 28000);
  const defaultTrash = houseConfig?.defaultTrashFee ?? 30000;
  const defaultRoomPrice = houseConfig?.defaultRoomPrice ?? 0;

  const prevMonth = getPreviousMonth(month);

  const roomList = houseData.roomOrder ?? Object.keys(houseData.rooms || {});

  const headers = [
    "Tên phòng",
    "Tiền phòng",
    "Điện Mới",
    "Điện Cũ",
    "Điện sử dụng",
    "Tiền điện",
    "Nước Mới",
    "Nước Cũ",
    isWaterByPerson ? "Số người" : "Nước sd",
    "Tiền nước",
    "Tiền rác",
    "Tổng Tiền",
  ];

  let totalRevenue = 0;
  let totalElecUsage = 0;
  let totalElecCost = 0;
  let totalWaterUsage = 0;
  let totalWaterCost = 0;
  let totalTrashCost = 0;
  let totalRoomPrice = 0;

  const rows = roomList.map((room) => {
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

    return [
      `"${room}"`,
      roomPrice,
      elecNew ?? "",
      elecOld ?? "",
      elecUsage,
      elecCost,
      isWaterByPerson ? "" : (waterNew ?? ""),
      isWaterByPerson ? "" : (waterOld ?? ""),
      isWaterByPerson ? `${peopleCount} ng` : waterUsage,
      waterCost,
      trashCost,
      total,
    ].join(",");
  });

  const summaryRow = [
    '"TỔNG CỘNG"',
    totalRoomPrice,
    '""',
    '""',
    totalElecUsage,
    totalElecCost,
    '""',
    '""',
    isWaterByPerson ? '""' : totalWaterUsage,
    totalWaterCost,
    totalTrashCost,
    totalRevenue,
  ].join(",");

  const csvContent = [headers.join(","), ...rows, summaryRow].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `HoaDonTro-${house}-${month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
