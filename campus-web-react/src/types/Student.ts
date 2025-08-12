// Student entity type definition
// Represents a student in the campus management system

export interface Student {
  // Basic Information
  id: string;                    // Unique student ID
  studentNumber: string;         // Student number (e.g., "2024001")
  firstName: string;             // First name
  lastName: string;              // Last name
  fullName: string;              // Full name (computed)
  
  // Contact Information
  email: string;                 // Student email (must be valid format)
  phone: string;                 // Phone number
  address: string;               // Home address
  
  // Academic Information
  department: string;            // Department/Program
  year: number;                  // Academic year (1-4)
  semester: 'א' | 'ב' | 'ג';     // Current semester
  creditsCompleted: number;      // Total credits completed
  gpa: number;                   // Grade Point Average (0.0-4.0)
  
  // Personal Information
  birthDate: string;             // Birth date (YYYY-MM-DD)
  age: number;                   // Age (computed)
  gender: 'male' | 'female' | 'other';
  city: string;                  // City of residence
  
  // Status Information
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: string;        // Date of enrollment (YYYY-MM-DD)
  lastActive: string;            // Last activity date (YYYY-MM-DD)
  
  // Additional Information
  emergencyContact: string;      // Emergency contact name
  emergencyPhone: string;        // Emergency contact phone
  notes?: string;                // Optional notes
}

// Validation rules and constants
export const STUDENT_VALIDATION = {
  MIN_YEAR: 1,
  MAX_YEAR: 4,
  MIN_GPA: 0.0,
  MAX_GPA: 4.0,
  MIN_AGE: 16,
  MAX_AGE: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\-\+\(\)\s]+$/,
  STUDENT_NUMBER_REGEX: /^\d{7}$/
} as const;

// Helper functions for validation
export const validateStudent = (student: Student): string[] => {
  const errors: string[] = [];
  
  // Basic validations
  if (!student.firstName.trim()) errors.push('שם פרטי הוא שדה חובה');
  if (!student.lastName.trim()) errors.push('שם משפחה הוא שדה חובה');
  if (!STUDENT_VALIDATION.EMAIL_REGEX.test(student.email)) errors.push('כתובת אימייל לא תקינה');
  if (!STUDENT_VALIDATION.PHONE_REGEX.test(student.phone)) errors.push('מספר טלפון לא תקין');
  
  // Academic validations
  if (student.year < STUDENT_VALIDATION.MIN_YEAR || student.year > STUDENT_VALIDATION.MAX_YEAR) {
    errors.push(`שנת לימודים חייבת להיות בין ${STUDENT_VALIDATION.MIN_YEAR} ל-${STUDENT_VALIDATION.MAX_YEAR}`);
  }
  if (student.gpa < STUDENT_VALIDATION.MIN_GPA || student.gpa > STUDENT_VALIDATION.MAX_GPA) {
    errors.push(`ממוצע ציונים חייב להיות בין ${STUDENT_VALIDATION.MIN_GPA} ל-${STUDENT_VALIDATION.MAX_GPA}`);
  }
  
  // Age validation
  if (student.age < STUDENT_VALIDATION.MIN_AGE || student.age > STUDENT_VALIDATION.MAX_AGE) {
    errors.push(`גיל חייב להיות בין ${STUDENT_VALIDATION.MIN_AGE} ל-${STUDENT_VALIDATION.MAX_AGE}`);
  }
  
  return errors;
};

// Helper function to get student display name
export const getStudentDisplayName = (student: Student): string => {
  return `${student.firstName} ${student.lastName}`;
};

// Helper function to get student status in Hebrew
export const getStudentStatusInHebrew = (status: Student['status']): string => {
  const statusMap = {
    active: 'פעיל',
    inactive: 'לא פעיל',
    graduated: 'בוגר',
    suspended: 'מושעה'
  };
  return statusMap[status];
};

// Helper function to get semester in Hebrew
export const getSemesterInHebrew = (semester: Student['semester']): string => {
  const semesterMap = {
    'א': 'סמסטר א',
    'ב': 'סמסטר ב',
    'ג': 'סמסטר ג'
  };
  return semesterMap[semester];
};
