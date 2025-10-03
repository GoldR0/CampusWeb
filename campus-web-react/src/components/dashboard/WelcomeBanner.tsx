import React from 'react';
import { Paper, Typography } from '@mui/material';
import { User } from '../../types';

interface WelcomeBannerProps {
  currentUser: User | null;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ currentUser }) => {

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgb(179, 209, 53) 0%, rgb(159, 189, 33) 100%)',
        color: 'white'
      }}
    >
      <Typography variant="h4" gutterBottom>
        ברוכים הבאים למערכת המקיפה לניהול חיי הסטודנטים בקמפוס
      </Typography>
      {currentUser && (
        <Typography variant="h6">
          שלום {currentUser.name}!
        </Typography>
      )}
    </Paper>
  );
};

export default WelcomeBanner;
