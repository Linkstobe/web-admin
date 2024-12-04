import { cookies } from "next/headers";

export function getCookie (cookieName: string) {
  const cookieStore = cookies();
  const cookie = cookieStore.get(cookieName)?.value;

  if (!cookie) {
    throw new Error(`${cookieName} "${cookieName}" not found in cookies`);
  }

  return cookie;
}