import { useState, createContext, useContext } from "react";

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