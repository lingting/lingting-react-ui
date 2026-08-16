export type R<T = unknown> = {
  code: number;
  message: string;
  data?: T | null;
};

export type PaginationSort = {
  field: string;
  desc: boolean;
};

export type PaginationParams = {
  current: number;
  size: number;
  sorts: PaginationSort[];
};

export type PaginationResult<T> = {
  total: number;
  records: T[];
};
