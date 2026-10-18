export type UtilityType = "electricity" | "water" | "bill";

export type RentalData = Record<
  string, // Tên nhà
  Record<
    string, // Tên phòng
    Record<string, MonthRecord> // Tháng -> { electricity, water }
  >
>;

export interface MonthRecord {
  electricity?: UtilityRecord;
  water?: UtilityRecord;
}

export interface UtilityRecord {
  value?: number;
  image?: string;
}
