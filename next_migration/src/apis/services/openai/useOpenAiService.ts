import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { DefaultResponse, FcFsError } from "@/lib/type";

import queryOptions from "./queries";
import {
  OpenAiFindResponseRequest,
  OpenAiFindResponseResponse,
  OpenAiImageToTextRequest,
  OpenAiImageToTextResponse,
} from "./type";

export const useOpenAiImageToText = (
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<OpenAiImageToTextResponse | null>,
      FcFsError,
      OpenAiImageToTextRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    ...queryOptions.imageToText(),
    ...options,
  });
};

export function useGetAiResponse(
  query: OpenAiFindResponseRequest,
  options?: Omit<
    UseQueryOptions<DefaultResponse<OpenAiFindResponseResponse | null>>,
    "queryFn" | "queryKey"
  >,
) {
  return useQuery({
    ...queryOptions.find(query),
    ...options,
  });
}
