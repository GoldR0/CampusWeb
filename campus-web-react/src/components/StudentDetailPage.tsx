import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { ArrowBack, Edit, Email, Phone, LocationOn, School, CalendarToday, Person } from '@mui/icons-material';
import { Student } from '../types';
import { getStudentById } from '../fireStore/studentsService';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setError('Student ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const studentData = await getStudentById(id);
        if (studentData) {
          setStudent(studentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'graduated': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'inactive': return 'לא פעיל';
      case 'graduated': return 'סיים לימודים';
      case 'suspended': return 'מושעה';
      default: return status;
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'זכר';
      case 'female': return 'נקבה';
      case 'other': return 'אחר';
      default: return gender;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/students')}
          sx={{ mb: 2 }}
        >
          חזור לרשימת הסטודנטים
        </Button>
        <Alert severity="error">{error || 'Student not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/students')}
          variant="outlined"
        >
          חזור לרשימת הסטודנטים
        </Button>
        <Button
          startIcon={<Edit />}
          onClick={() => navigate(`/students/${student.id}/edit`)}
          variant="contained"
        >
          ערוך פרטים
        </Button>
      </Box>

      {/* Student Details */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1">
                {student.fullName}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מספר סטודנט: {student.studentNumber}
              </Typography>
              <Chip 
                label={getStatusText(student.status)} 
                color={getStatusColor(student.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            {/* Personal Information */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  פרטים אישיים
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <Email sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    אימייל
                  </Typography>
                  <Typography variant="body1">{student.email}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    טלפון
                  </Typography>
                  <Typography variant="body1">{student.phone}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    כתובת
                  </Typography>
                  <Typography variant="body1">{student.address}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    עיר
                  </Typography>
                  <Typography variant="body1">{student.city}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    מין
                  </Typography>
                  <Typography variant="body1">{getGenderText(student.gender)}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    גיל
                  </Typography>
                  <Typography variant="body1">{student.age}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    תאריך לידה
                  </Typography>
                  <Typography variant="body1">
                    {new Date(student.birthDate).toLocaleDateString('he-IL')}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Academic Information */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  פרטים אקדמיים
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <School sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    מחלקה
                  </Typography>
                  <Typography variant="body1">{student.department}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    שנת לימודים
                  </Typography>
                  <Typography variant="body1">{student.year}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    סמסטר
                  </Typography>
                  <Typography variant="body1">{student.semester}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    נקודות זכות שהושלמו
                  </Typography>
                  <Typography variant="body1">{student.creditsCompleted}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    ממוצע ציונים
                  </Typography>
                  <Typography variant="body1">
                    {student.gpa <= 4.0 ? (student.gpa * 25).toFixed(1) : student.gpa.toFixed(1)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    תאריך הרשמה
                  </Typography>
                  <Typography variant="body1">
                    {new Date(student.enrollmentDate).toLocaleDateString('he-IL')}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    פעילות אחרונה
                  </Typography>
                  <Typography variant="body1">
                    {new Date(student.lastActive).toLocaleDateString('he-IL')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Emergency Contact */}
          <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  פרטי קשר חירום
                </Typography>
                
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      שם איש קשר
                    </Typography>
                    <Typography variant="body1">{student.emergencyContact}</Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      טלפון חירום
                    </Typography>
                    <Typography variant="body1">{student.emergencyPhone}</Typography>
                  </Box>
                </Box>
              </Paper>
          </Box>

          {/* Notes */}
          {student.notes && (
            <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    הערות
                  </Typography>
                  <Typography variant="body1">{student.notes}</Typography>
                </Paper>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDetailPage;
