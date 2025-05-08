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
    link_background: string;
    link_icon: string;
    link_format: string;
    link_position: string;
  }[];
  config_marketplace_afiliados: string;
  updatedAt: string;
  createdAt: string;
  arquived: boolean;
  role?: string;
  referral_id: string;
  blocked: boolean;
  config?: object;
  title_classname?: string;
  description_classname?: string;
  hasCover?: boolean;
  background_image?: string;
  background_color?: string;
  background_effect?: string;
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
  blocked: boolean;
  config?: object;
}
