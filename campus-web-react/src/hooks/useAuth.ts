import { useState, useEffect } from 'react';
import { User } from '../types';
import { demoUsers } from '../data/demoData';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // User authentication is now managed through Firestore
  useEffect(() => {
    // User authentication is now managed through Firestore
    // No need to load from localStorage
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = demoUsers[email];
    if (user && password === '123456') {
      setCurrentUser(user);
      
      // User authentication is now managed through Firestore
      
      return { success: true, message: 'התחברת בהצלחה!' };
    } else {
      return { success: false, message: 'שם משתמש או סיסמה שגויים' };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    
    // User authentication is now managed through Firestore
    
    return { success: true, message: 'התנתקת בהצלחה' };
  };

  return {
    currentUser,
    handleLogin,
    handleLogout
  };
};
