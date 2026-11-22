import type { RentalData } from "../type";

export type PaymentStatus = "paid" | "unfilled" | "unpaid";

export const getRoomStatus = (
  data: RentalData,
  house: string,
  roomName: string,
  month: string,
): PaymentStatus => {
  const houseData = data[house];
  const roomData = houseData?.rooms?.[roomName];
  const monthRecord = roomData?.months?.[month];

  if (monthRecord?.paid) {
    return "paid";
  }

  const isWaterByPerson = houseData?.config?.waterBillingType === "person";
  const hasElectricity = monthRecord?.electricity?.value !== undefined;
  const hasWater = isWaterByPerson || monthRecord?.water?.value !== undefined;

  // Both electricity AND water must be filled for it to turn unpaid (red)
  if (hasElectricity && hasWater) {
    return "unpaid";
  }

  return "unfilled";
};
