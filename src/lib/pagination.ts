// Pagination types and utilities

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  campaign?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
export const MAX_PAGE_SIZE = 100;

// Available page size options
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

/**
 * Calculate pagination options from parameters
 */
export function calculatePagination(params: PaginationParams): PaginationOptions {
  const page = Math.max(1, params.page || DEFAULT_PAGE);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, params.limit || DEFAULT_PAGE_SIZE));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Generate page numbers for pagination UI
 */
export function generatePageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Create URL search params for pagination
 */
export function createPaginationSearchParams(params: PaginationParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  if (params.page && params.page > 1) {
    searchParams.set('page', params.page.toString());
  }
  
  if (params.limit && params.limit !== DEFAULT_PAGE_SIZE) {
    searchParams.set('limit', params.limit.toString());
  }
  
  if (params.search) {
    searchParams.set('search', params.search);
  }
  
  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status);
  }
  
  if (params.campaign) {
    searchParams.set('campaign', params.campaign);
  }
  
  return searchParams;
}

/**
 * Parse pagination params from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    campaign: searchParams.get('campaign') || undefined,
  };
}
