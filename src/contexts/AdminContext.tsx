import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  showAdminLogin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  toggleAdminLogin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'greeneo.ltd@gmail.com',
  password: 'Singularity@2028'
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setShowAdminLogin(false);
  };

  const toggleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin);
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      showAdminLogin,
      loginAdmin,
      logoutAdmin,
      toggleAdminLogin
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}