type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export const ApiResponse = {
  success<T>(message: string, data: T) {
    return {
      success: true,
      message,
      data,
    };
  },

  paginated<T>(message: string, items: T[], pagination: PaginationMeta) {
    return {
      success: true,
      message,
      data: {
        items,
        pagination,
      },
    };
  },
};
