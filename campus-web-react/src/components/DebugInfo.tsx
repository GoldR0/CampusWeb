import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { User } from '../types';

interface DebugInfoProps {
  currentUser: User | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ currentUser }) => {
  const testFirestoreConnection = async () => {
    try {
      // Import the test function dynamically
      const { testFirestoreConnection } = await import('../fireStore/studentsService');
      const isConnected = await testFirestoreConnection();
      alert(`Firestore connection: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      alert(`Firestore connection error: ${error}`);
    }
  };

  const initializeFirestoreCollections = async () => {
    try {
      const { initializeAllCollections } = await import('../fireStore/initializeCollections');
      alert('Starting Firestore initialization... Check console for progress.');
      await initializeAllCollections();
      alert('✅ Firestore collections initialized successfully!');
    } catch (error) {
      alert(`❌ Firestore initialization error: ${error}`);
    }
  };

  const clearLocalStorage = () => {
    // Data is now managed through Firestore, no need to clear localStorage
    alert('Data is now managed through Firestore. No localStorage to clear.');
  };

  const checkLocalStorage = () => {
    // Data is now managed through Firestore, no localStorage to check
    alert('Data is now managed through Firestore. No localStorage to check.');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        backgroundColor: '#f5f5f5',
        border: '2px solid #2196f3'
      }}
    >
      <Typography variant="h5" gutterBottom color="primary">
        🔧 מידע דיבוג - Debug Information
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">משתמש נוכחי:</Typography>
        {currentUser ? (
          <Box sx={{ p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
            <Typography><strong>שם:</strong> {currentUser.name}</Typography>
            <Typography><strong>אימייל:</strong> {currentUser.email}</Typography>
            <Typography><strong>תפקיד:</strong> {currentUser.role}</Typography>
            <Typography><strong>מזהה:</strong> {currentUser.id}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">לא מחובר</Typography>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">פרטי הדפדפן:</Typography>
        <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
          <Typography><strong>User Agent:</strong> {navigator.userAgent}</Typography>
          <Typography><strong>URL:</strong> {window.location.href}</Typography>
          <Typography><strong>LocalStorage support:</strong> {typeof(Storage) !== "undefined" ? "כן" : "לא"}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={testFirestoreConnection}
        >
          בדוק חיבור Firestore
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          onClick={initializeFirestoreCollections}
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
        >
          🚀 אתחל קולקציות Firestore
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={checkLocalStorage}
        >
          בדוק LocalStorage
        </Button>
        
        <Button 
          variant="contained" 
          color="error"
          onClick={clearLocalStorage}
        >
          נקה LocalStorage
        </Button>
      </Box>
    </Paper>
  );
};

export default DebugInfo;
