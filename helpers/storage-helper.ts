const AppConfig = {
  STORAGE_BASE_KEY: "@linkstobe_",
};

async function getKey(key: string) {
  return AppConfig.STORAGE_BASE_KEY + key;
}

async function getItem(key: string) {
  if (typeof window !== "undefined") {
    key = await getKey(key);
    const item = localStorage.getItem(key);
    if (!item) return;
    return JSON.parse(item);
  }
}

async function setItem(key: string, data: any) {
  if (typeof window !== "undefined") {
    key = await getKey(key);
    localStorage.setItem(key, JSON.stringify(data));
  }
}

async function removeItem(key: string) {
  if (typeof window !== "undefined") {
    key = await getKey(key);
    localStorage.removeItem(key);
  }
}

export const StorageHelper = {
  getItem,
  setItem,
  removeItem,
};
