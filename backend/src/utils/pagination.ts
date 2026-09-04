export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/**
 * Normalizes raw query-string pagination/sort params into safe values.
 * Falls back to sane defaults instead of throwing, since a malformed
 * `page` or `limit` shouldn't break a list endpoint.
 */
export function parsePagination(
  query: PaginationQuery,
  allowedSortFields: string[],
  defaultSortField: string
): ParsedPagination {
  const page = Math.max(parseInt(query.page ?? '1', 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const requestedSort = query.sortBy ?? defaultSortField;
  const sortBy = allowedSortFields.includes(requestedSort) ? requestedSort : defaultSortField;
  const sortOrder: 'asc' | 'desc' = query.sortOrder === 'desc' ? 'desc' : 'asc';

  return { page, limit, skip, take: limit, sortBy, sortOrder };
}

export function buildMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
}
