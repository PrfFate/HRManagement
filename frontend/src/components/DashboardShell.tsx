import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  LogOut,
  Menu,
  Shield,
  UserCircle,
  Users,
} from "lucide-react";

import { BrandLogo } from "./BrandLogo";
import { roleLabels } from "../constants";
import { getInitials } from "../lib/format";
import type { AppView, User } from "../types";

export function DashboardShell({
  activeView,
  user,
  onLogout,
  onNavigate,
  onViewProfile,
  children,
}: {
  activeView: AppView;
  user: User;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
  onViewProfile: () => void;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth > 760,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isManager = user.roleName === "Manager";

  return (
    <div className="app-shell">
      {isSidebarOpen && <button className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <BrandLogo compact />
        </div>
        <button
          aria-label="Menüyü kapat"
          className="sidebar-close"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        >
          <ChevronLeft size={22} />
        </button>
        <nav>
          <button
            className={activeView === "leaves" ? "active" : ""}
            onClick={() => {
              onNavigate("leaves");
              setIsSidebarOpen(false);
            }}
            type="button"
          >
            <Shield size={24} />
            <span>{isManager ? "İzinler" : "İzin Talebi"}</span>
          </button>
          {!isManager && user.roleName !== "PendingUser" && (
            <button
              className={activeView === "my-leaves" ? "active" : ""}
              onClick={() => {
                onNavigate("my-leaves");
                setIsSidebarOpen(false);
              }}
              type="button"
            >
              <Calendar size={24} />
              <span>İzinlerim</span>
            </button>
          )}
          {isManager && (
            <button
              className={activeView === "users" ? "active" : ""}
              onClick={() => {
                onNavigate("users");
                setIsSidebarOpen(false);
              }}
              type="button"
            >
              <Users size={24} />
              <span>Kullanıcılar</span>
            </button>
          )}
        </nav>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          {!isSidebarOpen && (
            <button
              aria-label="Menüyü aç"
              className="icon-button"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          <h1>{isManager ? "Yönetici Paneli" : "Çalışan Paneli"}</h1>
          <div className="profile-area">
            <button className="avatar-button" type="button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              {getInitials(user.fullName)}
            </button>
            {isProfileOpen && (
              <>
                <button
                  className="profile-backdrop"
                  onClick={() => setIsProfileOpen(false)}
                  aria-label="Menüyü kapat"
                />
                <div className="profile-menu">
                  <div className="profile-summary">
                    <div className="avatar large">{getInitials(user.fullName)}</div>
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>{roleLabels[user.roleName]}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onViewProfile();
                    }}
                  >
                    <UserCircle size={22} />
                    Hesabı Görüntüle
                  </button>
                  <button type="button" onClick={onLogout}>
                    <LogOut size={22} />
                    Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
