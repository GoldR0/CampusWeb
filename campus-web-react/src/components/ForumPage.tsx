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
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { TYPOGRAPHY, BUTTON_STYLES } from '../constants/theme';
import { User, Message, Course } from '../types';
import { 
  getMessagesByCourse, 
  addMessage,
  deleteMessage,
  testMessagesCollection
} from '../fireStore/messagesService';
import { 
  listCourses 
} from '../fireStore/coursesService';
import { firestore } from '../fireStore/config';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
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
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load courses and messages from Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Test Firestore connection first
        console.log('Testing Firestore connection...');
        const isConnected = await testMessagesCollection();
        console.log('Firestore connection test result:', isConnected);
        
        // Load courses from Firestore (same as Students page)
        const firestoreCourses = await listCourses();
        console.log('Loaded courses from Firestore:', firestoreCourses.length);
        
        // If no courses from Firestore, create them manually for the forum
        let allCourses = firestoreCourses;
        if (firestoreCourses.length === 0) {
          console.log('No courses from Firestore, creating manual courses for forum');
          allCourses = [
            {
              id: "3Aj891JCB3sZR8WanRqH",
              name: "כימיה",
              code: "CHEM101",
              instructor: "עודד בז",
              credits: 4,
              status: "active" as const,
              progress: 0
            },
            {
              id: "tErYYRI05IqNuIADB2vr",
              name: "מתמטיקה 1",
              code: "MATH101",
              instructor: "ד\"ר כהן",
              credits: 4,
              status: "active" as const,
              progress: 0
            },
            {
              id: "vcoP4vR78mshdyiuAWmf",
              name: "פיזיקה 1",
              code: "PHYS101",
              instructor: "פרופ' לוי",
              credits: 4,
              status: "active" as const,
              progress: 0
            }
          ];
          console.log('Created manual courses for forum:', allCourses.length);
        }
        
        // Show all courses to all users (lecturers and students)
        // This allows full access to all course forums
        setUserCourses(allCourses);
        
        // Set first course as default if available
        if (allCourses.length > 0 && !selectedCourse) {
          setSelectedCourse(allCourses[0].id);
          console.log('Set default course:', allCourses[0].id);
        } else if (allCourses.length === 0) {
          console.log('No courses found - but user can still access forum');
          // Allow access even if no courses are available
          // Don't set selectedCourse to allow user to see the forum interface
        }
        
        // Load messages for selected course
        if (selectedCourse) {
          console.log('Loading messages for course:', selectedCourse);
          try {
            const courseMessages = await getMessagesByCourse(selectedCourse);
            console.log('Loaded messages:', courseMessages.length);
            setMessages(courseMessages);
          } catch (error) {
            console.error('Error loading messages for course:', error);
            // Create demo messages if no messages are available
            console.log('Creating demo messages for course:', selectedCourse);
            const demoMessages = [
              {
                id: "demo1",
                sender: "ד\"ר כהן",
                content: "שלום לכולם! ברוכים הבאים לקורס " + allCourses.find(c => c.id === selectedCourse)?.name,
                timestamp: new Date().toISOString(),
                courseId: selectedCourse
              },
              {
                id: "demo2",
                sender: "סטודנט",
                content: "שלום! מתי יהיה המבחן?",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                courseId: selectedCourse
              }
            ];
            setMessages(demoMessages);
          }
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
        console.log('Message counts loaded:', messageCounts);
      } catch (error) {
        console.error('Error loading forum data:', error);
        
        // Initialize with empty data instead of showing error
        setUserCourses([]);
        setMessages([]);
        setCourseMessageCounts({});
        
        // Try to create courses manually even if Firestore fails
        console.log('Firestore failed, creating courses manually...');
        const fallbackCourses = [
          {
            id: "3Aj891JCB3sZR8WanRqH",
            name: "כימיה",
            code: "CHEM101",
            instructor: "עודד בז",
            credits: 4,
            status: "active" as const,
            progress: 0
          },
          {
            id: "tErYYRI05IqNuIADB2vr",
            name: "מתמטיקה 1",
            code: "MATH101",
            instructor: "ד\"ר כהן",
            credits: 4,
            status: "active" as const,
            progress: 0
          },
          {
            id: "vcoP4vR78mshdyiuAWmf",
            name: "פיזיקה 1",
            code: "PHYS101",
            instructor: "פרופ' לוי",
            credits: 4,
            status: "active" as const,
            progress: 0
          }
        ];
        setUserCourses(fallbackCourses);
        if (!selectedCourse) {
          setSelectedCourse(fallbackCourses[0].id);
        }
        
        // Only show error notification for critical connection errors
        if (error instanceof Error && 
            (error.message.includes('Firebase') || 
             error.message.includes('network') || 
             error.message.includes('permission'))) {
          setNotification({
            message: 'שגיאה בחיבור לשרת',
            type: 'error'
          });
        }
        // For other errors (like no courses), just log and continue silently
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, selectedCourse]);

  // Real-time message updates using Firestore listeners
  useEffect(() => {
    if (!selectedCourse) return;

    console.log('Setting up real-time listener for course:', selectedCourse);
    
    const q = query(
      collection(firestore, "messages"),
      where("courseId", "==", selectedCourse),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Real-time update received for course:', selectedCourse, 'docs:', querySnapshot.docs.length);
      
      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Message({
          id: doc.id,
          sender: data.sender,
          content: data.content,
          timestamp: data.timestamp,
          courseId: data.courseId
        });
      });
      
      // Only update if we have messages or if the count changed
      setMessages(prev => {
        if (prev.length !== messages.length || 
            prev.some((prevMsg, index) => !messages[index] || prevMsg.id !== messages[index].id)) {
          console.log('Updating messages from real-time listener:', messages.length);
          return messages;
        }
        console.log('No change in messages, keeping current messages');
        return prev;
      });
      
      setLastRefreshTime(new Date());
      
      // Update message counts
      setCourseMessageCounts(prev => ({
        ...prev,
        [selectedCourse]: messages.length
      }));
    }, (error) => {
      console.error('Real-time listener error:', error);
      // Don't call handleRefreshMessages here to avoid infinite loop
      console.log('Real-time listener failed, keeping current messages');
    });

    return () => {
      console.log('Cleaning up real-time listener for course:', selectedCourse);
      unsubscribe();
    };
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
    const matchesCourse = !selectedCourse || msg.courseId === selectedCourse;
    const matchesSearch = !searchTerm || 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    
    // If no course is selected, show error
    if (!selectedCourse) {
      setNotification({
        message: 'יש לבחור קורס לפני שליחת הודעה',
        type: 'error'
      });
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX
    setLoading(true);
    
    try {
      // Create message object with temporary ID for immediate display
      const tempId = `temp_${Date.now()}`;
      const newMessageObj = {
        sender: currentUser.name,
        content: messageContent,
        timestamp: new Date().toISOString(),
        courseId: selectedCourse
      };

      console.log('Sending message to Firestore:', newMessageObj);
      
      // Add message to local state immediately for better UX
      const tempMessage = new Message({
        id: tempId,
        sender: currentUser.name,
        content: messageContent,
        timestamp: new Date().toISOString(),
        courseId: selectedCourse
      });
      
      // Add to local state immediately
      setMessages(prev => [tempMessage, ...prev]);
      
      // Show immediate feedback
      setNotification({
        message: 'שולח הודעה...',
        type: 'success'
      });
      
      // Update message count for the course
      setCourseMessageCounts(prev => ({
        ...prev,
        [selectedCourse]: (prev[selectedCourse] || 0) + 1
      }));
      
      // Save to Firestore - this will generate an ID automatically
      const messageId = await addMessage(newMessageObj as Message);
      console.log('Message saved with ID:', messageId);
      
      // Remove temporary message and refresh from Firestore to get the real message with proper ID
      setTimeout(async () => {
        try {
          const courseMessages = await getMessagesByCourse(selectedCourse);
          setMessages(courseMessages);
          console.log('Messages refreshed from Firestore after send:', courseMessages.length, 'messages');
          
          // Force update last refresh time
          setLastRefreshTime(new Date());
        } catch (error) {
          console.error('Error refreshing messages after send:', error);
        }
      }, 1000);
      
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
      // Restore the message to input if sending failed
      setNewMessage(messageContent);
      // Remove the temporary message from local state
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
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

  const handleRefreshMessages = React.useCallback(async () => {
    if (!selectedCourse) {
      setNotification({
        message: 'יש לבחור קורס לפני רענון הודעות',
        type: 'error'
      });
      return;
    }
    
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
  }, [selectedCourse]);

  const getSelectedCourseName = () => {
    const course = userCourses.find(c => c.id === selectedCourse);
    return course ? course.name : 'בחר קורס';
  };

  const getUnreadMessageCount = (courseId: string) => {
    const courseMessages = messages.filter(msg => msg.courseId === courseId);
    return courseMessages.filter(msg => !readMessages.has(msg.id)).length;
  };

  // Check if current user can delete messages (only lecturers)
  const canDeleteMessages = () => {
    return currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
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

  // Handle delete message button click
  const handleDeleteMessageClick = (message: Message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  // Handle delete message confirmation
  const handleDeleteMessage = async () => {
    if (!messageToDelete || !canDeleteMessages()) return;

    setLoading(true);
    try {
      console.log('Deleting message:', messageToDelete.id);
      
      // Delete from Firestore
      await deleteMessage(messageToDelete.id);
      
      // Remove from local state immediately
      setMessages(prev => prev.filter(msg => msg.id !== messageToDelete.id));
      
      // Update message count
      if (messageToDelete.courseId) {
        const courseId = messageToDelete.courseId;
        setCourseMessageCounts(prev => ({
          ...prev,
          [courseId]: Math.max(0, (prev[courseId] || 1) - 1)
        }));
      }
      
      setNotification({
        message: 'ההודעה נמחקה בהצלחה',
        type: 'success'
      });
      
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      setNotification({
        message: 'שגיאה במחיקת ההודעה',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
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

  // Remove the restriction - allow access to all courses for all users
  // if (userCourses.length === 0) {
  //   return (
  //     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  //       <Paper sx={{ p: 3, textAlign: 'center' }}>
  //         <Typography variant="h5" color="primary" gutterBottom>
  //           אינך רשום לקורסים כלשהם
  //         </Typography>
  //         <Typography variant="body1" color="text.secondary">
  //           יש להירשם לקורסים כדי להשתתף בפורום
  //         </Typography>
  //       </Paper>
  //     </Container>
  //   );
  // }

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

  // Remove the restriction - allow access to forum even if no courses are loaded
  // if (userCourses.length === 0 && !loading) {
  //   return (
  //     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  //       <Paper sx={{ p: 3, textAlign: 'center' }}>
  //         <Typography variant="h5" color="primary" gutterBottom>
  //           אין קורסים פעילים כרגע
  //         </Typography>
  //         <Typography variant="body1" color="text.secondary">
  //           הפורום זמין לכל המשתמשים. כאשר יהיו קורסים פעילים, הם יופיעו כאן.
  //         </Typography>
  //       </Paper>
  //     </Container>
  //   );
  // }

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
              {selectedCourse && courseMessageCounts[selectedCourse] > 0 && (
                <Chip 
                  label={`${courseMessageCounts[selectedCourse]} הודעות`}
                  color="info"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
              {selectedCourse && getUnreadMessageCount(selectedCourse) > 0 && (
                <Chip 
                  label={`${getUnreadMessageCount(selectedCourse)} חדשות`}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              {selectedCourse && getUnreadMessageCount(selectedCourse) > 0 && (
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
                title={selectedCourse ? "רענן הודעות מהשרת" : "בחר קורס לפני רענון"}
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
              label={`${userCourses.length} קורסים זמינים`}
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
              {!selectedCourse ? (
                <>
                  <Typography variant="h6" sx={TYPOGRAPHY.h6}>
                    בחר קורס
                  </Typography>
                  <Typography variant="body2">
                    בחר קורס מהרשימה כדי לראות את ההודעות
                  </Typography>
                </>
              ) : searchTerm ? (
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
                      {message.id.startsWith('temp_') && (
                        <Chip 
                          label="שולח..." 
                          color="info" 
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
                      {canDeleteMessages() && !message.id.startsWith('temp_') && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMessageClick(message)}
                          sx={{ ml: 1 }}
                          title="מחק הודעה זו"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Box sx={{ 
                      backgroundColor: message.id.startsWith('temp_') ? '#e3f2fd' : 'white',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 1,
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      opacity: message.id.startsWith('temp_') ? 0.7 : 1,
                      border: message.id.startsWith('temp_') ? '1px dashed #2196f3' : 'none'
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
              disabled={!newMessage.trim() || loading || !selectedCourse}
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
            {userCourses.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="טוען קורסים..."
                  secondary="אנא המתן עד שהקורסים יטענו"
                />
              </ListItem>
            ) : (
              userCourses.map((course) => (
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
              ))
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon color="error" />
            מחק הודעה
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את ההודעה הבאה?
          </Typography>
          {messageToDelete && (
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                מאת: {messageToDelete.sender}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(messageToDelete.timestamp).toLocaleString('he-IL')}
              </Typography>
              <Typography variant="body1">
                {messageToDelete.content}
              </Typography>
            </Paper>
          )}
          <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
            ⚠️ פעולה זו אינה ניתנת לביטול!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={loading}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleDeleteMessage}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={<DeleteIcon />}
          >
            מחק לצמיתות
          </Button>
        </DialogActions>
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
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            maxWidth: '400px'
          }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>
            {notification.message}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setNotification(null)}
            sx={{ color: 'white', ml: 1 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default ForumPage;
