import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import { CalendarToday as CalendarIcon, AccessTime as TimeIcon, MeetingRoom as RoomIcon } from '@mui/icons-material';

import { demoEvents } from '../../data/demoData';
import { listEvents } from '../../fireStore/eventsService';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  createdAt: string;
}

interface EventsCardProps {
  customColors: {
    primary: string;
  };
}

const EventsCard: React.FC<EventsCardProps> = ({ customColors }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventsFromFirestore = async () => {
      setIsLoading(true);
      try {
        const firestoreEvents = await listEvents();
        if (firestoreEvents.length > 0) {
          // Convert Firestore events to local format
          const localEvents = firestoreEvents.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.roomId,
            maxParticipants: 50,
            createdAt: new Date().toLocaleString('he-IL')
          }));
          setEvents(localEvents);
        } else {
          // If no events in Firestore, use demo events
          const demoEventsData = demoEvents.map(demoEvent => ({
            id: demoEvent.id,
            title: demoEvent.title,
            description: demoEvent.description,
            date: demoEvent.date,
            time: demoEvent.time,
            location: `חדר ${demoEvent.roomId}`,
            maxParticipants: 50,
            createdAt: new Date().toLocaleString('he-IL')
          }));
          setEvents(demoEventsData);
        }
      } catch (error) {
        console.error('Error loading events from Firestore:', error);
        // Fallback to demo events
        setEvents(demoEvents.map(demoEvent => ({
          id: demoEvent.id,
          title: demoEvent.title,
          description: demoEvent.description,
          date: demoEvent.date,
          time: demoEvent.time,
          location: `חדר ${demoEvent.roomId}`,
          maxParticipants: 50,
          createdAt: new Date().toLocaleString('he-IL')
        })));
      } finally {
        setIsLoading(false);
      }
    };

    loadEventsFromFirestore();
    
    // Events are now managed through Firestore, no need for localStorage listeners

    // Events are now managed through Firestore, no need for event listeners
  }, []);

  return (
    <Card sx={{ border: `2px solid ${customColors.primary}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon sx={{ mr: 1 }} />
          <Typography variant="h6">לוח אירועים ({events.length})</Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              sx={{ 
                height: 3,
                backgroundColor: 'rgba(179, 209, 53, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgb(179, 209, 53)'
                }
              }} 
            />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              טוען אירועים...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            maxHeight: { xs: 'none', lg: '500px' }, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#555'
              }
            }
          }}>
            {events.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                אין אירועים מתוכננים
              </Typography>
            ) : (
              events.map((event, index) => (
              <Box 
                key={event.id} 
                sx={{ 
                  p: 2.5, 
                  mb: 2, 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: '#c4c4c4'
                  },
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  color="primary"
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    fontSize: '1.1rem'
                  }}
                >
                  {event.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {event.description}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 2 },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}>
                  <Box key={`date-${event.id}`} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                      {event.date}
                    </Typography>
                  </Box>
                  
                  <Box key={`time-${event.id}`} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                      {event.time}
                    </Typography>
                  </Box>
                  
                  <Box key={`location-${event.id}`} sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                      {event.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              ))
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
