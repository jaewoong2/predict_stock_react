'use client';

import { UseMutationOptions } from '@tanstack/react-query';

import imageService from './imageService';
import { UploadImageParams } from './type';

const queryKeys = {
  upload: (file: File) => ['upload'],
};

const queryOptions = {
  upload: () => ({
    mutationFn: (file: UploadImageParams) => imageService.upload(file),
  }),
};

export default queryOptions;
