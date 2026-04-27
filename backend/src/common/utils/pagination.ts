import { AppError } from "../errors/AppError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;
const MAX_PAGE_SIZE = 50;

export type PaginationInput = {
  page?: unknown;
  pageSize?: unknown;
};

export type Pagination = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

export function getPagination(input: PaginationInput): Pagination {
  const page = Number(input.page ?? DEFAULT_PAGE);
  const pageSize = Number(input.pageSize ?? DEFAULT_PAGE_SIZE);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("Sayfa numarası geçersiz.", 400);
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new AppError("Sayfa boyutu geçersiz.", 400);
  }

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function createPaginationMeta(page: number, pageSize: number, totalItems: number) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
}
