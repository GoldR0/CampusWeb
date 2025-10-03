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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { TYPOGRAPHY, BUTTON_STYLES } from '../constants/theme';
import { User, Message, Course } from '../types';
import { 
  getMessagesByCourse, 
  addMessage
} from '../fireStore/messagesService';
import { 
  getActiveCourses 
} from '../fireStore/coursesService';
import {
  Send as SendIcon,
  Forum as ForumIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  MarkEmailRead as MarkEmailReadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Using Message type from types/index.ts instead of custom ForumMessage interface

interface ForumPageProps {
  currentUser: User | null;
}

const ForumPage: React.FC<ForumPageProps> = ({ currentUser }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [courseSelectDialogOpen, setCourseSelectDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [courseMessageCounts, setCourseMessageCounts] = useState<{[courseId: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  // Load courses and messages from Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Load courses from Firestore
        const allCourses = await getActiveCourses();
        
        // For now, we'll show all active courses to the user
        // In a real app, you'd filter based on user enrollment
        setUserCourses(allCourses);
        
        // Set first course as default if available
        if (allCourses.length > 0 && !selectedCourse) {
          setSelectedCourse(allCourses[0].id);
        }
        
        // Load messages for selected course
        if (selectedCourse) {
          const courseMessages = await getMessagesByCourse(selectedCourse);
          setMessages(courseMessages);
        }
        
        // Load message counts for all courses
        const messageCounts: {[courseId: string]: number} = {};
        for (const course of allCourses) {
          try {
            const courseMessages = await getMessagesByCourse(course.id);
            messageCounts[course.id] = courseMessages.length;
          } catch (error) {
            console.error(`Error loading message count for course ${course.id}:`, error);
            messageCounts[course.id] = 0;
          }
        }
        setCourseMessageCounts(messageCounts);
      } catch (error) {
        console.error('Error loading forum data:', error);
        setNotification({
          message: 'שגיאה בטעינת נתוני הפורום',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, selectedCourse]);

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    if (!selectedCourse) return;

    const interval = setInterval(async () => {
      try {
        const courseMessages = await getMessagesByCourse(selectedCourse);
        setMessages(courseMessages);
        setLastRefreshTime(new Date());
      } catch (error) {
        console.error('Auto-refresh error:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedCourse]);

  // Mark messages as read when course changes
  useEffect(() => {
    if (selectedCourse && messages.length > 0) {
      const messageIds = messages.map(msg => msg.id);
      setReadMessages(prev => {
        const newSet = new Set(prev);
        messageIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }, [selectedCourse, messages]);

  // Filter messages for selected course and search term
  const courseMessages = messages.filter(msg => {
    const matchesCourse = msg.courseId === selectedCourse;
    const matchesSearch = !searchTerm || 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCourse || !currentUser) return;

    setLoading(true);
    try {
      const newMessageObj = new Message({
        id: '', // Will be generated by Firestore
        sender: currentUser.name,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        courseId: selectedCourse
      });

      // Save to Firestore
      await addMessage(newMessageObj);
      
      // Add the new message to local state immediately for better UX
      const localMessage = new Message({
        id: Date.now().toString(), // Temporary ID for local state
        sender: currentUser.name,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        courseId: selectedCourse
      });
      
      // Update local state immediately
      setMessages(prev => [...prev, localMessage]);
      
      // Update message count for the course
      setCourseMessageCounts(prev => ({
        ...prev,
        [selectedCourse]: (prev[selectedCourse] || 0) + 1
      }));
      
      // Refresh messages from Firestore in background to ensure consistency
      setTimeout(async () => {
        try {
          const courseMessages = await getMessagesByCourse(selectedCourse);
          setMessages(courseMessages);
        } catch (error) {
          console.error('Error refreshing messages:', error);
        }
      }, 1000);
      
      setNewMessage('');
      
      setNotification({
        message: 'ההודעה נשלחה בהצלחה!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification({
        message: 'שגיאה בשליחת ההודעה',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefreshMessages = async () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    try {
      const courseMessages = await getMessagesByCourse(selectedCourse);
      setMessages(courseMessages);
      setLastRefreshTime(new Date());
      setNotification({
        message: 'הודעות עודכנו בהצלחה',
        type: 'success'
      });
    } catch (error) {
      console.error('Error refreshing messages:', error);
      setNotification({
        message: 'שגיאה ברענון ההודעות',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCourseName = () => {
    const course = userCourses.find(c => c.id === selectedCourse);
    return course ? course.name : '';
  };

  const getUnreadMessageCount = (courseId: string) => {
    const courseMessages = messages.filter(msg => msg.courseId === courseId);
    return courseMessages.filter(msg => !readMessages.has(msg.id)).length;
  };

  const markAllMessagesAsRead = () => {
    const messageIds = messages.map(msg => msg.id);
    setReadMessages(prev => {
      const newSet = new Set(prev);
      messageIds.forEach(id => newSet.add(id));
      return newSet;
    });
    setNotification({
      message: 'כל ההודעות סומנו כקרואות',
      type: 'success'
    });
  };

  const markMessageAsRead = (messageId: string) => {
    setReadMessages(prev => {
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: '#ffeb3b',
            fontWeight: 'bold',
            borderRadius: '2px',
            px: 0.5
          }}
        >
          {part}
        </Box>
      ) : part
    );
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

  if (loading && messages.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            טוען נתוני פורום...
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
              {courseMessageCounts[selectedCourse] > 0 && (
                <Chip 
                  label={`${courseMessageCounts[selectedCourse]} הודעות`}
                  color="info"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
              {getUnreadMessageCount(selectedCourse) > 0 && (
                <Chip 
                  label={`${getUnreadMessageCount(selectedCourse)} חדשות`}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              {getUnreadMessageCount(selectedCourse) > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<MarkEmailReadIcon />}
                  onClick={markAllMessagesAsRead}
                  disabled={loading}
                  size="small"
                  color="success"
                  title="סמן את כל ההודעות בקורס הנוכחי כקרואות"
                >
                  סמן כקרואות
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshMessages}
                disabled={loading || !selectedCourse}
                size="small"
                title="רענן הודעות מהשרת"
              >
                רענן
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExpandMoreIcon />}
                onClick={() => setCourseSelectDialogOpen(true)}
                size="small"
                title="בחר קורס אחר"
              >
                החלף קורס
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`${userCourses.length} קורסים רשומים`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${Object.values(courseMessageCounts).reduce((sum, count) => sum + count, 0)} הודעות כולל`}
              color="secondary"
              variant="outlined"
            />
            {userCourses.some(course => getUnreadMessageCount(course.id) > 0) && (
              <Chip 
                label={`${userCourses.reduce((sum, course) => sum + getUnreadMessageCount(course.id), 0)} הודעות חדשות`}
                color="error"
                variant="outlined"
              />
            )}
            {lastRefreshTime && (
              <Chip 
                label={`עודכן לאחרונה: ${lastRefreshTime.toLocaleTimeString('he-IL')}`}
                color="default"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="חיפוש בהודעות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            variant="outlined"
            size="small"
          />
          {searchTerm && (
            <>
              <Typography variant="caption" color="text.secondary">
                {courseMessages.length} תוצאות
                {courseMessages.some(msg => !readMessages.has(msg.id)) && (
                  <Box
                    component="span"
                    sx={{ color: '#f44336', fontWeight: 'bold' }}
                  >
                    {' '}({courseMessages.filter(msg => !readMessages.has(msg.id)).length} חדשות)
                  </Box>
                )}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSearchTerm('')}
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                <ClearIcon />
              </Button>
            </>
          )}
        </Box>
      </Paper>

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
              {searchTerm ? (
                <>
                  <Typography variant="h6" sx={TYPOGRAPHY.h6}>לא נמצאו הודעות</Typography>
                  <Typography variant="body2">לא נמצאו הודעות התואמות לחיפוש "{searchTerm}"</Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={TYPOGRAPHY.h6}>אין הודעות עדיין</Typography>
                  <Typography variant="body2">התחל את השיחה הראשונה!</Typography>
                </>
              )}
            </Box>
          ) : (
            <List>
              {courseMessages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      p: 1,
                      backgroundColor: !readMessages.has(message.id) ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                      borderLeft: !readMessages.has(message.id) ? '3px solid #f44336' : 'none'
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
                        {highlightSearchTerm(message.sender, searchTerm)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString('he-IL')}
                      </Typography>
                      {!readMessages.has(message.id) && (
                        <Chip 
                          label="חדש" 
                          color="error" 
                          size="small" 
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                      {!readMessages.has(message.id) && (
                        <IconButton
                          size="small"
                          onClick={() => markMessageAsRead(message.id)}
                          sx={{ ml: 1 }}
                          title="סמן הודעה זו כקרואה"
                        >
                          <CheckCircleIcon fontSize="small" color="success" />
                        </IconButton>
                      )}
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
                        {highlightSearchTerm(message.content, searchTerm)}
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
              disabled={!newMessage.trim() || loading}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              בחר קורס
            </Box>
            {userCourses.some(course => getUnreadMessageCount(course.id) > 0) && (
              <Button
                variant="outlined"
                startIcon={<MarkEmailReadIcon />}
                onClick={() => {
                  const allMessageIds = userCourses.flatMap(course => 
                    messages.filter(msg => msg.courseId === course.id).map(msg => msg.id)
                  );
                  setReadMessages(prev => {
                    const newSet = new Set(prev);
                    allMessageIds.forEach(id => newSet.add(id));
                    return newSet;
                  });
                  setNotification({
                    message: 'כל ההודעות בכל הקורסים סומנו כקרואות',
                    type: 'success'
                  });
                }}
                size="small"
                color="success"
              >
                סמן הכל כקרואות
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {userCourses.map((course) => (
              <ListItem
                key={course.id}
                onClick={async () => {
                  setSelectedCourse(course.id);
                  setCourseSelectDialogOpen(false);
                  
                  // Load messages for the newly selected course
                  setLoading(true);
                  try {
                    const courseMessages = await getMessagesByCourse(course.id);
                    setMessages(courseMessages);
                  } catch (error) {
                    console.error('Error loading messages for course:', error);
                    setNotification({
                      message: 'שגיאה בטעינת הודעות הקורס',
                      type: 'error'
                    });
                  } finally {
                    setLoading(false);
                  }
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
                  secondary={`${course.instructor} • ${courseMessageCounts[course.id] || 0} הודעות`}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {getUnreadMessageCount(course.id) > 0 && (
                    <Chip 
                      label={`${getUnreadMessageCount(course.id)} חדשות`} 
                      color="error" 
                      size="small" 
                    />
                  )}
                  {courseMessageCounts[course.id] > 0 && (
                    <Chip 
                      label={`${courseMessageCounts[course.id]} הודעות`} 
                      color="secondary" 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                  {getUnreadMessageCount(course.id) > 0 && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const courseMessageIds = messages
                          .filter(msg => msg.courseId === course.id)
                          .map(msg => msg.id);
                        setReadMessages(prev => {
                          const newSet = new Set(prev);
                          courseMessageIds.forEach(id => newSet.add(id));
                          return newSet;
                        });
                        setNotification({
                          message: `כל ההודעות בקורס ${course.name} סומנו כקרואות`,
                          type: 'success'
                        });
                      }}
                      sx={{ ml: 1 }}
                      title="סמן את כל ההודעות בקורס זה כקרואות"
                    >
                      <CheckCircleIcon fontSize="small" color="success" />
                    </IconButton>
                  )}
                  {selectedCourse === course.id && (
                    <Chip label="נבחר" color="primary" size="small" />
                  )}
                </Box>
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
