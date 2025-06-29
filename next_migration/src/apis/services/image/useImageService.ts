import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { DefaultResponse, FcFsError } from '@/lib/type';

import queryOptions from './queries';
import { ImageResponse, UploadImageParams } from './type';

export const useUploadImageMutation = (
  options?: Omit<
    UseMutationOptions<DefaultResponse<ImageResponse | null>, FcFsError, UploadImageParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation({
    ...queryOptions.upload(),
    ...options,
  });
};
