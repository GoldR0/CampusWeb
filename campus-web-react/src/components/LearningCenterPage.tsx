import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY } from '../constants/theme';
import { User } from '../types';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface LearningCenterPageProps {
  currentUser: User | null;
}

interface StudentCourse {
  courseId: string;
  courseName: string;
  lecturer: string;
  semester: string;
  year: string;
  credits: string;
  createdAt: string;
}

interface StudentTask {
  id: string;
  title: string;
  type: string;
  date: string;
  course: string;
  createdAt: string;
}

const LearningCenterPage: React.FC<LearningCenterPageProps> = ({ currentUser }) => {
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [studentTasks, setStudentTasks] = useState<StudentTask[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Custom color theme
  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // Load student's courses and tasks
  useEffect(() => {
    if (currentUser) {
      // Load courses from localStorage
      const savedCourses = null; // Courses are now managed through Firestore
      if (savedCourses) {
        try {
          const allCourses = JSON.parse(savedCourses);
          const userCourses = allCourses.filter((course: { selectedStudents?: string[] }) => 
            course.selectedStudents && course.selectedStudents.includes(currentUser.id)
          );
          setStudentCourses(userCourses);
          
          // Load tasks from localStorage after courses are loaded
          const savedTasks = null; // Tasks are now managed through Firestore
          if (savedTasks) {
            try {
              const allTasks = JSON.parse(savedTasks);
              const userTasks = allTasks.filter((task: { course: string }) => {
                // Find if the task's course is in student's courses
                return userCourses.some((course: { courseId: string }) => course.courseId === task.course);
              });
              setStudentTasks(userTasks);
            } catch (error) {
              // Error loading tasks
            }
          }
        } catch (error) {
          // Error loading courses
        }
      }
    }
  }, [currentUser]);

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'assignment': return 'מטלה';
      case 'exam': return 'מבחן';
      case 'quiz': return 'בוחן';
      case 'presentation': return 'הצגה';
      default: return type;
    }
  };

  const getSemesterLabel = (semester: string) => {
    switch (semester) {
      case 'a': return 'סמסטר א';
      case 'b': return 'סמסטר ב';
      case 'summer': return 'סמסטר קיץ';
      default: return semester;
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            יש להתחבר כדי לצפות במרכז הלימודים
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        p: 3, 
        backgroundColor: customColors.primaryLight + '20',
        borderRadius: 2,
        border: `2px solid ${customColors.primary}`
      }}>
        <SchoolIcon sx={{ fontSize: 40, mr: 2, color: customColors.primary }} />
        <Box>
          <Typography variant="h4" sx={{ ...TYPOGRAPHY.h4, color: CUSTOM_COLORS.primary }}>
            מרכז הלימודים
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ברוך הבא, {currentUser.name}! הנה הקורסים והמטלות שלך
          </Typography>
        </Box>
      </Box>

      {/* Student Info */}
      <Card sx={{ mb: 4, border: `2px solid ${customColors.primary}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: customColors.primary }} />
            <Typography variant="h6" sx={{ ...TYPOGRAPHY.h6, color: CUSTOM_COLORS.primary }}>
              מידע אישי
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">שם מלא:</Typography>
              <Typography variant="body1" fontWeight="medium">{currentUser.name}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">אימייל:</Typography>
              <Typography variant="body1">{currentUser.email}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">תפקיד:</Typography>
              <Chip 
                label={currentUser.role === 'student' ? 'סטודנט' : 'מרצה'} 
                color="primary" 
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ ...TYPOGRAPHY.h5, color: CUSTOM_COLORS.primary, mb: 3 }}>
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          הקורסים שלי ({studentCourses.length})
        </Typography>
        
        {studentCourses.length === 0 ? (
          <Card sx={{ border: `2px solid ${customColors.primary}` }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                אין לך קורסים רשומים עדיין
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3 
          }}>
            {studentCourses.map((course) => (
              <Card key={course.courseId} sx={{ border: `2px solid ${customColors.primary}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1, color: customColors.primary }} />
                    <Typography variant="h6" sx={TYPOGRAPHY.h6}>
                      {course.courseName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">מרצה:</Typography>
                    <Typography variant="body1">{course.lecturer}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={getSemesterLabel(course.semester)} 
                      size="small" 
                      color="secondary"
                    />
                    <Chip 
                      label={`שנה ${course.year}`} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${course.credits} נקודות`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    מזהה: {course.courseId}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Tasks Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ ...TYPOGRAPHY.h5, color: CUSTOM_COLORS.primary, mb: 3 }}>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          המטלות שלי ({studentTasks.length})
        </Typography>
        
        {studentTasks.length === 0 ? (
          <Card sx={{ border: `2px solid ${customColors.primary}` }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                אין לך מטלות עדיין
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ border: `2px solid ${customColors.primary}` }}>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
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
                </Box>
                
                {studentTasks.map((task) => (
                  <Box key={task.id} sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Box sx={{ fontWeight: 'bold', color: customColors.primary }}>{task.id}</Box>
                    <Box>{task.title}</Box>
                    <Box>
                      <Chip 
                        label={getTaskTypeLabel(task.type)} 
                        size="small" 
                        color="primary"
                      />
                    </Box>
                    <Box>{task.date}</Box>
                    <Box>{task.course}</Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

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
    </Container>
  );
};

export default LearningCenterPage;
