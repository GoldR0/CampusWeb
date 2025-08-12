import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, url: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, url: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: '#', label: 'LinkedIn' },
    { icon: <YouTubeIcon />, url: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { label: 'תנאי שימוש', url: '#' },
    { label: 'מדיניות פרטיות', url: '#' },
    { label: 'צור קשר', url: '#' },
    { label: 'אודות', url: '#' },
    { label: 'שאלות נפוצות', url: '#' },
    { label: 'תמיכה טכנית', url: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgb(179, 209, 53)',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4 
        }}>
          {/* Main Info */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🏫 מכללת אונו
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              מערכת ניהול קמפוס מתקדמת לסטודנטים ומרצים
            </Typography>
            
            {/* Contact Info */}
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  info@ono.ac.il
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  03-1234567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">
                  רחוב האוניברסיטה 123, תל אביב
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              קישורים מהירים
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    display: 'block',
                    '&:hover': { color: 'rgba(255,255,255,0.8)' }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Social Media */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              עקבו אחרינו
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              הישארו מעודכנים עם החדשות והאירועים שלנו
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  color="inherit"
                  sx={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderColor: 'rgba(255,255,255,0.7)',
                      transform: 'scale(1.1)'
                    }
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} מכללת אונו - מערכת ניהול קמפוס. כל הזכויות שמורות.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 1 }}>
            פותח עם ❤️ עבור קהילת הסטודנטים והמרצים
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
