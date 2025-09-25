import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  Event, 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  PriorityHigh,
  Description
} from '@mui/icons-material';
import { Event as EventType } from '../types';
import { getEventById } from '../fireStore/eventsService';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const eventData = await getEventById(id);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const getDaysUntilEvent = (date: string) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isPastEvent = (date: string) => {
    return new Date(date) < new Date();
  };

  const getEventStatus = (date: string) => {
    if (isPastEvent(date)) return 'past';
    const daysUntil = getDaysUntilEvent(date);
    if (daysUntil === 0) return 'today';
    if (daysUntil === 1) return 'tomorrow';
    if (daysUntil <= 7) return 'this-week';
    return 'future';
  };

  const getEventStatusText = (date: string) => {
    const status = getEventStatus(date);
    switch (status) {
      case 'past': return 'אירוע הסתיים';
      case 'today': return 'היום';
      case 'tomorrow': return 'מחר';
      case 'this-week': return 'השבוע';
      case 'future': return 'בעתיד';
      default: return '';
    }
  };

  const getEventStatusColor = (date: string) => {
    const status = getEventStatus(date);
    switch (status) {
      case 'past': return 'default';
      case 'today': return 'error';
      case 'tomorrow': return 'warning';
      case 'this-week': return 'info';
      case 'future': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/forms')}
          sx={{ mb: 2 }}
        >
          חזור לטופסים
        </Button>
        <Alert severity="error">{error || 'Event not found'}</Alert>
      </Box>
    );
  }

  const daysUntilEvent = getDaysUntilEvent(event.date);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/forms')}
          variant="outlined"
        >
          חזור לטופסים
        </Button>
        <Button
          startIcon={<Edit />}
          onClick={() => navigate(`/forms/events/${event.id}/edit`)}
          variant="contained"
        >
          ערוך אירוע
        </Button>
      </Box>

      {/* Event Details */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Event sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box flexGrow={1}>
              <Typography variant="h4" component="h1">
                {event.title}
              </Typography>
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                <Chip 
                  label={getEventStatusText(event.date)} 
                  color={getEventStatusColor(event.date) as any}
                  size="small"
                />
                {event.urgent && (
                  <Chip 
                    label="דחוף" 
                    color="error"
                    size="small"
                    icon={<PriorityHigh />}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            {/* Event Information */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  פרטי האירוע
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    תאריך
                  </Typography>
                  <Typography variant="body1">
                    {new Date(event.date).toLocaleDateString('he-IL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  {!isPastEvent(event.date) && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {daysUntilEvent === 0 ? 'היום!' : 
                       daysUntilEvent === 1 ? 'מחר' : 
                       `בעוד ${daysUntilEvent} ימים`}
                    </Typography>
                  )}
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    שעה
                  </Typography>
                  <Typography variant="body1">{event.time}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    חדר
                  </Typography>
                  <Typography variant="body1">{event.roomId}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    סטטוס
                  </Typography>
                  <Chip 
                    label={getEventStatusText(event.date)} 
                    color={getEventStatusColor(event.date) as any}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Event Details */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  מידע נוסף
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    רמת דחיפות
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <PriorityHigh 
                      sx={{ 
                        fontSize: 20, 
                        mr: 1, 
                        color: event.urgent ? 'error.main' : 'text.disabled' 
                      }} 
                    />
                    <Typography variant="body1">
                      {event.urgent ? 'דחוף' : 'רגיל'}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    תאריך יצירה
                  </Typography>
                  <Typography variant="body1">
                    {new Date().toLocaleDateString('he-IL')}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    מזהה אירוע
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                    {event.id}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  <Description sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                  תיאור האירוע
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </Typography>
              </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetailPage;
