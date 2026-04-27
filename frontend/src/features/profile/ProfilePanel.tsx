import {
  ChevronLeft,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  UserCircle,
} from "lucide-react";

import { roleLabels } from "../../constants";
import { getInitials } from "../../lib/format";
import type { User } from "../../types";

export function ProfilePanel({ user, onBack }: { user: User; onBack: () => void }) {
  const profileItems = [
    { icon: UserIcon, label: "KULLANICI ADI", value: user.fullName },
    { icon: Mail, label: "E-POSTA", value: user.email },
    { icon: Phone, label: "TELEFON", value: user.phone || "-" },
    { icon: Shield, label: "ROL", value: roleLabels[user.roleName] },
  ];

  return (
    <section className="profile-page">
      <aside className="profile-side">
        <button className="back-button" type="button" onClick={onBack}>
          <ChevronLeft size={22} />
          Geri Dön
        </button>
        <div className="profile-identity">
          <div className="avatar profile-avatar">{getInitials(user.fullName)}</div>
          <strong>{user.fullName}</strong>
          <span>{roleLabels[user.roleName]}</span>
        </div>
        <div className="profile-nav-item">
          <UserCircle size={22} />
          Profil Bilgileri
        </div>
      </aside>
      <div className="profile-content">
        <h2>Profil Bilgileri</h2>
        <div className="profile-info-list">
          {profileItems.map((item) => (
            <div className="profile-info-row" key={item.label}>
              <div className="profile-info-icon">
                <item.icon size={24} />
              </div>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
