import { User } from '../types';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: ('student' | 'lecturer' | 'admin')[];
}

// פונקציה שמחזירה את התפריטים המותרים למשתמש לפי התפקיד שלו
export const getMenuItemsForUser = (user: User | null): MenuItem[] => {
  if (!user) {
    return []; // אם המשתמש לא מחובר, אין תפריטים
  }

  // כל התפריטים הזמינים
  const allMenuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'עמוד בית',
      path: '/',
      icon: null, // האייקון יוגדר ב-Header component
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'students',
      label: 'ניהול לימודים',
      path: '/students',
      icon: null,
      roles: ['lecturer', 'admin'] // רק למרצים ומנהלים
    },
    {
      id: 'forms',
      label: 'ניהול',
      path: '/forms',
      icon: null,
      roles: ['lecturer', 'admin'] // רק למרצים ומנהלים
    },
    {
      id: 'profile',
      label: 'פרופיל אישי',
      path: '/profile',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'learning',
      label: 'מרכז הלימודים',
      path: '/learning',
      icon: null,
      roles: ['student'] // רק לסטודנטים
    },
    {
      id: 'cafeteria',
      label: 'קפיטריה',
      path: '/cafeteria',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'lostfound',
      label: 'מציאות ואבדות',
      path: '/lost-found',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'community',
      label: 'קהילה',
      path: '/community',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'forum',
      label: 'פורום קורס',
      path: '/forum',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'help',
      label: 'עזרה',
      path: '/help',
      icon: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'debug',
      label: 'דיבוג',
      path: '/debug',
      icon: null,
      roles: ['lecturer', 'admin'] // רק למרצים ומנהלים
    }
  ];

  // סינון התפריטים לפי התפקיד של המשתמש
  return allMenuItems.filter(item => item.roles.includes(user.role));
};

// פונקציה שבודקת אם למשתמש יש הרשאה לגשת לנתיב מסוים
export const hasPermissionForRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  
  const menuItems = getMenuItemsForUser(user);
  return menuItems.some(item => item.path === route);
};

// פונקציה שמחזירה את רשימת הנתיבים המותרים למשתמש
export const getAllowedRoutes = (user: User | null): string[] => {
  if (!user) return ['/'];
  
  const menuItems = getMenuItemsForUser(user);
  return menuItems.map(item => item.path);
};
