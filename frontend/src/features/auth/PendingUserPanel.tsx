import { getInitials } from "../../lib/format";
import type { User } from "../../types";

export function PendingUserPanel({ user }: { user: User }) {
  return (
    <section className="panel-section">
      <h2>Hesap Durumu</h2>
      <div className="pending-card">
        <div className="avatar large">{getInitials(user.fullName)}</div>
        <div>
          <strong>{user.fullName}</strong>
          <p>
            {user.approvalStatus === "REJECTED"
              ? "Hesabınız reddedildi. Lütfen yöneticinizle iletişime geçiniz."
              : "Hesabınız yönetici onayı bekliyor."}
          </p>
        </div>
      </div>
    </section>
  );
}
