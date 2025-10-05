import React from 'react';
import { Box, Typography, Card, CardMedia, Container } from '@mui/material';

// Import all cafeteria images
import a1 from '../assets/a1.png';
import a2 from '../assets/a2.png';
import a3 from '../assets/a3.png';
import a4 from '../assets/a4.png';
import a5 from '../assets/a5.png';
import a6 from '../assets/a6.png';
import a7 from '../assets/a7.png';
import a8 from '../assets/a8.png';
import a9 from '../assets/a9.png';
import a10 from '../assets/a10.png';
import a11 from '../assets/a11.png';
import a12 from '../assets/a12.png';
import a13 from '../assets/a13.png';
import a14 from '../assets/a14.png';
import a15 from '../assets/a15.png';
import a16 from '../assets/a16.png';
import a17 from '../assets/a17.png';
import a18 from '../assets/a18.png';
import a19 from '../assets/a19.png';
import a20 from '../assets/a20.png';
import a21 from '../assets/a21.png';
import a22 from '../assets/a22.png';
import a23 from '../assets/a23.png';
import a24 from '../assets/a24.png';

const CafeteriaPage: React.FC = () => {
  const cafeteriaImages = [
    { id: 1, src: a1 },
    { id: 2, src: a2 },
    { id: 3, src: a3 },
    { id: 4, src: a4 },
    { id: 5, src: a5 },
    { id: 6, src: a6 },
    { id: 7, src: a7 },
    { id: 8, src: a8 },
    { id: 9, src: a9 },
    { id: 10, src: a10 },
    { id: 11, src: a11 },
    { id: 12, src: a12 },
    { id: 13, src: a13 },
    { id: 14, src: a14 },
    { id: 15, src: a15 },
    { id: 16, src: a16 },
    { id: 17, src: a17 },
    { id: 18, src: a18 },
    { id: 19, src: a19 },
    { id: 20, src: a20 },
    { id: 21, src: a21 },
    { id: 22, src: a22 },
    { id: 23, src: a23 },
    { id: 24, src: a24 },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            color: 'rgb(179, 209, 53)',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          🍽️ קפיטריה - תפריטים ומנות
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 4
          }}
        >
          גלריית תמונות של התפריטים והמנות הזמינות בקפיטריה
        </Typography>

        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3
          }}
        >
          {cafeteriaImages.map((image) => (
            <Card 
              key={image.id}
              sx={{ 
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                image={image.src}
                alt={`תפריט קפיטריה ${image.id}`}
                sx={{ 
                  objectFit: 'contain',
                  width: '100%',
                  height: 'auto',
                  minHeight: '300px'
                }}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default CafeteriaPage;