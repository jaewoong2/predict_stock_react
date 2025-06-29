import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import {
  OpenAiFindResponseRequest,
  OpenAiFindResponseResponse,
  OpenAiImageToTextRequest,
  OpenAiImageToTextResponse,
} from "./type";

class OpenAiService extends BaseService {
  async imageToText(
    params: OpenAiImageToTextRequest,
  ): Promise<DefaultResponse<OpenAiImageToTextResponse>> {
    return await this.http<DefaultResponse<OpenAiImageToTextResponse>>(
      `/api/ai/text`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  async findResponse(
    params: OpenAiFindResponseRequest,
  ): Promise<DefaultResponse<OpenAiFindResponseResponse>> {
    return await this.http<DefaultResponse<OpenAiFindResponseResponse>>(
      `/api/ai?imageUrl=${params.imageUrl}`,
      {
        method: "GET",
      },
    );
  }
}

const openAiService = new OpenAiService();

export default openAiService;
