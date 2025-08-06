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
  Paper,
  Chip,
  Avatar,
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
  Grid,
  Divider,
  Tabs,
  Tab,
  ListItemAvatar,
  Badge,
  Fab,
  FormHelperText,
  InputAdornment,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Rating,
  Autocomplete,
  Chip as MuiChip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Breadcrumbs,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Zoom,
  Fade,
  Slide,
  Grow,
  Collapse,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Skeleton,
  AlertTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  CardMedia,
  CardActions,
  CardActionArea,
  CardHeader
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Event as EventIcon,
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
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  PhotoCamera as PhotoCameraIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Report as ReportIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  GridView as GridViewIcon,
  List as ListIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  DonutLarge as DonutLargeIcon,
  DonutSmall as DonutSmallIcon,
  InsertChart as InsertChartIcon,
  BubbleChart as BubbleChartIcon,
  ScatterPlot as ScatterPlotIcon,
  Schedule as ScheduleIcon,
  AccessTimeFilled as AccessTimeFilledIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  EventNote as EventNoteIcon,
  LocationCity as LocationCityIcon,
  LocationSearching as LocationSearchingIcon,
  MyLocation as MyLocationIcon,
  Place as PlaceIcon,
  Room as RoomIcon,
  Store as StoreIcon,
  Storefront as StorefrontIcon,
  ShoppingBasket as ShoppingBasketIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  LocalMall as LocalMallIcon,
  LocalOffer as LocalOfferIcon2,
  LocalShipping as LocalShippingIcon,
  LocalTaxi as LocalTaxiIcon,
  DirectionsCar as DirectionsCarIcon,
  DirectionsBus as DirectionsBusIcon,
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsBike as DirectionsBikeIcon,
  DirectionsSubway as DirectionsSubwayIcon,
  DirectionsBoat as DirectionsBoatIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon2,
  LocalBar as LocalBarIcon,
  LocalCafe as LocalCafeIcon,
  LocalPizza as LocalPizzaIcon,
  LocalDining as LocalDiningIcon,
  LocalDrink as LocalDrinkIcon,
  LocalConvenienceStore as LocalConvenienceStoreIcon,
  LocalPharmacy as LocalPharmacyIcon,
  LocalHospital as LocalHospitalIcon,
  LocalPolice as LocalPoliceIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  LocalLibrary as LocalLibraryIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  LocalGasStation as LocalGasStationIcon,
  LocalCarWash as LocalCarWashIcon,
  LocalAtm as LocalAtmIcon,
  LocalPrintshop as LocalPrintshopIcon,
  LocalFlorist as LocalFloristIcon,
  LocalLaundryService as LocalLaundryServiceIcon,
  LocalParking as LocalParkingIcon,
  LocalAirport as LocalAirportIcon,
  LocalMovies as LocalMoviesIcon,
  LocalPlay as LocalPlayIcon,
  LocalActivity as LocalActivityIcon,
  BeachAccess as BeachAccessIcon,
  GolfCourse as GolfCourseIcon,
  IceSkating as IceSkatingIcon
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
  ForumReply,
  CafeteriaOrder,
  CafeteriaOrderItem,
  CafeteriaMenuItem,
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
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
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
    { id: 'help', label: 'עזרה', icon: <HelpIcon /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'busy': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ONO - מערכת ניהול קמפוס
          </Typography>
          
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                שלום, {currentUser?.name}
              </Typography>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              startIcon={<LoginIcon />}
              onClick={() => setLoginDialogOpen(true)}
            >
              התחברות
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActiveSection(item.id);
                    setDrawerOpen(false);
                  }}
                  selected={activeSection === item.id}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
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
            
            <Grid container spacing={3}>
              {lostFoundItems.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {marketplaceItems.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {serviceRequests.map((request) => (
                <Grid item xs={12} md={6} lg={4} key={request.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {forumPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {cafeteriaOrders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {communityEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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
            
            <Grid container spacing={3}>
              {helpTickets.map((ticket) => (
                <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                  <Card>
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
                </Grid>
              ))}
            </Grid>
            
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

        {/* Other sections */}
        {!['home', 'lost-found', 'marketplace', 'services', 'forum', 'cafeteria', 'community', 'help'].includes(activeSection) && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              תוכן זה יפותח בהמשך...
            </Typography>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={lostFoundForm.title}
                onChange={(e) => setLostFoundForm({...lostFoundForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="מיקום"
                value={lostFoundForm.location}
                onChange={(e) => setLostFoundForm({...lostFoundForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם איש קשר"
                value={lostFoundForm.contactName}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactName: e.target.value})}
                error={!!formErrors.contactName}
                helperText={formErrors.contactName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={lostFoundForm.contactPhone}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactPhone: e.target.value})}
                error={!!formErrors.contactPhone}
                helperText={formErrors.contactPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={lostFoundForm.contactEmail}
                onChange={(e) => setLostFoundForm({...lostFoundForm, contactEmail: e.target.value})}
                error={!!formErrors.contactEmail}
                helperText={formErrors.contactEmail}
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={marketplaceForm.title}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם המוכר"
                value={marketplaceForm.sellerName}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerName: e.target.value})}
                error={!!formErrors.sellerName}
                helperText={formErrors.sellerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={marketplaceForm.sellerPhone}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerPhone: e.target.value})}
                error={!!formErrors.sellerPhone}
                helperText={formErrors.sellerPhone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={marketplaceForm.sellerEmail}
                onChange={(e) => setMarketplaceForm({...marketplaceForm, sellerEmail: e.target.value})}
                error={!!formErrors.sellerEmail}
                helperText={formErrors.sellerEmail}
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={serviceRequestForm.title}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="מיקום"
                value={serviceRequestForm.location}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם המבקש"
                value={serviceRequestForm.requesterName}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterName: e.target.value})}
                error={!!formErrors.requesterName}
                helperText={formErrors.requesterName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={serviceRequestForm.requesterPhone}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterPhone: e.target.value})}
                error={!!formErrors.requesterPhone}
                helperText={formErrors.requesterPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={serviceRequestForm.requesterEmail}
                onChange={(e) => setServiceRequestForm({...serviceRequestForm, requesterEmail: e.target.value})}
                error={!!formErrors.requesterEmail}
                helperText={formErrors.requesterEmail}
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="קורס"
                value={forumPostForm.courseId}
                onChange={(e) => setForumPostForm({...forumPostForm, courseId: e.target.value})}
                error={!!formErrors.courseId}
                helperText={formErrors.courseId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={forumPostForm.title}
                onChange={(e) => setForumPostForm({...forumPostForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם המחבר"
                value={forumPostForm.authorName}
                onChange={(e) => setForumPostForm({...forumPostForm, authorName: e.target.value})}
                error={!!formErrors.authorName}
                helperText={formErrors.authorName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={forumPostForm.authorEmail}
                onChange={(e) => setForumPostForm({...forumPostForm, authorEmail: e.target.value})}
                error={!!formErrors.authorEmail}
                helperText={formErrors.authorEmail}
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם הלקוח"
                value={cafeteriaOrderForm.customerName}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerName: e.target.value})}
                error={!!formErrors.customerName}
                helperText={formErrors.customerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={cafeteriaOrderForm.customerPhone}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerPhone: e.target.value})}
                error={!!formErrors.customerPhone}
                helperText={formErrors.customerPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={cafeteriaOrderForm.customerEmail}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, customerEmail: e.target.value})}
                error={!!formErrors.customerEmail}
                helperText={formErrors.customerEmail}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="הערות מיוחדות"
                multiline
                rows={2}
                value={cafeteriaOrderForm.specialInstructions}
                onChange={(e) => setCafeteriaOrderForm({...cafeteriaOrderForm, specialInstructions: e.target.value})}
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={communityEventForm.title}
                onChange={(e) => setCommunityEventForm({...communityEventForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="מיקום"
                value={communityEventForm.location}
                onChange={(e) => setCommunityEventForm({...communityEventForm, location: e.target.value})}
                error={!!formErrors.location}
                helperText={formErrors.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="מספר משתתפים מקסימלי"
                type="number"
                value={communityEventForm.maxParticipants}
                onChange={(e) => setCommunityEventForm({...communityEventForm, maxParticipants: e.target.value})}
                error={!!formErrors.maxParticipants}
                helperText={formErrors.maxParticipants}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם המארגן"
                value={communityEventForm.organizerName}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerName: e.target.value})}
                error={!!formErrors.organizerName}
                helperText={formErrors.organizerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={communityEventForm.organizerPhone}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerPhone: e.target.value})}
                error={!!formErrors.organizerPhone}
                helperText={formErrors.organizerPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={communityEventForm.organizerEmail}
                onChange={(e) => setCommunityEventForm({...communityEventForm, organizerEmail: e.target.value})}
                error={!!formErrors.organizerEmail}
                helperText={formErrors.organizerEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={communityEventForm.registrationRequired}
                    onChange={(e) => setCommunityEventForm({...communityEventForm, registrationRequired: e.target.checked})}
                  />
                }
                label="נדרשת הרשמה מוקדמת"
              />
            </Grid>
          </Grid>
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כותרת"
                value={helpTicketForm.title}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, title: e.target.value})}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם המבקש"
                value={helpTicketForm.requesterName}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterName: e.target.value})}
                error={!!formErrors.requesterName}
                helperText={formErrors.requesterName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={helpTicketForm.requesterPhone}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterPhone: e.target.value})}
                error={!!formErrors.requesterPhone}
                helperText={formErrors.requesterPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={helpTicketForm.requesterEmail}
                onChange={(e) => setHelpTicketForm({...helpTicketForm, requesterEmail: e.target.value})}
                error={!!formErrors.requesterEmail}
                helperText={formErrors.requesterEmail}
              />
            </Grid>
          </Grid>
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
    </Box>
  );
}

export default App;
