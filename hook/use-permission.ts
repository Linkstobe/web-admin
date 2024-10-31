import { create } from "zustand"

interface PermissionStore {
  permission: string;
  setPermission: (permission: string) => void;
  canEdit: () => boolean;
}

export const usePermission = create<PermissionStore>((set, get) => ({
  permission: "",
  setPermission: (permission: string) => set({ permission }),
  canEdit: () => get().permission === "editar",
}))