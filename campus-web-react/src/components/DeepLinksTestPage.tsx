import React from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const DeepLinksTestPage: React.FC = () => {
  const testRoutes = [
    {
      title: 'Main Pages',
      description: 'Navigate to main pages with entity lists',
      routes: [
        { path: '/students', label: 'Students Page - View and click on students' },
        { path: '/forms', label: 'Forms Page - View events and their details' },
        { path: '/', label: 'Dashboard - View tasks and events with detail links' }
      ]
    },
    {
      title: 'Student Detail',
      description: 'View specific student details',
      routes: [
        { path: '/students/student123', label: 'Student with ID: student123' },
        { path: '/students/abc456', label: 'Student with ID: abc456' }
      ]
    },
    {
      title: 'Task Detail',
      description: 'View specific task details',
      routes: [
        { path: '/tasks/task123', label: 'Task with ID: task123' },
        { path: '/tasks/def789', label: 'Task with ID: def789' }
      ]
    },
    {
      title: 'Event Detail',
      description: 'View specific event details',
      routes: [
        { path: '/events/event123', label: 'Event with ID: event123' },
        { path: '/events/ghi012', label: 'Event with ID: ghi012' }
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Deep Links Test Page
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This page demonstrates the deep links functionality. Click on any link to test direct access to specific entities.
      </Typography>

      {testRoutes.map((section, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {section.description}
            </Typography>
            
            <List>
              {section.routes.map((route, routeIndex) => (
                <React.Fragment key={routeIndex}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Button
                          component={Link}
                          to={route.path}
                          variant="outlined"
                          size="small"
                        >
                          {route.label}
                        </Button>
                      }
                      secondary={`Route: ${route.path}`}
                    />
                  </ListItem>
                  {routeIndex < section.routes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            איך לבדוק קישורים ישירים (Deep Links)
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>לחץ על דפי הראשי למעלה כדי לראות את הרשימות</li>
              <li>בדף הסטודנטים - לחץ על כפתור העין כדי לצפות בפרטי סטודנט</li>
              <li>בדף הטפסים - לחץ על כפתור העין ליד אירועים</li>
              <li>בלוח הבקרה - לחץ על כפתורי העין ליד מטלות ואירועים</li>
              <li>אתה יכול גם להקליד ישירות בכתובת URL כמו <code>/students/any-id</code></li>
              <li>דפי הפרטים כוללים ניווט חזרה לדפים הראשיים</li>
              <li>אם הישות לא קיימת, תראה הודעת שגיאה מתאימה</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeepLinksTestPage;
