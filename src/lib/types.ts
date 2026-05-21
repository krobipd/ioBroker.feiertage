export interface AdapterConfig {
  country: string;
  state: string;
  region: string;
  holidayTypes: string[];
  excludeHolidays: string[];
  includeBridgeDays: boolean;
}

export interface DayInfo {
  name: string;
  id: string;
  isHoliday: boolean;
  region: string;
  type: string;
}

export interface NextHoliday extends DayInfo {
  date: string;
  duration: number;
}

export interface ComputedHolidays {
  yesterday: DayInfo;
  today: DayInfo;
  tomorrow: DayInfo;
  dayAfterTomorrow: DayInfo;
  next: NextHoliday;
}
