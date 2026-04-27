import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { RoleBadge } from "../../components/RoleBadge";
import { Toolbar } from "../../components/Toolbar";
import { roleOptions } from "../../constants";
import { getErrorMessage } from "../../lib/forms";
import { listUsers, updateUserRole } from "../../services/userService";
import type { Pagination as PaginationMeta, RoleId, User } from "../../types";

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: 15,
  totalItems: 0,
  totalPages: 1,
};

export function UsersPanel({ token }: { token: string }) {
  const [items, setItems] = useState<User[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<RoleId | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const response = await listUsers({ token, search, roleId, page, pageSize: 15 });
      setItems(response.data.items);
      setPagination(response.data.pagination);
      setMessage("");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  useEffect(() => {
    void load();
  }, [page, roleId]);

  async function handleRoleChange(id: string, nextRoleId: RoleId) {
    try {
      await updateUserRole(token, id, nextRoleId);
      setMessage("");
      await load();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  const roleFilterOptions = useMemo(
    () => [{ value: "ALL", label: "Tümü" }, ...roleOptions.map((role) => ({ value: String(role.id), label: role.label }))],
    [],
  );

  return (
    <section className="panel-section" id="users">
      <h2>Kullanıcılar</h2>
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
        selectValue={String(roleId)}
        onSelectChange={(value) => {
          setRoleId(value === "ALL" ? "ALL" : (Number(value) as RoleId));
          setPage(1);
        }}
        options={roleFilterOptions}
      />
      {message && <p className="form-message">{message}</p>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Rol Ata</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label="Ad Soyad">{item.fullName}</td>
                <td data-label="E-posta">{item.email}</td>
                <td data-label="Telefon">{item.phone || "-"}</td>
                <td data-label="Rol"><RoleBadge roleName={item.roleName} /></td>
                <td data-label="Rol Ata">
                  <div className="role-select">
                    <select
                      value={item.roleId}
                      onChange={(event) => handleRoleChange(item.id, Number(event.target.value) as RoleId)}
                    >
                      {roleOptions.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <EmptyState title="Kullanıcı bulunamadı." />}
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
