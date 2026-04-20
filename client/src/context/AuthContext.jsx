import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";

const AuthContext = createContext(null);
const storageKey = "studymatch-auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem(storageKey);

    if (!storedSession) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedSession);

      if (!parsed?.token || typeof parsed.token !== "string") {
        localStorage.removeItem(storageKey);
        setLoading(false);
        return;
      }

      setToken(parsed.token);
    } catch {
      localStorage.removeItem(storageKey);
      setLoading(false);
    }
  }, []);

  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser(token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (userLoading) {
      return;
    }

    if (userError || !currentUser) {
      localStorage.removeItem(storageKey);
      setToken("");
      setUser(null);
    } else {
      setUser(currentUser.user);
    }
    setLoading(false);
  }, [token, userLoading, userError, currentUser]);

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(storageKey, JSON.stringify({ token: nextToken }));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(storageKey);
  };

  const value = {
    token,
    user,
    loading: loading || userLoading,
    persistSession,
    setUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
