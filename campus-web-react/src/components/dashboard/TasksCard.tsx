import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

import { demoTasks } from '../../data/demoData';
import { listTasks } from '../../fireStore/tasksService';

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
  const [studentTasks, setStudentTasks] = useState<Task[]>([]);

  // Load student-specific tasks from Firestore
  useEffect(() => {
    if (currentUser) {
      const loadTasksFromFirestore = async () => {
        try {
          const firestoreTasks = await listTasks();
          const savedCourses = localStorage.getItem('campus-courses-data');
          
          if (savedCourses) {
            const allCourses = JSON.parse(savedCourses);
            
            // Find courses where this student is enrolled
            const studentCourses = allCourses.filter((course: { selectedStudents?: string[]; courseId: string }) => 
              course.selectedStudents && course.selectedStudents.includes(currentUser.id)
            );
            
            // Find tasks for courses this student is enrolled in
            const userTasks = firestoreTasks.filter((task: { course: string }) => {
              return studentCourses.some((course: { courseId: string }) => course.courseId === task.course);
            });
            
            setStudentTasks(userTasks);
            localStorage.setItem('campus-tasks-data', JSON.stringify(firestoreTasks));
          }
        } catch (error) {
          console.error('Error loading tasks from Firestore:', error);
          // Fallback to localStorage
          const savedTasks = localStorage.getItem('campus-tasks-data');
          if (savedTasks) {
            const allTasks = JSON.parse(savedTasks);
            setStudentTasks(allTasks);
          }
        }
      };
      
      loadTasksFromFirestore();
      } catch (error) {
        setStudentTasks([]);
      }
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
        {tasksToShow.map((task) => (
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
            <Box key={`task-header-${task.id}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {task.priority === 'urgent' ? <WarningIcon color="error" /> : <TimeIcon color="primary" />}
              <Typography variant="body2" fontWeight="bold">
                {task.title}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {task.course} - {(task as any).date || task.dueDate}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default TasksCard;
