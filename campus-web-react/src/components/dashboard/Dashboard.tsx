import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import { User } from '../../types';
import WelcomeBanner from './WelcomeBanner';
import TasksCard from './TasksCard';
import EventsCard from './EventsCard';
import { demoEvents } from '../../data/demoData';
import { getAllStudents } from '../../data/studentsData';
import { listEvents } from '../../fireStore/eventsService';
import { listFacilities } from '../../fireStore/facilitiesService';
import { listTasks } from '../../fireStore/tasksService';

interface DashboardProps {
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  // Custom color theme
  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
  };

  // Initialize data from Firestore
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load events from Firestore
        const firestoreEvents = await listEvents();
        if (firestoreEvents.length > 0) {
          localStorage.setItem('campus-events-data', JSON.stringify(firestoreEvents));
        } else {
          // Create initial events data if none exist in Firestore
          const initialEvents = [
            ...demoEvents.map(demoEvent => ({
              id: demoEvent.id,
              title: demoEvent.title,
              description: demoEvent.description,
              date: demoEvent.date,
              time: demoEvent.time,
              location: `חדר ${demoEvent.roomId}`,
              maxParticipants: 50,
              createdAt: new Date().toLocaleString('he-IL')
            })),
            // Add more events to reach 10
            ...Array.from({ length: 7 }, (_, index) => ({
              id: `EVENT-${index + 4}`,
              title: `אירוע ${index + 4}`,
              description: `תיאור אירוע ${index + 4}`,
              date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: `${10 + index}:00`,
              location: `חדר ${index + 4}`,
              maxParticipants: 30 + (index * 5),
              createdAt: new Date().toLocaleString('he-IL')
            }))
          ];
          
          localStorage.setItem('campus-events-data', JSON.stringify(initialEvents));
        }

        // Load facilities from Firestore
        const firestoreFacilities = await listFacilities();
        if (firestoreFacilities.length > 0) {
          localStorage.setItem('campus-facilities-data', JSON.stringify(firestoreFacilities));
        } else {
          // Create initial facilities data if none exist in Firestore
          const facilityTypes = ['library', 'cafeteria', 'gym', 'parking', 'study', 'recreation'];
          const facilityNames = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'חדר לימוד', 'חדר משחקים', 'מעבדה', 'אודיטוריום', 'גינה', 'מרכז סטודנטים'];
          
          const initialFacilities = Array.from({ length: 10 }, (_, index) => ({
            id: `facility-${index + 1}`,
            name: facilityNames[index] || `מתקן ${index + 1}`,
            type: facilityTypes[index % facilityTypes.length],
            status: index % 3 === 0 ? 'open' : index % 3 === 1 ? 'busy' : 'closed',
            lastUpdated: new Date().toLocaleString('he-IL')
          }));
          
          localStorage.setItem('campus-facilities-data', JSON.stringify(initialFacilities));
        }

        // Check if lost found data exists
        const existingLostFound = localStorage.getItem('campus-lostfound-data');
        if (!existingLostFound) {
          // Create initial lost found data (at least 10 objects)
          const itemNames = ['מפתחות', 'ארנק', 'טלפון', 'תיק', 'ספר', 'משקפיים', 'שעון', 'תעודת זהות', 'כרטיס סטודנט', 'מחשב נייד'];
          const locations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
          
          const initialLostFound = Array.from({ length: 10 }, (_, index) => ({
            id: `LF-${String(index + 1).padStart(3, '0')}`,
            type: index % 2 === 0 ? 'lost' : 'found',
            itemName: itemNames[index] || `פריט ${index + 1}`,
            description: `תיאור מפורט של ${itemNames[index] || `פריט ${index + 1}`}`,
            location: locations[index] || `מיקום ${index + 1}`,
            date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            contactPhone: `050-${String(1234567 + index).padStart(7, '0')}`,
            timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
            user: `משתמש ${index + 1}`
          }));
          
          localStorage.setItem('campus-lostfound-data', JSON.stringify(initialLostFound));
        }

        // Check if inquiries data exists
        const existingInquiries = localStorage.getItem('campus-inquiries-data');
        if (!existingInquiries) {
          // Create initial inquiries data (at least 10 objects)
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
          const locations = ['ספרייה', 'קפיטריה', 'חדר כושר', 'חניה', 'אודיטוריום', 'מעבדה', 'כיתה', 'משרד', 'גינה', 'מרכז סטודנטים'];
          
          const initialInquiries = Array.from({ length: 10 }, (_, index) => ({
            inquiryId: `INQUIRY-${String(index + 1).padStart(3, '0')}`,
            category: index % 2 === 0 ? 'complaint' : 'improvement',
            description: inquiryDescriptions[index] || `תיאור פנייה ${index + 1}`,
            date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            location: locations[index] || `מיקום ${index + 1}`,
            createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleString('he-IL'),
            user: `משתמש ${index + 1}`
          }));
          
          localStorage.setItem('campus-inquiries-data', JSON.stringify(initialInquiries));
        }

        // Always refresh students data to ensure we have the latest data
        const initialStudents = getAllStudents();
        localStorage.setItem('campus-students-data', JSON.stringify(initialStudents));

        // Check if courses data exists
        const existingCourses = localStorage.getItem('campus-courses-data');
        if (!existingCourses) {
          // Create initial courses data (at least 10 objects)
          const courseNames = [
            'מבוא למדעי המחשב',
            'אלגוריתמים',
            'מבני נתונים',
            'מסדי נתונים',
            'תכנות מונחה עצמים',
            'רשתות מחשבים',
            'אבטחת מידע',
            'בינה מלאכותית',
            'פיתוח אפליקציות',
            'ניהול פרויקטים'
          ];
          
          const initialCourses = Array.from({ length: 10 }, (_, index) => ({
            courseId: `COURSE-${String(index + 1).padStart(3, '0')}`,
            courseName: courseNames[index],
            lecturer: `ד"ר ${['כהן', 'לוי', 'ישראלי', 'אברהם', 'גולד'][index % 5]}`,
            semester: ['a', 'b', 'summer'][index % 3],
            year: '2025',
            students: '0',
            credits: String((index % 4) + 2),
            selectedStudents: [],
            createdAt: new Date().toLocaleString('he-IL')
          }));
          
          localStorage.setItem('campus-courses-data', JSON.stringify(initialCourses));
        }

        // Check if tasks data exists
        const existingTasks = localStorage.getItem('campus-tasks-data');
        if (!existingTasks) {
          // Create initial tasks data (at least 10 objects)
          const taskTitles = [
            'מטלת תכנות בסיסית',
            'מבחן אלגוריתמים',
            'בוחן מבני נתונים',
            'הצגת פרויקט',
            'מטלת מסדי נתונים',
            'מבחן רשתות',
            'בוחן אבטחה',
            'הצגת בינה מלאכותית',
            'מטלת פיתוח',
            'מבחן ניהול פרויקטים'
          ];
          
          const initialTasks = Array.from({ length: 10 }, (_, index) => ({
            id: `TASK-${String(index + 1).padStart(3, '0')}`,
            title: taskTitles[index],
            type: ['assignment', 'exam', 'quiz', 'presentation'][index % 4],
            date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            course: `COURSE-${String(index + 1).padStart(3, '0')}`,
            createdAt: new Date().toLocaleString('he-IL')
          }));
          
          localStorage.setItem('campus-tasks-data', JSON.stringify(initialTasks));
        }

        // Check if forum messages data exists
        const existingForumMessages = localStorage.getItem('campus-forum-messages');
        if (!existingForumMessages) {
          // Create initial forum messages data (at least 10 objects)
          const initialForumMessages = Array.from({ length: 10 }, (_, index) => ({
            id: `msg-${index + 1}`,
            courseId: `COURSE-${String((index % 10) + 1).padStart(3, '0')}`,
            studentId: `student-${(index % 10) + 1}`,
            studentName: `סטודנט ${(index % 10) + 1}`,
            message: `הודעה ${index + 1} בפורום הקורס`,
            timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)).toISOString()
          }));
          
          localStorage.setItem('campus-forum-messages', JSON.stringify(initialForumMessages));
        }

      } catch (error) {
        // Error initializing data in localStorage
      }
    };

    initializeData();
  }, []);

  return (
    <Box>
      {/* Welcome Banner */}
      <WelcomeBanner currentUser={currentUser} />

      {/* Content Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
        gap: 3 
      }}>
        {/* Tasks Card */}
        <TasksCard customColors={customColors} />
        
        {/* Events Card */}
        <EventsCard customColors={customColors} />
      </Box>
    </Box>
  );
};

export default Dashboard;
