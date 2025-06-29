import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { customRevalidateTag } from "@/lib/serverActions";
import { DefaultResponse, FcFsError, UseInfiniteOptions } from "@/lib/type";

import queryOptions from "./queries";
import {
  CreateHabbitRequest,
  CreateHabbitResponse,
  DeleteHabbitRequest,
  DeleteHabbitResponse,
  GetHabbitAllRequest,
  GetHabbitRequest,
  GetHabbitResponse,
  RecordHabbitRequest,
  RecordHabbitResponse,
  UpdateHabbitRequest,
  UpdateHabbitResponse,
} from "./type";

export function useCreateHabbit(
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<CreateHabbitResponse | null>,
      FcFsError,
      CreateHabbitRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    ...queryOptions.create(),
    ...options,
    async onSuccess(data, vars, context) {
      await queryClient.invalidateQueries({ queryKey: ["habbits"] });
      await customRevalidateTag("habbits");

      if (options?.onSuccess) {
        options.onSuccess(data, vars, context);
      }

      toast({
        title: `습관이 생성되었습니다 🎉`,
      });
    },
  });
}

export function useUpdateHabbit(
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<UpdateHabbitResponse | null>,
      FcFsError,
      UpdateHabbitRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    ...queryOptions.update(),
    ...options,
    onSuccess: async (data, vars, context) => {
      await queryClient.invalidateQueries({ queryKey: ["habbits"] });
      await customRevalidateTag("habbits");

      if (options?.onSuccess) {
        options.onSuccess(data, vars, context);
      }

      toast({
        title: `습관이 수정되었습니다 🎉`,
      });
    },
  });
}

export function useGetHabbit(
  query: GetHabbitRequest,
  options?: Omit<
    UseQueryOptions<DefaultResponse<GetHabbitResponse | null>>,
    "queryFn" | "queryKey"
  >,
) {
  return useQuery({
    ...queryOptions.find(query),
    ...options,
  });
}

export function useDeleteHabbit(
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<DeleteHabbitResponse | null>,
      FcFsError,
      DeleteHabbitRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    ...queryOptions.delete(),
    ...options,
    onSuccess: async (data, vars, context) => {
      await queryClient.invalidateQueries({ queryKey: ["habbits"] });
      await customRevalidateTag("habbits");

      if (options?.onSuccess) {
        options.onSuccess(data, vars, context);
      }

      toast({
        title: `삭제되었습니다`,
      });
    },
  });
}

export function useInfiniteGetAllHabbits({
  initialPageParam,
  params,
  enabled,
}: UseInfiniteOptions<GetHabbitResponse[], GetHabbitAllRequest>) {
  const data = useSuspenseInfiniteQuery({
    ...queryOptions.findAll(params),
    initialPageParam: initialPageParam ?? { page: 1 },
  });

  if (!enabled) return null;
  return data;
}

export function useRecordHabbit(
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<RecordHabbitResponse | null>,
      FcFsError,
      RecordHabbitRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) {
  return useMutation({
    ...queryOptions.recordHabbit(),
    ...options,
  });
}
