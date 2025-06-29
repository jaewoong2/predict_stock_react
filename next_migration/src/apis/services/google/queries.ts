"use client";

import { UseMutationOptions } from "@tanstack/react-query";
import { CreateEventRequest } from "./type";
import openAiService from "./googleService";

const queryKeys = {
  imageToText: (file: File) => ["upload"],
  find: (imageUrl?: string) => ["find", imageUrl],
};

const queryOptions = {
  addToCalander: () => ({
    mutationFn: (body: CreateEventRequest) => openAiService.addToCalander(body),
  }),
};

export default queryOptions;
