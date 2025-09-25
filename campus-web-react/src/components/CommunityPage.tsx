import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Alert,
  Snackbar,
  FormHelperText
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY, BUTTON_STYLES } from '../constants/theme';
import { User } from '../types';
import { 
  Group as GroupIcon,
  Send as SendIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import FacilitiesCard from './dashboard/FacilitiesCard';

interface CommunityPageProps {
  currentUser: User | null;
}

interface InquiryFormData {
  inquiryId: string;
  category: string;
  description: string;
  date: string;
  location: string;
}

interface ValidationErrors {
  category?: string;
  description?: string;
  date?: string;
  location?: string;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ currentUser }) => {
  // Custom color theme
  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // Inquiry form state
  const [inquiryCounter, setInquiryCounter] = useState(1);
  const [inquiryFormData, setInquiryFormData] = useState<InquiryFormData>({
    inquiryId: `INQUIRY-${String(inquiryCounter).padStart(3, '0')}`,
    category: '',
    description: '',
    date: '',
    location: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load existing inquiries counter on component mount
  useEffect(() => {
    try {
      const savedInquiries = null; // Inquiries are now managed through Firestore
      if (savedInquiries) {
        const inquiries = JSON.parse(savedInquiries);
        if (inquiries.length > 0) {
          // Find the highest inquiry counter
          const maxId = Math.max(...inquiries.map((inquiry: { inquiryId: string }) => 
            parseInt(inquiry.inquiryId.split('-')[1])
          ));
          setInquiryCounter(maxId + 1);
          // Update form data with new counter
          setInquiryFormData(prev => ({
            ...prev,
            inquiryId: `INQUIRY-${String(maxId + 1).padStart(3, '0')}`
          }));
        }
      }
    } catch (error) {
      // Error loading inquiries counter from localStorage
    }
  }, []);

  // Validation functions
  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateDescription = (description: string): string | undefined => {
    if (!description) return 'תיאור הפנייה הוא שדה חובה';
    if (description.length < 10) return 'תיאור הפנייה חייב להכיל לפחות 10 תווים';
    if (description.length > 500) return 'תיאור הפנייה לא יכול לעלות על 500 תווים';
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location) return 'מיקום הוא שדה חובה';
    if (location.length < 3) return 'מיקום חייב להכיל לפחות 3 תווים';
    if (location.length > 100) return 'מיקום לא יכול לעלות על 100 תווים';
    return undefined;
  };

  const validateDate = (date: string): string | undefined => {
    if (!date) return 'תאריך הוא שדה חובה';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Allow dates from the past (remove the restriction)
    // if (selectedDate < today) {
    //   return 'תאריך לא יכול להיות בעבר';
    // }
    return undefined;
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'category':
        return validateRequired(value, 'קטגוריה');
      case 'description':
        return validateDescription(value);
      case 'date':
        return validateDate(value);
      case 'location':
        return validateLocation(value);
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(inquiryFormData).forEach(field => {
      if (field !== 'inquiryId') { // Skip inquiryId validation
        const error = validateField(field, inquiryFormData[field as keyof InquiryFormData]);
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Inquiry form handlers
  const handleInquiryInputChange = (field: string, value: string) => {
    setInquiryFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
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

    const error = validateField(field, inquiryFormData[field as keyof InquiryFormData]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleInquirySubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(inquiryFormData).reduce((acc, field) => {
      if (field !== 'inquiryId') {
        acc[field] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      // Create new inquiry object with additional metadata
      const newInquiry = {
        inquiryId: inquiryFormData.inquiryId,
        category: inquiryFormData.category as 'complaint' | 'improvement',
        description: inquiryFormData.description,
        date: inquiryFormData.date,
        location: inquiryFormData.location,
        createdAt: new Date().toLocaleString('he-IL'),
        user: currentUser?.name || 'משתמש אלמוני'
      };

      // Save to localStorage
      try {
        const existingInquiries = null; // Inquiries are now managed through Firestore
        const inquiries = existingInquiries ? JSON.parse(existingInquiries) : [];
        const updatedInquiries = [...inquiries, newInquiry];
        
        // Inquiries are now managed through Firestore
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('inquiriesUpdated'));
      } catch (error) {
        // Error saving inquiry to localStorage
      }
      
      setNotification({
        message: `פנייה חדשה נוצרה בהצלחה! מזהה: ${inquiryFormData.inquiryId}`,
        type: 'success'
      });
      
      setInquiryCounter(prev => prev + 1);
      setInquiryFormData({
        inquiryId: `INQUIRY-${String(inquiryCounter + 1).padStart(3, '0')}`,
        category: '',
        description: '',
        date: '',
        location: ''
      });
      setErrors({});
      setTouched({});
    } else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  const handleClearForm = () => {
    setInquiryFormData({
      inquiryId: `INQUIRY-${String(inquiryCounter).padStart(3, '0')}`,
      category: '',
      description: '',
      date: '',
      location: ''
    });
    setErrors({});
    setTouched({});
  };

  const shouldShowError = (field: string): boolean => {
    return touched[field] && !!errors[field as keyof ValidationErrors];
  };

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
        <GroupIcon sx={{ fontSize: 40, mr: 2, color: customColors.primary }} />
        <Box>
          <Typography variant="h4" sx={{ ...TYPOGRAPHY.h4, color: CUSTOM_COLORS.primary }}>
            קהילת הקמפוס
          </Typography>
          <Typography variant="body1" color="text.secondary">
            מידע על מתקנים בקמפוס
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        {/* Facilities Card */}
        <Box sx={{ maxWidth: 800, width: '100%' }}>
          <FacilitiesCard customColors={customColors} />
        </Box>
      </Box>

      {/* Inquiry Form Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ ...TYPOGRAPHY.h5, color: CUSTOM_COLORS.primary, mb: 3 }}>
          <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          פנייה חדשה
        </Typography>
        
        <Card sx={{ border: '2px solid rgb(179, 209, 53)' }}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <TextField
                fullWidth
                label="מזהה פנייה"
                value={inquiryFormData.inquiryId}
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
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              
              <FormControl fullWidth error={shouldShowError('category')} required>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={inquiryFormData.category}
                  onChange={(e) => handleInquiryInputChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: customColors.primary
                      }
                    }
                  }}
                >
                  <MenuItem value="complaint">תלונה</MenuItem>
                  <MenuItem value="improvement">עצת שיפור</MenuItem>
                </Select>
                {shouldShowError('category') && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="תיאור הפנייה"
                value={inquiryFormData.description}
                onChange={(e) => handleInquiryInputChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                error={shouldShowError('description')}
                helperText={shouldShowError('description') ? errors.description : 'תיאור מפורט של הפנייה (10-500 תווים)'}
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
                type="date"
                label="תאריך"
                value={inquiryFormData.date}
                onChange={(e) => handleInquiryInputChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                error={shouldShowError('date')}
                helperText={shouldShowError('date') ? errors.date : ''}
                required
                InputLabelProps={{ shrink: true }}
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
                label="מיקום"
                value={inquiryFormData.location}
                onChange={(e) => handleInquiryInputChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                error={shouldShowError('location')}
                helperText={shouldShowError('location') ? errors.location : 'למשל: בניין A, קומה 2, חדר 205'}
                required
                placeholder="למשל: בניין A, קומה 2, חדר 205"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: customColors.primary
                    }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
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
                startIcon={<SendIcon />}
                onClick={handleInquirySubmit}
                sx={BUTTON_STYLES.primary}
              >
                שליחת פנייה
              </Button>
            </Box>
          </CardContent>
        </Card>
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

export default CommunityPage;
