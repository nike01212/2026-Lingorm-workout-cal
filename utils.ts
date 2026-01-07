
import { DayInfo, MonthData } from './types';
import { MONTH_COLORS, MONTH_NAMES, WEEK_DAYS_CHINESE } from './constants';

export const generateCalendar2026 = (): MonthData[] => {
  const calendar: MonthData[] = [];
  const year = 2026;

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: DayInfo[] = [];

    for (let date = 1; date <= daysInMonth; date++) {
      const dateObj = new Date(year, month, date);
      const dayIndex = dateObj.getDay();
      const dayOfWeek = WEEK_DAYS_CHINESE[dayIndex];
      const isWeekend = dayIndex === 0 || dayIndex === 6;
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

      days.push({
        date,
        dayOfWeek,
        isWeekend,
        dateKey
      });
    }

    calendar.push({
      name: MONTH_NAMES[month],
      shortName: MONTH_NAMES[month],
      days,
      color: MONTH_COLORS[month]
    });
  }

  return calendar;
};

export const downloadAsJSON = (data: any, fileName: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
