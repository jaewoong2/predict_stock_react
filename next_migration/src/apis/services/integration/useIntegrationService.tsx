import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { DefaultResponse, FcFsError } from "@/lib/type";

import queryOptions from "./queries";
import {
  CreateEventRequest,
  CreateEventResponse,
  CreatePageRequest,
  CreatePageResponse,
  GetDatabaseResponse,
  GetDatabaseResponses,
} from "./type";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

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

export const useGetDatabases = (
  options?: Omit<
    UseQueryOptions<DefaultResponse<GetDatabaseResponses | null>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    ...queryOptions.getDatabases(),
    ...options,
  });
};

export const useGetDatabase = (
  id?: string,
  options?: Omit<
    UseQueryOptions<DefaultResponse<GetDatabaseResponse | null>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    ...queryOptions.getDatabase(id),
    ...options,
  });
};

export const usePostCreatePage = (
  options?: Omit<
    UseMutationOptions<
      DefaultResponse<CreatePageResponse | null>,
      FcFsError,
      CreatePageRequest
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  const router = useRouter();
  const mutate = useMutation({
    ...queryOptions.createPage(),
    ...options,
    onSuccess: (data, variables, context) => {
      if (data.data) {
        toast({
          title: "Notion에 기록을 등록 했어요",
          description: (
            <Link
              href={data.data.url}
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center gap-1"
            >
              <NotionLogoIcon />
              바로가기
            </Link>
          ),
        });
      }

      router.push("/");

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });

  return mutate;
};
