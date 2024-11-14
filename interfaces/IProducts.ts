export interface ICreateProduct {
  title: string;
  product_type: string;
  description: string;
  info_complement: string;
  product_link: string;
  value: string;
  comission: string;
  imgUrl: string;
  status: string;
  user_id: number;
  estoque: string;
}

export interface IProduct extends ICreateProduct {
  id: number;
  updatedAt: string;
  createdAt: string;
}
