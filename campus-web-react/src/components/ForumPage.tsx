import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY, BUTTON_STYLES } from '../constants/theme';
import { User } from '../types';
import {
  Send as SendIcon,
  Forum as ForumIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

interface ForumMessage {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: string;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  semester: string;
  year: string;
  students: string;
  credits: string;
  selectedStudents?: string[];
}

interface ForumPageProps {
  currentUser: User | null;
}

const ForumPage: React.FC<ForumPageProps> = ({ currentUser }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [courseSelectDialogOpen, setCourseSelectDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load courses and messages from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load courses
        const savedCourses = null; // Courses are now managed through Firestore
        if (savedCourses) {
          const parsedCourses = JSON.parse(savedCourses);
          setCourses(parsedCourses);
          
          // Filter courses where current user is enrolled
          if (currentUser) {
            const userEnrolledCourses = parsedCourses.filter((course: Course) => 
              course.selectedStudents?.includes(currentUser.id)
            );
            setUserCourses(userEnrolledCourses);
            
            // Set first course as default if available
            if (userEnrolledCourses.length > 0 && !selectedCourse) {
              setSelectedCourse(userEnrolledCourses[0].id);
            }
          }
        }
        
        // Load messages
        const savedMessages = null; // Forum messages are now managed through Firestore
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        // Error loading forum data
      }
    };

    loadData();
  }, [currentUser, selectedCourse]);

  // Filter messages for selected course
  const courseMessages = messages.filter(msg => msg.courseId === selectedCourse);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCourse || !currentUser) return;

    const newForumMessage: ForumMessage = {
      id: Date.now().toString(),
      courseId: selectedCourse,
      studentId: currentUser.id,
      studentName: currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleString('he-IL')
    };

    const updatedMessages = [...messages, newForumMessage];
    setMessages(updatedMessages);
    setNewMessage('');

    // Save to localStorage
    try {
      // Forum messages are now managed through Firestore
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('forumMessagesUpdated'));
    } catch (error) {
      // Error saving message to localStorage
    }

    setNotification({
      message: 'ההודעה נשלחה בהצלחה!',
      type: 'success'
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getSelectedCourseName = () => {
    const course = userCourses.find(c => c.id === selectedCourse);
    return course ? course.name : '';
  };

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            יש להתחבר כדי לגשת לפורום הקורסים
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (userCourses.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            אינך רשום לקורסים כלשהם
          </Typography>
          <Typography variant="body1" color="text.secondary">
            יש להירשם לקורסים כדי להשתתף בפורום
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ForumIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={TYPOGRAPHY.h4}>
            פורום קורסים
          </Typography>
          <Typography variant="body1" color="text.secondary">
            צ'אט לכל קורס - תקשורת ישירה עם חברי הקורס
          </Typography>
        </Box>
      </Box>

      {/* Course Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <SchoolIcon color="primary" />
            <Typography variant="h6" sx={TYPOGRAPHY.h6}>
              קורס נבחר: {getSelectedCourseName()}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ExpandMoreIcon />}
              onClick={() => setCourseSelectDialogOpen(true)}
              sx={{ ml: 'auto' }}
            >
              החלף קורס
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`${userCourses.length} קורסים רשומים`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        {/* Messages */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          backgroundColor: '#f5f5f5'
        }}>
          {courseMessages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary'
            }}>
              <ForumIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={TYPOGRAPHY.h6}>אין הודעות עדיין</Typography>
              <Typography variant="body2">התחל את השיחה הראשונה!</Typography>
            </Box>
          ) : (
            <List>
              {courseMessages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      p: 1
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 1
                    }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {message.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.timestamp}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: 'white',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 1,
                      maxWidth: '80%',
                      wordBreak: 'break-word'
                    }}>
                      <Typography variant="body1">
                        {message.message}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < courseMessages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="כתוב הודעה..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{ 
                ...BUTTON_STYLES.primary,
                minWidth: 'auto',
                px: 2
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Course Selection Dialog */}
      <Dialog 
        open={courseSelectDialogOpen} 
        onClose={() => setCourseSelectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="primary" />
            בחר קורס
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {userCourses.map((course) => (
              <ListItem
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course.id);
                  setCourseSelectDialogOpen(false);
                }}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedCourse === course.id ? 'rgba(179, 209, 53, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(179, 209, 53, 0.05)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#B3D135' }}>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={course.name}
                  secondary={`${course.instructor} • סמסטר ${course.semester} ${course.year}`}
                />
                {selectedCourse === course.id && (
                  <Chip label="נבחר" color="primary" size="small" />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            backgroundColor: notification.type === 'success' ? '#4CAF50' : '#F44336',
            color: 'white',
            p: 2,
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          {notification.message}
        </Box>
      )}
    </Container>
  );
};

export default ForumPage;
