import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import {
  CreateEventRequest,
  CreateEventResponse,
  CreatePageRequest,
  CreatePageResponse,
  GetDatabaseResponse,
  GetDatabaseResponses,
} from "./type";

class IntegrationService extends BaseService {
  async addToCalander(
    params: CreateEventRequest,
  ): Promise<DefaultResponse<CreateEventResponse>> {
    return await this.http<DefaultResponse<CreateEventResponse>>(
      `/api/google/calendar/add-event`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  getDatabases() {
    return this.http<DefaultResponse<GetDatabaseResponses | null>>(
      `/api/integration/notion/databases`,
      {
        method: "GET",
      },
    );
  }

  getDatabase(databaseId: string) {
    return this.http<DefaultResponse<GetDatabaseResponse | null>>(
      `/api/integration/notion/database/${databaseId}`,
      {
        method: "GET",
      },
    );
  }

  createPage(params: CreatePageRequest) {
    return this.http<DefaultResponse<CreatePageResponse | null>>(
      `/api/integration/notion/page`,
      {
        method: "POST",
        body: params,
      },
    );
  }
}

const integrationService = new IntegrationService();

export default integrationService;
