import { http as serverHttp } from './api';
import { http } from './apiClient';

type FetchInterceptor = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export default class BaseService {
  private isServer: boolean;
  protected http: typeof http;

  constructor() {
    if (typeof window === 'undefined') {
      this.http = serverHttp;
      this.isServer = true;
    } else {
      this.http = http;
      this.isServer = false;
    }
  }

  response_interceptor(response: Response) {
    if (response.ok) return response;
  }
}
