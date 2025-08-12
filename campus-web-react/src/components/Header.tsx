import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Build as BuildIcon,
  Group as GroupIcon,
  Forum as ForumIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
  currentSection
}) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    userType: ''
  });

  const navigationItems = [
    { id: 'home', label: 'עמוד בית', icon: <HomeIcon /> },
    { id: 'students', label: 'ניהול סטודנטים', icon: <SchoolIcon /> },
    { id: 'profile', label: 'פרופיל אישי', icon: <PersonIcon /> },
    { id: 'learning', label: 'מרכז הלימודים', icon: <SchoolIcon /> },
    { id: 'cafeteria', label: 'קפיטריה', icon: <RestaurantIcon /> },
    { id: 'lostfound', label: 'מציאות ואבדות', icon: <SearchIcon /> },
    { id: 'marketplace', label: 'שוק יד שנייה', icon: <ShoppingCartIcon /> },
    { id: 'services', label: 'שירותים בקמפוס', icon: <BuildIcon /> },
    { id: 'community', label: 'קהילה', icon: <GroupIcon /> },
    { id: 'course-forum', label: 'פורום קורס', icon: <ForumIcon /> },
    { id: 'help', label: 'עזרה', icon: <HelpIcon /> }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm.email, loginForm.password);
    setLoginOpen(false);
    setLoginForm({ email: '', password: '', userType: '' });
  };

  const handleLogout = () => {
    onLogout();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgb(179, 209, 53)' }}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              🏫 מערכת ניהול קמפוס
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
            {navigationItems.slice(0, 8).map((item) => (
              <Button
                key={item.id}
                color="inherit"
                onClick={() => handleNavigation(item.id)}
                sx={{
                  backgroundColor: currentSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  },
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5
                }}
              >
                {item.icon}
                <Typography sx={{ 
                  mr: 0.5, 
                  display: { xs: 'none', lg: 'block' },
                  fontSize: '0.875rem'
                }}>
                  {item.label}
                </Typography>
              </Button>
            ))}
          </Box>

          {/* User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {currentUser ? (
              <>
                <Chip
                  avatar={<Avatar>{currentUser.name.charAt(0)}</Avatar>}
                  label={currentUser.name}
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}
                />
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  התנתקות
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => setLoginOpen(true)}
                startIcon={<LoginIcon />}
              >
                התחברות
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.id)}
                  selected={currentSection === item.id}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🔐 התחברות למערכת</DialogTitle>
        <form onSubmit={handleLoginSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>סוג משתמש</InputLabel>
              <Select
                value={loginForm.userType}
                onChange={(e) => setLoginForm({ ...loginForm, userType: e.target.value })}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(179, 209, 53)'
                    }
                  }
                }}
              >
                <MenuItem value="student">סטודנט</MenuItem>
                <MenuItem value="lecturer">מרצה</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="אימייל"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="סיסמה"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(179, 209, 53)'
                  }
                }
              }}
            />
                          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(179, 209, 53, 0.1)', borderRadius: 1, border: '1px solid rgba(179, 209, 53, 0.3)' }}>
              <Typography variant="subtitle2" gutterBottom>
                חשבונות לדוגמה:
              </Typography>
              <Typography variant="body2">
                <strong>סטודנט:</strong> student@campus.ac.il / 123456
              </Typography>
              <Typography variant="body2">
                <strong>מרצה:</strong> lecturer@campus.ac.il / 123456
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoginOpen(false)}>ביטול</Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                backgroundColor: 'rgb(179, 209, 53)',
                '&:hover': {
                  backgroundColor: 'rgb(159, 189, 33)'
                }
              }}
            >
              התחבר
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Header;
