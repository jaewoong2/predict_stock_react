'use client';

import userService from './userService';

const queryKeys = {
  getMe: ['getUser'] as const,
  getUser: (user: string) => ['getUser', user],
};

const queryOptions = {
  getMe: () => ({
    queryKey: queryKeys.getMe,
    queryFn: () => userService.getMe(),
  }),

  getUser: () => ({
    queryKey: queryKeys.getMe,
    queryFn: () => userService.getMe(),
  }),

  apply: () => ({
    mutationFn: (email: string) => userService.apply(email),
  }),
};

export default queryOptions;
