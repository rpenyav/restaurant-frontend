import React, { createContext, useContext, ReactNode } from "react";
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
  const userId = user ? user._id : null;
  const userRole = user ? user.role : null;

  return (
    <UserContext.Provider value={{ userId, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
