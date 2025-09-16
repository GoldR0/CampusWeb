import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { CalendarToday as CalendarIcon, AccessTime as TimeIcon, MeetingRoom as RoomIcon } from '@mui/icons-material';

import { demoEvents } from '../../data/demoData';

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

  useEffect(() => {
    const loadEventsFromLocalStorage = () => {
      try {
        const savedEvents = localStorage.getItem('campus-events-data');
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents);
        } else {
          // If no saved events, use demo events
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
        }
      } catch (error) {
        // Error loading events from localStorage
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
      }
    };

    loadEventsFromLocalStorage();
    
    // Listen for storage changes to update when events are modified in FormsPage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campus-events-data') {
        loadEventsFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleEventsUpdate = () => {
      loadEventsFromLocalStorage();
    };

    window.addEventListener('eventsUpdated', handleEventsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
    };
  }, []);

  return (
    <Card sx={{ border: `2px solid ${customColors.primary}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon sx={{ mr: 1 }} />
          <Typography variant="h6">לוח אירועים ({events.length})</Typography>
        </Box>
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
      </CardContent>
    </Card>
  );
};

export default EventsCard;
