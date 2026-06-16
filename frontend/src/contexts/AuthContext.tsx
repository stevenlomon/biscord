import { useState, createContext, useContext } from "react";

// Single source of truth for the online status mapping
const OnlineStatusMap = {
  1: "Online",
  2: "Idle",
  3: "Do Not Disturb",
  4: "Invisible",
} as const;

// Nifty TypeScript magic: extracts 1 | 2 | 3 | 4 as valid types
type OnlineStatusId = keyof typeof OnlineStatusMap;

interface User {
  id: string;
  createdAt: Date; // For the "Member since"
  username: string;
  displayName: string | null; // We want this as `string | null` rather than `displayName?: string;` to match the bio, keep them normalized. And it will require some changes in both frontend and backend. We don't want two ways of representing "no data" ("" vs null) for strings
  bio: string | null;
  profilePicURL: string | null;
  onlineStatusId: OnlineStatusId | null; // Will now look for the Id integer, not the string. Future proofing for translations and we eliminate the need for INNER JOINS in the backend. We're letting the database handle the data and React handle the UI (translating via `OnlineStatusMap[currentUser.onlineStatusId]`)
  onlineStatusUntil: Date | null;
}

// Defining the shape of the AuthContext
interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch< React.SetStateAction<User | null> >;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // null for now

  const value = {
    currentUser, setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;