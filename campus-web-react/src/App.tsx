import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Build as BuildIcon,
  Group as GroupIcon,
  Forum as ForumIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { 
  User, 
  Task, 
  Event, 
  Facility,
  LostFoundItem,
  MarketplaceItem,
  ServiceRequest,
  ForumPost,
  CafeteriaOrder,
  CafeteriaOrderItem,
  CommunityEvent,
  HelpTicket
} from './types';

// Local Storage Keys
const STORAGE_KEYS = {
  LOST_FOUND: 'campus_lost_found',
  MARKETPLACE: 'campus_marketplace',
  SERVICE_REQUESTS: 'campus_service_requests',
  FORUM_POSTS: 'campus_forum_posts',
  CAFETERIA_ORDERS: 'campus_cafeteria_orders',
  COMMUNITY_EVENTS: 'campus_community_events',
  HELP_TICKETS: 'campus_help_tickets',
  USERS: 'campus_users'
};

// Local Storage Utilities
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Demo data
const demoUsers: Record<string, User> = {
  'student@campus.ac.il': {
    id: '123456789',
    name: 'ישראל ישראלי',
    email: 'student@campus.ac.il',
    role: 'student',
    phone: '050-1234567',
    age: 22,
    city: 'תל אביב',
    gender: 'male'
  },
  'lecturer@campus.ac.il': {
    id: '987654321',
    name: 'ד"ר כהן',
    email: 'lecturer@campus.ac.il',
    role: 'lecturer',
    phone: '050-9876543',
    age: 45,
    city: 'ירושלים',
    gender: 'male'
  }
};

const demoEvents: Event[] = [
  {
    id: '1',
    title: 'מיטאפ יזמות',
    description: 'מפגש עם יזמים מובילים בתעשייה',
    date: '15/12',
    time: '18:00',
    location: 'אודיטוריום',
    urgent: true
  },
  {
    id: '2',
    title: 'הרצאת אורח - AI',
    description: 'ד"ר כהן על בינה מלאכותית',
    date: '20/12',
    time: '14:00',
    location: 'חדר 301',
    urgent: false
  },
  {
    id: '3',
    title: 'סדנת פיתוח',
    description: 'סדנה מעשית בפיתוח אפליקציות',
    date: '25/12',
    time: '10:00',
    location: 'מעבדת מחשבים',
    urgent: false
  },
  {
    id: '4',
    title: 'יום אטרקציות',
    description: 'יום כיף עם פעילויות מגוונות',
    date: '30/12',
    time: '09:00',
    location: 'קמפוס',
    urgent: false
  }
];

const demoFacilities: Facility[] = [
  { id: '1', name: 'ספרייה', status: 'open', hours: '6:30-22:30' },
  { id: '2', name: 'קפיטריה', status: 'busy', hours: '7:00-22:00' },
  { id: '3', name: 'חדר כושר', status: 'open', hours: '6:30-8:00' },
  { id: '4', name: 'חניה', status: 'busy', hours: '24/7' }
];

