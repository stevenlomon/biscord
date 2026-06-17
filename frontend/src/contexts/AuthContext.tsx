import { useState, createContext, useContext, useEffect } from "react";
import { type OnlineStatusId, type UserDTO } from "./../../../shared/types/user";

// Our Frontend-only UI Model using only hydrated string-converted Dates
interface User {
  id: string;
  createdAt: Date; // Hydrated Date!
  username: string;
  displayName: string | null; // We want this as `string | null` rather than `displayName?: string;` to match the bio, keep them normalized. And it will require some changes in both frontend and backend. We don't want two ways of representing "no data" ("" vs null) for strings
  bio: string | null;
  profilePicURL: string | null;
  onlineStatusId: OnlineStatusId | null; // Will now look for the Id integer, not the string. Future proofing for translations and we eliminate the need for INNER JOINS in the backend. We're letting the database handle the data and React handle the UI (translating via `OnlineStatusMap[currentUser.onlineStatusId]`)
  onlineStatusUntil: Date | null; // Hydrated Date!
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
  const [isLoadingSession, setIsLoadingSession] = useState(true); // block the UI initially

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3007/me', {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json() as { success: string, data: UserDTO };

          if (data?.success === "ok") {
            // Rehydrate the strings into Dates and re-set the user!
            setCurrentUser({
              id: data.data.id,
              createdAt: new Date(data.data.createdAt),
              username: data.data.username,
              displayName: data.data.displayName,
              bio: data.data.bio,
              profilePicURL: data.data.profilePicURL,
              onlineStatusId: data.data.onlineStatusId,
              onlineStatusUntil: data.data.onlineStatusUntil ? new Date(data.data.onlineStatusUntil) : null
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        // Whether it succeeded, failed, or we aren't logged in, we are done loading. Release the UI haha!
        setIsLoadingSession(false);
      }
    };

    checkSession();
  }, []); // Only on mount, and more specifically in this specific scenario: only on page refresh!

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