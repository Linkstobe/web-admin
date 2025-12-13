export interface IEligibleInfluencerPanel {
  id: number;
  banner_title: string | null;
  indicatedUsersCount: number;
}

export interface IEligibleInfluencer {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  activePanelsCount: number;
  totalIndicatedUsers: number;
  panels: IEligibleInfluencerPanel[];
}

export interface IAffiliateSubCommissionConfig {
  id: number;
  user_id: number;
  sub_percent_influencer: number;
  sub_percent_platform: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSubCommissionConfig {
  user_id: number;
  sub_percent_influencer: number;
  sub_percent_platform: number;
}

export interface IUpdateSubCommissionConfig {
  sub_percent_influencer?: number;
  sub_percent_platform?: number;
  active?: boolean;
}
