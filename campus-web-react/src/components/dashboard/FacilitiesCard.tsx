import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, Chip, Divider, LinearProgress } from '@mui/material';
import { 
  LocationOn as LocationIcon,
  LocalLibrary as LibraryIcon,
  Restaurant as CafeteriaIcon,
  FitnessCenter as GymIcon,
  LocalParking as ParkingIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import { listFacilities } from '../../fireStore/facilitiesService';

interface FacilitiesCardProps {
  customColors: {
    primary: string;
  };
}

interface ManagedFacility {
  id: string;
  name: string;
  type: 'library' | 'cafeteria' | 'gym' | 'parking';
  status: 'open' | 'closed' | 'busy';
  lastUpdated: string;
}

const FacilitiesCard: React.FC<FacilitiesCardProps> = ({ customColors }) => {
  const [facilities, setFacilities] = useState<ManagedFacility[]>([]);
  const [managedFacilities, setManagedFacilities] = useState<ManagedFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load facilities from Firestore
  useEffect(() => {
    const loadFacilitiesFromFirestore = async () => {
      setIsLoading(true);
      try {
        const firestoreFacilities = await listFacilities();
        if (firestoreFacilities.length > 0) {
          // Convert Firestore facilities to local format
          const localFacilities: ManagedFacility[] = firestoreFacilities.map(facility => ({
            id: facility.id,
            name: facility.name,
            type: 'library' as 'library' | 'cafeteria' | 'gym' | 'parking', // Default type
            status: facility.status,
            lastUpdated: new Date().toLocaleString('he-IL')
          }));
          setManagedFacilities(localFacilities);
          setFacilities(localFacilities);
        } else {
          setManagedFacilities([]);
          setFacilities([]);
        }
      } catch (error) {
        console.error('Error loading facilities from Firestore:', error);
        setManagedFacilities([]);
        setFacilities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilitiesFromFirestore();
    
    // Facilities are now managed through Firestore, no need for localStorage listeners
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'busy': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getFacilityIcon = (facilityName: string, facilityType?: string) => {
    // First check if we have a managed facility with type
    if (facilityType) {
      switch (facilityType) {
        case 'library': return <LibraryIcon sx={{ fontSize: 24, color: customColors.primary }} />;
        case 'cafeteria': return <CafeteriaIcon sx={{ fontSize: 24, color: customColors.primary }} />;
        case 'gym': return <GymIcon sx={{ fontSize: 24, color: customColors.primary }} />;
        case 'parking': return <ParkingIcon sx={{ fontSize: 24, color: customColors.primary }} />;
        default: return <LocationIcon sx={{ fontSize: 24, color: customColors.primary }} />;
      }
    }
    
    // Fallback to name-based matching for demo facilities
    switch (facilityName) {
      case 'ספרייה':
        return <LibraryIcon sx={{ fontSize: 24, color: customColors.primary }} />;
      case 'קפיטריה':
        return <CafeteriaIcon sx={{ fontSize: 24, color: customColors.primary }} />;
      case 'חדר כושר':
        return <GymIcon sx={{ fontSize: 24, color: customColors.primary }} />;
      case 'חניה':
        return <ParkingIcon sx={{ fontSize: 24, color: customColors.primary }} />;
      default:
        return <LocationIcon sx={{ fontSize: 24, color: customColors.primary }} />;
    }
  };

  return (
    <Card sx={{ border: `2px solid ${customColors.primary}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ mr: 1 }} />
          <Typography variant="h6">מצב מתקנים</Typography>
        </Box>
        
        {isLoading ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              sx={{ 
                height: 3,
                backgroundColor: 'rgba(179, 209, 53, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgb(179, 209, 53)'
                }
              }} 
            />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              טוען מתקנים...
            </Typography>
          </Box>
        ) : (
          (managedFacilities.length > 0 ? managedFacilities : facilities).length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              אין מתקנים להצגה
            </Typography>
          ) : (
          (managedFacilities.length > 0 ? managedFacilities : facilities).map((facility, index) => {
            const isManagedFacility = managedFacilities.length > 0;
            
            return (
              <Box key={facility.id}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getFacilityIcon(facility.name, isManagedFacility ? (facility as ManagedFacility).type : undefined)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>
                        {facility.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={facility.status === 'open' ? 'פתוח' : facility.status === 'busy' ? 'עמוס' : 'סגור'}
                        color={getStatusColor(facility.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {isManagedFacility ? `עודכן: ${(facility as ManagedFacility).lastUpdated}` : ''}
                      </Typography>
                    </Box>
                    
                    {/* דירוג מוצג רק בדמו - הוסר כדי לעבוד עם Firestore בלבד */}
                  </Box>
                </Box>
                
                {index < (managedFacilities.length > 0 ? managedFacilities : facilities).length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            );
        })
        )
        )}
      </CardContent>
    </Card>
  );
};

export default FacilitiesCard;
