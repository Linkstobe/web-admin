import { StorageHelper } from "@/helpers/storage-helper";
import { usePermission } from "@/hook/use-permission";
import { UserService } from "@/services/user.service";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const Api = axios.create({
  baseURL: API,
});

export async function setBearerToken(token: string) {
  Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function getCookie(name: string) {
  const nameEQ = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

(async () => {
  try {
    const token = getCookie("authToken");
    if (token) {
      setBearerToken(token);
    }

    const permission = getCookie("permission");
    if (permission) {
      usePermission.getState().setPermission(permission);
    }
  } catch (error) {
    console.error("Erro ao buscar token ou permissão do cookie", error);
  }
})();
