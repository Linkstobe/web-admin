export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  cellphone: string;
  cpf_cnpj?: string;
  profile_photo: string;
  role: string;
  projects: [];
  createdAt: string;
  updatedAt: string;
  permission: string
}

export interface ICreateUser {
  name: string;
  email: string;
  password?: string;
  cpf_cnpj?: string;
  cellphone: string;
  profile_photo: string;
  permission: string;
}

export interface IUploadUser extends Partial<IUser> {}

export interface ILogin {
  email: string
  password: string
}

export interface ILoginResponse {
  token: string;
  expiresIn: string;
  user: IUser;
}