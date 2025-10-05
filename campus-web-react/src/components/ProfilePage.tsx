import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Avatar,
  FormHelperText
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY, BUTTON_STYLES } from '../constants/theme';
import { User } from '../types';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface ProfilePageProps {
  currentUser: User | null;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  year: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  year?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    department: '',
    year: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // טעינת נתוני המשתמש הנוכחי
  useEffect(() => {
    if (currentUser) {
      const nameParts = currentUser.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.city || '', // נשתמש ב-city ככתובת
        department: '', // נטען בהתאם לסוג המשתמש
        year: '' // נטען בהתאם לסוג המשתמש
      });
    }
  }, [currentUser]);

  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // פונקציות בדיקת תקינות
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'אימייל הוא שדה חובה';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'פורמט אימייל לא תקין';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'מספר טלפון הוא שדה חובה';
    const phoneRegex = /^[\d\s\-+()]{9,15}$/;
    if (!phoneRegex.test(phone)) return 'מספר טלפון לא תקין';
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name) return `${fieldName} הוא שדה חובה`;
    const nameRegex = /^[א-ת\s]+$/;
    if (!nameRegex.test(name)) return `${fieldName} יכול להכיל אותיות בלבד`;
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        return validateName(value, 'שם פרטי');
      case 'lastName':
        return validateName(value, 'שם משפחה');
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'address':
        return validateRequired(value, 'כתובת');
      case 'department':
        return validateRequired(value, 'חוג');
      case 'year':
        return validateRequired(value, 'שנה');
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // בדיקת שדות בסיסיים
    const basicFields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    basicFields.forEach(field => {
      const error = validateField(field, formData[field as keyof ProfileFormData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    // בדיקת שדות לפי סוג משתמש
    if (currentUser?.role === 'student') {
      const studentFields = ['department', 'year'];
      studentFields.forEach(field => {
        const error = validateField(field, formData[field as keyof ProfileFormData]);
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
          isValid = false;
        }
      });
    } else if (currentUser?.role === 'lecturer') {
      const lecturerFields = ['department'];
      lecturerFields.forEach(field => {
        const error = validateField(field, formData[field as keyof ProfileFormData]);
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // נקה שגיאה כשהמשתמש מתחיל להקליד
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateField(field, formData[field as keyof ProfileFormData]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleFormSubmit = async () => {
    // סמן את כל השדות כנגעו
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      try {
        // כאן אפשר להוסיף לוגיקה לשמירת הנתונים ב-Firestore
        // כרגע נשמור ב-localStorage לדוגמה
        
        const updatedUser = {
          ...currentUser,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          city: formData.address
        };

        // שמירה ב-localStorage (במקום Firestore כרגע)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        setNotification({
          message: 'הפרופיל עודכן בהצלחה!',
          type: 'success'
        });
        
        console.log('Profile updated:', updatedUser);
      } catch (error) {
        console.error('Error updating profile:', error);
        setNotification({
          message: 'שגיאה בעדכון הפרופיל',
          type: 'error'
        });
      }
    } else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  const handleClearForm = () => {
    if (currentUser) {
      const nameParts = currentUser.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.city || '',
        department: '',
        year: ''
      });
    }
    setErrors({});
    setTouched({});
  };

  const shouldShowError = (field: string): boolean => {
    return touched[field] && !!errors[field as keyof ValidationErrors];
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ ...TYPOGRAPHY.h3, color: CUSTOM_COLORS.primary }}>
          <PersonIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 40 }} />
          פרופיל אישי
        </Typography>
        <Typography variant="h6" color="text.secondary">
          עדכון פרטי המשתמש האישיים
        </Typography>
      </Box>

      {/* Profile Form Card */}
      <Card sx={{ 
        maxWidth: 800, 
        mx: 'auto',
        boxShadow: 3,
        border: `2px solid ${customColors.primary}`
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* User Avatar and Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: customColors.primary,
                mr: 3,
                fontSize: '2rem'
              }}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ ...TYPOGRAPHY.h5, color: CUSTOM_COLORS.primary }}>
                {currentUser?.name || 'משתמש'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser?.role === 'student' ? 'סטודנט' : 
                 currentUser?.role === 'lecturer' ? 'מרצה' : 'משתמש'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ ...TYPOGRAPHY.h5, mb: 3, textAlign: 'center' }}>
            עדכון פרטי הפרופיל
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <TextField
              fullWidth
              label="שם פרטי"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              error={shouldShowError('firstName')}
              helperText={shouldShowError('firstName') ? errors.firstName : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: customColors.primary
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="שם משפחה"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              error={shouldShowError('lastName')}
              helperText={shouldShowError('lastName') ? errors.lastName : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: customColors.primary
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              type="email"
              label="אימייל"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={shouldShowError('email')}
              helperText={shouldShowError('email') ? errors.email : ''}
              required
              sx={{ 
                gridColumn: { xs: '1', md: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: customColors.primary
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="טלפון"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={shouldShowError('phone')}
              helperText={shouldShowError('phone') ? errors.phone : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: customColors.primary
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="כתובת"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              error={shouldShowError('address')}
              helperText={shouldShowError('address') ? errors.address : ''}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: customColors.primary
                  }
                }
              }}
            />
            
            {/* שדות לסטודנטים בלבד */}
            {currentUser?.role === 'student' && (
              <>
                <FormControl fullWidth error={shouldShowError('department')} required>
                  <InputLabel>חוג</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    onBlur={() => handleBlur('department')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.primary
                        }
                      }
                    }}
                  >
                    <MenuItem value="computer-science">מדעי המחשב</MenuItem>
                    <MenuItem value="engineering">הנדסה</MenuItem>
                    <MenuItem value="business">ניהול</MenuItem>
                    <MenuItem value="arts">אמנויות</MenuItem>
                    <MenuItem value="medicine">רפואה</MenuItem>
                    <MenuItem value="law">משפטים</MenuItem>
                  </Select>
                  {shouldShowError('department') && (
                    <FormHelperText>{errors.department}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl fullWidth error={shouldShowError('year')} required>
                  <InputLabel>שנה</InputLabel>
                  <Select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    onBlur={() => handleBlur('year')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: customColors.primary
                        }
                      }
                    }}
                  >
                    <MenuItem value="1">שנה א</MenuItem>
                    <MenuItem value="2">שנה ב</MenuItem>
                    <MenuItem value="3">שנה ג</MenuItem>
                    <MenuItem value="4">שנה ד</MenuItem>
                  </Select>
                  {shouldShowError('year') && (
                    <FormHelperText>{errors.year}</FormHelperText>
                  )}
                </FormControl>
              </>
            )}
            
            {/* שדות למרצים */}
            {currentUser?.role === 'lecturer' && (
              <TextField
                fullWidth
                label="מחלקה"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                error={shouldShowError('department')}
                helperText={shouldShowError('department') ? errors.department : ''}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: customColors.primary
                    }
                  }
                }}
              />
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearForm}
              sx={BUTTON_STYLES.secondary}
            >
              נקה טופס
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleFormSubmit}
              sx={BUTTON_STYLES.primary}
            >
              שמור שינויים
            </Button>
          </Box>
        </CardContent>
      </Card>

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
          icon={notification?.type === 'success' ? <CheckCircleIcon /> : undefined}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
