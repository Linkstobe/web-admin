import { StorageHelper } from "@/helpers/storage-helper";
import { ILogin } from "@/interfaces/IUser";
import { setBearerToken } from "@/provider";
import { AuthService } from "@/services/auth.service";
import { usePermission } from "@/hook/use-permission";

export default function useAuth () {
  async function onAuth (payload: ILogin) {
    try {
      const res = await AuthService.login(payload);
      delete res.user.password;
      
      const userUnauthorized = !res.user.permission;
      
      if (userUnauthorized) {
        throw new Error("Erro ao tentar fazer login");
      }

      usePermission.getState().setPermission(res.user.permission);
      
      await StorageHelper.setItem("user", res.user);
      await StorageHelper.setItem("token", res.token);
      await setBearerToken(res.token);

      document.cookie = `authToken=${res.token}; path=/; max-age=86400`;
      document.cookie = `permission=${res.user.permission}; path=/; max-age=86400`;
    } catch (error) {
      console.log(error);
      throw new Error("Email ou senha errada");
    }
  }

  return onAuth;
}