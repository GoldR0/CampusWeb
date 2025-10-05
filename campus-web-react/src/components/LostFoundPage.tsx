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
  Paper,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY } from '../constants/theme';
import { User } from '../types';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { listLostFoundOrderedByTimestampDesc, addLostFoundReport, LostFoundReport } from '../fireStore/lostFoundService';

interface LostFoundPageProps {
  currentUser: User | null;
}

interface LostFoundFormData {
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  location: string;
  date: string;
  contactPhone: string;
}

interface ValidationErrors {
  itemName?: string;
  description?: string;
  location?: string;
  date?: string;
  contactPhone?: string;
}

interface SubmittedForm {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  location: string;
  date: string;
  contactPhone: string;
  timestamp: Date;
  user: string;
}

const LostFoundPage: React.FC<LostFoundPageProps> = ({ currentUser }) => {
  const [formData, setFormData] = useState<LostFoundFormData>({
    type: 'lost',
    itemName: '',
    description: '',
    location: '',
    date: '',
    contactPhone: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>([]);
  const [reportCounter, setReportCounter] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // Validation functions
  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'מספר טלפון הוא שדה חובה';
    const phoneRegex = /^[\d\s\-+()]{9,15}$/;
    if (!phoneRegex.test(phone)) return 'מספר טלפון לא תקין';
    return undefined;
  };

  const validateItemName = (itemName: string): string | undefined => {
    if (!itemName) return 'שם הפריט הוא שדה חובה';
    if (itemName.length < 2) return 'שם הפריט חייב להכיל לפחות 2 תווים';
    if (itemName.length > 50) return 'שם הפריט לא יכול לעלות על 50 תווים';
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} הוא שדה חובה`;
    return undefined;
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'itemName':
        return validateItemName(value);
      case 'description':
        return validateRequired(value, 'תיאור הפריט');
      case 'location':
        return validateRequired(value, 'מיקום');
      case 'date':
        return validateRequired(value, 'תאריך');
      case 'contactPhone':
        return validatePhone(value);
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof LostFoundFormData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Load reports from Firestore on component mount
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        const reports = await listLostFoundOrderedByTimestampDesc();
        const mapped: SubmittedForm[] = reports.map((r) => ({
          id: r.id,
          type: r.type,
          itemName: r.itemName,
          description: r.description,
          location: r.location,
          date: r.date,
          contactPhone: r.contactPhone,
          timestamp: new Date(r.timestamp),
          user: r.user
        }));
        setSubmittedForms(mapped);
        setReportCounter(mapped.length + 1);
      } catch (e) {
        // Silent fail; UI can remain empty
      }
    };
    loadFromFirestore();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
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

    const error = validateField(field, formData[field as keyof LostFoundFormData]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleFormSubmit = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      const newForm: SubmittedForm = {
        id: `LF-${String(reportCounter).padStart(3, '0')}`,
        ...formData,
        timestamp: new Date(),
        user: currentUser?.name || 'משתמש אנונימי'
      };
      
      try {
        const report: LostFoundReport = {
          id: newForm.id,
          type: newForm.type,
          itemName: newForm.itemName,
          description: newForm.description,
          location: newForm.location,
          date: newForm.date,
          contactPhone: newForm.contactPhone,
          timestamp: newForm.timestamp.toISOString(),
          user: newForm.user
        };
        await addLostFoundReport(report);
        const refreshed = await listLostFoundOrderedByTimestampDesc();
        const mapped: SubmittedForm[] = refreshed.map((r) => ({
          id: r.id,
          type: r.type,
          itemName: r.itemName,
          description: r.description,
          location: r.location,
          date: r.date,
          contactPhone: r.contactPhone,
          timestamp: new Date(r.timestamp),
          user: r.user
        }));
        setSubmittedForms(mapped);
        setReportCounter(mapped.length + 1);
      } catch (e) {
        setNotification({ message: 'שגיאה בשמירת הדיווח למסד', type: 'error' });
        return;
      }
      
      setNotification({
        message: `הדיווח על ${formData.type === 'lost' ? 'אבידה' : 'מציאה'} נשלח בהצלחה! מזהה: ${newForm.id}`,
        type: 'success'
      });
      
      // איפוס הטופס וסגירת הדיאלוג
      setFormData({
        type: 'lost',
        itemName: '',
        description: '',
        location: '',
        date: '',
        contactPhone: ''
      });
      setErrors({});
      setTouched({});
      setFormDialogOpen(false);
    } else {
      setNotification({
        message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
        type: 'error'
      });
    }
  };

  const handleClearForm = () => {
    setFormData({
      type: 'lost',
      itemName: '',
      description: '',
      location: '',
      date: '',
      contactPhone: ''
    });
    setErrors({});
    setTouched({});
  };

  const shouldShowError = (field: string): boolean => {
    return touched[field] && !!errors[field as keyof ValidationErrors];
  };

  const formatDate = (date: Date) => {
    // Check if date is valid
    if (!date || isNaN(date.getTime())) {
      return 'תאריך לא תקין';
    }
    
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter reports based on search term
  const filteredForms = submittedForms.filter(form => 
    form.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ ...TYPOGRAPHY.h3, color: CUSTOM_COLORS.primary }}>
          <SearchIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 40 }} />
          אבידות ומציאות
        </Typography>
        <Typography variant="h6" color="text.secondary">
          דיווח על אבידה או מציאה בקמפוס
        </Typography>
      </Box>

      {/* Add Form Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setFormDialogOpen(true)}
          sx={{
            backgroundColor: customColors.primary,
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            '&:hover': { backgroundColor: customColors.primaryDark }
          }}
        >
          מלא טופס דיווח חדש
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          placeholder="חיפוש לפי מזהה, שם פריט, תיאור, מיקום או משתמש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: customColors.primary
              }
            }
          }}
        />
      </Box>

      {/* Chat Section - Submitted Forms */}
      <Card sx={{ height: 800, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: customColors.primary, 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
            <SearchIcon />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              דיווחים אחרונים ({filteredForms.length})
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            flexGrow: 1, 
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
          }}>
            {filteredForms.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {searchTerm ? 'לא נמצאו דיווחים התואמים לחיפוש' : 'אין דיווחים עדיין'}
              </Typography>
            ) : (
              filteredForms.map((form, index) => (
                <Box key={form.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      mb: 1.5, 
                      backgroundColor: form.type === 'lost' ? '#fff3e0' : '#e8f5e8',
                      border: `1px solid ${form.type === 'lost' ? '#ffb74d' : '#81c784'}`,
                      borderRadius: 1.5,
                      boxShadow: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: form.type === 'lost' ? '#ff9800' : '#4caf50',
                        mr: 1.5,
                        width: 32,
                        height: 32
                      }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {form.user}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              backgroundColor: customColors.primary,
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {form.id}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(form.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: form.type === 'lost' ? '#e65100' : '#2e7d32',
                          fontWeight: 'bold'
                        }}
                      >
                        {form.type === 'lost' ? '🔍 אבידה:' : '🎯 מציאה:'} {form.itemName}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
                      <strong>תיאור:</strong> {form.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                      gap: 1,
                      p: 1.5,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}>
                      <Typography variant="body2">
                        <strong>📍 מיקום:</strong> {form.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>📅 תאריך:</strong> {new Date(form.date).toLocaleDateString('he-IL')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>📞 טלפון:</strong> {form.contactPhone}
                      </Typography>
                    </Box>
                  </Paper>
                  {index < filteredForms.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: customColors.primary, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <AddIcon />
          טופס דיווח אבידה/מציאה
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <TextField
              fullWidth
              label="מזהה דיווח"
              value={`LF-${String(reportCounter).padStart(3, '0')}`}
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
            
            <FormControl fullWidth required sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <InputLabel>סוג הדיווח</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: customColors.primary
                    }
                  }
                }}
              >
                <MenuItem value="lost">אבידה</MenuItem>
                <MenuItem value="found">מציאה</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="שם הפריט"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              onBlur={() => handleBlur('itemName')}
              error={shouldShowError('itemName')}
              helperText={shouldShowError('itemName') ? errors.itemName : ''}
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
              multiline
              rows={3}
              label="תיאור הפריט"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={shouldShowError('description')}
              helperText={shouldShowError('description') ? errors.description : ''}
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
              label="מיקום"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              error={shouldShowError('location')}
              helperText={shouldShowError('location') ? errors.location : ''}
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
              type="date"
              label="תאריך"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
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
              label="טלפון ליצירת קשר"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              onBlur={() => handleBlur('contactPhone')}
              error={shouldShowError('contactPhone')}
              helperText={shouldShowError('contactPhone') ? errors.contactPhone : ''}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearForm}
            sx={{
              borderColor: customColors.primary,
              color: customColors.primary,
              '&:hover': {
                borderColor: customColors.primaryDark,
                backgroundColor: customColors.primaryLight + '20'
              }
            }}
          >
            נקה טופס
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: customColors.primary,
              '&:hover': { backgroundColor: customColors.primaryDark }
            }}
          >
            שלח דיווח
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

export default LostFoundPage;
