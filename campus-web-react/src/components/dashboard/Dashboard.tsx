import React, { useEffect, useState } from 'react';
import { Box, LinearProgress } from '@mui/material';

import { User, Event, Facility } from '../../types';
import WelcomeBanner from './WelcomeBanner';
import TasksCard from './TasksCard';
import EventsCard from './EventsCard';
import { demoEvents } from '../../data/demoData';
import { getAllStudents } from '../../data/studentsData';
import { listEvents, addEvent } from '../../fireStore/eventsService';
import { listFacilities, addFacility } from '../../fireStore/facilitiesService';
import { listTasks } from '../../fireStore/tasksService';

interface DashboardProps {
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  
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
      setIsLoading(true);
      try {
        // Load events from Firestore
        const firestoreEvents = await listEvents();
        if (firestoreEvents.length === 0) {
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
          
          // Save initial events to Firestore
          for (const event of initialEvents) {
            try {
              const eventData = {
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                roomId: event.location.replace('חדר ', ''),
                urgent: false
              };
              await addEvent(new Event(eventData));
            } catch (error) {
              console.error('Error adding initial event to Firestore:', error);
            }
          }
        }

        // Load facilities from Firestore
        const firestoreFacilities = await listFacilities();
        if (firestoreFacilities.length === 0) {
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
          
          // Save initial facilities to Firestore
          for (const facility of initialFacilities) {
            try {
              const facilityData = {
                id: facility.id,
                name: facility.name,
                status: facility.status as 'open' | 'closed' | 'busy',
                hours: '08:00-22:00',
                rating: 4.5,
                totalRatings: 10,
                averageRating: 4.5
              };
              await addFacility(new Facility(facilityData));
            } catch (error) {
              console.error('Error adding initial facility to Firestore:', error);
            }
          }
        }

      } catch (error) {
        console.error('Error initializing data from Firestore:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  return (
    <Box>
      {/* Loading Progress */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 4,
              backgroundColor: 'rgba(179, 209, 53, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgb(179, 209, 53)'
              }
            }} 
          />
        </Box>
      )}

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
