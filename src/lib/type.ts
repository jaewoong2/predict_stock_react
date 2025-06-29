export type NextPageProps<
  Params extends Record<string, string> | null = null,
  SearhParams extends Record<string, string> | null = null,
> = {
  params: Params;
  searchParams: SearhParams;
};

type SegmentParams<T extends Object = any> =
  T extends Record<string, any> ? { [K in keyof T]: T[K] extends string ? string | string[] | undefined : never } : T;

export interface PageProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<any>;
}

export interface PageMetaDtoParameters {
  pageOptionsDto: {
    page: number;
    take: number;
  };
  total: number;
}

export class PageMetaDto {
  readonly total: number;
  readonly page: number;
  readonly take: number;
  readonly last_page: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, total }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page <= 0 ? 1 : pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.total = total;
    this.last_page = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.last_page;
  }
}

export interface DefaultResponse<T, U = any> {
  message: string;
  error: U;
  status: number;
  success: boolean;
  data: T;
}

export type GetInfinityResponse<T> = DefaultResponse<{
  data: T;
  meta: PageMetaDto | null;
}>;

export interface UseInfiniteOptions<T, U = any> {
  initialPageParam?: { page: number };
  enabled?: boolean;
  initialData?: GetInfinityResponse<T>['data'];
  params: U;
}

export interface FcFsError {
  statusCode: number;
  message: string;
}
