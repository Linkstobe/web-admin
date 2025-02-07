import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const catchError = async <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
};

export const formatDateToSequelize = (date: Date) => {
  return date.toISOString().split("T").join(" ").split(".")[0];
};
