import { Api } from "@/provider/Api";

type MenusUsers = {
  user_id: number;
  menu_id: string;
};

export const MenusService = {
  async getMenusFromUser(userId: number) {
    const { data } = await Api.get(`/menus/`, { params: { userId } });
    return data;
  },

  async patchMenusFromUser(menuUsers: MenusUsers) {
    const { data } = await Api.patch<void>("/menus/users", menuUsers);
    return data;
  },
};
