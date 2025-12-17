import {
  IAffiliate,
  IAffiliateSubCommissionConfig,
  ICreateSubCommissionConfig,
  IEligibleInfluencer,
  ISponsor,
  IUpdateSubCommissionConfig,
} from "@/interfaces/IAffiliateSubCommissionConfig";
import { Api } from "../provider/Api";

export const AffiliateSubCommissionConfigService = {
  // Legacy - manter para compatibilidade
  async getEligibleInfluencers(): Promise<IEligibleInfluencer[]> {
    const { data } = await Api.get<IEligibleInfluencer[]>(
      "/affiliate-sub-commission-config/eligible-influencers"
    );
    return data;
  },

  // Novos métodos
  async getSponsorsWithAffiliates(): Promise<ISponsor[]> {
    const { data } = await Api.get<ISponsor[]>(
      "/affiliate-sub-commission-config/sponsors"
    );
    return data;
  },

  async getAffiliatesBySponsor(sponsorId: number): Promise<IAffiliate[]> {
    const { data } = await Api.get<IAffiliate[]>(
      `/affiliate-sub-commission-config/sponsors/${sponsorId}/affiliates`
    );
    return data;
  },

  async getConfigByUserId(
    userId: number
  ): Promise<IAffiliateSubCommissionConfig | null> {
    try {
      const { data } = await Api.get<IAffiliateSubCommissionConfig>(
        `/affiliate-sub-commission-config/user/${userId}`
      );
      return data;
    } catch {
      return null;
    }
  },

  async createConfig(
    payload: ICreateSubCommissionConfig
  ): Promise<IAffiliateSubCommissionConfig> {
    const { data } = await Api.post<IAffiliateSubCommissionConfig>(
      "/affiliate-sub-commission-config",
      payload
    );
    return data;
  },

  async updateConfig(
    id: number,
    payload: IUpdateSubCommissionConfig
  ): Promise<IAffiliateSubCommissionConfig> {
    const { data } = await Api.patch<IAffiliateSubCommissionConfig>(
      `/affiliate-sub-commission-config/${id}`,
      payload
    );
    return data;
  },
};
