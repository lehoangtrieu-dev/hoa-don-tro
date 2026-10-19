export type UtilityType = "electricity" | "water" | "bill";

export type RentalData = Record<
  string, // Tên nhà
  {
    config?: HouseConfig;
    roomOrder?: string[];
    rooms: Record<string, RoomData>;
  }
>;

export interface HouseConfig {
  defaultRoomPrice?: number;
  defaultTrashFee?: number;
  electricityRate?: number;
  waterRate?: number;
}

export interface RoomConfig {
  roomPrice?: number;
  trashFee?: number;
}

export interface RoomData {
  config?: RoomConfig;
  months: Record<string, MonthRecord>; // Tháng -> { electricity, water }
}

export interface MonthRecord {
  electricity?: UtilityRecord;
  water?: UtilityRecord;
}

export interface UtilityRecord {
  value?: number;
  image?: string;
}
