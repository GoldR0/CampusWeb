import React, { useState } from 'react';
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
import {
  Search as SearchIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface LostFoundPageProps {
  currentUser: any;
}

interface LostFoundFormData {
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  location: string;
  date: string;
  contactPhone: string;
}

interface SubmittedForm {
  id: number;
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
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>([
    {
      id: 1,
      type: 'lost',
      itemName: 'מפתחות',
      description: 'מפתחות עם תליון כחול',
      location: 'ספרייה',
      date: '2024-01-15',
      contactPhone: '050-1234567',
      timestamp: new Date('2024-01-15T10:30:00'),
      user: 'דוד כהן'
    },
    {
      id: 2,
      type: 'found',
      itemName: 'ארנק שחור',
      description: 'ארנק עם תעודות',
      location: 'קפיטריה',
      date: '2024-01-14',
      contactPhone: '052-9876543',
      timestamp: new Date('2024-01-14T14:20:00'),
      user: 'שרה לוי'
    },
    {
      id: 3,
      type: 'lost',
      itemName: 'טלפון נייד',
      description: 'iPhone 13 עם כיסוי שקוף',
      location: 'אודיטוריום',
      date: '2024-01-13',
      contactPhone: '054-5555555',
      timestamp: new Date('2024-01-13T09:15:00'),
      user: 'משה ישראלי'
    }
  ]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = () => {
    const newForm: SubmittedForm = {
      id: submittedForms.length + 1,
      ...formData,
      timestamp: new Date(),
      user: currentUser?.name || 'משתמש אנונימי'
    };
    
    setSubmittedForms(prev => [newForm, ...prev]);
    
    setNotification({
      message: `הדיווח על ${formData.type === 'lost' ? 'אבידה' : 'מציאה'} נשלח בהצלחה!`,
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
    setFormDialogOpen(false);
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
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: customColors.primary }}>
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
              דיווחים אחרונים
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            flexGrow: 1, 
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
          }}>
            {submittedForms.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                אין דיווחים עדיין
              </Typography>
            ) : (
              submittedForms.map((form, index) => (
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {form.user}
                        </Typography>
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
                  {index < submittedForms.length - 1 && <Divider sx={{ my: 1 }} />}
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
          icon={notification?.type === 'success' ? <CheckCircleIcon /> : undefined}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LostFoundPage;
