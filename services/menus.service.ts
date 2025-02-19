import { Api } from "@/provider/Api";

type MenusUsers = {
  user_id: number;
  menu_id: number[];
};

export const MenusService = {
  async getMenus() {
    const { data } = await Api.get(`/menus`);
    return data;
  },
  async getMenusFromUser(userId: number) {
    const { data } = await Api.get(`/menus/`, { params: { userId } });
    return data;
  },

  async patchMenusFromUser(menuUsers: MenusUsers) {
    const { data } = await Api.patch<void>("/menus/users", menuUsers);
    return data;
  },
};
