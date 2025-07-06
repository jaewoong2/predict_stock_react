"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const customRevalidateTag = async (tag: string) => {
  revalidateTag(tag);
};
