export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
