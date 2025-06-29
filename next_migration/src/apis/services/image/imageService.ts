import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import { ImageResponse, UploadImageParams } from "./type";

class ImageService extends BaseService {
  async upload({ file }: UploadImageParams) {
    const formData = new FormData();
    formData.append("file", file);

    const result = await this.http<DefaultResponse<ImageResponse | null>>(
      "/api/images/upload",
      {
        method: "POST",
        body: formData,
        stringfy: false,
      },
    );

    return result;
  }
}

const imageService = new ImageService();

export default imageService;
