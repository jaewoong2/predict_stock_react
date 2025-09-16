import { oxApi } from "./api";
import {
  CurrentPriceResponseSchema,
  EODPriceResponseSchema,
  UniversePricesPayload,
  SettlementPriceData,
  PriceComparisonResult,
  EODCollectionResult,
  CurrentPriceResponse,
  EODPriceResponse,
} from "@/types/price";
import { PredictionChoice } from "@/types/prediction";

const normalizeSymbol = (symbol: string) => symbol.toUpperCase();

const buildQueryString = (
  params: Record<string, string | number | undefined>,
) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const priceService = {
  async getCurrentPrice(symbol: string): Promise<CurrentPriceResponse> {
    try {
      const response = await oxApi.getWithBaseResponse<CurrentPriceResponse>(
        `/prices/current/${normalizeSymbol(symbol)}`,
      );

// Zod로 응답 검증
      const parsed = CurrentPriceResponseSchema.safeParse(response);
      if (parsed.success) {
return parsed.data;
      }

      console.error("❌ API 응답이 예상된 스키마와 맞지 않음:", {
        response,
        error: parsed.error?.format(),
      });

      throw new Error(`Invalid API response structure for symbol: ${symbol}`);
    } catch (error) {

      throw error;
    }
  },

  async getUniversePrices(tradingDay: string): Promise<UniversePricesPayload> {
    const response = await oxApi.getWithBaseResponse<{
      universe_prices: UniversePricesPayload;
    }>(`/prices/universe/${tradingDay}`);

    return response.universe_prices;
  },

  async getEodPrice(
    symbol: string,
    tradingDay: string,
  ): Promise<EODPriceResponse> {
    try {
      const response = await oxApi.getWithBaseResponse<EODPriceResponse>(
        `/prices/eod/${normalizeSymbol(symbol)}/${tradingDay}`,
      );

// Zod로 응답 검증
      const parsed = EODPriceResponseSchema.safeParse(response);
      if (parsed.success) {
return parsed.data;
      }

      console.error("❌ API 응답이 예상된 스키마와 맞지 않음:", {
        response,
        error: parsed.error?.format(),
      });

      throw new Error(
        `Invalid EOD API response structure for symbol: ${symbol}, date: ${tradingDay}`,
      );
    } catch (error) {

      throw error;
    }
  },

  async validateSettlement(tradingDay: string): Promise<SettlementPriceData[]> {
    const response = await oxApi.getWithBaseResponse<{
      settlement_data: SettlementPriceData[];
    }>(`/prices/admin/validate-settlement/${tradingDay}`);

    return response.settlement_data;
  },

  async comparePrediction(params: {
    symbol: string;
    trading_day: string;
    predicted_direction: PredictionChoice;
  }): Promise<PriceComparisonResult> {
    const query = buildQueryString({
      symbol: normalizeSymbol(params.symbol),
      trading_day: params.trading_day,
      predicted_direction: params.predicted_direction,
    });

    const response = await oxApi.postWithBaseResponse<{
      comparison: PriceComparisonResult;
    }>(`/prices/admin/compare-prediction${query}`);

    return response.comparison;
  },

  async comparePredictionById(
    predictionId: number,
  ): Promise<PriceComparisonResult> {
    const response = await oxApi.postWithBaseResponse<{
      comparison: PriceComparisonResult;
    }>(
      `/prices/admin/compare-prediction/by-id${buildQueryString({ prediction_id: predictionId })}`,
    );

    return response.comparison;
  },

  async collectEodPrices(tradingDay: string): Promise<EODCollectionResult> {
    return await oxApi.postWithBaseResponse<EODCollectionResult>(
      `/prices/collect-eod/${tradingDay}`,
    );
  },
};
