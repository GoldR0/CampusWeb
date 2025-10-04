// Students Page Component
// Manages student data and displays it using the StudentsTable component
// Handles data fetching, filtering, and actions

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  FormHelperText,
  LinearProgress
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY } from '../constants/theme';
import { User } from '../types';
import {
  Add as AddIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { StudentsTable } from '../components/tables';
import { Student, Course as CourseType, Task as TaskType } from '../types';
import { 
  getAllStudents, 
  getStudentsStatistics,
  getStudentsByStatus,
  getHighGPAStudents
} from '../data/studentsData';
import { addStudent, listStudents, deleteStudent, updateAllStudentGPAs } from '../fireStore/studentsService';
import { addCourse, listCourses, updateCourse, deleteCourse } from '../fireStore/coursesService';
import { addTask, listTasks, deleteTask } from '../fireStore/tasksService';

interface TaskFormData {
  title: string;
  type: string;
  date: string;
  course: string;
}

interface CourseFormData {
  courseId: string;
  courseName: string;
  lecturer: string;
  semester: string;
  year: string;
  students: string;
  credits: string;
  selectedStudents: string[];
}

interface Task extends TaskFormData {
  id: string;
  createdAt: string;
}

interface Course extends CourseFormData {
  createdAt: string;
  selectedStudents: string[];
}

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  year: number;
  semester: 'א' | 'ב' | 'ג';
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
}

interface StudentValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  year?: string;
  semester?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface CourseValidationErrors {
  courseName?: string;
  lecturer?: string;
  semester?: string;
  year?: string;
  credits?: string;
}

interface TaskValidationErrors {
  title?: string;
  type?: string;
  date?: string;
  course?: string;
}

