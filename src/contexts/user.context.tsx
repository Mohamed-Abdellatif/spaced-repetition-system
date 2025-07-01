import { useState, type ReactNode } from "react";
import { createContext } from "react";







interface UserContextType {
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any | null>>;
};

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {}, // no-op default function
});


type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const value = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
