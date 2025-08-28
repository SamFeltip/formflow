import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatTimelineItemDate(startDate: {
  amount: number;
  unit: "years" | "months" | "weeks" | "days";
}): string {
  return `${startDate.amount} ${startDate.unit}${
    startDate.amount !== 1 ? "s" : ""
  } after start`;
}
