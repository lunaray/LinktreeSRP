import { createContext, useContext, useState, useCallback } from 'react';
import pb from '../../hooks/usePocketBase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => pb.authStore.model);

  const login = useCallback(async (email, password) => {
    await pb.collection('_superusers').authWithPassword(email, password);
    setAdmin(pb.authStore.model);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoggedIn: pb.authStore.isValid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
