
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';
import StudentsPage from './pages/StudentsPage';
import CommunityPage from './components/CommunityPage';
import FormsPage from './pages/FormsPage';
import CafeteriaPage from './components/CafeteriaPage';
import LostFoundPage from './components/LostFoundPage';
import ProfilePage from './components/ProfilePage';
import HelpPage from './components/HelpPage';
import LearningCenterPage from './components/LearningCenterPage';
import ForumPage from './components/ForumPage';
import DebugInfo from './components/DebugInfo';
import StudentDetailPage from './components/StudentDetailPage';
import TaskDetailPage from './components/TaskDetailPage';
import EventDetailPage from './components/EventDetailPage';
import DeepLinksTestPage from './components/DeepLinksTestPage';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { hasPermissionForRoute } from './utils/menuPermissions';

// קומפוננטה להגנה על נתיבים
const ProtectedRoute: React.FC<{ 
  path: string; 
  children: React.ReactNode; 
  currentUser: any;
}> = ({ path, children, currentUser }) => {
  if (!hasPermissionForRoute(currentUser, path)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { currentUser, handleLogin, handleLogout } = useAuth();
  const { notification, showNotification, hideNotification } = useNotifications();

  const onLogin = (email: string, password: string) => {
    const result = handleLogin(email, password);
    showNotification(result.message, result.success ? 'success' : 'error');
  };

  const onLogout = () => {
    const result = handleLogout();
    showNotification(result.message, 'success');
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Component */}
      <Header
        currentUser={currentUser}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard currentUser={currentUser} />} />
          
          {/* נתיבים מוגנים - רק למרצים */}
          <Route path="/debug" element={
            <ProtectedRoute path="/debug" currentUser={currentUser}>
              <DebugInfo currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute path="/students" currentUser={currentUser}>
              <StudentsPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/students/:id" element={
            <ProtectedRoute path="/students" currentUser={currentUser}>
              <StudentDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/students/:id/edit" element={
            <ProtectedRoute path="/students" currentUser={currentUser}>
              <StudentsPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/forms" element={
            <ProtectedRoute path="/forms" currentUser={currentUser}>
              <FormsPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/forms/events/:id/edit" element={
            <ProtectedRoute path="/forms" currentUser={currentUser}>
              <FormsPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="/forms/tasks/:id/edit" element={
            <ProtectedRoute path="/forms" currentUser={currentUser}>
              <FormsPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          
          {/* נתיבים מוגנים - רק לסטודנטים */}
          <Route path="/learning" element={
            <ProtectedRoute path="/learning" currentUser={currentUser}>
              <LearningCenterPage currentUser={currentUser} />
            </ProtectedRoute>
          } />
          
          {/* נתיבים פתוחים לכולם */}
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
          <Route path="/cafeteria" element={<CafeteriaPage />} />
          <Route path="/lost-found" element={<LostFoundPage currentUser={currentUser} />} />
          <Route path="/community" element={<CommunityPage currentUser={currentUser} />} />
          <Route path="/forum" element={<ForumPage currentUser={currentUser} />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/test-deep-links" element={<DeepLinksTestPage />} />
        </Routes>
      </Container>

      {/* Footer Component */}
      <Footer />

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={hideNotification}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification?.type} 
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;