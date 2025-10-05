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
  Paper,
  LinearProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  Assignment, 
  CalendarToday, 
  School, 
  Flag, 
  CheckCircle,
  Schedule,
  Description
} from '@mui/icons-material';
import { Task } from '../types';
import { getTaskById } from '../fireStore/tasksService';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const taskData = await getTaskById(id);
        if (taskData) {
          setTask(taskData);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task data');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const getTypeText = (type: string) => {
    switch (type) {
      case 'exam': return 'בחינה';
      case 'assignment': return 'מטלה';
      case 'homework': return 'שיעורי בית';
      case 'quiz': return 'חידון';
      case 'presentation': return 'הצגה';
      default: return type;
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'דחוף';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'הושלם';
      case 'in-progress': return 'בתהליך';
      case 'pending': return 'ממתין';
      default: return status;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/forms')}
          sx={{ mb: 2 }}
        >
          חזור לטופסים
        </Button>
        <Alert severity="error">{error || 'Task not found'}</Alert>
      </Box>
    );
  }

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

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
          onClick={() => navigate(`/forms/tasks/${task.id}/edit`)}
          variant="contained"
        >
          ערוך מטלה
        </Button>
      </Box>

      {/* Task Details */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Assignment sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box flexGrow={1}>
              <Typography variant="h4" component="h1">
                {task.title}
              </Typography>
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                <Chip 
                  label={getTypeText(task.type)} 
                  color="primary"
                  size="small"
                />
                <Chip 
                  label={getStatusText(task.status)} 
                  color={getStatusColor(task.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  size="small"
                />
                <Chip 
                  label={getPriorityText(task.priority)} 
                  color={getPriorityColor(task.priority) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            {/* Task Information */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  פרטי המטלה
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <School sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    קורס
                  </Typography>
                  <Typography variant="body1">{task.course}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <Flag sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    סוג מטלה
                  </Typography>
                  <Typography variant="body1">{getTypeText(task.type)}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    תאריך יעד
                  </Typography>
                  <Typography variant="body1">
                    {new Date(task.dueDate).toLocaleDateString('he-IL')}
                  </Typography>
                  {overdue && (
                    <Chip 
                      label={`איחור של ${Math.abs(daysUntilDue)} ימים`}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                  {!overdue && daysUntilDue >= 0 && (
                    <Typography variant="body2" color="text.secondary">
                      נותרו {daysUntilDue} ימים
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Status and Priority */}
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  סטטוס ועדיפות
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    סטטוס
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <CheckCircle 
                      sx={{ 
                        fontSize: 20, 
                        mr: 1, 
                        color: task.status === 'completed' ? 'success.main' : 'text.disabled' 
                      }} 
                    />
                    <Chip 
                      label={getStatusText(task.status)} 
                      color={getStatusColor(task.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Box>
                  {task.status !== 'completed' && (
                    <LinearProgress 
                      variant="determinate" 
                      value={task.status === 'in-progress' ? 50 : 0} 
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    עדיפות
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Flag 
                      sx={{ 
                        fontSize: 20, 
                        mr: 1, 
                        color: task.priority === 'urgent' ? 'error.main' : 
                               task.priority === 'medium' ? 'warning.main' : 'success.main'
                      }} 
                    />
                    <Chip 
                      label={getPriorityText(task.priority)} 
                      color={getPriorityColor(task.priority) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    זמן יצירה
                  </Typography>
                  <Typography variant="body1">
                    <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {new Date().toLocaleDateString('he-IL')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Description */}
          {task.description && (
            <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <Description sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                    תיאור המטלה
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {task.description}
                  </Typography>
                </Paper>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskDetailPage;
