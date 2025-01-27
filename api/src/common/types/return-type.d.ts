export interface PaginatedResponse<T> {
  items: T[];
  metadata: {
    currentPage: number;
    totalItems: number;
    itemsCount: number;
    totalPages: number;
    limit: number;
  };
}
