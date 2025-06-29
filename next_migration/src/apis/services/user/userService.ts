import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import { User } from "@/apis/type";

class UserService extends BaseService {
  getMe(options?: RequestInit) {
    return this.http<DefaultResponse<User | null>>(`/api/users/me`, {
      next: { tags: ["user"] },
      cache: "no-cache",
      ...options,
    });
  }

  getUser(user: string) {
    return this.http<DefaultResponse<User | null>>(`/api/users/${user}`, {});
  }

  apply(email: string) {
    return this.http<DefaultResponse<(User & { access_token: string }) | null>>(
      `/api/auth/signup`,
      {
        method: "POST",

        body: { email },
      },
    );
  }
}

const userService = new UserService();

export default userService;
