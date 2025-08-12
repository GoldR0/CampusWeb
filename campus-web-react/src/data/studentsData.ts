// Students data source
// Contains mock data for students in the campus management system
// This data follows the Student type definition and validation rules
// This data is used to test the campus management system
import { Student } from '../types/Student';

export const studentsData: Student[] = [
  {
    id: '1',
    studentNumber: '2024001',
    firstName: 'ישראל',
    lastName: 'ישראלי',
    fullName: 'ישראל ישראלי',
    email: 'israel.israeli@student.ono.ac.il',
    phone: '050-1234567',
    address: 'רחוב הרצל 15, תל אביב',
    department: 'מדעי המחשב',
    year: 2,
    semester: 'א',
    creditsCompleted: 45,
    gpa: 3.8,
    birthDate: '2002-05-15',
    age: 22,
    gender: 'male',
    city: 'תל אביב',
    status: 'active',
    enrollmentDate: '2022-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'שרה ישראלי',
    emergencyPhone: '050-9876543',
    notes: 'סטודנט מצטיין'
  },
  {
    id: '2',
    studentNumber: '2024002',
    firstName: 'מיכל',
    lastName: 'כהן',
    fullName: 'מיכל כהן',
    email: 'michal.cohen@student.ono.ac.il',
    phone: '052-2345678',
    address: 'רחוב ויצמן 8, ירושלים',
    department: 'פסיכולוגיה',
    year: 3,
    semester: 'ב',
    creditsCompleted: 78,
    gpa: 3.5,
    birthDate: '2001-08-22',
    age: 23,
    gender: 'female',
    city: 'ירושלים',
    status: 'active',
    enrollmentDate: '2021-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'דוד כהן',
    emergencyPhone: '052-8765432',
    notes: 'מתנדבת בקהילה'
  },
  {
    id: '3',
    studentNumber: '2024003',
    firstName: 'אברהם',
    lastName: 'לוי',
    fullName: 'אברהם לוי',
    email: 'avraham.levi@student.ono.ac.il',
    phone: '054-3456789',
    address: 'רחוב בן גוריון 12, חיפה',
    department: 'הנדסת חשמל',
    year: 1,
    semester: 'א',
    creditsCompleted: 15,
    gpa: 3.2,
    birthDate: '2003-12-10',
    age: 21,
    gender: 'male',
    city: 'חיפה',
    status: 'active',
    enrollmentDate: '2023-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'רחל לוי',
    emergencyPhone: '054-7654321'
  },
  {
    id: '4',
    studentNumber: '2024004',
    firstName: 'שירה',
    lastName: 'גולדברג',
    fullName: 'שירה גולדברג',
    email: 'shira.goldberg@student.ono.ac.il',
    phone: '053-4567890',
    address: 'רחוב רוטשילד 25, באר שבע',
    department: 'רפואה',
    year: 4,
    semester: 'ג',
    creditsCompleted: 120,
    gpa: 3.9,
    birthDate: '2000-03-18',
    age: 24,
    gender: 'female',
    city: 'באר שבע',
    status: 'active',
    enrollmentDate: '2020-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'יוסי גולדברג',
    emergencyPhone: '053-6543210',
    notes: 'סטודנטית מצטיינת, מנהיגה בפרויקטים קהילתיים'
  },
  {
    id: '5',
    studentNumber: '2024005',
    firstName: 'דניאל',
    lastName: 'ברק',
    fullName: 'דניאל ברק',
    email: 'daniel.barak@student.ono.ac.il',
    phone: '055-5678901',
    address: 'רחוב וינגייט 7, אשדוד',
    department: 'מנהל עסקים',
    year: 2,
    semester: 'ב',
    creditsCompleted: 52,
    gpa: 3.1,
    birthDate: '2002-11-05',
    age: 22,
    gender: 'male',
    city: 'אשדוד',
    status: 'inactive',
    enrollmentDate: '2022-10-01',
    lastActive: '2024-08-15',
    emergencyContact: 'מיכל ברק',
    emergencyPhone: '055-5432109',
    notes: 'השעה זמנית - שירות צבאי'
  },
  {
    id: '6',
    studentNumber: '2024006',
    firstName: 'נועה',
    lastName: 'שפירא',
    fullName: 'נועה שפירא',
    email: 'noa.shapira@student.ono.ac.il',
    phone: '056-6789012',
    address: 'רחוב הרצל 33, נתניה',
    department: 'חינוך',
    year: 3,
    semester: 'א',
    creditsCompleted: 85,
    gpa: 3.7,
    birthDate: '2001-07-14',
    age: 23,
    gender: 'female',
    city: 'נתניה',
    status: 'active',
    enrollmentDate: '2021-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'עמית שפירא',
    emergencyPhone: '056-4321098',
    notes: 'מתמחה בהוראה'
  },
  {
    id: '7',
    studentNumber: '2024007',
    firstName: 'יוסי',
    lastName: 'מרגלית',
    fullName: 'יוסי מרגלית',
    email: 'yossi.margalit@student.ono.ac.il',
    phone: '057-7890123',
    address: 'רחוב ויצמן 18, רמת גן',
    department: 'כלכלה',
    year: 1,
    semester: 'ב',
    creditsCompleted: 18,
    gpa: 2.8,
    birthDate: '2003-01-30',
    age: 21,
    gender: 'male',
    city: 'רמת גן',
    status: 'suspended',
    enrollmentDate: '2023-10-01',
    lastActive: '2024-11-20',
    emergencyContact: 'דינה מרגלית',
    emergencyPhone: '057-3210987',
    notes: 'השעה זמנית - בעיות משמעת'
  },
  {
    id: '8',
    studentNumber: '2024008',
    firstName: 'תמר',
    lastName: 'אברהמי',
    fullName: 'תמר אברהמי',
    email: 'tamar.avrahami@student.ono.ac.il',
    phone: '058-8901234',
    address: 'רחוב בן יהודה 42, ראשון לציון',
    department: 'אדריכלות',
    year: 4,
    semester: 'ג',
    creditsCompleted: 135,
    gpa: 3.6,
    birthDate: '2000-09-12',
    age: 24,
    gender: 'female',
    city: 'ראשון לציון',
    status: 'graduated',
    enrollmentDate: '2020-10-01',
    lastActive: '2024-12-01',
    emergencyContact: 'משה אברהמי',
    emergencyPhone: '058-2109876',
    notes: 'בוגרת מצטיינת, ממשיכה לתואר שני'
  }
];

