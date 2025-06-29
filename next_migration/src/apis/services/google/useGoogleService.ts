import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { DefaultResponse, FcFsError } from "@/lib/type";

import queryOptions from "./queries";
import { CreateEventRequest, CreateEventResponse } from "./type";

export const useAddToCalander = (
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<CreateEventResponse | null>,
      FcFsError,
      CreateEventRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    ...queryOptions.addToCalander(),
    ...options,
  });
};
