import { useState, createContext, useContext } from "react";

interface User {
  id: string;
  username: string;
  displayName: string | null; // We want this as `string | null` rather than `displayName?: string;` to match the bio, keep them normalized. And it will require some changes in both frontend and backend. We don't want two ways of representing "no data" ("" vs null) for strings
  bio: string | null;
}

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // null for now

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