const demoTasks: Task[] = [
  {
    id: '1',
    title: 'מבחן מתמטיקה',
    type: 'exam',
    course: 'מתמטיקה 1',
    dueDate: '2024-12-15',
    priority: 'urgent',
    status: 'pending'
  },
  {
    id: '2',
    title: 'מבחן פיזיקה',
    type: 'exam',
    course: 'פיזיקה 1',
    dueDate: '2024-12-15',
    priority: 'urgent',
    status: 'pending'
  },
  {
    id: '3',
    title: 'הגשת עבודה',
    type: 'assignment',
    course: 'תכנות מתקדם',
    dueDate: '2024-12-16',
    priority: 'medium',
    status: 'pending'
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Form states
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [cafeteriaOrders, setCafeteriaOrders] = useState<CafeteriaOrder[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>([]);
  
  // Form dialogs
  const [lostFoundDialogOpen, setLostFoundDialogOpen] = useState(false);
  const [marketplaceDialogOpen, setMarketplaceDialogOpen] = useState(false);
  const [serviceRequestDialogOpen, setServiceRequestDialogOpen] = useState(false);
  const [forumPostDialogOpen, setForumPostDialogOpen] = useState(false);
  const [cafeteriaOrderDialogOpen, setCafeteriaOrderDialogOpen] = useState(false);
  const [communityEventDialogOpen, setCommunityEventDialogOpen] = useState(false);
  const [helpTicketDialogOpen, setHelpTicketDialogOpen] = useState(false);
  
  // Form data
  const [lostFoundForm, setLostFoundForm] = useState({
    type: 'lost' as 'lost' | 'found',
    title: '',
    description: '',
    location: '',
    date: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  
  const [marketplaceForm, setMarketplaceForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books' as 'books' | 'electronics' | 'furniture' | 'clothing' | 'other',
    condition: 'good' as 'new' | 'like-new' | 'good' | 'fair' | 'poor',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: ''
  });
  
  const [serviceRequestForm, setServiceRequestForm] = useState({
    type: 'maintenance' as 'maintenance' | 'cleaning' | 'security' | 'technical' | 'other',
    title: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    requesterName: '',
    requesterPhone: '',
    requesterEmail: ''
  });
  
  const [forumPostForm, setForumPostForm] = useState({
    courseId: '',
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    tags: [] as string[]
  });
  
  const [cafeteriaOrderForm, setCafeteriaOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    items: [] as CafeteriaOrderItem[],
    pickupTime: '',
    specialInstructions: ''
  });
  
  const [communityEventForm, setCommunityEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    maxParticipants: '',
    category: 'social' as 'social' | 'academic' | 'sports' | 'cultural' | 'other',
    registrationRequired: false
  });
  
  const [helpTicketForm, setHelpTicketForm] = useState({
    category: 'technical' as 'technical' | 'academic' | 'administrative' | 'financial' | 'other',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: ''
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Load data from localStorage on component mount
  useEffect(() => {
    setLostFoundItems(loadFromLocalStorage(STORAGE_KEYS.LOST_FOUND, []));
    setMarketplaceItems(loadFromLocalStorage(STORAGE_KEYS.MARKETPLACE, []));
    setServiceRequests(loadFromLocalStorage(STORAGE_KEYS.SERVICE_REQUESTS, []));
    setForumPosts(loadFromLocalStorage(STORAGE_KEYS.FORUM_POSTS, []));
    setCafeteriaOrders(loadFromLocalStorage(STORAGE_KEYS.CAFETERIA_ORDERS, []));
    setCommunityEvents(loadFromLocalStorage(STORAGE_KEYS.COMMUNITY_EVENTS, []));
    setHelpTickets(loadFromLocalStorage(STORAGE_KEYS.HELP_TICKETS, []));
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = demoUsers[email];
    if (user && password === '123456') {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginDialogOpen(false);
      showNotification('התחברת בהצלחה!', 'success');
    } else {
      showNotification('שם משתמש או סיסמה שגויים', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    showNotification('התנתקת בהצלחה', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.length >= 9;
  };

  const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };

  const validatePrice = (price: string): boolean => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice >= 0;
  };

  const validateNumber = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0;
  };

  // Form submission handlers
  const handleLostFoundSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(lostFoundForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(lostFoundForm.description)) errors.description = 'תיאור הוא שדה חובה';
    if (!validateRequired(lostFoundForm.location)) errors.location = 'מיקום הוא שדה חובה';
    if (!validateRequired(lostFoundForm.date)) errors.date = 'תאריך הוא שדה חובה';
    if (!validateRequired(lostFoundForm.contactName)) errors.contactName = 'שם איש קשר הוא שדה חובה';
    if (!validatePhone(lostFoundForm.contactPhone)) errors.contactPhone = 'מספר טלפון לא תקין';
    if (!validateEmail(lostFoundForm.contactEmail)) errors.contactEmail = 'כתובת אימייל לא תקינה';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newItem: LostFoundItem = {
      id: Date.now().toString(),
      ...lostFoundForm,
      status: 'open',
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedItems = [...lostFoundItems, newItem];
    setLostFoundItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.LOST_FOUND, updatedItems);
    
    setLostFoundForm({
      type: 'lost',
      title: '',
      description: '',
      location: '',
      date: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    });
    setFormErrors({});
    setLostFoundDialogOpen(false);
    showNotification('פריט נוסף בהצלחה', 'success');
  };

  const handleMarketplaceSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(marketplaceForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(marketplaceForm.description)) errors.description = 'תיאור הוא שדה חובה';
    if (!validatePrice(marketplaceForm.price)) errors.price = 'מחיר לא תקין';
    if (!validateRequired(marketplaceForm.sellerName)) errors.sellerName = 'שם המוכר הוא שדה חובה';
    if (!validatePhone(marketplaceForm.sellerPhone)) errors.sellerPhone = 'מספר טלפון לא תקין';
    if (!validateEmail(marketplaceForm.sellerEmail)) errors.sellerEmail = 'כתובת אימייל לא תקינה';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newItem: MarketplaceItem = {
      id: Date.now().toString(),
      ...marketplaceForm,
      price: parseFloat(marketplaceForm.price),
      datePosted: new Date().toISOString().split('T')[0],
      status: 'available'
    };
    
    const updatedItems = [...marketplaceItems, newItem];
    setMarketplaceItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.MARKETPLACE, updatedItems);
    
    setMarketplaceForm({
      title: '',
      description: '',
      price: '',
      category: 'books',
      condition: 'good',
      sellerName: '',
      sellerPhone: '',
      sellerEmail: ''
    });
    setFormErrors({});
    setMarketplaceDialogOpen(false);
    showNotification('פריט נוסף בהצלחה', 'success');
  };

  const handleServiceRequestSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(serviceRequestForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(serviceRequestForm.description)) errors.description = 'תיאור הוא שדה חובה';
    if (!validateRequired(serviceRequestForm.location)) errors.location = 'מיקום הוא שדה חובה';
    if (!validateRequired(serviceRequestForm.requesterName)) errors.requesterName = 'שם המבקש הוא שדה חובה';
    if (!validatePhone(serviceRequestForm.requesterPhone)) errors.requesterPhone = 'מספר טלפון לא תקין';
    if (!validateEmail(serviceRequestForm.requesterEmail)) errors.requesterEmail = 'כתובת אימייל לא תקינה';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newRequest: ServiceRequest = {
      id: Date.now().toString(),
      ...serviceRequestForm,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    const updatedRequests = [...serviceRequests, newRequest];
    setServiceRequests(updatedRequests);
    saveToLocalStorage(STORAGE_KEYS.SERVICE_REQUESTS, updatedRequests);
    
    setServiceRequestForm({
      type: 'maintenance',
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      requesterName: '',
      requesterPhone: '',
      requesterEmail: ''
    });
    setFormErrors({});
    setServiceRequestDialogOpen(false);
    showNotification('בקשה נשלחה בהצלחה', 'success');
  };

  const handleForumPostSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(forumPostForm.courseId)) errors.courseId = 'קורס הוא שדה חובה';
    if (!validateRequired(forumPostForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(forumPostForm.content)) errors.content = 'תוכן הוא שדה חובה';
    if (!validateRequired(forumPostForm.authorName)) errors.authorName = 'שם המחבר הוא שדה חובה';
    if (!validateEmail(forumPostForm.authorEmail)) errors.authorEmail = 'כתובת אימייל לא תקינה';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newPost: ForumPost = {
      id: Date.now().toString(),
      ...forumPostForm,
      datePosted: new Date().toISOString().split('T')[0],
      status: 'active',
      replies: []
    };
    
    const updatedPosts = [...forumPosts, newPost];
    setForumPosts(updatedPosts);
    saveToLocalStorage(STORAGE_KEYS.FORUM_POSTS, updatedPosts);
    
    setForumPostForm({
      courseId: '',
      title: '',
      content: '',
      authorName: '',
      authorEmail: '',
      tags: []
    });
    setFormErrors({});
    setForumPostDialogOpen(false);
    showNotification('פוסט נוסף בהצלחה', 'success');
  };

  const handleCafeteriaOrderSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(cafeteriaOrderForm.customerName)) errors.customerName = 'שם הלקוח הוא שדה חובה';
    if (!validatePhone(cafeteriaOrderForm.customerPhone)) errors.customerPhone = 'מספר טלפון לא תקין';
    if (!validateEmail(cafeteriaOrderForm.customerEmail)) errors.customerEmail = 'כתובת אימייל לא תקינה';
    if (cafeteriaOrderForm.items.length === 0) errors.items = 'יש לבחור לפחות פריט אחד';
    if (!validateRequired(cafeteriaOrderForm.pickupTime)) errors.pickupTime = 'זמן איסוף הוא שדה חובה';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const totalPrice = cafeteriaOrderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: CafeteriaOrder = {
      id: Date.now().toString(),
      ...cafeteriaOrderForm,
      totalPrice,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    const updatedOrders = [...cafeteriaOrders, newOrder];
    setCafeteriaOrders(updatedOrders);
    saveToLocalStorage(STORAGE_KEYS.CAFETERIA_ORDERS, updatedOrders);
    
    setCafeteriaOrderForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      items: [],
      pickupTime: '',
      specialInstructions: ''
    });
    setFormErrors({});
    setCafeteriaOrderDialogOpen(false);
    showNotification('הזמנה נשלחה בהצלחה', 'success');
  };

  const handleCommunityEventSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(communityEventForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(communityEventForm.description)) errors.description = 'תיאור הוא שדה חובה';
    if (!validateRequired(communityEventForm.date)) errors.date = 'תאריך הוא שדה חובה';
    if (!validateRequired(communityEventForm.time)) errors.time = 'שעה היא שדה חובה';
    if (!validateRequired(communityEventForm.location)) errors.location = 'מיקום הוא שדה חובה';
    if (!validateRequired(communityEventForm.organizerName)) errors.organizerName = 'שם המארגן הוא שדה חובה';
    if (!validateEmail(communityEventForm.organizerEmail)) errors.organizerEmail = 'כתובת אימייל לא תקינה';
    if (!validatePhone(communityEventForm.organizerPhone)) errors.organizerPhone = 'מספר טלפון לא תקין';
    if (!validateNumber(communityEventForm.maxParticipants)) errors.maxParticipants = 'מספר משתתפים לא תקין';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newEvent: CommunityEvent = {
      id: Date.now().toString(),
      ...communityEventForm,
      maxParticipants: parseInt(communityEventForm.maxParticipants),
      currentParticipants: 0,
      status: 'upcoming',
      participants: []
    };
    
    const updatedEvents = [...communityEvents, newEvent];
    setCommunityEvents(updatedEvents);
    saveToLocalStorage(STORAGE_KEYS.COMMUNITY_EVENTS, updatedEvents);
    
    setCommunityEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      maxParticipants: '',
      category: 'social',
      registrationRequired: false
    });
    setFormErrors({});
    setCommunityEventDialogOpen(false);
    showNotification('אירוע נוסף בהצלחה', 'success');
  };

  const handleHelpTicketSubmit = () => {
    const errors: {[key: string]: string} = {};
    
    if (!validateRequired(helpTicketForm.title)) errors.title = 'כותרת היא שדה חובה';
    if (!validateRequired(helpTicketForm.description)) errors.description = 'תיאור הוא שדה חובה';
    if (!validateRequired(helpTicketForm.requesterName)) errors.requesterName = 'שם המבקש הוא שדה חובה';
    if (!validateEmail(helpTicketForm.requesterEmail)) errors.requesterEmail = 'כתובת אימייל לא תקינה';
    if (!validatePhone(helpTicketForm.requesterPhone)) errors.requesterPhone = 'מספר טלפון לא תקין';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('יש לתקן שגיאות בטופס', 'error');
      return;
    }
    
    const newTicket: HelpTicket = {
      id: Date.now().toString(),
      ...helpTicketForm,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    
    const updatedTickets = [...helpTickets, newTicket];
    setHelpTickets(updatedTickets);
    saveToLocalStorage(STORAGE_KEYS.HELP_TICKETS, updatedTickets);
    
    setHelpTicketForm({
      category: 'technical',
      title: '',
      description: '',
      priority: 'medium',
      requesterName: '',
      requesterEmail: '',
      requesterPhone: ''
    });
    setFormErrors({});
    setHelpTicketDialogOpen(false);
    showNotification('כרטיס עזרה נשלח בהצלחה', 'success');
  };

  const navigationItems = [
    { id: 'home', label: 'עמוד בית', icon: <HomeIcon /> },
    { id: 'profile', label: 'פרופיל אישי', icon: <PersonIcon /> },
    { id: 'learning', label: 'מרכז הלימודים', icon: <SchoolIcon /> },
    { id: 'cafeteria', label: 'קפיטריה', icon: <RestaurantIcon /> },
    { id: 'lost-found', label: 'מציאות ואבדות', icon: <SearchIcon /> },
    { id: 'marketplace', label: 'שוק יד שנייה', icon: <ShoppingCartIcon /> },
    { id: 'services', label: 'שירותים בקמפוס', icon: <BuildIcon /> },
    { id: 'community', label: 'קהילה', icon: <GroupIcon /> },
    { id: 'forum', label: 'פורום-קורס', icon: <ForumIcon /> },
    { id: 'help', label: 'עזרה', icon: <HelpIcon /> },
    { id: 'lost-found-management', label: 'ניהול מציאות ואבדות', icon: <SearchIcon /> },
    { id: 'marketplace-management', label: 'ניהול שוק יד שנייה', icon: <ShoppingCartIcon /> },
    { id: 'services-management', label: 'ניהול שירותים', icon: <BuildIcon /> },
    { id: 'forum-management', label: 'ניהול פורום', icon: <ForumIcon /> },
    { id: 'cafeteria-management', label: 'ניהול קפיטריה', icon: <RestaurantIcon /> },
    { id: 'community-management', label: 'ניהול קהילה', icon: <GroupIcon /> },
    { id: 'help-management', label: 'ניהול עזרה', icon: <HelpIcon /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'busy': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  // Delete functions
  const handleDeleteLostFound = (id: string) => {
    const updatedItems = lostFoundItems.filter(item => item.id !== id);
    setLostFoundItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.LOST_FOUND, updatedItems);
    showNotification('הפריט נמחק בהצלחה', 'success');
  };

  const handleDeleteMarketplace = (id: string) => {
    const updatedItems = marketplaceItems.filter(item => item.id !== id);
    setMarketplaceItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.MARKETPLACE, updatedItems);
    showNotification('הפריט נמחק בהצלחה', 'success');
  };

  const handleDeleteServiceRequest = (id: string) => {
    const updatedItems = serviceRequests.filter(item => item.id !== id);
    setServiceRequests(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.SERVICE_REQUESTS, updatedItems);
    showNotification('הבקשה נמחקה בהצלחה', 'success');
  };

  const handleDeleteForumPost = (id: string) => {
    const updatedItems = forumPosts.filter(item => item.id !== id);
    setForumPosts(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.FORUM_POSTS, updatedItems);
    showNotification('הפוסט נמחק בהצלחה', 'success');
  };

  const handleDeleteCafeteriaOrder = (id: string) => {
    const updatedItems = cafeteriaOrders.filter(item => item.id !== id);
    setCafeteriaOrders(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.CAFETERIA_ORDERS, updatedItems);
    showNotification('ההזמנה נמחקה בהצלחה', 'success');
  };

  const handleDeleteCommunityEvent = (id: string) => {
    const updatedItems = communityEvents.filter(item => item.id !== id);
    setCommunityEvents(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.COMMUNITY_EVENTS, updatedItems);
    showNotification('האירוע נמחק בהצלחה', 'success');
  };

  const handleDeleteHelpTicket = (id: string) => {
    const updatedItems = helpTickets.filter(item => item.id !== id);
    setHelpTickets(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.HELP_TICKETS, updatedItems);
    showNotification('כרטיס העזרה נמחק בהצלחה', 'success');
  };

  // Status update functions
  const handleUpdateLostFoundStatus = (id: string, newStatus: 'open' | 'claimed' | 'closed') => {
    const updatedItems = lostFoundItems.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setLostFoundItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.LOST_FOUND, updatedItems);
    showNotification('סטטוס הפריט עודכן בהצלחה', 'success');
  };

  const handleUpdateMarketplaceStatus = (id: string, newStatus: 'available' | 'sold' | 'reserved') => {
    const updatedItems = marketplaceItems.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setMarketplaceItems(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.MARKETPLACE, updatedItems);
    showNotification('סטטוס הפריט עודכן בהצלחה', 'success');
  };

  const handleUpdateServiceRequestStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    const updatedItems = serviceRequests.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setServiceRequests(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.SERVICE_REQUESTS, updatedItems);
    showNotification('סטטוס הבקשה עודכן בהצלחה', 'success');
  };

  const handleUpdateForumPostStatus = (id: string, newStatus: 'active' | 'closed' | 'deleted') => {
    const updatedItems = forumPosts.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setForumPosts(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.FORUM_POSTS, updatedItems);
    showNotification('סטטוס הפוסט עודכן בהצלחה', 'success');
  };

  const handleUpdateCafeteriaOrderStatus = (id: string, newStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled') => {
    const updatedItems = cafeteriaOrders.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setCafeteriaOrders(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.CAFETERIA_ORDERS, updatedItems);
    showNotification('סטטוס ההזמנה עודכן בהצלחה', 'success');
  };

  const handleUpdateCommunityEventStatus = (id: string, newStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => {
    const updatedItems = communityEvents.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setCommunityEvents(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.COMMUNITY_EVENTS, updatedItems);
    showNotification('סטטוס האירוע עודכן בהצלחה', 'success');
  };

  const handleUpdateHelpTicketStatus = (id: string, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    const updatedItems = helpTickets.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setHelpTickets(updatedItems);
    saveToLocalStorage(STORAGE_KEYS.HELP_TICKETS, updatedItems);
    showNotification('סטטוס כרטיס העזרה עודכן בהצלחה', 'success');
  };

  // Status Update Dialogs
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const statusOptions = [
    { value: 'open', label: 'פתוח' },
    { value: 'claimed', label: 'נטען' },
    { value: 'closed', label: 'סגור' }
  ];

  const handleStatusUpdate = () => {
    // Implement status update logic
    console.log('Status updated:', selectedStatus);
    setStatusUpdateDialogOpen(false);
  };

  // Confirmation Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');

  const handleConfirmDelete = () => {
    // Implement delete logic
    console.log('Item deleted:', selectedItemId);
    setConfirmDialogOpen(false);
  };

  // Get current section count for management screens
  const getCurrentSectionCount = () => {
    switch (activeSection) {
      case 'lost-found-management':
        return lostFoundItems.length;
      case 'marketplace-management':
        return marketplaceItems.length;
      case 'services-management':
        return serviceRequests.length;
      case 'forum-management':
        return forumPosts.length;
      case 'cafeteria-management':
        return cafeteriaOrders.length;
      case 'community-management':
        return communityEvents.length;
      case 'help-management':
        return helpTickets.length;
      default:
        return 0;
    }
  };

  const getActiveItemsCount = () => {
    switch (activeSection) {
      case 'lost-found-management':
        return lostFoundItems.filter(item => item.status === 'open').length;
      case 'marketplace-management':
        return marketplaceItems.filter(item => item.status === 'available').length;
      case 'services-management':
        return serviceRequests.filter(item => item.status === 'pending').length;
      case 'forum-management':
        return forumPosts.filter(item => item.status === 'active').length;
      case 'cafeteria-management':
        return cafeteriaOrders.filter(item => item.status === 'pending').length;
      case 'community-management':
        return communityEvents.filter(item => item.status === 'upcoming').length;
      case 'help-management':
        return helpTickets.filter(item => item.status === 'open').length;
      default:
        return 0;
    }
  };

  const getPendingItemsCount = () => {
    switch (activeSection) {
      case 'lost-found-management':
        return lostFoundItems.filter(item => item.status === 'claimed').length;
      case 'marketplace-management':
        return marketplaceItems.filter(item => item.status === 'sold').length;
      case 'services-management':
        return serviceRequests.filter(item => item.status === 'in-progress').length;
      case 'forum-management':
        return forumPosts.filter(item => item.status === 'closed').length;
      case 'cafeteria-management':
        return cafeteriaOrders.filter(item => item.status === 'preparing').length;
      case 'community-management':
        return communityEvents.filter(item => item.status === 'ongoing').length;
      case 'help-management':
        return helpTickets.filter(item => item.status === 'in-progress').length;
      default:
        return 0;
    }
  };

  const getCompletedItemsCount = () => {
    switch (activeSection) {
      case 'lost-found-management':
        return lostFoundItems.filter(item => item.status === 'closed').length;
      case 'marketplace-management':
        return marketplaceItems.filter(item => item.status === 'sold').length;
      case 'services-management':
        return serviceRequests.filter(item => item.status === 'completed').length;
      case 'forum-management':
        return forumPosts.filter(item => item.status === 'closed').length;
      case 'cafeteria-management':
        return cafeteriaOrders.filter(item => item.status === 'ready').length;
      case 'community-management':
        return communityEvents.filter(item => item.status === 'completed').length;
      case 'help-management':
        return helpTickets.filter(item => item.status === 'resolved').length;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32', boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Section - Menu and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => setActiveSection('home')}
            >
              <Box
                component="img"
                src="/onologo.png"
                alt="ONO Logo"
                sx={{ 
                  height: 40, 
                  width: 'auto', 
                  mr: 2,
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                ONO - מערכת ניהול קמפוס
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Breadcrumbs */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                color="inherit" 
                sx={{ 
                  opacity: 0.7, 
                  cursor: 'pointer',
                  '&:hover': { opacity: 1 }
                }}
                onClick={() => setActiveSection('home')}
              >
                עמוד בית
              </Typography>
              
              {activeSection !== 'home' && (
                <>
                  <Typography variant="body2" color="inherit" sx={{ opacity: 0.5 }}>
                    /
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ opacity: 0.9, fontWeight: 'medium' }}>
                    {activeSection === 'profile' && 'פרופיל אישי'}
                    {activeSection === 'learning' && 'מרכז הלימודים'}
                    {activeSection === 'cafeteria' && 'קפיטריה'}
                    {activeSection === 'lost-found' && 'מציאות ואבדות'}
                    {activeSection === 'marketplace' && 'שוק יד שנייה'}
                    {activeSection === 'services' && 'שירותים בקמפוס'}
                    {activeSection === 'community' && 'קהילה'}
                    {activeSection === 'forum' && 'פורום קורס'}
                    {activeSection === 'help' && 'עזרה'}
                    {activeSection === 'lost-found-management' && 'ניהול מציאות ואבדות'}
                    {activeSection === 'marketplace-management' && 'ניהול שוק יד שנייה'}
                    {activeSection === 'services-management' && 'ניהול שירותים'}
                    {activeSection === 'forum-management' && 'ניהול פורום'}
                    {activeSection === 'cafeteria-management' && 'ניהול קפיטריה'}
                    {activeSection === 'community-management' && 'ניהול קהילה'}
                    {activeSection === 'help-management' && 'ניהול עזרה'}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          
          {/* Right Section - User Info and Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Quick Stats for Management Screens */}
            {activeSection.endsWith('-management') && (
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
                <Chip 
                  label={`${getCurrentSectionCount()} פריטים`} 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            )}
            
            {/* User Section */}
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    שלום, {currentUser?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {currentUser?.role || 'משתמש'}
                  </Typography>
                </Box>
                
                <IconButton 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            ) : (
              <Button 
                color="inherit" 
                startIcon={<LoginIcon />}
                onClick={() => setLoginDialogOpen(true)}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                התחברות
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            backgroundColor: '#f8f9fa',
            borderLeft: '1px solid #e0e0e0'
          }
        }}
      >
        <Box sx={{ width: 320, pt: 2 }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              תפריט ניווט
            </Typography>
            {isLoggedIn && (
              <Typography variant="body2" color="text.secondary">
                שלום, {currentUser?.name}
              </Typography>
            )}
          </Box>

          <List sx={{ px: 1 }}>
            {/* Main Navigation */}
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
              ניווט ראשי
            </Typography>
            
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('home');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'home'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'home' ? '#2e7d32' : 'inherit' }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="עמוד בית" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('profile');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'profile'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'profile' ? '#2e7d32' : 'inherit' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="פרופיל אישי" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('learning');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'learning'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'learning' ? '#2e7d32' : 'inherit' }}>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="מרכז הלימודים" />
              </ListItemButton>
            </ListItem>

            {/* Services Section */}
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold', mt: 2 }}>
              שירותים בקמפוס
            </Typography>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('cafeteria');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'cafeteria'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'cafeteria' ? '#2e7d32' : 'inherit' }}>
                  <RestaurantIcon />
                </ListItemIcon>
                <ListItemText primary="קפיטריה" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('lost-found');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'lost-found'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'lost-found' ? '#2e7d32' : 'inherit' }}>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="מציאות ואבדות" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('marketplace');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'marketplace'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'marketplace' ? '#2e7d32' : 'inherit' }}>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="שוק יד שנייה" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('services');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'services'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'services' ? '#2e7d32' : 'inherit' }}>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText primary="שירותים בקמפוס" />
              </ListItemButton>
            </ListItem>

            {/* Community Section */}
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold', mt: 2 }}>
              קהילה ותקשורת
            </Typography>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('community');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'community'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'community' ? '#2e7d32' : 'inherit' }}>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="קהילה" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('forum');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'forum'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'forum' ? '#2e7d32' : 'inherit' }}>
                  <ForumIcon />
                </ListItemIcon>
                <ListItemText primary="פורום קורס" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveSection('help');
                  setDrawerOpen(false);
                }}
                selected={activeSection === 'help'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    '&:hover': { backgroundColor: '#c8e6c9' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === 'help' ? '#2e7d32' : 'inherit' }}>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="עזרה" />
              </ListItemButton>
            </ListItem>

            {/* Management Section - Only for logged in users */}
            {isLoggedIn && (
              <>
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold', mt: 2 }}>
                  ניהול מערכת
                </Typography>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('lost-found-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'lost-found-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'lost-found-management' ? '#2e7d32' : 'inherit' }}>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול מציאות ואבדות" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('marketplace-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'marketplace-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'marketplace-management' ? '#2e7d32' : 'inherit' }}>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול שוק יד שנייה" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('services-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'services-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'services-management' ? '#2e7d32' : 'inherit' }}>
                      <BuildIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול שירותים" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('forum-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'forum-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'forum-management' ? '#2e7d32' : 'inherit' }}>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול פורום" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('cafeteria-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'cafeteria-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'cafeteria-management' ? '#2e7d32' : 'inherit' }}>
                      <RestaurantIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול קפיטריה" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('community-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'community-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'community-management' ? '#2e7d32' : 'inherit' }}>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול קהילה" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveSection('help-management');
                      setDrawerOpen(false);
                    }}
                    selected={activeSection === 'help-management'}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        '&:hover': { backgroundColor: '#c8e6c9' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: activeSection === 'help-management' ? '#2e7d32' : 'inherit' }}>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="ניהול עזרה" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {/* Quick Actions */}
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold', mt: 2 }}>
              פעולות מהירות
            </Typography>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setLostFoundDialogOpen(true);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="דווח על פריט אבוד/נמצא" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMarketplaceDialogOpen(true);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="הוסף פריט למכירה" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setServiceRequestDialogOpen(true);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="בקש שירות" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setHelpTicketDialogOpen(true);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="פתח כרטיס עזרה" />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              מערכת ניהול קמפוס ONO
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              גרסה 1.0
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        {/* Page Header for Regular Screens */}
        {!activeSection.endsWith('-management') && activeSection !== 'home' && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
              border: '1px solid #c8e6c9'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {activeSection === 'profile' && 'פרופיל אישי'}
                  {activeSection === 'learning' && 'מרכז הלימודים'}
                  {activeSection === 'cafeteria' && 'קפיטריה'}
                  {activeSection === 'lost-found' && 'מציאות ואבדות'}
                  {activeSection === 'marketplace' && 'שוק יד שנייה'}
                  {activeSection === 'services' && 'שירותים בקמפוס'}
                  {activeSection === 'community' && 'קהילה'}
                  {activeSection === 'forum' && 'פורום קורס'}
                  {activeSection === 'help' && 'עזרה'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {activeSection === 'profile' && 'ניהול הפרופיל האישי שלך'}
                  {activeSection === 'learning' && 'גישה לכלי הלמידה והקורסים'}
                  {activeSection === 'cafeteria' && 'הזמנת אוכל מהקפיטריה'}
                  {activeSection === 'lost-found' && 'דיווח על פריטים אבודים או נמצאים'}
                  {activeSection === 'marketplace' && 'קנייה ומכירה של פריטים'}
                  {activeSection === 'services' && 'בקשות שירות בקמפוס'}
                  {activeSection === 'community' && 'אירועים ופעילויות קהילתיות'}
                  {activeSection === 'forum' && 'דיונים ופורומים לקורסים'}
                  {activeSection === 'help' && 'בקשת עזרה ותמיכה'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    switch (activeSection) {
                      case 'lost-found':
                        setLostFoundDialogOpen(true);
                        break;
                      case 'marketplace':
                        setMarketplaceDialogOpen(true);
                        break;
                      case 'services':
                        setServiceRequestDialogOpen(true);
                        break;
                      case 'forum':
                        setForumPostDialogOpen(true);
                        break;
                      case 'cafeteria':
                        setCafeteriaOrderDialogOpen(true);
                        break;
                      case 'community':
                        setCommunityEventDialogOpen(true);
                        break;
                      case 'help':
                        setHelpTicketDialogOpen(true);
                        break;
                    }
                  }}
                  sx={{ 
                    backgroundColor: '#2e7d32',
                    display: ['lost-found', 'marketplace', 'services', 'forum', 'cafeteria', 'community', 'help'].includes(activeSection) ? 'flex' : 'none'
                  }}
                >
                  {activeSection === 'lost-found' && 'דווח על פריט'}
                  {activeSection === 'marketplace' && 'הוסף פריט למכירה'}
                  {activeSection === 'services' && 'בקש שירות'}
                  {activeSection === 'forum' && 'צור פוסט'}
                  {activeSection === 'cafeteria' && 'הזמן אוכל'}
                  {activeSection === 'community' && 'צור אירוע'}
                  {activeSection === 'help' && 'פתח כרטיס עזרה'}
                </Button>
              </Box>
            </Box>

            {/* Quick Navigation */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'white' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#2e7d32' }}>
                ניווט מהיר
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('home')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  עמוד בית
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('profile')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  פרופיל
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('learning')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  לימודים
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('cafeteria')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  קפיטריה
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('community')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  קהילה
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('help')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  עזרה
                </Button>
              </Box>
            </Paper>
          </Paper>
        )}

        {activeSection === 'home' && (
          <Box>
            {/* Welcome Banner */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                mb: 3, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom>
                ברוכים הבאים למערכת המקיפה לניהול חיי הסטודנטים בקמפוס
              </Typography>
              {isLoggedIn && (
                <Typography variant="h6">
                  שלום {currentUser?.name}! היום יש לך {demoTasks.filter(t => t.priority === 'urgent').length} מבחנים ו-{demoTasks.filter(t => t.type === 'assignment').length} מטלות להגשה
                </Typography>
              )}
            </Paper>

            {/* Navigation Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
              gap: 2, 
              mb: 4 
            }}>
              {navigationItems.slice(1, 7).map((item) => (
                <Card 
                  key={item.id}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => setActiveSection(item.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    {item.icon}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Secondary Navigation - Quick Access */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
                גישה מהירה
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2 
              }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setLostFoundDialogOpen(true)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    p: 2,
                    height: 'auto',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    דווח על פריט אבוד/נמצא
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    דווח על פריטים אבודים או נמצאים
                  </Typography>
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setMarketplaceDialogOpen(true)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    p: 2,
                    height: 'auto',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    הוסף פריט למכירה
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    מכור פריטים בשוק יד שנייה
                  </Typography>
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setServiceRequestDialogOpen(true)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    p: 2,
                    height: 'auto',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    בקש שירות
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    בקש שירותים בקמפוס
                  </Typography>
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setHelpTicketDialogOpen(true)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    p: 2,
                    height: 'auto',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    פתח כרטיס עזרה
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    קבל עזרה ותמיכה
                  </Typography>
                </Button>
              </Box>
            </Paper>

            {/* Management Quick Access - Only for logged in users */}
            {isLoggedIn && (
              <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
                  ניהול מערכת
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2 
                }}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => setActiveSection('lost-found-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול מציאות ואבדות
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => setActiveSection('marketplace-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול שוק יד שנייה
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<BuildIcon />}
                    onClick={() => setActiveSection('services-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול שירותים
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<ForumIcon />}
                    onClick={() => setActiveSection('forum-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול פורום
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<RestaurantIcon />}
                    onClick={() => setActiveSection('cafeteria-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול קפיטריה
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<HelpIcon />}
                    onClick={() => setActiveSection('help-management')}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    ניהול עזרה
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Content Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {/* Events Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">לוח אירועים</Typography>
                  </Box>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {demoEvents.map((event) => (
                      <Box 
                        key={event.id} 
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          backgroundColor: event.urgent ? '#ffebee' : 'transparent'
                        }}
                      >
                        <Typography variant="subtitle2" color={event.urgent ? 'error' : 'primary'}>
                          {event.title} - {event.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">{event.time}</Typography>
                          <LocationIcon sx={{ fontSize: 16, ml: 2, mr: 0.5 }} />
                          <Typography variant="caption">{event.location}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Facilities Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">מצב מתקנים</Typography>
                  </Box>
                  {demoFacilities.map((facility) => (
                    <Box key={facility.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2">{facility.name}:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={facility.status === 'open' ? 'פתוח' : facility.status === 'busy' ? 'עמוס' : 'סגור'}
                          color={getStatusColor(facility.status) as any}
                          size="small"
                        />
                        <Typography variant="caption">{facility.hours}</Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Tasks Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">תזכורות יומיות</Typography>
                  </Box>
                  {demoTasks.map((task) => (
                    <Box 
                      key={task.id} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        backgroundColor: task.priority === 'urgent' ? '#ffebee' : '#e3f2fd'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {task.priority === 'urgent' ? <WarningIcon color="error" /> : <TimeIcon color="primary" />}
                        <Typography variant="body2" fontWeight="bold">
                          {task.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {task.course} - {task.dueDate}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>

            {/* Event Images Gallery */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
                📸 אירועים נוספים
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2 
              }}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/loc1.png"
                    alt="אירוע 1"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/loc2.png"
                    alt="אירוע 2"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/loc3.png"
                    alt="אירוע 3"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/loc4.png"
                    alt="אירוע 4"
                  />
                </Card>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32' }}>
                פרופיל אישי
              </Typography>
              
              {isLoggedIn && currentUser ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>פרטים אישיים</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">שם מלא</Typography>
                        <Typography variant="body1">{currentUser.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">אימייל</Typography>
                        <Typography variant="body1">{currentUser.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">תפקיד</Typography>
                        <Typography variant="body1">{currentUser.role === 'student' ? 'סטודנט' : currentUser.role === 'lecturer' ? 'מרצה' : 'מנהל'}</Typography>
                      </Box>
                      {currentUser.phone && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">טלפון</Typography>
                          <Typography variant="body1">{currentUser.phone}</Typography>
                        </Box>
                      )}
                      {currentUser.age && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">גיל</Typography>
                          <Typography variant="body1">{currentUser.age}</Typography>
                        </Box>
                      )}
                      {currentUser.city && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">עיר</Typography>
                          <Typography variant="body1">{currentUser.city}</Typography>
                        </Box>
                      )}
                      {currentUser.gender && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">מגדר</Typography>
                          <Typography variant="body1">{currentUser.gender === 'male' ? 'זכר' : 'נקבה'}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>סטטיסטיקות</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">{demoTasks.length}</Typography>
                        <Typography variant="body2" color="text.secondary">מטלות</Typography>
                      </Paper>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">{demoEvents.length}</Typography>
                        <Typography variant="body2" color="text.secondary">אירועים</Typography>
                      </Paper>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">{lostFoundItems.length}</Typography>
                        <Typography variant="body2" color="text.secondary">פריטים אבודים/נמצאים</Typography>
                      </Paper>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">{marketplaceItems.length}</Typography>
                        <Typography variant="body2" color="text.secondary">פריטים למכירה</Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    יש להתחבר כדי לצפות בפרופיל
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setLoginDialogOpen(true)}
                    sx={{ backgroundColor: '#2e7d32' }}
                  >
                    התחברות
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Learning Center Section */}
        {activeSection === 'learning' && (
          <Box>
            {/* Task Board Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DeleteIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  לוח מטלות
                </Typography>
              </Box>
              
              {/* Task Filters */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button variant="contained" size="small" sx={{ backgroundColor: '#2e7d32' }}>
                  הכל
                </Button>
                <Button variant="outlined" size="small">
                  הושלם
                </Button>
                <Button variant="outlined" size="small">
                  דחוי
                </Button>
                <Button variant="outlined" size="small">
                  ממתין
                </Button>
              </Box>
              
              {/* Task Summary Cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" color="primary">
                    6
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ מטלות
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                  <Typography variant="h4" color="warning.main">
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    דחויות
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" color="success.main">
                    1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    הושלמו
                  </Typography>
                </Paper>
              </Box>
              
              {/* Tasks Table */}
              <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>סוג מטלה</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>קורס</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>כותרת</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>תאריך יעד</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>דחיפות</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>מבחן</TableCell>
                      <TableCell>מתמטיקה 1</TableCell>
                      <TableCell>מבחן אמצע</TableCell>
                      <TableCell>15/12/2024</TableCell>
                      <TableCell>
                        <Chip label="גבוה" color="error" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="בביצוע" color="info" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>פרויקט סופי</TableCell>
                      <TableCell></TableCell>
                      <TableCell>18/12/2024</TableCell>
                      <TableCell>
                        <Chip label="בינוני" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="ממתין" color="default" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>שיעורי בית</TableCell>
                      <TableCell>פיזיקה 1</TableCell>
                      <TableCell>תרגילי כוחות</TableCell>
                      <TableCell>20/12/2024</TableCell>
                      <TableCell>
                        <Chip label="בינוני" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="ממתין" color="default" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>בוחן</TableCell>
                      <TableCell>מתמטיקה 1</TableCell>
                      <TableCell>בוחן קצר - נגזרות</TableCell>
                      <TableCell>22/12/2024</TableCell>
                      <TableCell>
                        <Chip label="נמוך" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="הושלם" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>מטלה</TableCell>
                      <TableCell>תכנות</TableCell>
                      <TableCell>קריאת מאמר</TableCell>
                      <TableCell>25/12/2024</TableCell>
                      <TableCell>
                        <Chip label="בינוני" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="ממתין" color="default" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ניסוי</TableCell>
                      <TableCell>פיזיקה 1</TableCell>
                      <TableCell>הצגת ניסוי</TableCell>
                      <TableCell>28/12/2024</TableCell>
                      <TableCell>
                        <Chip label="גבוה" color="error" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="ממתין" color="default" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            ערוך
                          </Button>
                          <Button size="small" variant="contained" sx={{ backgroundColor: '#2e7d32', minWidth: 'auto' }}>
                            מחק
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Task Management Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EditIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  ניהול מטלות
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>סוג מטלה</InputLabel>
                  <Select label="סוג מטלה">
                    <MenuItem value="exam">מבחן</MenuItem>
                    <MenuItem value="assignment">מטלה</MenuItem>
                    <MenuItem value="homework">שיעורי בית</MenuItem>
                    <MenuItem value="quiz">בוחן</MenuItem>
                    <MenuItem value="project">פרויקט</MenuItem>
                    <MenuItem value="experiment">ניסוי</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>קורס</InputLabel>
                  <Select label="קורס">
                    <MenuItem value="math1">מתמטיקה 1</MenuItem>
                    <MenuItem value="physics1">פיזיקה 1</MenuItem>
                    <MenuItem value="programming">תכנות</MenuItem>
                    <MenuItem value="final-project">פרויקט סופי</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="כותרת המטלה"
                  placeholder="הכנס כותרת מטלה"
                />
                
                <TextField
                  fullWidth
                  label="תאריך יעד"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="תיאור"
                  placeholder="תיאור המטלה"
                  sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                />
                
                <Button
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#2e7d32',
                    gridColumn: { xs: '1', md: '1 / -1' }
                  }}
                >
                  הוסף מטלה
                </Button>
              </Box>
            </Paper>

            {/* Academic Progress Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BookIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  התקדמות אקדמית
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" color="primary">
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    קורסים פעילים
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" color="primary">
                    88.3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ממוצע ציונים
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h4" color="primary">
                    16
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ נקודות זכות
                  </Typography>
                </Paper>
              </Box>
              
              {/* Course Details Table */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  פירוט קורסים וציונים
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>קורס</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>נקודות זכות</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ציון</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>מתמטיקה 1</TableCell>
                      <TableCell>6</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>
                        <Chip label="הושלם" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>פיזיקה 1</TableCell>
                      <TableCell>6</TableCell>
                      <TableCell>92</TableCell>
                      <TableCell>
                        <Chip label="הושלם" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>תכנות</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>88</TableCell>
                      <TableCell>
                        <Chip label="הושלם" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* My Courses Section */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1, color: '#2e7d32' }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    הקורסים שלי
                  </Typography>
                </Box>
                <IconButton>
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              
              {/* Course List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #2e7d32'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    מתמטיקה 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: ד"ר יוסי כהן | נקודות זכות: 6 | מערכת: א' 10:00-12:00, ג' 14:00-16:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #1976d2'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    פיזיקה 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: פרופ' שרה לוי | נקודות זכות: 5 | מערכת: ב' 09:00-11:00, ד' 13:00-15:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #ed6c02'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    תכנות מתקדם
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: ד"ר דוד ישראלי | נקודות זכות: 4 | מערכת: א' 14:00-16:00, ה' 10:00-12:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #9c27b0'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    כימיה כללית
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: ד"ר רות כהן | נקודות זכות: 5 | מערכת: ב' 12:00-14:00, ד' 09:00-11:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #2e7d32'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    ביולוגיה תאית
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: פרופ' משה גולדברג | נקודות זכות: 4 | מערכת: ג' 10:00-12:00, ו' 09:00-11:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #d32f2f'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    סטטיסטיקה והסתברות
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: ד"ר אנה פטרוב | נקודות זכות: 3 | מערכת: א' 16:00-18:00, ד' 16:00-18:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #1976d2'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    אנגלית אקדמית
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: גב' לינדה סמית | נקודות זכות: 2 | מערכת: ב' 16:00-18:00, ה' 14:00-16:00
                  </Typography>
                </Paper>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderLeft: '4px solid #ed6c02'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    היסטוריה של המדע
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מרצה: ד"ר יעל ברק | נקודות זכות: 3 | מערכת: ג' 14:00-16:00, ו' 12:00-14:00
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Lost & Found Section */}
        {activeSection === 'lost-found' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">מציאות ואבדות</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setLostFoundDialogOpen(true)}
              >
                הוסף פריט חדש
              </Button>
            </Box>
            
            {/* Search and Filter */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="חיפוש לפי כותרת או מיקום..."
                  size="small"
                  sx={{ minWidth: 300 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>סוג</InputLabel>
                  <Select label="סוג">
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="lost">אבד</MenuItem>
                    <MenuItem value="found">נמצא</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>סטטוס</InputLabel>
                  <Select label="סטטוס">
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="open">פתוח</MenuItem>
                    <MenuItem value="claimed">נטען</MenuItem>
                    <MenuItem value="closed">סגור</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" size="small">נקה סינון</Button>
              </Box>
            </Paper>
            
            {/* Statistics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {lostFoundItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סה"כ פריטים
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  {lostFoundItems.filter(item => item.type === 'lost').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים אבודים
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {lostFoundItems.filter(item => item.type === 'found').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים שנמצאו
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {lostFoundItems.filter(item => item.status === 'open').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים פתוחים
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {lostFoundItems.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={item.type === 'lost' ? 'אבד' : 'נמצא'} 
                        color={item.type === 'lost' ? 'error' : 'success'}
                      />
                      <Chip 
                        label={item.status === 'open' ? 'פתוח' : item.status === 'claimed' ? 'נטען' : 'סגור'} 
                        color={item.status === 'open' ? 'primary' : item.status === 'claimed' ? 'warning' : 'default'}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{item.description}</Typography>
                    <Typography variant="body2"><strong>מיקום:</strong> {item.location}</Typography>
                    <Typography variant="body2"><strong>תאריך:</strong> {item.date}</Typography>
                    <Typography variant="body2"><strong>איש קשר:</strong> {item.contactName}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {item.contactPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {item.contactEmail}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {lostFoundItems.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין פריטים להצגה
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setLostFoundDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  הוסף פריט ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Marketplace Section */}
        {activeSection === 'marketplace' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">שוק יד שנייה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setMarketplaceDialogOpen(true)}
              >
                הוסף פריט למכירה
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {marketplaceItems.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={item.status === 'available' ? 'זמין' : item.status === 'sold' ? 'נמכר' : 'שמור'} 
                        color={item.status === 'available' ? 'success' : item.status === 'sold' ? 'error' : 'warning'}
                      />
                      <Typography variant="h6" color="primary">₪{item.price}</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{item.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={item.category} size="small" />
                      <Chip label={item.condition} size="small" />
                    </Box>
                    <Typography variant="body2"><strong>מוכר:</strong> {item.sellerName}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {item.sellerPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {item.sellerEmail}</Typography>
                    <Typography variant="body2"><strong>תאריך פרסום:</strong> {item.datePosted}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {marketplaceItems.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין פריטים למכירה
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setMarketplaceDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  הוסף פריט ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">שירותים בקמפוס</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setServiceRequestDialogOpen(true)}
              >
                בקש שירות
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {serviceRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={request.type} 
                        color="primary"
                      />
                      <Chip 
                        label={request.priority} 
                        color={request.priority === 'urgent' ? 'error' : request.priority === 'high' ? 'warning' : 'success'}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>{request.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{request.description}</Typography>
                    <Typography variant="body2"><strong>מיקום:</strong> {request.location}</Typography>
                    <Typography variant="body2"><strong>מבקש:</strong> {request.requesterName}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {request.requesterPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {request.requesterEmail}</Typography>
                    <Typography variant="body2"><strong>תאריך בקשה:</strong> {request.dateRequested}</Typography>
                    <Chip 
                      label={request.status === 'pending' ? 'ממתין' : request.status === 'in-progress' ? 'בטיפול' : request.status === 'completed' ? 'הושלם' : 'בוטל'} 
                      color={request.status === 'pending' ? 'warning' : request.status === 'in-progress' ? 'info' : request.status === 'completed' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {serviceRequests.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין בקשות שירות
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setServiceRequestDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  בקש שירות ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Forum Section */}
        {activeSection === 'forum' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">פורום קורס</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setForumPostDialogOpen(true)}
              >
                צור פוסט חדש
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {forumPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{post.title}</Typography>
                      <Chip 
                        label={post.status === 'active' ? 'פעיל' : post.status === 'closed' ? 'סגור' : 'נמחק'} 
                        color={post.status === 'active' ? 'success' : post.status === 'closed' ? 'warning' : 'default'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>{post.content}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {post.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>
                    <Typography variant="body2"><strong>מחבר:</strong> {post.authorName}</Typography>
                    <Typography variant="body2"><strong>תאריך:</strong> {post.datePosted}</Typography>
                    <Typography variant="body2"><strong>תגובות:</strong> {post.replies.length}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {forumPosts.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין פוסטים בפורום
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setForumPostDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  צור פוסט ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Cafeteria Section */}
        {activeSection === 'cafeteria' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">קפיטריה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCafeteriaOrderDialogOpen(true)}
              >
                הזמן אוכל
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {cafeteriaOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">הזמנה #{order.id.slice(-6)}</Typography>
                      <Chip 
                        label={order.status === 'pending' ? 'ממתין' : order.status === 'preparing' ? 'בהכנה' : order.status === 'ready' ? 'מוכן' : order.status === 'completed' ? 'הושלם' : 'בוטל'} 
                        color={order.status === 'pending' ? 'warning' : order.status === 'preparing' ? 'info' : order.status === 'ready' ? 'success' : order.status === 'completed' ? 'default' : 'error'}
                      />
                    </Box>
                    <Typography variant="body2"><strong>לקוח:</strong> {order.customerName}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {order.customerPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {order.customerEmail}</Typography>
                    <Typography variant="body2"><strong>פריטים:</strong> {order.items.length}</Typography>
                    <Typography variant="body2"><strong>סה"כ:</strong> ₪{order.totalPrice}</Typography>
                    <Typography variant="body2"><strong>זמן איסוף:</strong> {order.pickupTime}</Typography>
                    <Typography variant="body2"><strong>תאריך הזמנה:</strong> {order.orderDate}</Typography>
                    {order.specialInstructions && (
                      <Typography variant="body2"><strong>הערות:</strong> {order.specialInstructions}</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {cafeteriaOrders.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין הזמנות
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCafeteriaOrderDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  הזמן אוכל ראשון
                </Button>
              </Paper>
            )}
            
            {/* Cafeteria Images Gallery */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
                📸 גלריית תמונות קפיטריה
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
                gap: 2 
              }}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a1.png"
                    alt="תמונה 1"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a2.png"
                    alt="תמונה 2"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a3.png"
                    alt="תמונה 3"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a4.png"
                    alt="תמונה 4"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a5.png"
                    alt="תמונה 5"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a6.png"
                    alt="תמונה 6"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a7.png"
                    alt="תמונה 7"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a8.png"
                    alt="תמונה 8"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a9.png"
                    alt="תמונה 9"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a10.png"
                    alt="תמונה 10"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a11.png"
                    alt="תמונה 11"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a12.png"
                    alt="תמונה 12"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a17.png"
                    alt="תמונה 17"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a18.png"
                    alt="תמונה 18"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a19.png"
                    alt="תמונה 19"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a20.png"
                    alt="תמונה 20"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a21.png"
                    alt="תמונה 21"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a22.png"
                    alt="תמונה 22"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a23.png"
                    alt="תמונה 23"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a24.png"
                    alt="תמונה 24"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a13.png"
                    alt="תמונה 13"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a14.png"
                    alt="תמונה 14"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a15.png"
                    alt="תמונה 15"
                  />
                </Card>
                
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/a16.png"
                    alt="תמונה 16"
                  />
                </Card>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Community Section */}
        {activeSection === 'community' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">קהילה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCommunityEventDialogOpen(true)}
              >
                צור אירוע חדש
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {communityEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={event.category} 
                        color="primary"
                      />
                      <Chip 
                        label={event.status === 'upcoming' ? 'קרוב' : event.status === 'ongoing' ? 'מתקיים' : event.status === 'completed' ? 'הושלם' : 'בוטל'} 
                        color={event.status === 'upcoming' ? 'success' : event.status === 'ongoing' ? 'info' : event.status === 'completed' ? 'default' : 'error'}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{event.description}</Typography>
                    <Typography variant="body2"><strong>תאריך:</strong> {event.date}</Typography>
                    <Typography variant="body2"><strong>שעה:</strong> {event.time}</Typography>
                    <Typography variant="body2"><strong>מיקום:</strong> {event.location}</Typography>
                    <Typography variant="body2"><strong>מארגן:</strong> {event.organizerName}</Typography>
                    <Typography variant="body2"><strong>משתתפים:</strong> {event.currentParticipants}/{event.maxParticipants}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {event.organizerPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {event.organizerEmail}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {communityEvents.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין אירועים קהילתיים
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCommunityEventDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  צור אירוע ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Help Section */}
        {activeSection === 'help' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">עזרה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setHelpTicketDialogOpen(true)}
              >
                פתח כרטיס עזרה
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {helpTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={ticket.category} 
                        color="primary"
                      />
                      <Chip 
                        label={ticket.priority} 
                        color={ticket.priority === 'urgent' ? 'error' : ticket.priority === 'high' ? 'warning' : ticket.priority === 'medium' ? 'info' : 'success'}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{ticket.description}</Typography>
                    <Typography variant="body2"><strong>מבקש:</strong> {ticket.requesterName}</Typography>
                    <Typography variant="body2"><strong>טלפון:</strong> {ticket.requesterPhone}</Typography>
                    <Typography variant="body2"><strong>אימייל:</strong> {ticket.requesterEmail}</Typography>
                    <Typography variant="body2"><strong>תאריך יצירה:</strong> {ticket.dateCreated}</Typography>
                    <Chip 
                      label={ticket.status === 'open' ? 'פתוח' : ticket.status === 'in-progress' ? 'בטיפול' : ticket.status === 'resolved' ? 'נפתר' : 'סגור'} 
                      color={ticket.status === 'open' ? 'warning' : ticket.status === 'in-progress' ? 'info' : ticket.status === 'resolved' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {helpTickets.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  אין כרטיסי עזרה
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setHelpTicketDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  פתח כרטיס עזרה ראשון
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Management Screens */}
        {activeSection === 'lost-found-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול מציאות ואבדות</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setLostFoundDialogOpen(true)}
              >
                הוסף פריט חדש
              </Button>
            </Box>
            
            {/* Search and Filter */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="חיפוש לפי כותרת או מיקום..."
                  size="small"
                  sx={{ minWidth: 300 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>סוג</InputLabel>
                  <Select label="סוג">
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="lost">אבד</MenuItem>
                    <MenuItem value="found">נמצא</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>סטטוס</InputLabel>
                  <Select label="סטטוס">
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="open">פתוח</MenuItem>
                    <MenuItem value="claimed">נטען</MenuItem>
                    <MenuItem value="closed">סגור</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" size="small">נקה סינון</Button>
              </Box>
            </Paper>
            
            {/* Statistics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {lostFoundItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סה"כ פריטים
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  {lostFoundItems.filter(item => item.type === 'lost').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים אבודים
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {lostFoundItems.filter(item => item.type === 'found').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים שנמצאו
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {lostFoundItems.filter(item => item.status === 'open').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים פתוחים
                </Typography>
              </Paper>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>סוג</TableCell>
                      <TableCell>כותרת</TableCell>
                      <TableCell>מיקום</TableCell>
                      <TableCell>תאריך</TableCell>
                      <TableCell>איש קשר</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lostFoundItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Chip 
                            label={item.type === 'lost' ? 'אבד' : 'נמצא'} 
                            color={item.type === 'lost' ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.contactName}</TableCell>
                        <TableCell>{item.contactPhone}</TableCell>
                        <TableCell>{item.contactEmail}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status === 'open' ? 'פתוח' : item.status === 'claimed' ? 'נטען' : 'סגור'} 
                            color={item.status === 'open' ? 'primary' : item.status === 'claimed' ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteLostFound(item.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={lostFoundItems.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'marketplace-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול שוק יד שנייה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setMarketplaceDialogOpen(true)}
              >
                הוסף פריט חדש
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>כותרת</TableCell>
                      <TableCell>קטגוריה</TableCell>
                      <TableCell>מצב</TableCell>
                      <TableCell>מחיר</TableCell>
                      <TableCell>מוכר</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>תאריך פרסום</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marketplaceItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={item.condition} size="small" />
                        </TableCell>
                        <TableCell>₪{item.price}</TableCell>
                        <TableCell>{item.sellerName}</TableCell>
                        <TableCell>{item.sellerPhone}</TableCell>
                        <TableCell>{item.sellerEmail}</TableCell>
                        <TableCell>{item.datePosted}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status === 'available' ? 'זמין' : item.status === 'sold' ? 'נמכר' : 'שמור'} 
                            color={item.status === 'available' ? 'success' : item.status === 'sold' ? 'error' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteMarketplace(item.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={marketplaceItems.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'services-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול שירותים</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setServiceRequestDialogOpen(true)}
              >
                הוסף בקשה חדשה
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>סוג שירות</TableCell>
                      <TableCell>כותרת</TableCell>
                      <TableCell>מיקום</TableCell>
                      <TableCell>עדיפות</TableCell>
                      <TableCell>מבקש</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>תאריך בקשה</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceRequests.map((request) => (
                      <TableRow key={request.id} hover>
                        <TableCell>
                          <Chip label={request.type} size="small" />
                        </TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.priority} 
                            color={request.priority === 'urgent' ? 'error' : request.priority === 'high' ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.requesterName}</TableCell>
                        <TableCell>{request.requesterPhone}</TableCell>
                        <TableCell>{request.requesterEmail}</TableCell>
                        <TableCell>{request.dateRequested}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status === 'pending' ? 'ממתין' : request.status === 'in-progress' ? 'בטיפול' : request.status === 'completed' ? 'הושלם' : 'בוטל'} 
                            color={request.status === 'pending' ? 'warning' : request.status === 'in-progress' ? 'info' : request.status === 'completed' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteServiceRequest(request.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={serviceRequests.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'forum-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול פורום</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setForumPostDialogOpen(true)}
              >
                צור פוסט חדש
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>קורס</TableCell>
                      <TableCell>כותרת</TableCell>
                      <TableCell>מחבר</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>תאריך פרסום</TableCell>
                      <TableCell>תגובות</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {forumPosts.map((post) => (
                      <TableRow key={post.id} hover>
                        <TableCell>{post.courseId}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.authorName}</TableCell>
                        <TableCell>{post.authorEmail}</TableCell>
                        <TableCell>{post.datePosted}</TableCell>
                        <TableCell>{post.replies.length}</TableCell>
                        <TableCell>
                          <Chip 
                            label={post.status === 'active' ? 'פעיל' : post.status === 'closed' ? 'סגור' : 'נמחק'} 
                            color={post.status === 'active' ? 'success' : post.status === 'closed' ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteForumPost(post.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={forumPosts.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'cafeteria-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול קפיטריה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCafeteriaOrderDialogOpen(true)}
              >
                הוסף הזמנה חדשה
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>מספר הזמנה</TableCell>
                      <TableCell>לקוח</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>פריטים</TableCell>
                      <TableCell>סה"כ</TableCell>
                      <TableCell>זמן איסוף</TableCell>
                      <TableCell>תאריך הזמנה</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cafeteriaOrders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>#{order.id.slice(-6)}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.customerPhone}</TableCell>
                        <TableCell>{order.customerEmail}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>₪{order.totalPrice}</TableCell>
                        <TableCell>{order.pickupTime}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status === 'pending' ? 'ממתין' : order.status === 'preparing' ? 'בהכנה' : order.status === 'ready' ? 'מוכן' : order.status === 'completed' ? 'הושלם' : 'בוטל'} 
                            color={order.status === 'pending' ? 'warning' : order.status === 'preparing' ? 'info' : order.status === 'ready' ? 'success' : order.status === 'completed' ? 'default' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCafeteriaOrder(order.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={cafeteriaOrders.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'community-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול קהילה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCommunityEventDialogOpen(true)}
              >
                צור אירוע חדש
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>כותרת</TableCell>
                      <TableCell>קטגוריה</TableCell>
                      <TableCell>תאריך</TableCell>
                      <TableCell>שעה</TableCell>
                      <TableCell>מיקום</TableCell>
                      <TableCell>מארגן</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>משתתפים</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {communityEvents.map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>
                          <Chip label={event.category} size="small" />
                        </TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.organizerName}</TableCell>
                        <TableCell>{event.organizerPhone}</TableCell>
                        <TableCell>{event.organizerEmail}</TableCell>
                        <TableCell>{event.currentParticipants}/{event.maxParticipants}</TableCell>
                        <TableCell>
                          <Chip 
                            label={event.status === 'upcoming' ? 'קרוב' : event.status === 'ongoing' ? 'מתקיים' : event.status === 'completed' ? 'הושלם' : 'בוטל'} 
                            color={event.status === 'upcoming' ? 'success' : event.status === 'ongoing' ? 'info' : event.status === 'completed' ? 'default' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCommunityEvent(event.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={communityEvents.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {activeSection === 'help-management' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">ניהול עזרה</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setHelpTicketDialogOpen(true)}
              >
                פתח כרטיס חדש
              </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>קטגוריה</TableCell>
                      <TableCell>כותרת</TableCell>
                      <TableCell>עדיפות</TableCell>
                      <TableCell>מבקש</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>תאריך יצירה</TableCell>
                      <TableCell>סטטוס</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {helpTickets.map((ticket) => (
                      <TableRow key={ticket.id} hover>
                        <TableCell>
                          <Chip label={ticket.category} size="small" />
                        </TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={ticket.priority} 
                            color={ticket.priority === 'urgent' ? 'error' : ticket.priority === 'high' ? 'warning' : ticket.priority === 'medium' ? 'info' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{ticket.requesterName}</TableCell>
                        <TableCell>{ticket.requesterPhone}</TableCell>
                        <TableCell>{ticket.requesterEmail}</TableCell>
                        <TableCell>{ticket.dateCreated}</TableCell>
                        <TableCell>
                          <Chip 
                            label={ticket.status === 'open' ? 'פתוח' : ticket.status === 'in-progress' ? 'בטיפול' : ticket.status === 'resolved' ? 'נפתר' : 'סגור'} 
                            color={ticket.status === 'open' ? 'warning' : ticket.status === 'in-progress' ? 'info' : ticket.status === 'resolved' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">ערוך</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteHelpTicket(ticket.id)}>מחק</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={helpTickets.length}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                labelRowsPerPage="שורות בעמוד:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
              />
            </Paper>
          </Box>
        )}

        {/* Other sections */}
        {!['home', 'profile', 'learning', 'lost-found', 'marketplace', 'services', 'forum', 'cafeteria', 'community', 'help', 'lost-found-management', 'marketplace-management', 'services-management', 'forum-management', 'cafeteria-management', 'community-management', 'help-management'].includes(activeSection) && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              תוכן זה יפותח בהמשך...
            </Typography>
          </Paper>
        )}

        {/* Page Header for Management Screens */}
        {activeSection.endsWith('-management') && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {activeSection === 'lost-found-management' && 'ניהול מציאות ואבדות'}
                  {activeSection === 'marketplace-management' && 'ניהול שוק יד שנייה'}
                  {activeSection === 'services-management' && 'ניהול שירותים'}
                  {activeSection === 'forum-management' && 'ניהול פורום'}
                  {activeSection === 'cafeteria-management' && 'ניהול קפיטריה'}
                  {activeSection === 'community-management' && 'ניהול קהילה'}
                  {activeSection === 'help-management' && 'ניהול עזרה'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ניהול מלא של הנתונים במערכת
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    switch (activeSection) {
                      case 'lost-found-management':
                        setLostFoundDialogOpen(true);
                        break;
                      case 'marketplace-management':
                        setMarketplaceDialogOpen(true);
                        break;
                      case 'services-management':
                        setServiceRequestDialogOpen(true);
                        break;
                      case 'forum-management':
                        setForumPostDialogOpen(true);
                        break;
                      case 'cafeteria-management':
                        setCafeteriaOrderDialogOpen(true);
                        break;
                      case 'community-management':
                        setCommunityEventDialogOpen(true);
                        break;
                      case 'help-management':
                        setHelpTicketDialogOpen(true);
                        break;
                    }
                  }}
                  sx={{ backgroundColor: '#2e7d32' }}
                >
                  הוסף חדש
                </Button>
              </Box>
            </Box>
            
            {/* Quick Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {getCurrentSectionCount()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סה"כ פריטים
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
                <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {getActiveItemsCount()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פעילים
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
                <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {getPendingItemsCount()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ממתינים
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
                <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                  {getCompletedItemsCount()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  הושלמו
                </Typography>
              </Paper>
            </Box>

            {/* Quick Navigation */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'white' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#2e7d32' }}>
                ניווט מהיר
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('home')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  עמוד בית
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('lost-found')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  מציאות ואבדות
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('marketplace')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  שוק יד שנייה
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('services')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  שירותים
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('forum')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  פורום
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveSection('help')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  עזרה
                </Button>
              </Box>
            </Paper>
          </Paper>
        )}
      </Container>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>התחברות למערכת</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              חשבונות דמו זמינים:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>סטודנט:</strong> student@campus.ac.il / 123456
              </Typography>
              <Typography variant="body2">
                <strong>מרצה:</strong> lecturer@campus.ac.il / 123456
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="אימייל"
              variant="outlined"
              margin="normal"
              id="login-email"
            />
            <TextField
              fullWidth
              label="סיסמה"
              type="password"
              variant="outlined"
              margin="normal"
              id="login-password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>ביטול</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              const email = (document.getElementById('login-email') as HTMLInputElement)?.value;
              const password = (document.getElementById('login-password') as HTMLInputElement)?.value;
              if (email && password) {
                handleLogin(email, password);
              }
            }}
          >
            התחבר
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lost & Found Form Dialog */}
      <Dialog open={lostFoundDialogOpen} onClose={() => setLostFoundDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>הוסף פריט למציאות ואבדות</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <FormControl fullWidth>
                <InputLabel>סוג</InputLabel>
                <Select
                  value={lostFoundForm.type}
                  onChange={(e) => setLostFoundForm({...lostFoundForm, type: e.target.value as 'lost' | 'found'})}
                >
                  <MenuItem value="lost">אבד</MenuItem>
                  <MenuItem value="found">נמצא</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={lostFoundForm.title}
                onChange={(e) => setLostFoundForm({...lostFoundForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תיאור"
                multiline
                rows={3}
                value={lostFoundForm.description}
                onChange={(e) => setLostFoundForm({...lostFoundForm, description: e.target.value})}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="מיקום"
                value={lostFoundForm.location}
                onChange={(e) => setLostFoundForm({...lostFoundForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
              <TextField
                fullWidth
                label="תאריך"
                type="date"
                value={lostFoundForm.date}
                onChange={(e) => setLostFoundForm({...lostFoundForm, date: e.target.value})}
                error={!!formErrors.date}
                helperText={formErrors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם איש קשר"
                value={lostFoundForm.contactName}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactName: e.target.value})}
                error={!!formErrors.contactName}
                helperText={formErrors.contactName}
              />
              <TextField
                fullWidth
                label="טלפון"
                value={lostFoundForm.contactPhone}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactPhone: e.target.value})}
                error={!!formErrors.contactPhone}
                helperText={formErrors.contactPhone}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={lostFoundForm.contactEmail}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactEmail: e.target.value})}
                error={!!formErrors.contactEmail}
                helperText={formErrors.contactEmail}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLostFoundDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleLostFoundSubmit}>שמור</Button>
        </DialogActions>
      </Dialog>

      {/* Marketplace Form Dialog */}
      <Dialog open={marketplaceDialogOpen} onClose={() => setMarketplaceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>הוסף פריט למכירה</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={marketplaceForm.title}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תיאור"
                multiline
                rows={3}
                value={marketplaceForm.description}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, description: e.target.value})}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="מחיר"
                type="number"
                value={marketplaceForm.price}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, price: e.target.value})}
                error={!!formErrors.price}
                helperText={formErrors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                }}
              />
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={marketplaceForm.category}
                  onChange={(e) => setMarketplaceForm({...marketplaceForm, category: e.target.value as any})}
                >
                  <MenuItem value="books">ספרים</MenuItem>
                  <MenuItem value="electronics">אלקטרוניקה</MenuItem>
                  <MenuItem value="furniture">רהיטים</MenuItem>
                  <MenuItem value="clothing">בגדים</MenuItem>
                  <MenuItem value="other">אחר</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>מצב</InputLabel>
                <Select
                  value={marketplaceForm.condition}
                  onChange={(e) => setMarketplaceForm({...marketplaceForm, condition: e.target.value as any})}
                >
                  <MenuItem value="new">חדש</MenuItem>
                  <MenuItem value="like-new">כמו חדש</MenuItem>
                  <MenuItem value="good">טוב</MenuItem>
                  <MenuItem value="fair">סביר</MenuItem>
                  <MenuItem value="poor">גרוע</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="שם המוכר"
                value={marketplaceForm.sellerName}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerName: e.target.value})}
                error={!!formErrors.sellerName}
                helperText={formErrors.sellerName}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="טלפון"
                value={marketplaceForm.sellerPhone}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerPhone: e.target.value})}
                error={!!formErrors.sellerPhone}
                helperText={formErrors.sellerPhone}
              />
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={marketplaceForm.sellerEmail}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerEmail: e.target.value})}
                error={!!formErrors.sellerEmail}
                helperText={formErrors.sellerEmail}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarketplaceDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleMarketplaceSubmit}>שמור</Button>
        </DialogActions>
      </Dialog>

      {/* Service Request Form Dialog */}
      <Dialog open={serviceRequestDialogOpen} onClose={() => setServiceRequestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>בקש שירות</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>סוג שירות</InputLabel>
                <Select
                  value={serviceRequestForm.type}
                  onChange={(e) => setServiceRequestForm({...serviceRequestForm, type: e.target.value as any})}
                >
                  <MenuItem value="maintenance">תחזוקה</MenuItem>
                  <MenuItem value="cleaning">ניקוי</MenuItem>
                  <MenuItem value="security">אבטחה</MenuItem>
                  <MenuItem value="technical">טכני</MenuItem>
                  <MenuItem value="other">אחר</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>עדיפות</InputLabel>
                <Select
                  value={serviceRequestForm.priority}
                  onChange={(e) => setServiceRequestForm({...serviceRequestForm, priority: e.target.value as any})}
                >
                  <MenuItem value="low">נמוכה</MenuItem>
                  <MenuItem value="medium">בינונית</MenuItem>
                  <MenuItem value="high">גבוהה</MenuItem>
                  <MenuItem value="urgent">דחופה</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={serviceRequestForm.title}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תיאור"
                multiline
                rows={3}
                value={serviceRequestForm.description}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, description: e.target.value})}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="מיקום"
                value={serviceRequestForm.location}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם המבקש"
                value={serviceRequestForm.requesterName}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterName: e.target.value})}
                error={!!formErrors.requesterName}
                helperText={formErrors.requesterName}
              />
              <TextField
                fullWidth
                label="טלפון"
                value={serviceRequestForm.requesterPhone}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterPhone: e.target.value})}
                error={!!formErrors.requesterPhone}
                helperText={formErrors.requesterPhone}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={serviceRequestForm.requesterEmail}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterEmail: e.target.value})}
                error={!!formErrors.requesterEmail}
                helperText={formErrors.requesterEmail}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceRequestDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleServiceRequestSubmit}>שלח בקשה</Button>
        </DialogActions>
      </Dialog>

      {/* Forum Post Form Dialog */}
      <Dialog open={forumPostDialogOpen} onClose={() => setForumPostDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>צור פוסט חדש</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="קורס"
                value={forumPostForm.courseId}
                onChange={(e) => setForumPostForm({...forumPostForm, courseId: e.target.value})}
                error={!!formErrors.courseId}
                helperText={formErrors.courseId}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={forumPostForm.title}
                onChange={(e) => setForumPostForm({...forumPostForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תוכן"
                multiline
                rows={4}
                value={forumPostForm.content}
                onChange={(e) => setForumPostForm({...forumPostForm, content: e.target.value})}
                error={!!formErrors.content}
                helperText={formErrors.content}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם המחבר"
                value={forumPostForm.authorName}
                onChange={(e) => setForumPostForm({...forumPostForm, authorName: e.target.value})}
                error={!!formErrors.authorName}
                helperText={formErrors.authorName}
              />
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={forumPostForm.authorEmail}
                onChange={(e) => setForumPostForm({...forumPostForm, authorEmail: e.target.value})}
                error={!!formErrors.authorEmail}
                helperText={formErrors.authorEmail}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForumPostDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleForumPostSubmit}>פרסם</Button>
        </DialogActions>
      </Dialog>

      {/* Cafeteria Order Form Dialog */}
      <Dialog open={cafeteriaOrderDialogOpen} onClose={() => setCafeteriaOrderDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>הזמן אוכל</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם הלקוח"
                value={cafeteriaOrderForm.customerName}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerName: e.target.value})}
                error={!!formErrors.customerName}
                helperText={formErrors.customerName}
              />
              <TextField
                fullWidth
                label="טלפון"
                value={cafeteriaOrderForm.customerPhone}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerPhone: e.target.value})}
                error={!!formErrors.customerPhone}
                helperText={formErrors.customerPhone}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={cafeteriaOrderForm.customerEmail}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerEmail: e.target.value})}
                error={!!formErrors.customerEmail}
                helperText={formErrors.customerEmail}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="זמן איסוף"
                type="time"
                value={cafeteriaOrderForm.pickupTime}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, pickupTime: e.target.value})}
                error={!!formErrors.pickupTime}
                helperText={formErrors.pickupTime}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="הערות מיוחדות"
                multiline
                rows={2}
                value={cafeteriaOrderForm.specialInstructions}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, specialInstructions: e.target.value})}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCafeteriaOrderDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleCafeteriaOrderSubmit}>שלח הזמנה</Button>
        </DialogActions>
      </Dialog>

      {/* Community Event Form Dialog */}
      <Dialog open={communityEventDialogOpen} onClose={() => setCommunityEventDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>צור אירוע קהילתי</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={communityEventForm.title}
                onChange={(e) => setCommunityEventForm({...communityEventForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תיאור"
                multiline
                rows={3}
                value={communityEventForm.description}
                onChange={(e) => setCommunityEventForm({...communityEventForm, description: e.target.value})}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="תאריך"
                type="date"
                value={communityEventForm.date}
                onChange={(e) => setCommunityEventForm({...communityEventForm, date: e.target.value})}
                error={!!formErrors.date}
                helperText={formErrors.date}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="שעה"
                type="time"
                value={communityEventForm.time}
                onChange={(e) => setCommunityEventForm({...communityEventForm, time: e.target.value})}
                error={!!formErrors.time}
                helperText={formErrors.time}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="מיקום"
                value={communityEventForm.location}
                onChange={(e) => setCommunityEventForm({...communityEventForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={communityEventForm.category}
                  onChange={(e) => setCommunityEventForm({...communityEventForm, category: e.target.value as any})}
                >
                  <MenuItem value="social">חברתי</MenuItem>
                  <MenuItem value="academic">אקדמי</MenuItem>
                  <MenuItem value="sports">ספורט</MenuItem>
                  <MenuItem value="cultural">תרבותי</MenuItem>
                  <MenuItem value="other">אחר</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="מספר משתתפים מקסימלי"
                type="number"
                value={communityEventForm.maxParticipants}
                onChange={(e) => setCommunityEventForm({...communityEventForm, maxParticipants: e.target.value})}
                error={!!formErrors.maxParticipants}
                helperText={formErrors.maxParticipants}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם המארגן"
                value={communityEventForm.organizerName}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerName: e.target.value})}
                error={!!formErrors.organizerName}
                helperText={formErrors.organizerName}
              />
              <TextField
                fullWidth
                label="טלפון"
                value={communityEventForm.organizerPhone}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerPhone: e.target.value})}
                error={!!formErrors.organizerPhone}
                helperText={formErrors.organizerPhone}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={communityEventForm.organizerEmail}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerEmail: e.target.value})}
                error={!!formErrors.organizerEmail}
                helperText={formErrors.organizerEmail}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={communityEventForm.registrationRequired}
                    onChange={(e) => setCommunityEventForm({...communityEventForm, registrationRequired: e.target.checked})}
                  />
                }
                label="נדרשת הרשמה מוקדמת"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommunityEventDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleCommunityEventSubmit}>צור אירוע</Button>
        </DialogActions>
      </Dialog>

      {/* Help Ticket Form Dialog */}
      <Dialog open={helpTicketDialogOpen} onClose={() => setHelpTicketDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>פתח כרטיס עזרה</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={helpTicketForm.category}
                  onChange={(e) => setHelpTicketForm({...helpTicketForm, category: e.target.value as any})}
                >
                  <MenuItem value="technical">טכני</MenuItem>
                  <MenuItem value="academic">אקדמי</MenuItem>
                  <MenuItem value="administrative">מנהלי</MenuItem>
                  <MenuItem value="financial">כספי</MenuItem>
                  <MenuItem value="other">אחר</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>עדיפות</InputLabel>
                <Select
                  value={helpTicketForm.priority}
                  onChange={(e) => setHelpTicketForm({...helpTicketForm, priority: e.target.value as any})}
                >
                  <MenuItem value="low">נמוכה</MenuItem>
                  <MenuItem value="medium">בינונית</MenuItem>
                  <MenuItem value="high">גבוהה</MenuItem>
                  <MenuItem value="urgent">דחופה</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="כותרת"
                value={helpTicketForm.title}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="תיאור הבעיה"
                multiline
                rows={4}
                value={helpTicketForm.description}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, description: e.target.value})}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="שם המבקש"
                value={helpTicketForm.requesterName}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterName: e.target.value})}
                error={!!formErrors.requesterName}
                helperText={formErrors.requesterName}
              />
              <TextField
                fullWidth
                label="טלפון"
                value={helpTicketForm.requesterPhone}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterPhone: e.target.value})}
                error={!!formErrors.requesterPhone}
                helperText={formErrors.requesterPhone}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={helpTicketForm.requesterEmail}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterEmail: e.target.value})}
                error={!!formErrors.requesterEmail}
                helperText={formErrors.requesterEmail}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpTicketDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleHelpTicketSubmit}>שלח כרטיס</Button>
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

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>עדכן סטטוס</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>סטטוס חדש</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>עדכן</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הפריט הזה? פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>מחק</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
