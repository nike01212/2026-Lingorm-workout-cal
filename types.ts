
export interface ExerciseLog {
  [dateKey: string]: string;
}

export interface DayInfo {
  date: number;
  dayOfWeek: string;
  isWeekend: boolean;
  dateKey: string;
}

export interface MonthData {
  name: string;
  shortName: string;
  days: DayInfo[];
  color: string;
}
