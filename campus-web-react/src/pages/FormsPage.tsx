import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Event as EventIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LibraryBooks as LibraryIcon,
  Restaurant as RestaurantIcon,
  FitnessCenter as GymIcon,
  LocalParking as ParkingIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Search as SearchIcon,
  Contacts as ContactIcon
} from '@mui/icons-material';

interface FormsPageProps {
  currentUser: any;
}

interface FormData {
  event: {
    eventId: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxParticipants: number;
  };
}

interface ValidationErrors {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
}

interface Event {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  createdAt: string;
}

interface Facility {
  id: string;
  name: string;
  type: 'library' | 'cafeteria' | 'gym' | 'parking';
  status: 'open' | 'closed';
  lastUpdated: string;
}

interface LostFoundReport {
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

interface Inquiry {
  inquiryId: string;
  category: 'complaint' | 'improvement';
  description: string;
  date: string;
  location: string;
  createdAt: string;
  user: string;
}

const FormsPage: React.FC<FormsPageProps> = ({ currentUser }) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [eventCounter, setEventCounter] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [lostFoundReports, setLostFoundReports] = useState<LostFoundReport[]>([]);
  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<LostFoundReport | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [deleteInquiryDialogOpen, setDeleteInquiryDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [resetDataDialogOpen, setResetDataDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    event: {
      eventId: `EVENT-${String(eventCounter).padStart(3, '0')}`,
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 10
    }
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // Validation functions
  const validateTitle = (title: string): string | undefined => {
    if (!title) return 'כותרת האירוע היא שדה חובה';
    if (title.length < 3) return 'כותרת האירוע חייבת להכיל לפחות 3 תווים';
    if (title.length > 100) return 'כותרת האירוע לא יכולה לעלות על 100 תווים';
    return undefined;
  };

  const validateDate = (date: string): string | undefined => {
    if (!date) return 'תאריך הוא שדה חובה';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'תאריך לא יכול להיות בעבר';
    }
    return undefined;
  };

  const validateTime = (time: string): string | undefined => {
    if (!time) return 'שעה היא שדה חובה';
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) return 'פורמט שעה לא תקין (HH:MM)';
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location) return 'מיקום הוא שדה חובה';
    if (location.length < 3) return 'מיקום חייב להכיל לפחות 3 תווים';
    if (location.length > 100) return 'מיקום לא יכול לעלות על 100 תווים';
    return undefined;
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'title':
        return validateTitle(value);
      case 'date':
        return validateDate(value);
      case 'time':
        return validateTime(value);
      case 'location':
        return validateLocation(value);
      default:
        return undefined;
    }
  };

  const validateEventForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const fieldsToValidate = ['title', 'date', 'time', 'location'];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData.event[field as keyof typeof formData.event] as string);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Load events and facilities from localStorage on component mount
  useEffect(() => {

    const loadEventsFromLocalStorage = () => {
      try {
        const savedEvents = localStorage.getItem('campus-events-data');
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          if (parsedEvents.length === 0) {
            // If events array is empty, create initial events
            const eventTitles = [
              'הרצאה על בינה מלאכותית',
              'סדנת תכנות',
              'מפגש סטודנטים',
              'הרצאה על אבטחת מידע',
              'סדנת פיתוח אפליקציות',
              'מפגש בוגרים',
              'הרצאה על רשתות מחשבים',
              'סדנת מסדי נתונים',
              'מפגש חברתי',
              'הרצאה על אלגוריתמים'
            ];
            
            const initialEvents: Event[] = Array.from({ length: 10 }, (_, index) => ({
              eventId: `EVENT-${String(index + 1).padStart(3, '0')}`,
              title: eventTitles[index],
              description: `תיאור מפורט של ${eventTitles[index]}`,
              date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: `${10 + (index % 8)}:00`,
              location: `חדר ${index + 1}`,
              maxParticipants: 30 + (index * 5),
              createdAt: new Date().toLocaleString('he-IL')
            }));
            
            setEvents(initialEvents);
            setEventCounter(11);
            localStorage.setItem('campus-events-data', JSON.stringify(initialEvents));
          } else {
            setEvents(parsedEvents);
            
            // Set counter to next available number
            const maxId = Math.max(...parsedEvents.map((event: Event) => 
              parseInt(event.eventId.split('-')[1])
            ));
            setEventCounter(maxId + 1);
          }
        } else {
          // Create initial events if none exist
          const eventTitles = [
            'הרצאה על בינה מלאכותית',
            'סדנת תכנות',
            'מפגש סטודנטים',
            'הרצאה על אבטחת מידע',
            'סדנת פיתוח אפליקציות',
            'מפגש בוגרים',
            'הרצאה על רשתות מחשבים',
            'סדנת מסדי נתונים',
            'מפגש חברתי',
            'הרצאה על אלגוריתמים'
          ];
          
          const initialEvents: Event[] = Array.from({ length: 10 }, (_, index) => ({
            eventId: `EVENT-${String(index + 1).padStart(3, '0')}`,
            title: eventTitles[index],
            description: `תיאור מפורט של ${eventTitles[index]}`,
            date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: `${10 + (index % 8)}:00`,
            location: `חדר ${index + 1}`,
            maxParticipants: 30 + (index * 5),
            createdAt: new Date().toLocaleString('he-IL')
          }));
          
          setEvents(initialEvents);
          setEventCounter(11);
          localStorage.setItem('campus-events-data', JSON.stringify(initialEvents));
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    };

    const loadFacilitiesFromLocalStorage = () => {
      try {
        const savedFacilities = localStorage.getItem('campus-facilities-data');
        if (savedFacilities) {
          const parsedFacilities = JSON.parse(savedFacilities);
          // Remove community center if it exists
          const filteredFacilities = parsedFacilities.filter((facility: any) => 
            facility.id !== 'community-1' && facility.name !== 'מרכז קהילתי' && facility.type !== 'community'
          );
          
          if (filteredFacilities.length === 0) {
            // If facilities array is empty, create initial facilities
            const facilityTypes: ('library' | 'cafeteria' | 'gym' | 'parking')[] = ['library', 'cafeteria', 'gym', 'parking'];
            const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
            
            const initialFacilities: Facility[] = Array.from({ length: 10 }, (_, index) => ({
              id: `facility-${index + 1}`,
              name: facilityNames[index] || `מתקן ${index + 1}`,
              type: facilityTypes[index % facilityTypes.length],
              status: index % 2 === 0 ? 'open' : 'closed',
              lastUpdated: new Date().toLocaleString('he-IL')
            }));
            
            setFacilities(initialFacilities);
            localStorage.setItem('campus-facilities-data', JSON.stringify(initialFacilities));
          } else {
            setFacilities(filteredFacilities);
            
            // Save the filtered data back to localStorage
            if (filteredFacilities.length !== parsedFacilities.length) {
              localStorage.setItem('campus-facilities-data', JSON.stringify(filteredFacilities));
            }
          }
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('facilityUpdated'));
        } else {
          // Initialize with default facilities - create 10 facilities
          const facilityTypes: ('library' | 'cafeteria' | 'gym' | 'parking')[] = ['library', 'cafeteria', 'gym', 'parking'];
          const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
          
          const defaultFacilities: Facility[] = Array.from({ length: 10 }, (_, index) => ({
            id: `facility-${index + 1}`,
            name: facilityNames[index] || `מתקן ${index + 1}`,
            type: facilityTypes[index % facilityTypes.length],
            status: index % 2 === 0 ? 'open' : 'closed',
            lastUpdated: new Date().toLocaleString('he-IL')
          }));
          
          setFacilities(defaultFacilities);
          localStorage.setItem('campus-facilities-data', JSON.stringify(defaultFacilities));
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('facilityUpdated'));
        }
        
        // Always ensure facilities exist (in case of corrupted data)
        const currentFacilities = localStorage.getItem('campus-facilities-data');
        if (currentFacilities) {
          try {
            const parsed = JSON.parse(currentFacilities);
            
            if (!Array.isArray(parsed) || parsed.length === 0) {
              // Reset if data is corrupted - create 10 facilities
              const facilityTypes: ('library' | 'cafeteria' | 'gym' | 'parking')[] = ['library', 'cafeteria', 'gym', 'parking'];
              const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
              
              const defaultFacilities: Facility[] = Array.from({ length: 10 }, (_, index) => ({
                id: `facility-${index + 1}`,
                name: facilityNames[index] || `מתקן ${index + 1}`,
                type: facilityTypes[index % facilityTypes.length],
                status: index % 2 === 0 ? 'open' : 'closed',
                lastUpdated: new Date().toLocaleString('he-IL')
              }));
              setFacilities(defaultFacilities);
              localStorage.setItem('campus-facilities-data', JSON.stringify(defaultFacilities));
              
              // Dispatch custom event to notify other components
              window.dispatchEvent(new CustomEvent('facilityUpdated'));
            }
          } catch (error) {
            console.error('Corrupted facilities data, resetting...', error);
            const facilityTypes: ('library' | 'cafeteria' | 'gym' | 'parking')[] = ['library', 'cafeteria', 'gym', 'parking'];
            const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
            
            const defaultFacilities: Facility[] = Array.from({ length: 10 }, (_, index) => ({
              id: `facility-${index + 1}`,
              name: facilityNames[index] || `מתקן ${index + 1}`,
              type: facilityTypes[index % facilityTypes.length],
              status: index % 2 === 0 ? 'open' : 'closed',
              lastUpdated: new Date().toLocaleString('he-IL')
            }));
            setFacilities(defaultFacilities);
            localStorage.setItem('campus-facilities-data', JSON.stringify(defaultFacilities));
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('facilityUpdated'));
          }
        }
      } catch (error) {
        console.error('Error loading facilities from localStorage:', error);
      }
    };

    const loadLostFoundReportsFromLocalStorage = () => {
      try {
        const savedReports = localStorage.getItem('campus-lost-found-data');
        if (savedReports) {
          const parsedReports = JSON.parse(savedReports);
          if (parsedReports.length === 0) {
            // If reports array is empty, create initial reports
            const itemNames = ['מפתחות', 'ארנק', 'טלפון', 'תיק', 'ספר', 'משקפיים', 'שעון', 'תעודת זהות', 'כרטיס סטודנט', 'מחשב נייד'];
            const reportLocations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
            const reportUsers = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
            
            const initialReports: LostFoundReport[] = Array.from({ length: 10 }, (_, index) => ({
              id: `LF-${String(index + 1).padStart(3, '0')}`,
              type: index % 2 === 0 ? 'lost' : 'found',
              itemName: itemNames[index] || `פריט ${index + 1}`,
              description: `תיאור מפורט של ${itemNames[index] || `פריט ${index + 1}`}`,
              location: reportLocations[index] || `מיקום ${index + 1}`,
              date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              contactPhone: `050-${String(1234567 + index).padStart(7, '0')}`,
              timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
              user: reportUsers[index] || `משתמש ${index + 1}`
            }));
            
            setLostFoundReports(initialReports);
            localStorage.setItem('campus-lost-found-data', JSON.stringify(initialReports));
          } else {
            // Convert timestamp strings back to Date objects
            const reportsWithDates = parsedReports.map((report: any) => ({
              ...report,
              timestamp: new Date(report.timestamp)
            }));
            setLostFoundReports(reportsWithDates);
          }
        } else {
          // Create initial lost/found reports if none exist
          const itemNames = ['מפתחות', 'ארנק', 'טלפון', 'תיק', 'ספר', 'משקפיים', 'שעון', 'תעודת זהות', 'כרטיס סטודנט', 'מחשב נייד'];
          const reportLocations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
          const reportUsers = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
          
          const initialReports: LostFoundReport[] = Array.from({ length: 10 }, (_, index) => ({
            id: `LF-${String(index + 1).padStart(3, '0')}`,
            type: index % 2 === 0 ? 'lost' : 'found',
            itemName: itemNames[index] || `פריט ${index + 1}`,
            description: `תיאור מפורט של ${itemNames[index] || `פריט ${index + 1}`}`,
            location: reportLocations[index] || `מיקום ${index + 1}`,
            date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            contactPhone: `050-${String(1234567 + index).padStart(7, '0')}`,
            timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
            user: reportUsers[index] || `משתמש ${index + 1}`
          }));
          
          setLostFoundReports(initialReports);
          localStorage.setItem('campus-lost-found-data', JSON.stringify(initialReports));
        }
      } catch (error) {
        console.error('Error loading lost-found reports from localStorage:', error);
      }
    };

    const loadInquiriesFromLocalStorage = () => {
      try {
        const savedInquiries = localStorage.getItem('campus-inquiries-data');
        if (savedInquiries) {
          const parsedInquiries = JSON.parse(savedInquiries);
          if (parsedInquiries.length === 0) {
            // If inquiries array is empty, create initial inquiries
            const inquiryDescriptions = [
              'בעיה עם המזגן בספרייה',
              'הצעת שיפור למערכת ההזמנות',
              'תלונה על רעש בכיתות',
              'הצעה להוספת מקומות חניה',
              'בעיה עם האינטרנט במעבדה',
              'הצעת שיפור לתפריט הקפיטריה',
              'תלונה על ניקיון בשירותים',
              'הצעה להוספת שקעי חשמל',
              'בעיה עם התאורה בחניה',
              'הצעת שיפור למערכת ההרשמה'
            ];
            const inquiryLocations2 = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
            const inquiryUsers2 = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
            
            const initialInquiries: Inquiry[] = Array.from({ length: 10 }, (_, index) => ({
              inquiryId: `INQUIRY-${String(index + 1).padStart(3, '0')}`,
              category: index % 2 === 0 ? 'complaint' : 'improvement',
              description: inquiryDescriptions[index] || `תיאור פנייה ${index + 1}`,
              date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              location: inquiryLocations2[index] || `מיקום ${index + 1}`,
              createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleString('he-IL'),
              user: inquiryUsers2[index] || `משתמש ${index + 1}`
            }));
            
            setInquiries(initialInquiries);
            localStorage.setItem('campus-inquiries-data', JSON.stringify(initialInquiries));
          } else {
            setInquiries(parsedInquiries);
          }
        } else {
          // Create initial inquiries if none exist
          const inquiryDescriptions = [
            'בעיה עם המזגן בספרייה',
            'הצעת שיפור למערכת ההזמנות',
            'תלונה על רעש בכיתות',
            'הצעה להוספת מקומות חניה',
            'בעיה עם האינטרנט במעבדה',
            'הצעת שיפור לתפריט הקפיטריה',
            'תלונה על ניקיון בשירותים',
            'הצעה להוספת שקעי חשמל',
            'בעיה עם התאורה בחניה',
            'הצעת שיפור למערכת ההרשמה'
          ];
          const inquiryLocations2 = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
          const inquiryUsers2 = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
          
          const initialInquiries: Inquiry[] = Array.from({ length: 10 }, (_, index) => ({
            inquiryId: `INQUIRY-${String(index + 1).padStart(3, '0')}`,
            category: index % 2 === 0 ? 'complaint' : 'improvement',
            description: inquiryDescriptions[index] || `תיאור פנייה ${index + 1}`,
            date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            location: inquiryLocations2[index] || `מיקום ${index + 1}`,
            createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleString('he-IL'),
            user: inquiryUsers2[index] || `משתמש ${index + 1}`
          }));
          
          setInquiries(initialInquiries);
          localStorage.setItem('campus-inquiries-data', JSON.stringify(initialInquiries));
        }
      } catch (error) {
        console.error('Error loading inquiries from localStorage:', error);
      }
    };

    loadEventsFromLocalStorage();
    loadFacilitiesFromLocalStorage();
    loadLostFoundReportsFromLocalStorage();
    loadInquiriesFromLocalStorage();

    // Listen for updates from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campus-facilities-data') {
        loadFacilitiesFromLocalStorage();
      } else if (e.key === 'campus-lost-found-data') {
        loadLostFoundReportsFromLocalStorage();
      } else if (e.key === 'campus-inquiries-data') {
        loadInquiriesFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const forms = [
    {
      id: 'event',
      title: 'יצירת אירוע',
      description: 'יצירת אירוע חדש',
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800'
    },
    {
      id: 'facilities',
      title: 'ניהול מתקנים',
      description: 'ניהול מצבי המתקנים בקמפוס',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50'
    },
    {
      id: 'lostfound',
      title: 'ניהול דיווחי אבידות',
      description: 'ניהול דיווחי אבידות ומציאות',
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0'
    }
  ];

  const handleFormSubmit = (formType: string) => {
    if (formType === 'event') {
      // Mark all fields as touched
      const allTouched = ['title', 'date', 'time', 'location'].reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

      if (validateEventForm()) {
        const newEvent: Event = {
          ...formData.event,
          createdAt: new Date().toLocaleString('he-IL')
        };

        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);

        // Save to localStorage
        try {
          localStorage.setItem('campus-events-data', JSON.stringify(updatedEvents));
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('eventsUpdated'));
        } catch (error) {
          console.error('Error saving events to localStorage:', error);
        }

        setNotification({
          message: `אירוע "${formData.event.title}" נוצר בהצלחה! מזהה: ${formData.event.eventId}`,
          type: 'success'
        });

        // Reset form and increment counter
        setEventCounter(prev => prev + 1);
        setFormData({
          event: {
            eventId: `EVENT-${String(eventCounter + 1).padStart(3, '0')}`,
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            maxParticipants: 10
          }
        });
        setErrors({});
        setTouched({});
      } else {
        setNotification({
          message: 'יש שגיאות בטופס. אנא בדוק את השדות המסומנים.',
          type: 'error'
        });
        return; // Don't close the form if there are errors
      }
    }
    
    setActiveForm(null);
  };

  // Facility management functions
  const handleFacilityStatusToggle = (facilityId: string) => {
    const updatedFacilities = facilities.map(facility => {
      if (facility.id === facilityId) {
        const newStatus: 'open' | 'closed' = facility.status === 'open' ? 'closed' : 'open';
        return {
          ...facility,
          status: newStatus,
          lastUpdated: new Date().toLocaleString('he-IL')
        };
      }
      return facility;
    });
    
    setFacilities(updatedFacilities);
    
    // Save to localStorage
    try {
      localStorage.setItem('campus-facilities-data', JSON.stringify(updatedFacilities));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('facilityUpdated'));
    } catch (error) {
      console.error('Error saving facilities to localStorage:', error);
    }
    
    const facility = facilities.find(f => f.id === facilityId);
    const newStatus = facility?.status === 'open' ? 'סגור' : 'פתוח';
    setNotification({
      message: `המתקן "${facility?.name}" שונה למצב ${newStatus}`,
      type: 'success'
    });
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'library': return <LibraryIcon />;
      case 'cafeteria': return <RestaurantIcon />;
      case 'gym': return <GymIcon />;
      case 'parking': return <ParkingIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getFacilityColor = (status: string) => {
    return status === 'open' ? '#4CAF50' : '#F44336';
  };

  // Lost & Found management functions
  const handleDeleteReport = (report: LostFoundReport) => {
    setReportToDelete(report);
    setDeleteReportDialogOpen(true);
  };

  const confirmDeleteReport = () => {
    if (reportToDelete) {
      const updatedReports = lostFoundReports.filter(report => report.id !== reportToDelete.id);
      setLostFoundReports(updatedReports);
      
      // Save to localStorage
      try {
        localStorage.setItem('campus-lost-found-data', JSON.stringify(updatedReports));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('lostFoundUpdated'));
      } catch (error) {
        console.error('Error saving reports to localStorage:', error);
      }
      
      setNotification({
        message: `הדיווח "${reportToDelete.id}" נמחק בהצלחה`,
        type: 'success'
      });
      setDeleteReportDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const formatDate = (date: Date) => {
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

  // Reset all data function
  const handleResetAllData = () => {
    // Clear all localStorage data
    localStorage.removeItem('campus-events-data');
    localStorage.removeItem('campus-facilities-data');
    localStorage.removeItem('campus-lost-found-data');
    localStorage.removeItem('campus-inquiries-data');
    
    // Reset state
    setEvents([]);
    setEventCounter(1);
    setLostFoundReports([]);
    setInquiries([]);
    
    // Reinitialize with default data - create 10 facilities
    const facilityTypes: ('library' | 'cafeteria' | 'gym' | 'parking')[] = ['library', 'cafeteria', 'gym', 'parking'];
    const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
    
    const defaultFacilities: Facility[] = Array.from({ length: 10 }, (_, index) => ({
      id: `facility-${index + 1}`,
      name: facilityNames[index] || `מתקן ${index + 1}`,
      type: facilityTypes[index % facilityTypes.length],
      status: index % 2 === 0 ? 'open' : 'closed',
      lastUpdated: new Date().toLocaleString('he-IL')
    }));
    setFacilities(defaultFacilities);
    localStorage.setItem('campus-facilities-data', JSON.stringify(defaultFacilities));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('facilityUpdated'));
    
    // Create 10 lost/found reports
    const itemNames = ['מפתחות', 'ארנק', 'טלפון', 'תיק', 'ספר', 'משקפיים', 'שעון', 'תעודת זהות', 'כרטיס סטודנט', 'מחשב נייד'];
    const resetLocations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
    const resetUsers = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
    
    const defaultReports: LostFoundReport[] = Array.from({ length: 10 }, (_, index) => ({
      id: `LF-${String(index + 1).padStart(3, '0')}`,
      type: index % 2 === 0 ? 'lost' : 'found',
      itemName: itemNames[index] || `פריט ${index + 1}`,
      description: `תיאור מפורט של ${itemNames[index] || `פריט ${index + 1}`}`,
      location: resetLocations[index] || `מיקום ${index + 1}`,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      contactPhone: `050-${String(1234567 + index).padStart(7, '0')}`,
      timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
      user: resetUsers[index] || `משתמש ${index + 1}`
    }));
    setLostFoundReports(defaultReports);
    localStorage.setItem('campus-lost-found-data', JSON.stringify(defaultReports));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('lostFoundUpdated'));
    
    // Create 10 inquiries
    const inquiryDescriptions = [
      'בעיה עם המזגן בספרייה',
      'הצעת שיפור למערכת ההזמנות',
      'תלונה על רעש בכיתות',
      'הצעה להוספת מקומות חניה',
      'בעיה עם האינטרנט במעבדה',
      'הצעת שיפור לתפריט הקפיטריה',
      'תלונה על ניקיון בשירותים',
      'הצעה להוספת שקעי חשמל',
      'בעיה עם התאורה בחניה',
      'הצעת שיפור למערכת ההרשמה'
    ];
    const inquiryLocations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
    const inquiryUsers = ['דוד כהן', 'שרה לוי', 'משה ישראלי', 'רחל אברהם', 'יוסף גולד', 'מרים שלום', 'אברהם כהן', 'רחל לוי', 'יצחק ישראלי', 'לאה אברהם'];
    
    const defaultInquiries: Inquiry[] = Array.from({ length: 10 }, (_, index) => ({
      inquiryId: `INQUIRY-${String(index + 1).padStart(3, '0')}`,
      category: index % 2 === 0 ? 'complaint' : 'improvement',
      description: inquiryDescriptions[index] || `תיאור פנייה ${index + 1}`,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      location: inquiryLocations[index] || `מיקום ${index + 1}`,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleString('he-IL'),
      user: inquiryUsers[index] || `משתמש ${index + 1}`
    }));
    
    setInquiries(defaultInquiries);
    localStorage.setItem('campus-inquiries-data', JSON.stringify(defaultInquiries));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('inquiriesUpdated'));
    
    setNotification({
      message: 'כל הנתונים אופסו בהצלחה!',
      type: 'success'
    });
    setResetDataDialogOpen(false);
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('facilityUpdated'));
    window.dispatchEvent(new CustomEvent('lostFoundUpdated'));
    window.dispatchEvent(new CustomEvent('inquiriesUpdated'));
  };

  const handleInputChange = (formType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType as keyof FormData],
        [field]: value
      } as any
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

    const error = validateField(field, formData.event[field as keyof typeof formData.event] as string);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const shouldShowError = (field: string): boolean => {
    return touched[field] && !!errors[field as keyof ValidationErrors];
  };

  // Inquiry management functions
  const handleDeleteInquiry = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
    setDeleteInquiryDialogOpen(true);
  };

  const confirmDeleteInquiry = () => {
    if (inquiryToDelete) {
      const updatedInquiries = inquiries.filter(inquiry => inquiry.inquiryId !== inquiryToDelete.inquiryId);
      setInquiries(updatedInquiries);
      
      // Save to localStorage
      try {
        localStorage.setItem('campus-inquiries-data', JSON.stringify(updatedInquiries));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('inquiriesUpdated'));
      } catch (error) {
        console.error('Error saving inquiries to localStorage:', error);
      }
      
      setNotification({
        message: `הפנייה "${inquiryToDelete.inquiryId}" נמחקה בהצלחה`,
        type: 'success'
      });
      setDeleteInquiryDialogOpen(false);
      setInquiryToDelete(null);
    }
  };

  // פונקציה ליצירת מזהה חדש בעת פתיחת טופס
  const handleOpenForm = (formId: string) => {
    setActiveForm(formId);
  };

  // Event management functions
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      event: {
        eventId: event.eventId,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        maxParticipants: event.maxParticipants
      }
    });
    setActiveForm('event');
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setDeleteEventDialogOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      const updatedEvents = events.filter(event => event.eventId !== eventToDelete.eventId);
      setEvents(updatedEvents);
      
      // Save to localStorage
      try {
        localStorage.setItem('campus-events-data', JSON.stringify(updatedEvents));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
      
      setNotification({
        message: `האירוע "${eventToDelete.title}" נמחק בהצלחה`,
        type: 'success'
      });
      setDeleteEventDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.map(event => 
        event.eventId === editingEvent.eventId 
          ? { ...formData.event, createdAt: editingEvent.createdAt }
          : event
      );
      setEvents(updatedEvents);
      
      // Save to localStorage
      try {
        localStorage.setItem('campus-events-data', JSON.stringify(updatedEvents));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
      
      setNotification({
        message: `האירוע "${formData.event.title}" עודכן בהצלחה`,
        type: 'success'
      });
      
      setEditingEvent(null);
      setActiveForm(null);
      
      // Reset form
      setEventCounter(prev => prev + 1);
      setFormData({
        event: {
          eventId: `EVENT-${String(eventCounter + 1).padStart(3, '0')}`,
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          maxParticipants: 10
        }
      });
    }
  };

  const renderForm = (formType: string) => {
    switch (formType) {
      case 'event':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingEvent ? 'עריכת אירוע' : 'יצירת אירוע'}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <TextField
                fullWidth
                label="מזהה אירוע"
                value={formData.event.eventId}
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
              <TextField
                fullWidth
                label="כותרת האירוע"
                value={formData.event.title}
                onChange={(e) => handleInputChange('event', 'title', e.target.value)}
                onBlur={() => handleBlur('title')}
                error={shouldShowError('title')}
                helperText={shouldShowError('title') ? errors.title : ''}
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
                label="תיאור האירוע"
                value={formData.event.description}
                onChange={(e) => handleInputChange('event', 'description', e.target.value)}
                required
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              <TextField
                fullWidth
                type="date"
                label="תאריך"
                value={formData.event.date}
                onChange={(e) => handleInputChange('event', 'date', e.target.value)}
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
                type="time"
                label="שעה"
                value={formData.event.time}
                onChange={(e) => handleInputChange('event', 'time', e.target.value)}
                onBlur={() => handleBlur('time')}
                error={shouldShowError('time')}
                helperText={shouldShowError('time') ? errors.time : ''}
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
                value={formData.event.location}
                onChange={(e) => handleInputChange('event', 'location', e.target.value)}
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
                type="number"
                label="מספר משתתפים מקסימלי"
                value={formData.event.maxParticipants}
                onChange={(e) => handleInputChange('event', 'maxParticipants', parseInt(e.target.value))}
                required
              />
            </Box>
          </Box>
        );

      case 'facilities':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ניהול מצבי המתקנים
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              לחץ על המתקן כדי לשנות את מצבו בין פתוח לסגור
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {facilities.map((facility) => (
                <Card 
                  key={facility.id}
                  sx={{ 
                    cursor: 'pointer',
                    border: `2px solid ${getFacilityColor(facility.status)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${getFacilityColor(facility.status)}40`
                    }
                  }}
                  onClick={() => handleFacilityStatusToggle(facility.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ color: getFacilityColor(facility.status), mb: 1 }}>
                      {getFacilityIcon(facility.type)}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {facility.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {facility.status === 'open' ? (
                        <ToggleOnIcon sx={{ color: '#4CAF50', fontSize: 30 }} />
                      ) : (
                        <ToggleOffIcon sx={{ color: '#F44336', fontSize: 30 }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: getFacilityColor(facility.status)
                        }}
                      >
                        {facility.status === 'open' ? 'פתוח' : 'סגור'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      עודכן: {facility.lastUpdated}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 'lostfound':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ניהול דיווחי אבידות ומציאות
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              לחץ על כפתור המחיקה כדי למחוק דיווח מהרשימה
            </Typography>
            
            {lostFoundReports.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                אין דיווחים עדיין
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  <Box>מזהה</Box>
                  <Box>סוג</Box>
                  <Box>פריט</Box>
                  <Box>מיקום</Box>
                  <Box>משתמש</Box>
                  <Box>תאריך</Box>
                  <Box>פעולות</Box>
                </Box>
                
                {lostFoundReports.map((report) => (
                  <Box key={report.id} sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto',
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Box sx={{ fontWeight: 'bold', color: customColors.primary }}>{report.id}</Box>
                    <Box>
                      <Box sx={{ 
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: report.type === 'lost' ? '#fff3e0' : '#e8f5e8',
                        color: report.type === 'lost' ? '#e65100' : '#2e7d32'
                      }}>
                        {report.type === 'lost' ? 'אבידה' : 'מציאה'}
                      </Box>
                    </Box>
                    <Box>{report.itemName}</Box>
                    <Box>{report.location}</Box>
                    <Box>{report.user}</Box>
                    <Box>{formatDate(report.timestamp)}</Box>
                    <Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReport(report)}
                        sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: customColors.primary }}>
              <DescriptionIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
              ניהול
            </Typography>
            <Typography variant="body1" color="text.secondary">
              טפסים בסיסיים לניהול פעילויות בקמפוס
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setResetDataDialogOpen(true)}
            sx={{
              borderColor: '#ff9800',
              color: '#ff9800',
              '&:hover': {
                borderColor: '#f57c00',
                backgroundColor: '#fff3e0'
              }
            }}
          >
            איפוס נתונים
          </Button>
        </Box>
      </Box>

      {/* Forms Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {forms.map((form) => (
          <Card 
            key={form.id}
            sx={{ 
              height: '100%',
              border: `2px solid ${form.color}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${form.color}40`
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: form.color, mb: 2 }}>
                {form.icon}
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {form.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {form.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                startIcon={<DescriptionIcon />}
                onClick={() => handleOpenForm(form.id)}
                sx={{
                  backgroundColor: form.color,
                  '&:hover': { backgroundColor: form.color + 'dd' }
                }}
              >
                פתח טופס
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Form Dialog */}
      <Dialog 
        open={!!activeForm} 
        onClose={() => setActiveForm(null)}
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
          {activeForm && forms.find(f => f.id === activeForm)?.icon}
          {activeForm && forms.find(f => f.id === activeForm)?.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {activeForm && renderForm(activeForm)}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setActiveForm(null)}
            startIcon={<ClearIcon />}
          >
            ביטול
          </Button>
          {activeForm !== 'facilities' && (
            <Button 
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => {
                if (editingEvent) {
                  handleUpdateEvent();
                } else if (activeForm) {
                  handleFormSubmit(activeForm);
                }
              }}
              sx={{
                backgroundColor: customColors.primary,
                '&:hover': { backgroundColor: customColors.primaryDark }
              }}
            >
              {editingEvent ? 'עדכן אירוע' : 'שלח טופס'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Facilities Status Overview */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: customColors.primary, mb: 3 }}>
          <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          סטטוס מתקנים ({facilities.length})
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
          {facilities.map((facility) => (
            <Card 
              key={facility.id}
              sx={{ 
                border: `2px solid ${getFacilityColor(facility.status)}`,
                backgroundColor: facility.status === 'open' ? '#f1f8e9' : '#ffebee'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ color: getFacilityColor(facility.status), mb: 1 }}>
                  {getFacilityIcon(facility.type)}
                </Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {facility.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: getFacilityColor(facility.status)
                  }}
                >
                  {facility.status === 'open' ? 'פתוח' : 'סגור'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Events Management Table */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: customColors.primary, mb: 3 }}>
          <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          ניהול אירועים ({events.length})
        </Typography>
        
        {events.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            אין אירועים עדיין. צור אירוע חדש באמצעות הטופס למעלה.
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto auto',
              gap: 2,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              mb: 2,
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              <Box>מזהה</Box>
              <Box>כותרת</Box>
              <Box>תאריך</Box>
              <Box>שעה</Box>
              <Box>מיקום</Box>
              <Box>משתתפים</Box>
              <Box>פעולות</Box>
            </Box>
            
            {events.map((event) => (
              <Box key={event.eventId} sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto auto',
                gap: 2,
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f9f9f9' },
                '&:last-child': { borderBottom: 'none' }
              }}>
                <Box sx={{ fontWeight: 'bold', color: customColors.primary }}>{event.eventId}</Box>
                <Box>{event.title}</Box>
                <Box>{event.date}</Box>
                <Box>{event.time}</Box>
                <Box>{event.location}</Box>
                <Box>{event.maxParticipants}</Box>
                <Box>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditEvent(event)}
                    sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteEvent(event)}
                    sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Inquiries Management Table */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: customColors.primary, mb: 3 }}>
          <ContactIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          ניהול פניות ({inquiries.length})
        </Typography>
        
        {inquiries.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            אין פניות עדיין. פניות יווצרו באמצעות טופס "פנייה חדשה" בעמוד קהילה.
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto',
              gap: 2,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              mb: 2,
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              <Box>מזהה</Box>
              <Box>קטגוריה</Box>
              <Box>תיאור</Box>
              <Box>מיקום</Box>
              <Box>תאריך</Box>
              <Box>משתמש</Box>
              <Box>פעולות</Box>
            </Box>
            
            {inquiries.map((inquiry) => (
              <Box key={inquiry.inquiryId} sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto',
                gap: 2,
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f9f9f9' },
                '&:last-child': { borderBottom: 'none' }
              }}>
                <Box sx={{ fontWeight: 'bold', color: customColors.primary }}>{inquiry.inquiryId}</Box>
                <Box>
                  <Box sx={{ 
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: inquiry.category === 'complaint' ? '#ffebee' : '#e8f5e8',
                    color: inquiry.category === 'complaint' ? '#c62828' : '#2e7d32'
                  }}>
                    {inquiry.category === 'complaint' ? 'תלונה' : 'הצעה לשיפור'}
                  </Box>
                </Box>
                <Box sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inquiry.description}
                </Box>
                <Box>{inquiry.location}</Box>
                <Box>{inquiry.date}</Box>
                <Box>{inquiry.user}</Box>
                <Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteInquiry(inquiry)}
                    sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Delete Event Confirmation Dialog */}
      <Dialog open={deleteEventDialogOpen} onClose={() => setDeleteEventDialogOpen(false)}>
        <DialogTitle>אישור מחיקת אירוע</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את האירוע "{eventToDelete?.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEventDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDeleteEvent} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Report Confirmation Dialog */}
      <Dialog open={deleteReportDialogOpen} onClose={() => setDeleteReportDialogOpen(false)}>
        <DialogTitle>אישור מחיקת דיווח</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הדיווח "{reportToDelete?.id}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פריט: {reportToDelete?.itemName} ({reportToDelete?.type === 'lost' ? 'אבידה' : 'מציאה'})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteReportDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDeleteReport} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Inquiry Confirmation Dialog */}
      <Dialog open={deleteInquiryDialogOpen} onClose={() => setDeleteInquiryDialogOpen(false)}>
        <DialogTitle>אישור מחיקת פנייה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הפנייה "{inquiryToDelete?.inquiryId}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            קטגוריה: {inquiryToDelete?.category === 'complaint' ? 'תלונה' : 'הצעה לשיפור'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteInquiryDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={confirmDeleteInquiry} 
            color="error" 
            variant="contained"
          >
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Data Confirmation Dialog */}
      <Dialog open={resetDataDialogOpen} onClose={() => setResetDataDialogOpen(false)}>
        <DialogTitle>אישור איפוס נתונים</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך לאפס את כל הנתונים?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו תמחק את כל האירועים, דיווחי האבידות והמציאות, הפניות, ותאתחל את מצבי המתקנים.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDataDialogOpen(false)}>ביטול</Button>
          <Button 
            onClick={handleResetAllData} 
            color="warning" 
            variant="contained"
          >
            איפוס נתונים
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

export default FormsPage;
