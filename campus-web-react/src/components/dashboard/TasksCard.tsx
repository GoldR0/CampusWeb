import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, AccessTime as TimeIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

import { demoTasks } from '../../data/demoData';
import { listTasks } from '../../fireStore/tasksService';
import { listCourses } from '../../fireStore/coursesService';

interface Task {
  id: string;
  title: string;
  type: string;
  course: string;
  date?: string;
  dueDate?: string;
  priority: 'urgent' | 'medium' | 'low';
}

interface TasksCardProps {
  customColors: {
    primary: string;
  };
}

const TasksCard: React.FC<TasksCardProps> = ({ customColors }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [studentTasks, setStudentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleViewTask = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  // Load student-specific tasks from Firestore
  useEffect(() => {
    if (currentUser) {
      const loadTasksFromFirestore = async () => {
        setIsLoading(true);
        try {
          const firestoreTasks = await listTasks();
          const firestoreCourses = await listCourses();
          
          if (firestoreCourses.length > 0) {
            // Find courses where this student is enrolled
            const studentCourses = firestoreCourses.filter((course: { selectedStudents?: string[]; id: string }) => 
              course.selectedStudents && course.selectedStudents.includes(currentUser.id)
            );
            
            // Find tasks for courses this student is enrolled in
            const userTasks = firestoreTasks.filter((task: { course: string }) => {
              return studentCourses.some((course: { id: string }) => course.id === task.course);
            });
            
            setStudentTasks(userTasks);
          }
        } catch (error) {
          console.error('Error loading tasks from Firestore:', error);
          setStudentTasks([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadTasksFromFirestore();
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const tasksToShow = currentUser ? studentTasks : demoTasks;

  return (
    <Card sx={{ border: `2px solid ${customColors.primary}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography variant="h6">תזכורות יומיות</Typography>
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
              טוען מטלות...
            </Typography>
          </Box>
        ) : (
          tasksToShow.map((task) => (
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
              <Box key={`task-header-${task.id}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {task.priority === 'urgent' ? <WarningIcon color="error" /> : <TimeIcon color="primary" />}
                  <Typography variant="body2" fontWeight="bold">
                    {task.title}
                  </Typography>
                </Box>
                <Tooltip title="צפייה בפרטי המטלה">
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewTask(task)}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {task.course} - {(task as any).date || task.dueDate}
              </Typography>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TasksCard;