// Helper function to get all students
export const getAllStudents = (): Student[] => {
  return studentsData;
};

// Helper function to get student by ID
export const getStudentById = (id: string): Student | undefined => {
  return studentsData.find(student => student.id === id);
};

// Helper function to get students by status
export const getStudentsByStatus = (status: Student['status']): Student[] => {
  return studentsData.filter(student => student.status === status);
};

// Helper function to get students by department
export const getStudentsByDepartment = (department: string): Student[] => {
  return studentsData.filter(student => student.department === department);
};

// Helper function to search students by name
export const searchStudentsByName = (searchTerm: string): Student[] => {
  const term = searchTerm.toLowerCase();
  return studentsData.filter(student => 
    student.firstName.toLowerCase().includes(term) ||
    student.lastName.toLowerCase().includes(term) ||
    student.fullName.toLowerCase().includes(term)
  );
};

// Helper function to get students with high GPA (above 3.5)
export const getHighGPAStudents = (): Student[] => {
  return studentsData.filter(student => student.gpa >= 3.5);
};

// Helper function to get students by year
export const getStudentsByYear = (year: number): Student[] => {
  return studentsData.filter(student => student.year === year);
};

// Statistics functions
export const getStudentsStatistics = () => {
  const total = studentsData.length;
  const active = studentsData.filter(s => s.status === 'active').length;
  const graduated = studentsData.filter(s => s.status === 'graduated').length;
  const averageGPA = studentsData.reduce((sum, student) => sum + student.gpa, 0) / total;
  
  return {
    total,
    active,
    graduated,
    averageGPA: Math.round(averageGPA * 100) / 100
  };
};
