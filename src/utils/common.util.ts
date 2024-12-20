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

export function processCollectionChanges<T>(
  oldItems: T[],
  inputItems: string[],
  nameKey: keyof T,
  idKey: keyof T,
) {
  const oldItemNames = oldItems.map(item => String(item[nameKey]).toLowerCase());
  const inputItemNames = inputItems.map(name => name.toLowerCase());

  const newItems = inputItems.filter(name => !oldItemNames.includes(name.toLowerCase()));
  const removedItemIds = oldItems
    .filter(item => !inputItemNames.includes(String(item[nameKey]).toLowerCase()))
    .map(item => item[idKey]);

  const updatedItemIds = oldItems
    .filter(item => !removedItemIds.includes(item[idKey]))
    .map(item => item[idKey]);

  return { newItems, removedItemIds, updatedItemIds };
}
