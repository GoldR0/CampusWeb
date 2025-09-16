
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Alert, Snackbar } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';
import PlaceholderContent from './components/PlaceholderContent';
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
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { User } from './types';
import { demoUsers } from './data/demoData';

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

  // Custom color theme
  const customColors = {
    primary: 'rgb(179, 209, 53)',
    primaryDark: 'rgb(159, 189, 33)',
    primaryLight: 'rgb(199, 229, 73)',
    textOnPrimary: 'white'
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
          <Route path="/debug" element={<DebugInfo currentUser={currentUser} />} />
          <Route path="/students" element={<StudentsPage currentUser={currentUser} />} />
          <Route path="/students/:id/edit" element={<StudentsPage currentUser={currentUser} />} />
          <Route path="/forms" element={<FormsPage currentUser={currentUser} />} />
          <Route path="/forms/events/:id/edit" element={<FormsPage currentUser={currentUser} />} />
          <Route path="/forms/tasks/:id/edit" element={<FormsPage currentUser={currentUser} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
          <Route path="/learning" element={<LearningCenterPage currentUser={currentUser} />} />
          <Route path="/cafeteria" element={<CafeteriaPage />} />
          <Route path="/lost-found" element={<LostFoundPage currentUser={currentUser} />} />
          <Route path="/community" element={<CommunityPage currentUser={currentUser} />} />
          <Route path="/forum" element={<ForumPage currentUser={currentUser} />} />
          <Route path="/help" element={<HelpPage />} />
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