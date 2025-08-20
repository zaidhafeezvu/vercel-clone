import { useState, useEffect, createContext, useContext } from 'react';
import { authClient } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionData = await authClient.getSession();
      setSession(sessionData);
    } catch (error) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data) => {
    const result = await authClient.signIn(data);
    setSession(result);
    return result;
  };

  const signUp = async (data) => {
    const result = await authClient.signUp(data);
    setSession(result);
    return result;
  };

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}