import { ICreateUser, IUploadUser, IUser } from "@/interfaces/IUser";
import { Api } from "../provider/Api";

export const UserService = {
  async createNewUser(payload: ICreateUser) {
    const { data } = await Api.post<IUser>("/users", payload);
    return data;
  },

  async getAllUsers() {
    const { data } = await Api.get<IUser[]>("/users");
    return data;
  },

  async getAmount() {
    const { data } = await Api.get("/users/amount");
    return data;
  },

  async getUserById(id: string | number) {
    const { data } = await Api.get<IUser>(`/users/${id}`);
    return data;
  },

  async getUserSocialById(id: string | number) {
    const { data } = await Api.get<IUser>(`/users/social/${id}`);
    return data;
  },

  async updateUserById(id: string | number, payload: IUploadUser) {
    const { data } = await Api.patch<IUser>(`/users/${id}`, payload);
    return data;
  },

  async deleteUserById(id: string | number) {
    await Api.delete(`/users/${id}`);
  },

  async getPassReset(email: string, redirect_link: string) {
    const { data } = await Api.post(`/users/request-password-reset`, {
      email,
      redirect_link,
    });
    return data;
  },
};
