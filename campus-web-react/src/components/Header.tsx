import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { TYPOGRAPHY } from '../constants/theme';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Forum as ForumIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Description as DescriptionIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { User } from '../types';
import { getMenuItemsForUser } from '../utils/menuPermissions';

interface HeaderProps {
  currentUser: User | null;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogin,
  onLogout
}) => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    userType: ''
  });

  // פונקציה שמחזירה את האייקון המתאים לכל פריט תפריט
  const getIconForMenuItem = (itemId: string) => {
    switch (itemId) {
      case 'home': return <HomeIcon />;
      case 'students': return <SchoolIcon />;
      case 'forms': return <DescriptionIcon />;
      case 'profile': return <PersonIcon />;
      case 'learning': return <SchoolIcon />;
      case 'cafeteria': return <RestaurantIcon />;
      case 'lostfound': return <SearchIcon />;
      case 'community': return <GroupIcon />;
      case 'forum': return <ForumIcon />;
      case 'help': return <HelpIcon />;
      case 'debug': return <BugReportIcon />;
      default: return <HomeIcon />;
    }
  };

  // קבלת התפריטים המותרים למשתמש הנוכחי
  const allowedMenuItems = getMenuItemsForUser(currentUser);
  
  // יצירת רשימת פריטי התפריט עם האייקונים
  const navigationItems = allowedMenuItems.map(item => ({
    ...item,
    icon: getIconForMenuItem(item.id)
  }));

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgb(179, 209, 53)' }}>
        <Toolbar>
          {/* Logo, Title and Hamburger Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                ...TYPOGRAPHY.h6,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={() => navigate('/')}
            >
              🏫 מערכת ניהול קמפוס
            </Typography>
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <div style={{ width: "250px" }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={false} // Removed currentSection prop
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
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
                <strong>סטודנטית:</strong> shira.goldberg@student.ono.ac.il / 123456
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