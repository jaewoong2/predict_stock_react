"use client";

import { GetInfinityResponse } from "@/lib/type";

import habbitService from "./habbitService";
import {
  CreateHabbitRequest,
  DeleteHabbitRequest,
  GetHabbitAllRequest,
  GetHabbitRequest,
  RecordHabbitRequest,
  UpdateHabbitRequest,
} from "./type";
import { Habbit } from "@/apis/type";

const queryKeys = {
  find: (query: GetHabbitRequest) => ["habbit", query.title],
  findAll: (query: GetHabbitAllRequest) => ["habbits", query.page],
  create: () => ["create-habbit"],
  update: () => ["update-habbit"],
  delete: () => ["delete-habbit"],
  recordHabbit: () => ["record-habbit"],
};

const queryOptions = {
  /**
   * Mutation: Create a new habbit
   */
  create: () => ({
    mutationKey: queryKeys.create(),
    mutationFn: (body: CreateHabbitRequest) => habbitService.create(body),
  }),

  /**
   * Mutation: Update an existing habbit
   */
  update: () => ({
    mutationKey: queryKeys.update(),
    mutationFn: (body: UpdateHabbitRequest) =>
      habbitService.update({ ...body }),
  }),

  /**
   * Query: Find a specific habbit by title
   */
  find: (query: GetHabbitRequest) => ({
    queryKey: queryKeys.find(query),
    queryFn: () => habbitService.find(query),
  }),

  /**
   * Query: Get all habbits with pagination
   */
  findAll: (query: GetHabbitAllRequest) => ({
    queryKey: queryKeys.findAll(query),
    queryFn: ({ pageParam }: { pageParam: { page: number } }) =>
      habbitService.findAll({ page: pageParam.page, ...query }),
    getNextPageParam: (lastPage: GetInfinityResponse<Habbit[] | undefined>) =>
      lastPage?.data?.meta?.hasNextPage
        ? { page: lastPage.data.meta.page + 1 }
        : null,
    getPreviousPageParam: (
      firstPage: GetInfinityResponse<Habbit[] | undefined>,
    ) =>
      firstPage?.data?.meta?.hasPreviousPage
        ? { page: firstPage.data.meta.page - 1 }
        : null,
  }),

  /**
   * Mutation: Delete a habbit by ID
   */
  delete: () => ({
    mutationKey: queryKeys.delete(),
    mutationFn: (body: DeleteHabbitRequest) =>
      habbitService.delete(body.habbitId),
  }),

  recordHabbit: () => ({
    mutationKey: queryKeys.recordHabbit(),
    mutationFn: (body: RecordHabbitRequest) => habbitService.recordHabbit(body),
  }),
};

export default queryOptions;
