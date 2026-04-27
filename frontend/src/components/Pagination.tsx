import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

import type { Pagination as PaginationMeta } from "../types";

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const start = pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);
  const visiblePageCount = Math.min(5, pagination.totalPages);
  const firstPage = Math.max(
    1,
    Math.min(pagination.page - 2, pagination.totalPages - visiblePageCount + 1),
  );
  const pages = Array.from({ length: visiblePageCount }, (_, index) => firstPage + index);

  return (
    <div className="pagination">
      <p>{start}-{end} / {pagination.totalItems} kayıt</p>
      <div className="pagination-buttons">
        <button
          type="button"
          aria-label="İlk sayfa"
          disabled={pagination.page === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Önceki sayfa"
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={page === pagination.page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          aria-label="Sonraki sayfa"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight size={18} />
        </button>
        <button
          type="button"
          aria-label="Son sayfa"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.totalPages)}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
