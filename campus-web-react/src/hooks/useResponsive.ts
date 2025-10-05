import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook לבדיקת גודל מסך
 * מספק מידע על breakpoints שונים
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isXLargeDesktop,
    // Helper functions
    isMobileOrTablet: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLargeDesktop || isXLargeDesktop,
  };
};

/**
 * Custom hook ספציפי למסכי מנהל
 * מסכי מנהל צריכים לתמוך רק ב-desktop
 */
export const useAdminResponsive = () => {
  const responsive = useResponsive();
  
  return {
    ...responsive,
    isAdminSupported: responsive.isDesktop,
    adminMessage: responsive.isMobileOrTablet 
      ? 'מסך זה זמין רק במחשבים שולחניים' 
      : null,
  };
};
