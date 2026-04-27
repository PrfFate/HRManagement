import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { Toolbar } from "../../components/Toolbar";
import { leaveStatusOptions, leaveTypeLabels } from "../../constants";
import { formatDateRange } from "../../lib/format";
import { getErrorMessage } from "../../lib/forms";
import { listLeaveRequests, updateLeaveRequestStatus } from "../../services/leaveService";
import type { LeaveRequest, LeaveStatus, Pagination as PaginationMeta } from "../../types";

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: 15,
  totalItems: 0,
  totalPages: 1,
};

export function LeaveRequestsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<LeaveRequest[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeaveStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const response = await listLeaveRequests({ token, search, status, page, pageSize: 15 });
      setItems(response.data.items);
      setPagination(response.data.pagination);
      setMessage("");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [page, status]);

  async function handleStatus(id: string, nextStatus: Exclude<LeaveStatus, "PENDING">) {
    try {
      await updateLeaveRequestStatus(token, id, nextStatus);
      setMessage("");
      await load();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <section className="panel-section" id="leaves">
      <h2>İzin Talepleri</h2>
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onSearch={() => {
          if (page === 1) {
            void load();
            return;
          }

          setPage(1);
        }}
        selectValue={status}
        onSelectChange={(value) => {
          setStatus(value as LeaveStatus | "ALL");
          setPage(1);
        }}
        options={leaveStatusOptions}
      />
      {message && <p className="form-message">{message}</p>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>İzin Türü</th>
              <th>Tarih Aralığı</th>
              <th>Açıklama</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label="Ad Soyad">{item.employee.fullName}</td>
                <td data-label="İzin Türü">{leaveTypeLabels[item.leaveType]}</td>
                <td data-label="Tarih Aralığı">{formatDateRange(item.startDate, item.endDate)}</td>
                <td data-label="Açıklama">{item.description || "-"}</td>
                <td data-label="Durum"><StatusBadge status={item.status} /></td>
                <td data-label="İşlemler">
                  {item.status === "PENDING" ? (
                    <div className="action-buttons">
                      <button
                        aria-label="Onayla"
                        className="approve"
                        onClick={() => handleStatus(item.id, "APPROVED")}
                        type="button"
                      >
                        <Check size={22} />
                      </button>
                      <button
                        aria-label="Reddet"
                        className="reject"
                        onClick={() => handleStatus(item.id, "REJECTED")}
                        type="button"
                      >
                        <X size={22} />
                      </button>
                    </div>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && items.length === 0 && <EmptyState title="İzin talebi bulunamadı." />}
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
