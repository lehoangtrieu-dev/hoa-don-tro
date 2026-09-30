export type RentalData = Record<
  string, // Tên nhà
  Record<
    string, // Tên phòng
    Record<string, MonthRecord> // Tháng -> { dien, nuoc }
  >
>;

export interface MonthRecord {
  dien: UtilityRecord;
  nuoc: UtilityRecord;
}

export interface UtilityRecord {
  value?: number;
  image?: string;
}
