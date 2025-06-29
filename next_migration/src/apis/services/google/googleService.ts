import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import { CreateEventRequest, CreateEventResponse } from "./type";

class GoogleService extends BaseService {
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
}

const googleService = new GoogleService();

export default googleService;
