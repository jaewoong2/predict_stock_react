import api from "./api";
import { ResearchAnalysis, ResearchRequestParams } from "../types/research";

export const researchService = {
  getAnalysis: async (params?: ResearchRequestParams): Promise<ResearchAnalysis> => {
    const response = await api.get<ResearchAnalysis>("/research/analysis", {
      params,
    });
    return response.data;
  },
};
