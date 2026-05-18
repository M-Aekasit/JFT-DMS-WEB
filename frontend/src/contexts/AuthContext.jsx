import { createContext, useContext, useMemo } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import { defaultUserGroups, defaultUsers, pagePermissions } from "../data/security";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  users: "jft-mes-users-v1",
  userGroups: "jft-mes-user-groups-v1",
  currentUsername: "jft-mes-current-username-v1",
};

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [users, setUsers] = usePersistentState(STORAGE_KEYS.users, defaultUsers);
  const [userGroups, setUserGroups] = usePersistentState(STORAGE_KEYS.userGroups, defaultUserGroups);
  const [currentUsername, setCurrentUsername] = usePersistentState(STORAGE_KEYS.currentUsername, "");

  const currentUser = useMemo(() => {
    if (!currentUsername) return null;
    return users.find((user) => normalizeUsername(user.username) === normalizeUsername(currentUsername)) || null;
  }, [currentUsername, users]);

  const currentGroup = useMemo(() => {
    if (!currentUser) return null;
    return userGroups.find((group) => group.id === currentUser.groupId || group.groupCode === currentUser.groupId) || null;
  }, [currentUser, userGroups]);

  const login = async (username, password) => {
    const normalizedUsername = normalizeUsername(username);
    const user = users.find((item) => normalizeUsername(item.username) === normalizedUsername);

    if (!user || user.password !== password) {
      return { ok: false, message: "Username or password is incorrect." };
    }

    if (!user.isActive) {
      return { ok: false, message: "This user is inactive." };
    }

    const group = userGroups.find((item) => item.id === user.groupId || item.groupCode === user.groupId);
    if (!group || !group.isActive) {
      return { ok: false, message: "This user's group is inactive or missing." };
    }

    setCurrentUsername(user.username);
    return { ok: true, user };
  };

  const logout = () => {
    setCurrentUsername("");
  };

  const hasPermission = (sectionSlug) => {
    if (!currentUser || !currentGroup || !currentGroup.isActive) return false;
    return currentGroup.permissions?.includes(sectionSlug) || false;
  };

  const getDefaultSection = () => {
    const permissions = currentGroup?.permissions || [];
    const preferredOrder = [
      "line-maintenance",
      "dashboard",
      "line-production-update",
      "line-stop-update",
      "stop-reason-maintenance",
      "user-group-management",
      "user-management",
    ];

    return (
      preferredOrder.find((slug) => permissions.includes(slug)) ||
      pagePermissions.find((item) => permissions.includes(item.slug))?.slug ||
      "line-maintenance"
    );
  };

  const value = {
    users,
    setUsers,
    userGroups,
    setUserGroups,
    currentUser,
    currentGroup,
    isAuthenticated: !!currentUser,
    login,
    logout,
    hasPermission,
    getDefaultSection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
