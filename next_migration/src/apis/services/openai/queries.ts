"use client";

import { UseMutationOptions } from "@tanstack/react-query";
import { OpenAiFindResponseRequest, OpenAiImageToTextRequest } from "./type";
import openAiService from "./openAiService";

const queryKeys = {
  imageToText: (file: File) => ["upload"],
  find: (imageUrl?: string) => ["find", imageUrl],
};

const queryOptions = {
  imageToText: () => ({
    mutationFn: ({ imageUrl }: OpenAiImageToTextRequest) =>
      openAiService.imageToText({ imageUrl }),
  }),

  find: (query: OpenAiFindResponseRequest) => ({
    queryKey: queryKeys.find(query.imageUrl),
    queryFn: () => openAiService.findResponse(query),
  }),
};

export default queryOptions;
