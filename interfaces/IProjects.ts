export interface IProject {
  id: number;
  title: string;
  description: string;
  logo_url: string;
  banner_url: string;
  linkstoBe: string;
  user_id: number;
  links: {
    order_id: number;
    link: string;
    social_media: string;
  }[];
  updatedAt: string;
  createdAt: string;
  arquived: boolean;
  role?: string
  referral_id: string
}

export interface IUpdateProject extends Partial<IProject> {}

export interface ICreateProject {
  user_id: number;
  linkstoBe: string;
  title: string;
  description: string;
  logo_url: string;
  banner_url: string;
  links: {
    order_id: number;
    link: string;
    social_media: string;
  }[];
  arquived: boolean;
}