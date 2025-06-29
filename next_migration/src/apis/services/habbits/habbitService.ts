import { DefaultResponse, GetInfinityResponse } from "@/lib/type";
import { buildQueryParams } from "@/lib/utils";

import BaseService from "../baseService";
import {
  CreateHabbitRequestSchema,
  CreateHabbitResponseSchema,
  UpdateHabbitResponseSchema,
  GetHabbitResponseSchema,
} from "./schemas";
import {
  CreateHabbitRequest,
  CreateHabbitResponse,
  DeleteHabbitResponse,
  GetHabbitRequest,
  GetHabbitResponse,
  GetHabbitAllRequest,
  UpdateHabbitRequest,
  UpdateHabbitResponse,
  RecordHabbitRequest,
  RecordHabbitResponse,
} from "./type";

class HabbitService extends BaseService {
  async recordHabbit(
    params: RecordHabbitRequest,
  ): Promise<DefaultResponse<RecordHabbitResponse>> {
    return await this.http<DefaultResponse<RecordHabbitResponse>>(
      `/api/habbit/record`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  async create(params: CreateHabbitRequest) {
    const result = await this.http<
      DefaultResponse<CreateHabbitResponse | null>
    >(`/api/habbit`, {
      method: "POST",
      body: params,
    });

    return result;
  }

  async update({ habbitId, ...params }: UpdateHabbitRequest) {
    const result = await this.http<
      DefaultResponse<UpdateHabbitResponse | null>
    >(`/api/habbit/${habbitId}`, {
      method: "PUT",
      body: params,
    });

    return result;
  }

  async find(params: GetHabbitRequest) {
    const { title } = params;
    const result = await this.http<DefaultResponse<GetHabbitResponse | null>>(
      `/api/habbit?title=${title}`,
      {
        method: "GET",
        next: { tags: ["habbit"] },
      },
    );

    return result;
  }

  async findAll({ page, ...params }: GetHabbitAllRequest) {
    const result = await this.http<GetInfinityResponse<GetHabbitResponse[]>>(
      `/api/habbit/all?${buildQueryParams({ page, take: 5, ...params })}`,
      {
        method: "GET",
        next: { tags: ["habbit"] },
      },
    );

    return result;
  }

  async delete(habbitId: number) {
    const result = await this.http<
      DefaultResponse<DeleteHabbitResponse | null>
    >(`/api/habbit/${habbitId}`, {
      method: "DELETE",
    });

    return result;
  }
}

const habbitService = new HabbitService();

export default habbitService;
