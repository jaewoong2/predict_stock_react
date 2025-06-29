"use client";

import { CreateEventRequest, CreatePageRequest } from "./type";
import integrationService from "./integrationService";

const queryKeys = {
  getDatabase: (id?: string) => ["database", id],
  getDatabases: () => ["databases"],
};

const queryOptions = {
  addToCalander: () => ({
    mutationFn: (body: CreateEventRequest) =>
      integrationService.addToCalander(body),
  }),

  getDatabase: (id?: string) => ({
    queryFn: () => integrationService.getDatabase(`${id}`),
    queryKey: queryKeys.getDatabase(id),
  }),

  getDatabases: () => ({
    queryFn: () => integrationService.getDatabases(),
    queryKey: queryKeys.getDatabases(),
  }),

  createPage: () => ({
    mutationFn: (body: CreatePageRequest) =>
      integrationService.createPage(body),
  }),
};

export default queryOptions;
