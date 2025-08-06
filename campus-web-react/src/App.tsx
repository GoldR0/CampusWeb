import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Typography
} from '@mui/material';
import {
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
import { User, Task, Event, Facility } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentsPage from './pages/StudentsPage';

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
      showNotification('התחברת בהצלחה!', 'success');
    } else {
      showNotification('שם משתמש או סיסמה שגויים', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showNotification('התנתקת בהצלחה', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };



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

  // Custom color theme
  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Component */}
      <Header
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={setActiveSection}
        currentSection={activeSection}
      />

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
                background: 'linear-gradient(135deg, rgb(179, 209, 53) 0%, rgb(159, 189, 33) 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom>
                ברוכים הבאים למערכת המקיפה לניהול חיי הסטודנטים בקמפוס
              </Typography>
              {currentUser && (
                <Typography variant="h6">
                  שלום {currentUser.name}! היום יש לך {demoTasks.filter(t => t.priority === 'urgent').length} מבחנים ו-{demoTasks.filter(t => t.type === 'assignment').length} מטלות להגשה
                </Typography>
              )}
            </Paper>



            {/* Content Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {/* Events Card */}
              <Card sx={{ border: `2px solid ${customColors.primary}` }}>
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
              <Card sx={{ border: `2px solid ${customColors.primary}` }}>
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
              <Card sx={{ border: `2px solid ${customColors.primary}` }}>
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

        {/* Students Page */}
        {activeSection === 'students' && (
          <StudentsPage />
        )}
        
        {/* Other sections can be added here */}
        {activeSection !== 'home' && activeSection !== 'students' && (
          <Paper sx={{ 
            p: 3, 
            textAlign: 'center',
            border: `2px solid ${customColors.primary}`,
            backgroundColor: customColors.primaryLight + '10'
          }}>
            <Typography variant="h5">
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
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              תוכן זה יפותח בהמשך...
            </Typography>
          </Paper>
        )}
      </Container>



      {/* Footer Component */}
      <Footer />

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
