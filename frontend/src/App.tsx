import { useState } from "react";

import { DashboardShell } from "./components/DashboardShell";
import { AuthScreen } from "./features/auth/AuthScreen";
import { PendingUserPanel } from "./features/auth/PendingUserPanel";
import { LeaveRequestForm } from "./features/leave-requests/LeaveRequestForm";
import { LeaveRequestsPanel } from "./features/leave-requests/LeaveRequestsPanel";
import { MyLeaveRequestsPanel } from "./features/leave-requests/MyLeaveRequestsPanel";
import { ProfilePanel } from "./features/profile/ProfilePanel";
import { UsersPanel } from "./features/users/UsersPanel";
import { clearStoredSession, getStoredSession, setStoredSession } from "./lib/storage";
import type { AppView, User } from "./types";

export function App() {
  const storedSession = getStoredSession();
  const [token, setToken] = useState<string | null>(storedSession?.token ?? null);
  const [user, setUser] = useState<User | null>(storedSession?.user ?? null);
  const [activeView, setActiveView] = useState<AppView>("leaves");
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);

  function handleAuthenticated(nextToken: string, nextUser: User) {
    setToken(nextToken);
    setUser(nextUser);
    setStoredSession(nextToken, nextUser);
  }

  function handleLogout() {
    clearStoredSession();
    setToken(null);
    setUser(null);
    setIsProfileViewOpen(false);
  }

  if (!token || !user) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  if (isProfileViewOpen) {
    return <ProfilePanel user={user} onBack={() => setIsProfileViewOpen(false)} />;
  }

  return (
    <DashboardShell
      activeView={activeView}
      onLogout={handleLogout}
      onNavigate={(view) => {
        setActiveView(view);
        setIsProfileViewOpen(false);
      }}
      onViewProfile={() => setIsProfileViewOpen(true)}
      user={user}
    >
      {user.roleName === "PendingUser" ? (
        <PendingUserPanel user={user} />
      ) : user.roleName === "Manager" ? (
        activeView === "users" ? <UsersPanel token={token} /> : <LeaveRequestsPanel token={token} />
      ) : (
        activeView === "my-leaves" ? <MyLeaveRequestsPanel token={token} /> : <LeaveRequestForm token={token} user={user} />
      )}
    </DashboardShell>
  );
}
