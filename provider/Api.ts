import { StorageHelper } from "@/helpers/storage-helper";
import { usePermission } from "@/hook/use-permission";
import { UserService } from "@/services/user.service";
import axios from "axios"

const API = "https://srv538807.hstgr.cloud/api/v1"

export const Api = axios.create({
  baseURL: API
})

export async function setBearerToken (token: string) {
  Api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

(async () => {
  try {
    const token = await StorageHelper.getItem('token');
    if (token) {
      setBearerToken(token);
    }
  } catch (error) {
    console.error("Error fetching token from storage", error);
  }
})();

(async () => {
  try {
    const { id } = await StorageHelper.getItem("user")
    if (id) {
      const { permission } = await UserService.getUserById(id)
      usePermission.getState().setPermission(permission)
    }
  } catch (error) {
    console.log(error)
  }
})()
