import { ILogin, ILoginResponse } from "@/interfaces/IUser";
import { Api } from "@/provider"

export const AuthService = {
  async login (payload: ILogin) {
    const { data } = await Api.post<ILoginResponse>("/auth/login", payload);
    return data;
  }
}