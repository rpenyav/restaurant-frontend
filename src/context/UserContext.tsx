import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "./AuthContext";

interface UserContextType {
  userId: string | null;
  userRole: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = useMemo(() => (user ? user._id : null), [user]);
  const userRole = useMemo(() => (user ? user.role : null), [user]);

  const value = useMemo(() => ({ userId, userRole }), [userId, userRole]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