const StudentsPage: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [taskCounter, setTaskCounter] = useState(1);
  const [courseCounter, setCourseCounter] = useState(1);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    type: '',
    date: '',
    course: ''
  });
  const [courseFormData, setCourseFormData] = useState<CourseFormData>({
    courseId: `COURSE-${String(courseCounter).padStart(3, '0')}`,
    courseName: '',
    lecturer: '',
    semester: '',
    year: '2025',
    students: '',
    credits: '',
    selectedStudents: []
  });

  // Tables data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Delete dialogs state
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Student selection dialog state
  const [studentSelectionDialogOpen, setStudentSelectionDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Student form dialog state
  const [studentFormDialogOpen, setStudentFormDialogOpen] = useState(false);
  const [studentFormData, setStudentFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: 'מדעי המחשב',
    year: 1,
    semester: 'א' as 'א' | 'ב' | 'ג',
    city: 'תל אביב',
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });
  const [studentErrors, setStudentErrors] = useState<StudentValidationErrors>({});
  const [studentTouched, setStudentTouched] = useState<Record<string, boolean>>({});

  // Course validation state
  const [courseErrors, setCourseErrors] = useState<CourseValidationErrors>({});
  const [courseTouched, setCourseTouched] = useState<Record<string, boolean>>({});

  // Task validation state
  const [taskErrors, setTaskErrors] = useState<TaskValidationErrors>({});
  const [taskTouched, setTaskTouched] = useState<Record<string, boolean>>({});

  // Load statistics on component mount
  useEffect(() => {
    setStatistics(getStudentsStatistics());
  }, []);

  // Handle deep link editing - open edit dialog if ID is in URL
  useEffect(() => {
    if (id && students.length > 0) {
      const studentToEdit = students.find(student => student.id === id);
      if (studentToEdit) {
        setSelectedStudent(studentToEdit);
        setViewDialogOpen(true);
        // Clear the URL parameter
        navigate('/students', { replace: true });
      }
    }
  }, [id, students, navigate]);

  // Handle view student - navigate to student details page
  const handleViewStudent = (student: Student) => {
    navigate(`/students/${student.id}`);
  };

  // Handle edit student - navigate to edit page
  const handleEditStudent = (student: Student) => {
    navigate(`/students/${student.id}/edit`);
  };

  // Handle delete student
  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (selectedStudent) {
      try {
        await deleteStudent(selectedStudent.id);
        // Update students state after Firestore deletion
        setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('studentsUpdated'));
        setNotification({
          message: `הסטודנט ${selectedStudent.fullName} נמחק בהצלחה`,
          type: 'success'
        });
      } catch (error) {
        setNotification({
          message: 'שגיאה במחיקת הסטודנט מהמסד',
          type: 'error'
        });
      } finally {
        setDeleteDialogOpen(false);
        setSelectedStudent(null);
      }
    }
  };

  // Get statistics
  const getActiveStudents = () => getStudentsByStatus('active');
  const getHighGPAStudentsList = () => getHighGPAStudents();

  // Validation functions for student form
  const validateStudentName = (name: string, fieldName: string): string | undefined => {
    if (!name) return `${fieldName} הוא שדה חובה`;
    if (name.length < 2) return `${fieldName} חייב להכיל לפחות 2 תווים`;
    if (name.length > 50) return `${fieldName} לא יכול לעלות על 50 תווים`;
    const nameRegex = /^[א-ת\s]+$/;
    if (!nameRegex.test(name)) return `${fieldName} יכול להכיל אותיות עבריות בלבד`;
    return undefined;
  };

  const validateStudentEmail = (email: string): string | undefined => {
    if (!email) return 'אימייל הוא שדה חובה';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'פורמט אימייל לא תקין';
    return undefined;
  };

  const validateStudentPhone = (phone: string): string | undefined => {
    if (!phone) return 'מספר טלפון הוא שדה חובה';
    const phoneRegex = /^[\d\s\-+()]{9,15}$/;
    if (!phoneRegex.test(phone)) return 'מספר טלפון לא תקין';
    return undefined;
  };

  const validateStudentRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateStudentField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        return validateStudentName(value, 'שם פרטי');
      case 'lastName':
        return validateStudentName(value, 'שם משפחה');
      case 'email':
        return validateStudentEmail(value);
      case 'phone':
        return validateStudentPhone(value);
      case 'address':
        return validateStudentRequired(value, 'כתובת');
      case 'department':
        return validateStudentRequired(value, 'חוג');
      case 'semester':
        return validateStudentRequired(value, 'סמסטר');
      case 'city':
        return validateStudentRequired(value, 'עיר');
      case 'emergencyContact':
        return validateStudentRequired(value, 'איש קשר לשעת חירום');
      case 'emergencyPhone':
        return validateStudentPhone(value);
      default:
        return undefined;
    }
  };

  const validateStudentForm = (): boolean => {
    const newErrors: StudentValidationErrors = {};
    let isValid = true;

    Object.keys(studentFormData).forEach(field => {
      if (field !== 'notes' && field !== 'year') { // Skip notes and year validation
        const error = validateStudentField(field, studentFormData[field as keyof StudentFormData] as string);
        if (error) {
          newErrors[field as keyof StudentValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setStudentErrors(newErrors);
    return isValid;
  };

  // Student form handlers
  const handleStudentInputChange = (field: string, value: string | number) => {
    setStudentFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (studentErrors[field as keyof StudentValidationErrors]) {
      setStudentErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleStudentBlur = (field: string) => {
    setStudentTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateStudentField(field, studentFormData[field as keyof StudentFormData] as string);
    setStudentErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const shouldShowStudentError = (field: string): boolean => {
    return studentTouched[field] && !!studentErrors[field as keyof StudentValidationErrors];
  };

  // Open student form dialog
  const openStudentFormDialog = () => {
    setStudentFormDialogOpen(true);
  };

  // Add new student with form data
  const addNewStudent = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(studentFormData).reduce((acc, field) => {
      if (field !== 'notes') {
        acc[field] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setStudentTouched(allTouched);

    if (validateStudentForm()) {
      try {
        // Generate unique ID and student number
        const newId = Date.now().toString();
        const newStudentNumber = `2024${String(students.length + 1).padStart(3, '0')}`;
        
        // Create new student object
        const newStudent: Student = {
          id: newId,
          studentNumber: newStudentNumber,
          firstName: studentFormData.firstName,
          lastName: studentFormData.lastName,
          fullName: `${studentFormData.firstName} ${studentFormData.lastName}`,
          email: studentFormData.email,
          phone: studentFormData.phone,
          address: studentFormData.address,
          department: studentFormData.department,
          year: studentFormData.year,
          semester: studentFormData.semester,
          creditsCompleted: 0,
          gpa: 0.0,
          birthDate: new Date().toISOString().split('T')[0],
          age: 18,
          gender: 'male',
          city: studentFormData.city,
          status: 'active',
          enrollmentDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString().split('T')[0],
          emergencyContact: studentFormData.emergencyContact,
          emergencyPhone: studentFormData.emergencyPhone,
          notes: studentFormData.notes || 'סטודנט חדש שנוסף למערכת'
        };

        // Add to students array
        const updatedStudents = [...students, newStudent];
        setStudents(updatedStudents);

        // Students are now managed through Firestore
        addStudent(newStudent)
        .then(() => {
          window.dispatchEvent(new CustomEvent('studentsUpdated'));

          setNotification({
            message: `סטודנט חדש נוסף בהצלחה! מספר סטודנט: ${newStudentNumber}`,
            type: 'success'
          });
                  // Reset form and close dialog
        setStudentFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          department: 'מדעי המחשב',
          year: 1,
          semester: 'א',
          city: 'תל אביב',
          emergencyContact: '',
          emergencyPhone: '',
          notes: ''
        });
        setStudentErrors({});
        setStudentTouched({});
        setStudentFormDialogOpen(false);
        
      })
        .catch((error) => {
          setNotification({
            message: 'שגיאה בהוספת סטודנט חדש',
            type: 'error'
          });
        });
        
        
        
        // Dispatch custom event to notify other components
        //window.dispatchEvent(new CustomEvent('studentsUpdated'));

        // setNotification({
        //   message: `סטודנט חדש נוסף בהצלחה! מספר סטודנט: ${newStudentNumber}`,
        //   type: 'success'
        // });
        
        // Reset form and close dialog
        // setStudentFormData({
        //   firstName: '',
        //   lastName: '',
        //   email: '',
        //   phone: '',
        //   address: '',
        //   department: 'מדעי המחשב',
        //   year: 1,
        //   semester: 'א',
        //   city: 'תל אביב',
        //   emergencyContact: '',
        //   emergencyPhone: '',
        //   notes: ''
        // });
        // setStudentErrors({});
        // setStudentTouched({});
        // setStudentFormDialogOpen(false);
        
      } catch (error) {
        // Error adding new student
        setNotification({
          message: 'שגיאה בהוספת סטודנט חדש',
          type: 'error'
        });
      }

    }
     else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  const handleClearStudentForm = () => {
    setStudentFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: 'מדעי המחשב',
      year: 1,
      semester: 'א' as 'א' | 'ב' | 'ג',
      city: 'תל אביב',
      emergencyContact: '',
      emergencyPhone: '',
      notes: ''
    });
    setStudentErrors({});
    setStudentTouched({});
  };

  // Course validation functions
  const validateCourseName = (courseName: string): string | undefined => {
    if (!courseName) return 'שם הקורס הוא שדה חובה';
    if (courseName.length < 3) return 'שם הקורס חייב להכיל לפחות 3 תווים';
    if (courseName.length > 100) return 'שם הקורס לא יכול לעלות על 100 תווים';
    return undefined;
  };

  const validateLecturer = (lecturer: string): string | undefined => {
    if (!lecturer) return 'מרצה אחראי הוא שדה חובה';
    if (lecturer.length < 2) return 'שם המרצה חייב להכיל לפחות 2 תווים';
    if (lecturer.length > 50) return 'שם המרצה לא יכול לעלות על 50 תווים';
    const nameRegex = /^[א-ת\s]+$/;
    if (!nameRegex.test(lecturer)) return 'שם המרצה יכול להכיל אותיות עבריות בלבד';
    return undefined;
  };

  const validateCourseRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateCourseYear = (year: string): string | undefined => {
    if (!year) return 'שנה היא שדה חובה';
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 2024 || yearNum > 2030) {
      return 'שנה חייבת להיות בין 2024 ל-2030';
    }
    return undefined;
  };

  const validateCourseCredits = (credits: string): string | undefined => {
    if (!credits) return 'נקודות זכות הוא שדה חובה';
    const creditsNum = parseInt(credits);
    if (isNaN(creditsNum) || creditsNum < 1 || creditsNum > 10) {
      return 'נקודות זכות חייבות להיות בין 1 ל-10';
    }
    return undefined;
  };

  const validateCourseField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'courseName':
        return validateCourseName(value);
      case 'lecturer':
        return validateLecturer(value);
      case 'semester':
        return validateCourseRequired(value, 'סמסטר');
      case 'year':
        return validateCourseYear(value);
      case 'credits':
        return validateCourseCredits(value);
      default:
        return undefined;
    }
  };

  const validateCourseForm = (): boolean => {
    const newErrors: CourseValidationErrors = {};
    let isValid = true;

    Object.keys(courseFormData).forEach(field => {
      if (field !== 'courseId' && field !== 'students' && field !== 'selectedStudents') {
        const error = validateCourseField(field, courseFormData[field as keyof CourseFormData] as string);
        if (error) {
          newErrors[field as keyof CourseValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setCourseErrors(newErrors);
    return isValid;
  };

  const shouldShowCourseError = (field: string): boolean => {
    return courseTouched[field] && !!courseErrors[field as keyof CourseValidationErrors];
  };

  // Task validation functions
  const validateTaskTitle = (title: string): string | undefined => {
    if (!title) return 'כותרת המטלה היא שדה חובה';
    if (title.length < 3) return 'כותרת המטלה חייב להכיל לפחות 3 תווים';
    if (title.length > 100) return 'כותרת המטלה לא יכולה לעלות על 100 תווים';
    return undefined;
  };

  const validateTaskType = (type: string): string | undefined => {
    if (!type) return 'סוג המטלה הוא שדה חובה';
    if (type.length < 2) return 'סוג המטלה חייב להכיל לפחות 2 תווים';
    if (type.length > 50) return 'סוג המטלה לא יכול לעלות על 50 תווים';
    return undefined;
  };

  const validateTaskDate = (date: string): string | undefined => {
    if (!date) return 'תאריך המטלה הוא שדה חובה';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'תאריך המטלה לא יכול להיות בעבר';
    }
    
    return undefined;
  };

  const validateTaskCourse = (course: string): string | undefined => {
    if (!course) return 'קורס הוא שדה חובה';
    return undefined;
  };

  const validateTaskRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateTaskField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'title':
        return validateTaskTitle(value);
      case 'type':
        return validateTaskType(value);
      case 'date':
        return validateTaskDate(value);
      case 'course':
        return validateTaskCourse(value);
      default:
        return undefined;
    }
  };

  const validateTaskForm = (): boolean => {
    const newErrors: TaskValidationErrors = {};
    let isValid = true;

    Object.keys(taskFormData).forEach(field => {
      if (field !== 'id' && field !== 'status' && field !== 'createdAt') {
        const error = validateTaskField(field, taskFormData[field as keyof TaskFormData] as string);
        if (error) {
          newErrors[field as keyof TaskValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setTaskErrors(newErrors);
    return isValid;
  };

  const shouldShowTaskError = (field: string): boolean => {
    return taskTouched[field] && !!taskErrors[field as keyof TaskValidationErrors];
  };



  // Force reload students data from Firestore
  const forceReloadStudents = async () => {
    setIsLoading(true);
    try {
      // Load fresh data from Firestore
      const allStudents = await listStudents();
      setStudents(allStudents);
      setStatistics(getStudentsStatistics());
    } catch (error) {
      console.error('Error loading students from Firestore:', error);
      // Fallback to demo data if Firestore fails
      const allStudents = getAllStudents();
      setStudents(allStudents);
      setStatistics(getStudentsStatistics());
    } finally {
      setIsLoading(false);
    }
  };

  // Update all student GPAs from 0-4 scale to 0-100 scale
  const handleUpdateGPAs = async () => {
    try {
      await updateAllStudentGPAs();
      setNotification({ message: 'הציונים עודכנו בהצלחה מ-0-4 ל-0-100!', type: 'success' });
      // Reload students to show updated data
      await forceReloadStudents();
    } catch (error) {
      console.error('Error updating GPAs:', error);
      setNotification({ message: 'שגיאה בעדכון הציונים', type: 'error' });
    }
  };

  // Load students from Firestore on component mount
  useEffect(() => {
    // Force reload on first load to ensure we have the correct data
    forceReloadStudents();

    const loadCoursesFromFirestore = async () => {
      try {
        // Load courses from Firestore
        const firestoreCourses = await listCourses();
        if (firestoreCourses.length > 0) {
          // Convert Firestore courses to local format
          const localCourses: Course[] = firestoreCourses.map(course => ({
            courseId: course.id,
            courseName: course.name,
            lecturer: course.instructor,
            semester: 'a', // Default semester
            year: '2025', // Default year
            students: '0',
            credits: course.credits.toString(),
            selectedStudents: [],
            createdAt: new Date().toLocaleString('he-IL')
          }));
          setCourses(localCourses);
        } else {
          // Create initial courses if none exist in Firestore
          const courseNames = [
            'מבוא למדעי המחשב',
            'אלגוריתמים',
            'מבני נתונים',
            'מסדי נתונים',
            'תכנות מונחה עצמים',
            'רשתות מחשבים',
            'אבטחת מידע',
            'בינה מלאכותית',
            'פיתוח אפליקציות',
            'ניהול פרויקטים'
          ];
          
          const initialCourses: Course[] = Array.from({ length: 10 }, (_, index) => ({
            courseId: `COURSE-${String(index + 1).padStart(3, '0')}`,
            courseName: courseNames[index],
            lecturer: `ד"ר ${['כהן', 'לוי', 'ישראלי', 'אברהם', 'גולד'][index % 5]}`,
            semester: ['a', 'b', 'summer'][index % 3],
            year: '2025',
            students: '0',
            credits: String((index % 4) + 2),
            selectedStudents: [],
            createdAt: new Date().toLocaleString('he-IL')
          }));
          
          setCourses(initialCourses);
          
          // Save initial courses to Firestore
          for (const course of initialCourses) {
            try {
              const courseData = {
                id: course.courseId,
                name: course.courseName,
                code: course.courseId,
                instructor: course.lecturer,
                credits: parseInt(course.credits),
                status: 'active' as const,
                progress: 0
              };
              await addCourse(new CourseType(courseData));
            } catch (error) {
              console.error('Error adding initial course to Firestore:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading courses from Firestore:', error);
      }
    };

    const loadTasksFromFirestore = async () => {
      try {
        // Load tasks from Firestore
        const firestoreTasks = await listTasks();
        if (firestoreTasks.length > 0) {
          // Convert Firestore tasks to local format
          const localTasks: Task[] = firestoreTasks.map(task => ({
            id: task.id,
            title: task.title,
            type: task.type,
            date: task.dueDate,
            course: task.course,
            createdAt: new Date().toLocaleString('he-IL')
          }));
          setTasks(localTasks);
        } else {
          // Create initial tasks if none exist in Firestore
          const taskTitles = [
            'מטלת תכנות בסיסית',
            'מבחן אלגוריתמים',
            'בוחן מבני נתונים',
            'הצגת פרויקט',
            'מטלת מסדי נתונים',
            'מבחן רשתות',
            'בוחן אבטחה',
            'הצגת בינה מלאכותית',
            'מטלת פיתוח',
            'מבחן ניהול פרויקטים'
          ];
          
          const initialTasks: Task[] = Array.from({ length: 10 }, (_, index) => ({
            id: `task-${index + 1}`,
            title: taskTitles[index],
            type: ['assignment', 'exam', 'quiz', 'presentation'][index % 4],
            date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            course: `COURSE-${String(index + 1).padStart(3, '0')}`,
            createdAt: new Date().toLocaleString('he-IL')
          }));
          
          setTasks(initialTasks);
          
          // Save initial tasks to Firestore
          for (const task of initialTasks) {
            try {
              const taskData = {
                id: task.id,
                title: task.title,
                type: task.type as 'exam' | 'assignment' | 'homework' | 'quiz' | 'presentation',
                course: task.course,
                dueDate: task.date,
                priority: 'medium' as const,
                status: 'pending' as const,
                description: task.title
              };
              await addTask(new TaskType(taskData));
            } catch (error) {
              console.error('Error adding initial task to Firestore:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading tasks from Firestore:', error);
      }
    };

    loadCoursesFromFirestore();
    loadTasksFromFirestore();
  }, []);

  // Task form handlers
  const handleTaskInputChange = (field: string, value: string) => {
    setTaskFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (taskErrors[field as keyof TaskValidationErrors]) {
      setTaskErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleTaskBlur = (field: string) => {
    setTaskTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateTaskField(field, taskFormData[field as keyof TaskFormData] as string);
    setTaskErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleTaskSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(taskFormData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTaskTouched(allTouched);

    if (validateTaskForm()) {
      // בדיקה שהקורס קיים בטבלת הקורסים
      const courseExists = courses.some(course => course.courseId === taskFormData.course);
      
      if (!courseExists) {
        setNotification({
          message: 'לא ניתן ליצור מטלה עבור קורס שלא קיים. אנא בחר קורס מהרשימה.',
          type: 'error'
        });
        return;
      }

      // Create new task with creation date
      const newTask: Task = {
        id: `task-${Date.now()}`, // Generate unique ID using timestamp
        ...taskFormData,
        createdAt: new Date().toLocaleString('he-IL')
      };

      // Add to tasks array
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);

      // Persist to Firestore and notify
      (async () => {
        try {
          const taskData = {
            id: newTask.id,
            title: newTask.title,
            type: newTask.type as 'exam' | 'assignment' | 'homework' | 'quiz' | 'presentation',
            course: newTask.course,
            dueDate: newTask.date,
            priority: 'medium' as const,
            status: 'pending' as const,
            description: newTask.title
          };
          await addTask(new TaskType(taskData));
          window.dispatchEvent(new CustomEvent('tasksUpdated'));
        } catch (error) {
          console.error('Error saving task to Firestore:', error);
        }
      })();

      setNotification({
        message: `מטלה חדשה נוצרה בהצלחה!`,
        type: 'success'
      });
      
      setTaskFormData({
        title: '',
        type: '',
        date: '',
        course: ''
      });
      setTaskErrors({});
      setTaskTouched({});
    } else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  // Course form handlers
  const handleCourseInputChange = (field: string, value: string | string[]) => {
    setCourseFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (courseErrors[field as keyof CourseValidationErrors]) {
      setCourseErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCourseBlur = (field: string) => {
    setCourseTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateCourseField(field, courseFormData[field as keyof CourseFormData] as string);
    setCourseErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleCourseSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(courseFormData).reduce((acc, field) => {
      if (field !== 'courseId' && field !== 'students' && field !== 'selectedStudents') {
        acc[field] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setCourseTouched(allTouched);

    if (validateCourseForm()) {
      // Create new course with creation date
      const newCourse: Course = {
        ...courseFormData,
        createdAt: new Date().toLocaleString('he-IL'),
        selectedStudents: courseFormData.selectedStudents
      };

      // Add to courses array
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);

      // Persist to Firestore and notify
      (async () => {
        try {
          const courseData = {
            id: newCourse.courseId,
            name: newCourse.courseName,
            code: newCourse.courseId,
            instructor: newCourse.lecturer,
            credits: parseInt(newCourse.credits),
            status: 'active' as const,
            progress: 0
          };
          await addCourse(new CourseType(courseData));
          window.dispatchEvent(new CustomEvent('coursesUpdated'));
        } catch (error) {
          console.error('Error saving course to Firestore:', error);
        }
      })();

      setNotification({
        message: `קורס חדש נוצר בהצלחה! מזהה: ${courseFormData.courseId}`,
        type: 'success'
      });
      
      setCourseCounter(prev => prev + 1);
      setCourseFormData({
        courseId: `COURSE-${String(courseCounter + 1).padStart(3, '0')}`,
        courseName: '',
        lecturer: '',
        semester: '',
        year: '2025',
        students: '',
        credits: '',
        selectedStudents: []
      });
      setCourseErrors({});
      setCourseTouched({});
    } else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  // Student selection functions
  const handleOpenStudentSelection = () => {
    setStudentSelectionDialogOpen(true);
  };

  const handleStudentToggle = (studentId: string) => {
    setCourseFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  };

  const handleConfirmStudentSelection = () => {
    const selectedCount = courseFormData.selectedStudents.length;
    setCourseFormData(prev => ({
      ...prev,
      students: selectedCount.toString()
    }));
    setStudentSelectionDialogOpen(false);
    setNotification({
      message: `נבחרו ${selectedCount} סטודנטים לקורס`,
      type: 'success'
    });
  };

  const getSelectedStudentNames = () => {
    return courseFormData.selectedStudents
      .map(studentId => students.find(s => s.id === studentId)?.fullName)
      .filter(Boolean)
      .join(', ');
  };

  // Edit course students functions
  const handleEditCourseStudents = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData(prev => ({
      ...prev,
      selectedStudents: course.selectedStudents || []
    }));
    setEditMode(true);
    setStudentSelectionDialogOpen(true);
  };

  const handleConfirmEditStudentSelection = () => {
    if (editingCourse) {
      const selectedCount = courseFormData.selectedStudents.length;
      
      // Update the course in the courses array
      const updatedCourses = courses.map(course => {
        if (course.courseId === editingCourse.courseId) {
          return {
            ...course,
            students: selectedCount.toString(),
            selectedStudents: courseFormData.selectedStudents
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Persist to Firestore (update course students) and notify
      (async () => {
        try {
          const courseData = {
            id: editingCourse.courseId,
            name: editingCourse.courseName,
            code: editingCourse.courseId,
            instructor: editingCourse.lecturer,
            credits: parseInt(editingCourse.credits),
            status: 'active' as const,
            progress: 0
          };
          await updateCourse(new CourseType(courseData));
          window.dispatchEvent(new CustomEvent('coursesUpdated'));
        } catch (error) {
          console.error('Error updating course students in Firestore:', error);
        }
      })();

      setNotification({
        message: `עודכנו ${selectedCount} סטודנטים בקורס ${editingCourse.courseName}`,
        type: 'success'
      });
    }
    
    setStudentSelectionDialogOpen(false);
    setEditMode(false);
    setEditingCourse(null);
    setCourseFormData(prev => ({
      ...prev,
      selectedStudents: []
    }));
  };

  const getCourseStudentNames = (course: Course) => {
    return (course.selectedStudents || [])
      .map(studentId => students.find(s => s.id === studentId)?.fullName)
      .filter(Boolean)
      .join(', ');
  };

  // Delete functions
  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteTaskDialogOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    // בדיקה אם יש מטלות שמשתמשות בקורס זה
    const tasksUsingCourse = tasks.filter(task => task.course === course.courseId);
    
    if (tasksUsingCourse.length > 0) {
      setNotification({
        message: `לא ניתן למחוק קורס זה כי יש ${tasksUsingCourse.length} מטלות שמשתמשות בו. מחק תחילה את המטלות.`,
        type: 'error'
      });
      return;
    }

    setCourseToDelete(course);
    setDeleteCourseDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);
      setTasks(updatedTasks);
      
      // Delete from Firestore and notify
      (async () => {
        try {
          await deleteTask(taskToDelete.id);
          window.dispatchEvent(new CustomEvent('tasksUpdated'));
        } catch (error) {
          console.error('Error deleting task from Firestore:', error);
        }
      })();
      
      setNotification({
        message: `המטלה "${taskToDelete.title}" נמחקה בהצלחה`,
        type: 'success'
      });
      setDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      const updatedCourses = courses.filter(course => course.courseId !== courseToDelete.courseId);
      setCourses(updatedCourses);
      
      // Delete from Firestore and notify
      (async () => {
        try {
          await deleteCourse(courseToDelete.courseId);
          window.dispatchEvent(new CustomEvent('coursesUpdated'));
        } catch (error) {
          console.error('Error deleting course from Firestore:', error);
        }
      })();
      
      setNotification({
        message: `הקורס "${courseToDelete.courseName}" נמחק בהצלחה`,
        type: 'success'
      });
      setDeleteCourseDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Loading Progress */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 4,
              backgroundColor: 'rgba(179, 209, 53, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgb(179, 209, 53)'
              }
            }} 
          />
        </Box>
      )}

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ ...TYPOGRAPHY.h4, color: CUSTOM_COLORS.primary }}>
          <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          ניהול לימודים
        </Typography>
        <Typography variant="body1" color="text.secondary">
          מערכת ניהול מקיפה לסטודנטים במכללה
        </Typography>
      </Box>

      {/* Statistics Cards */}
      {statistics && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card sx={{ 
            border: '2px solid rgb(179, 209, 53)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'rgb(179, 209, 53)', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {statistics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ סטודנטים
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            border: '2px solid rgb(179, 209, 53)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'rgb(179, 209, 53)', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {statistics.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סטודנטים פעילים
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            border: '2px solid rgb(179, 209, 53)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'rgb(179, 209, 53)', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {statistics.averageGPA}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ממוצע ציונים
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            border: '2px solid rgb(179, 209, 53)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: 'rgb(179, 209, 53)', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {getHighGPAStudentsList().length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סטודנטים מצטיינים
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openStudentFormDialog}
          sx={{ 
            backgroundColor: 'rgb(179, 209, 53)',
            '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
          }}
        >
          הוספת סטודנט חדש
        </Button>

        <Button
          variant="outlined"
          startIcon={<TrendingUpIcon />}
          onClick={handleUpdateGPAs}
          sx={{ 
            borderColor: 'rgb(179, 209, 53)',
            color: 'rgb(179, 209, 53)',
            '&:hover': { 
              borderColor: 'rgb(159, 189, 33)',
              backgroundColor: 'rgba(179, 209, 53, 0.1)'
            }
          }}
        >
          עדכון ציונים ל-0-100
        </Button>

      </Box>

      {/* Students Table */}
      {isLoading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress 
            sx={{ 
              height: 4,
              backgroundColor: 'rgba(179, 209, 53, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgb(179, 209, 53)'
              }
            }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            טוען נתוני סטודנטים...
          </Typography>
        </Box>
      ) : (
        <StudentsTable
          students={students}
          onViewStudent={handleViewStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {/* Forms Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)', mb: 3 }}>
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          ניהול קורסים ומטלות
        </Typography>
        
        {/* Task Form */}
        <Card sx={{ mb: 4, border: '2px solid rgb(179, 209, 53)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssignmentIcon sx={{ mr: 1, color: 'rgb(179, 209, 53)' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>
                יצירת מטלה חדשה
              </Typography>
            </Box>
            
            {courses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  אין קורסים זמינים. יש ליצור קורס תחילה לפני יצירת מטלה.
                </Typography>
                <Chip 
                  label="צור קורס חדש" 
                  color="primary" 
                  variant="outlined"
                  onClick={() => {
                    // Scroll to course form
                    const courseForm = document.querySelector('[data-course-form]');
                    if (courseForm) {
                      courseForm.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="כותרת"
                    value={taskFormData.title}
                    onChange={(e) => handleTaskInputChange('title', e.target.value)}
                    onBlur={() => handleTaskBlur('title')}
                    error={shouldShowTaskError('title')}
                    helperText={shouldShowTaskError('title') ? taskErrors.title : ''}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(179, 209, 53)'
                        }
                      }
                    }}
                  />
                  <FormControl fullWidth error={shouldShowTaskError('type')} required>
                    <InputLabel>סוג</InputLabel>
                    <Select
                      value={taskFormData.type}
                      onChange={(e) => handleTaskInputChange('type', e.target.value)}
                      onBlur={() => handleTaskBlur('type')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgb(179, 209, 53)'
                          }
                        }
                      }}
                    >
                      <MenuItem value="assignment">מטלה</MenuItem>
                      <MenuItem value="exam">מבחן</MenuItem>
                      <MenuItem value="quiz">בוחן</MenuItem>
                      <MenuItem value="presentation">הצגה</MenuItem>
                    </Select>
                    {shouldShowTaskError('type') && (
                      <FormHelperText>{taskErrors.type}</FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    type="date"
                    label="תאריך"
                    value={taskFormData.date}
                    onChange={(e) => handleTaskInputChange('date', e.target.value)}
                    onBlur={() => handleTaskBlur('date')}
                    error={shouldShowTaskError('date')}
                    helperText={shouldShowTaskError('date') ? taskErrors.date : 'תאריך לא יכול להיות בעבר'}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(179, 209, 53)'
                        }
                      }
                    }}
                  />
                  <FormControl fullWidth error={shouldShowTaskError('course')} required>
                    <InputLabel>קורס</InputLabel>
                    <Select
                      value={taskFormData.course}
                      onChange={(e) => handleTaskInputChange('course', e.target.value)}
                      onBlur={() => handleTaskBlur('course')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgb(179, 209, 53)'
                          }
                        }
                      }}
                    >
                      <MenuItem value="">בחר קורס</MenuItem>
                      {courses.map(course => (
                        <MenuItem key={course.courseId} value={course.courseId}>
                          {course.courseName} ({course.courseId})
                        </MenuItem>
                      ))}
                    </Select>
                    {shouldShowTaskError('course') && (
                      <FormHelperText>{taskErrors.course}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleTaskSubmit}
                    sx={{
                      backgroundColor: 'rgb(179, 209, 53)',
                      '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
                    }}
                  >
                    יצירת מטלה
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Course Form */}
        <Card sx={{ border: '2px solid rgb(179, 209, 53)' }} data-course-form>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BookIcon sx={{ mr: 1, color: 'rgb(179, 209, 53)' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>
                יצירת קורס חדש
              </Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <TextField
                fullWidth
                label="מזהה קורס"
                value={courseFormData.courseId}
                InputProps={{ 
                  readOnly: true,
                  sx: { 
                    backgroundColor: '#f5f5f5',
                    '& .MuiInputBase-input': {
                      color: '#666',
                      fontWeight: 'bold'
                    }
                  }
                }}
                helperText="נוצר אוטומטית"
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              <TextField
                fullWidth
                label="שם קורס"
                value={courseFormData.courseName}
                onChange={(e) => handleCourseInputChange('courseName', e.target.value)}
                onBlur={() => handleCourseBlur('courseName')}
                error={shouldShowCourseError('courseName')}
                helperText={shouldShowCourseError('courseName') ? courseErrors.courseName : ''}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="מרצה אחראי"
                value={courseFormData.lecturer}
                onChange={(e) => handleCourseInputChange('lecturer', e.target.value)}
                onBlur={() => handleCourseBlur('lecturer')}
                error={shouldShowCourseError('lecturer')}
                helperText={shouldShowCourseError('lecturer') ? courseErrors.lecturer : ''}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              />
              <FormControl fullWidth error={shouldShowCourseError('semester')} required>
                <InputLabel>סמסטר</InputLabel>
                <Select
                  value={courseFormData.semester}
                  onChange={(e) => handleCourseInputChange('semester', e.target.value)}
                  onBlur={() => handleCourseBlur('semester')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(179, 209, 53)'
                      }
                    }
                  }}
                >
                  <MenuItem value="a">סמסטר א</MenuItem>
                  <MenuItem value="b">סמסטר ב</MenuItem>
                  <MenuItem value="summer">סמסטר קיץ</MenuItem>
                </Select>
                {shouldShowCourseError('semester') && (
                  <FormHelperText>{courseErrors.semester}</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                label="שנה"
                value={courseFormData.year}
                onChange={(e) => handleCourseInputChange('year', e.target.value)}
                onBlur={() => handleCourseBlur('year')}
                error={shouldShowCourseError('year')}
                helperText={shouldShowCourseError('year') ? courseErrors.year : 'שנה בין 2024 ל-2030'}
                required
                inputProps={{ min: '2024', max: '2030' }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="סטודנטים רשומים"
                value={courseFormData.students}
                onChange={(e) => handleCourseInputChange('students', e.target.value)}
                type="number"
                inputProps={{ min: 0 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={handleOpenStudentSelection}
                      sx={{ mr: -1 }}
                    >
                      בחר סטודנטים
                    </Button>
                  )
                }}
              />
              {courseFormData.selectedStudents.length > 0 && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, mt: -2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    סטודנטים נבחרים: {getSelectedStudentNames()}
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth
                label="נקודות זכות"
                value={courseFormData.credits}
                onChange={(e) => handleCourseInputChange('credits', e.target.value)}
                onBlur={() => handleCourseBlur('credits')}
                error={shouldShowCourseError('credits')}
                helperText={shouldShowCourseError('credits') ? courseErrors.credits : 'נקודות זכות בין 1 ל-10'}
                type="number"
                inputProps={{ min: 1, max: 10 }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleCourseSubmit}
                sx={{
                  backgroundColor: 'rgb(179, 209, 53)',
                  '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
                }}
              >
                יצירת קורס
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tables Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)', mb: 3 }}>
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          רשימת מטלות וקורסים
        </Typography>

        {/* Tasks Table */}
        <Card sx={{ mb: 4, border: '2px solid rgb(179, 209, 53)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssignmentIcon sx={{ mr: 1, color: 'rgb(179, 209, 53)' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>
                מטלות שנוצרו ({tasks.length})
              </Typography>
            </Box>
            
            {tasks.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                אין מטלות עדיין. צור מטלה חדשה באמצעות הטופס למעלה.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr 1fr 1fr auto auto',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  <Box>מזהה</Box>
                  <Box>כותרת</Box>
                  <Box>סוג</Box>
                  <Box>תאריך</Box>
                  <Box>קורס</Box>
                  <Box>פעולות</Box>
                </Box>
                
                {tasks.map((task, index) => (
                  <Box key={task.id} sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr 1fr 1fr auto auto',
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Box sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>{task.id}</Box>
                    <Box>{task.title}</Box>
                    <Box>
                      <Chip 
                        label={task.type === 'assignment' ? 'מטלה' : 
                               task.type === 'exam' ? 'מבחן' : 
                               task.type === 'quiz' ? 'בוחן' : 'הצגה'} 
                        size="small" 
                        color="primary"
                      />
                    </Box>
                    <Box>{task.date}</Box>
                    <Box>{task.course}</Box>
                    <Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTask(task)}
                        sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card sx={{ border: '2px solid rgb(179, 209, 53)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BookIcon sx={{ mr: 1, color: 'rgb(179, 209, 53)' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>
                קורסים שנוצרו ({courses.length})
              </Typography>
            </Box>
            
            {courses.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                אין קורסים עדיין. צור קורס חדש באמצעות הטופס למעלה.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr 1fr auto auto auto',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  <Box>מזהה</Box>
                  <Box>שם קורס</Box>
                  <Box>מרצה</Box>
                  <Box>סמסטר</Box>
                  <Box>שנה</Box>
                  <Box>סטודנטים</Box>
                  <Box>נקודות</Box>
                  <Box>פעולות</Box>
                </Box>
                
                {courses.map((course, index) => (
                  <Box key={course.courseId} sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr 1fr auto auto auto',
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Box sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>{course.courseId}</Box>
                    <Box>{course.courseName}</Box>
                    <Box>{course.lecturer}</Box>
                    <Box>
                      <Chip 
                        label={course.semester === 'a' ? 'סמסטר א' : 
                               course.semester === 'b' ? 'סמסטר ב' : 'סמסטר קיץ'} 
                        size="small" 
                        color="secondary"
                      />
                    </Box>
                    <Box>{course.year}</Box>
                    <Box>
                      <Typography variant="body2">
                        {course.students || '-'}
                      </Typography>
                    </Box>
                    <Box>{course.credits || '-'}</Box>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCourseStudents(course)}
                        sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' } }}
                      >
                        <PeopleIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCourse(course)}
                        sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* View Student Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: 'rgb(179, 209, 53)', color: 'white' }}>
          פרטי סטודנט
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedStudent && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3 
            }}>
              <Box>
                <Typography variant="h6" gutterBottom>מידע בסיסי</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">שם מלא:</Typography>
                  <Typography variant="body1" fontWeight="medium">{selectedStudent.fullName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">מספר סטודנט:</Typography>
                  <Typography variant="body1">{selectedStudent.studentNumber}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">חוג:</Typography>
                  <Chip label={selectedStudent.department} color="primary" size="small" />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">שנה:</Typography>
                  <Typography variant="body1">שנה {selectedStudent.year}</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>מידע אקדמי</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">ממוצע ציונים:</Typography>
                  <Chip 
                    label={selectedStudent.gpa <= 4.0 ? (selectedStudent.gpa * 25).toFixed(1) : selectedStudent.gpa.toFixed(1)} 
                    color={selectedStudent.gpa <= 4.0 ? 
                      (selectedStudent.gpa * 25 >= 87.5 ? 'success' : selectedStudent.gpa * 25 >= 75 ? 'warning' : 'error') :
                      (selectedStudent.gpa >= 87.5 ? 'success' : selectedStudent.gpa >= 75 ? 'warning' : 'error')
                    }
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">נקודות זכות:</Typography>
                  <Typography variant="body1">{selectedStudent.creditsCompleted}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">סטטוס:</Typography>
                  <Chip 
                    label={selectedStudent.status === 'active' ? 'פעיל' : 'לא פעיל'} 
                    color={selectedStudent.status === 'active' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">סמסטר:</Typography>
                  <Typography variant="body1">{selectedStudent.semester}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>פרטי קשר</Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2 
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">אימייל:</Typography>
                    <Typography variant="body1">{selectedStudent.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">טלפון:</Typography>
                    <Typography variant="body1">{selectedStudent.phone}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <Typography variant="body2" color="text.secondary">כתובת:</Typography>
                    <Typography variant="body1">{selectedStudent.address}</Typography>
                  </Box>
                </Box>
              </Box>
              
              {selectedStudent.notes && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>הערות</Typography>
                  <Typography variant="body1">{selectedStudent.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>סגור</Button>
          <Button 
            variant="contained"
            sx={{ 
              backgroundColor: 'rgb(179, 209, 53)',
              '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
            }}
          >
            עריכה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הסטודנט {selectedStudent?.fullName}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type} 
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={deleteTaskDialogOpen} onClose={() => setDeleteTaskDialogOpen(false)}>
        <DialogTitle>אישור מחיקת מטלה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המטלה "{taskToDelete?.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTaskDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDeleteTask} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Course Confirmation Dialog */}
      <Dialog open={deleteCourseDialogOpen} onClose={() => setDeleteCourseDialogOpen(false)}>
        <DialogTitle>אישור מחיקת קורס</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הקורס {courseToDelete?.courseName}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCourseDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDeleteCourse} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Selection Dialog */}
      <Dialog 
        open={studentSelectionDialogOpen} 
        onClose={() => {
          setStudentSelectionDialogOpen(false);
          setEditMode(false);
          setEditingCourse(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? `עריכת סטודנטים בקורס ${editingCourse?.courseName}` : 'בחירת סטודנטים לקורס'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {editMode ? 'עדכן את הסטודנטים בקורס:' : 'סמן את הסטודנטים שברצונך לצרף לקורס:'}
          </Typography>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {students.map((student) => (
              <ListItem key={student.id} disablePadding>
                <ListItemButton 
                  dense
                  onClick={() => handleStudentToggle(student.id)}
                >
                  <Checkbox
                    edge="start"
                    checked={courseFormData.selectedStudents.includes(student.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={student.fullName}
                    secondary={`${student.studentNumber} - ${student.department}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {courseFormData.selectedStudents.length > 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                נבחרו {courseFormData.selectedStudents.length} סטודנטים
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setStudentSelectionDialogOpen(false);
            setEditMode(false);
            setEditingCourse(null);
          }}>
            ביטול
          </Button>
          <Button 
            onClick={editMode ? handleConfirmEditStudentSelection : handleConfirmStudentSelection}
            variant="contained"
            sx={{ 
              backgroundColor: 'rgb(179, 209, 53)',
              '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
            }}
          >
            {editMode ? 'עדכן בחירה' : 'אישור בחירה'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Form Dialog */}
      <Dialog 
        open={studentFormDialogOpen} 
        onClose={() => setStudentFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: 'rgb(179, 209, 53)', color: 'white' }}>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          הוספת סטודנט חדש
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <TextField
              fullWidth
              label="שם פרטי"
              value={studentFormData.firstName}
              onChange={(e) => handleStudentInputChange('firstName', e.target.value)}
              onBlur={() => handleStudentBlur('firstName')}
              error={shouldShowStudentError('firstName')}
              helperText={shouldShowStudentError('firstName') ? studentErrors.firstName : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="שם משפחה"
              value={studentFormData.lastName}
              onChange={(e) => handleStudentInputChange('lastName', e.target.value)}
              onBlur={() => handleStudentBlur('lastName')}
              error={shouldShowStudentError('lastName')}
              helperText={shouldShowStudentError('lastName') ? studentErrors.lastName : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              type="email"
              label="אימייל"
              value={studentFormData.email}
              onChange={(e) => handleStudentInputChange('email', e.target.value)}
              onBlur={() => handleStudentBlur('email')}
              error={shouldShowStudentError('email')}
              helperText={shouldShowStudentError('email') ? studentErrors.email : ''}
              required
              sx={{ 
                gridColumn: { xs: '1', md: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="טלפון"
              value={studentFormData.phone}
              onChange={(e) => handleStudentInputChange('phone', e.target.value)}
              onBlur={() => handleStudentBlur('phone')}
              error={shouldShowStudentError('phone')}
              helperText={shouldShowStudentError('phone') ? studentErrors.phone : 'פורמט: 050-1234567'}
              required
              placeholder="050-1234567"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="כתובת"
              value={studentFormData.address}
              onChange={(e) => handleStudentInputChange('address', e.target.value)}
              onBlur={() => handleStudentBlur('address')}
              error={shouldShowStudentError('address')}
              helperText={shouldShowStudentError('address') ? studentErrors.address : ''}
              required
              sx={{ 
                gridColumn: { xs: '1', md: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <FormControl fullWidth error={shouldShowStudentError('department')} required>
              <InputLabel>חוג</InputLabel>
              <Select
                value={studentFormData.department}
                onChange={(e) => handleStudentInputChange('department', e.target.value)}
                onBlur={() => handleStudentBlur('department')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              >
                <MenuItem value="מדעי המחשב">מדעי המחשב</MenuItem>
                <MenuItem value="הנדסה">הנדסה</MenuItem>
                <MenuItem value="ניהול">ניהול</MenuItem>
                <MenuItem value="אמנויות">אמנויות</MenuItem>
                <MenuItem value="רפואה">רפואה</MenuItem>
                <MenuItem value="משפטים">משפטים</MenuItem>
              </Select>
              {shouldShowStudentError('department') && (
                <FormHelperText>{studentErrors.department}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              type="number"
              label="שנה"
              value={studentFormData.year}
              onChange={(e) => handleStudentInputChange('year', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 4 }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <FormControl fullWidth error={shouldShowStudentError('semester')} required>
              <InputLabel>סמסטר</InputLabel>
              <Select
                value={studentFormData.semester}
                onChange={(e) => handleStudentInputChange('semester', e.target.value)}
                onBlur={() => handleStudentBlur('semester')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              >
                <MenuItem value="א">סמסטר א</MenuItem>
                <MenuItem value="ב">סמסטר ב</MenuItem>
                <MenuItem value="ג">סמסטר קיץ</MenuItem>
              </Select>
              {shouldShowStudentError('semester') && (
                <FormHelperText>{studentErrors.semester}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              label="עיר"
              value={studentFormData.city}
              onChange={(e) => handleStudentInputChange('city', e.target.value)}
              onBlur={() => handleStudentBlur('city')}
              error={shouldShowStudentError('city')}
              helperText={shouldShowStudentError('city') ? studentErrors.city : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="איש קשר לשעת חירום"
              value={studentFormData.emergencyContact}
              onChange={(e) => handleStudentInputChange('emergencyContact', e.target.value)}
              onBlur={() => handleStudentBlur('emergencyContact')}
              error={shouldShowStudentError('emergencyContact')}
              helperText={shouldShowStudentError('emergencyContact') ? studentErrors.emergencyContact : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="טלפון לשעת חירום"
              value={studentFormData.emergencyPhone}
              onChange={(e) => handleStudentInputChange('emergencyPhone', e.target.value)}
              onBlur={() => handleStudentBlur('emergencyPhone')}
              error={shouldShowStudentError('emergencyPhone')}
              helperText={shouldShowStudentError('emergencyPhone') ? studentErrors.emergencyPhone : 'פורמט: 050-1234567'}
              required
              placeholder="050-1234567"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="הערות (אופציונלי)"
              value={studentFormData.notes}
              onChange={(e) => handleStudentInputChange('notes', e.target.value)}
              sx={{ 
                gridColumn: { xs: '1', md: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClearStudentForm}
            sx={{
              borderColor: 'rgb(179, 209, 53)',
              color: 'rgb(179, 209, 53)',
              '&:hover': {
                borderColor: 'rgb(159, 189, 33)',
                backgroundColor: 'rgba(179, 209, 53, 0.1)'
              }
            }}
          >
            נקה טופס
          </Button>
          <Button
            onClick={() => setStudentFormDialogOpen(false)}
            sx={{
              borderColor: 'rgb(179, 209, 53)',
              color: 'rgb(179, 209, 53)',
              '&:hover': {
                borderColor: 'rgb(159, 189, 33)',
                backgroundColor: 'rgba(179, 209, 53, 0.1)'
              }
            }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={addNewStudent}
            sx={{
              backgroundColor: 'rgb(179, 209, 53)',
              '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
            }}
          >
            הוספת סטודנט
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentsPage;
