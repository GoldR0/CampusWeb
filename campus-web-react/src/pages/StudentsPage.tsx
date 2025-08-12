// Students Page Component
// Manages student data and displays it using the StudentsTable component
// Handles data fetching, filtering, and actions

import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import StudentsTable from '../components/tables/StudentsTable';
import { Student } from '../types/Student';
import { 
  getAllStudents, 
  getStudentsStatistics,
  getStudentsByStatus,
  getHighGPAStudents
} from '../data/studentsData';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  // Load students data on component mount
  useEffect(() => {
    const loadStudents = () => {
      const allStudents = getAllStudents();
      setStudents(allStudents);
      setStatistics(getStudentsStatistics());
    };

    loadStudents();
  }, []);

  // Handle view student
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  // Handle edit student (placeholder for future implementation)
  const handleEditStudent = (student: Student) => {
    setNotification({
      message: `עריכת סטודנט: ${student.fullName} - פונקציונליות תתווסף בהמשך`,
      type: 'success'
    });
  };

  // Handle delete student
  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedStudent) {
      // In a real app, this would call an API
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setNotification({
        message: `הסטודנט ${selectedStudent.fullName} נמחק בהצלחה`,
        type: 'success'
      });
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  // Get statistics
  const getActiveStudents = () => getStudentsByStatus('active');
  const getHighGPAStudentsList = () => getHighGPAStudents();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'rgb(179, 209, 53)' }}>
          <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          ניהול סטודנטים
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
          sx={{ 
            backgroundColor: 'rgb(179, 209, 53)',
            '&:hover': { backgroundColor: 'rgb(159, 189, 33)' }
          }}
        >
          הוספת סטודנט חדש
        </Button>
        <Button
          variant="outlined"
          sx={{ 
            borderColor: 'rgb(179, 209, 53)',
            color: 'rgb(179, 209, 53)',
            '&:hover': { 
              borderColor: 'rgb(159, 189, 33)',
              backgroundColor: 'rgba(179, 209, 53, 0.1)'
            }
          }}
        >
          ייצוא לאקסל
        </Button>
        <Button
          variant="outlined"
          sx={{ 
            borderColor: 'rgb(179, 209, 53)',
            color: 'rgb(179, 209, 53)',
            '&:hover': { 
              borderColor: 'rgb(159, 189, 33)',
              backgroundColor: 'rgba(179, 209, 53, 0.1)'
            }
          }}
        >
          סינון מתקדם
        </Button>
      </Box>

      {/* Students Table */}
      <StudentsTable
        students={students}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

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
                    label={selectedStudent.gpa.toFixed(2)} 
                    color={selectedStudent.gpa >= 3.5 ? 'success' : 'warning'}
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
    </Container>
  );
};

export default StudentsPage;
