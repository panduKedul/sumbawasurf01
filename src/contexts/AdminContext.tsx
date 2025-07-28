import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple encryption/decryption functions
const encrypt = (text: string): string => {
  return btoa(text.split('').reverse().join(''));
};

const decrypt = (encrypted: string): string => {
  return atob(encrypted).split('').reverse().join('');
};

interface AdminContextType {
  isAdminLoggedIn: boolean;
  showAdminLogin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  toggleAdminLogin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Encrypted admin credentials for security
const ENCRYPTED_ADMIN_CREDENTIALS = {
  email: encrypt('greeneo.ltd@gmail.com'),
  password: encrypt('Singularity@2028')
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    const decryptedEmail = decrypt(ENCRYPTED_ADMIN_CREDENTIALS.email);
    const decryptedPassword = decrypt(ENCRYPTED_ADMIN_CREDENTIALS.password);
    
    if (email === decryptedEmail && password === decryptedPassword) {
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