import { eachDayOfInterval, isSameDay } from "date-fns";

export const convertToTitleCase = (str: string) => {
  return str
    .replace("-", " ")
    .split(" ")
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

export const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

export const fillMissingDays = (
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date,
) => {
  if (activeDays.length === 0) return [];

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map(day => {
    const found = activeDays.find(d => isSameDay(d.date, day));

    if (found) return found;

    return {
      date: day,
      income: 0,
      expenses: 0,
    };
  });

  return transactionsByDay;
};

export function aggregateCounts<T>(items: T[]): { item: T; count: number }[] {
  const countMap = items.reduce((map, item) => {
    const key = JSON.stringify(item);

    const currentCount = map.get(key) || 0;

    map.set(key, currentCount + 1);

    return map;
  }, new Map<string, number>());

  return Array.from(countMap.entries()).map(([id, count]) => ({ item: JSON.parse(id), count }));
}
