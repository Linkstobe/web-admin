import { ICreateProduct, IProduct } from "@/interfaces/IProducts";
import { Api } from "@/provider";

export const ProductService = {
  async createNew(payload: ICreateProduct) {
    const { data } = await Api.post<IProduct>("/products", payload);
    return data;
  },

  async getById(id: string | number) {
    const { data } = await Api.get<IProduct>(`/products/${id}`);
    return data;
  },

  async getAll() {
    const { data } = await Api.get<IProduct[]>("/products")
    return data
  },

  async getByUserId(userId: number) {
    const { data } = await Api.get<IProduct[]>(`/products`);
    const products = data.filter((e) => e.user_id === userId);
    return products;
  },

  async updateById(payload: Partial<ICreateProduct>, id: string | number) {
    const { data } = await Api.patch<IProduct>(`/products/${id}`, payload);
    return data;
  },

  async deleteById(id: string | number) {
    await Api.delete(`/products/${id}`);
  },
};