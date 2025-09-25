import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, Chip, Divider } from '@mui/material';
import { 
  LocationOn as LocationIcon,
  LocalLibrary as LibraryIcon,
  Restaurant as CafeteriaIcon,
  FitnessCenter as GymIcon,
  LocalParking as ParkingIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import RatingStars from '../RatingStars';

import { demoFacilities } from '../../data/demoData';
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
  status: 'open' | 'closed';
  lastUpdated: string;
}

const FacilitiesCard: React.FC<FacilitiesCardProps> = ({ customColors }) => {
  const [facilities, setFacilities] = useState(demoFacilities);
  const [managedFacilities, setManagedFacilities] = useState<ManagedFacility[]>([]);

  // Load facilities from Firestore
  useEffect(() => {
    const loadFacilitiesFromFirestore = async () => {
      try {
        const firestoreFacilities = await listFacilities();
        if (firestoreFacilities.length > 0) {
          setManagedFacilities(firestoreFacilities);
          localStorage.setItem('campus-facilities-data', JSON.stringify(firestoreFacilities));
        } else {
          // If no facilities in Firestore, use demo facilities
          setManagedFacilities(demoFacilities);
          localStorage.setItem('campus-facilities-data', JSON.stringify(demoFacilities));
        }
      } catch (error) {
        console.error('Error loading facilities from Firestore:', error);
        // Fallback to localStorage
        const savedFacilities = localStorage.getItem('campus-facilities-data');
        if (savedFacilities) {
          const parsedFacilities = JSON.parse(savedFacilities);
          setManagedFacilities(parsedFacilities);
        } else {
          setManagedFacilities(demoFacilities);
        }
      }
    };

    loadFacilitiesFromFirestore();
    
    // Listen for storage changes to update when facilities are modified in FormsPage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campus-facilities-data') {
        loadFacilitiesFromFirestore();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleFacilityUpdate = () => {
      loadFacilitiesFromLocalStorage();
    };

    window.addEventListener('facilityUpdated', handleFacilityUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('facilityUpdated', handleFacilityUpdate);
    };
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

  const handleRatingChange = (facilityId: string, rating: number) => {
    setFacilities(prevFacilities => 
      prevFacilities.map(facility => {
        if (facility.id === facilityId) {
          const newTotalRatings = (facility.totalRatings || 0) + 1;
          const newAverageRating = facility.averageRating 
            ? ((facility.averageRating * (facility.totalRatings || 0)) + rating) / newTotalRatings
            : rating;
          
          return {
            ...facility,
            rating,
            totalRatings: newTotalRatings,
            averageRating: newAverageRating
          };
        }
        return facility;
      })
    );
  };

  return (
    <Card sx={{ border: `2px solid ${customColors.primary}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ mr: 1 }} />
          <Typography variant="h6">מצב מתקנים</Typography>
        </Box>
        
        {/* Display managed facilities if available, otherwise show demo facilities */}
        {(managedFacilities.length > 0 ? managedFacilities : facilities).map((facility, index) => {
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
                      color={getStatusColor(facility.status) as any}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {isManagedFacility ? `עודכן: ${(facility as ManagedFacility).lastUpdated}` : (facility as any).hours}
                    </Typography>
                  </Box>
                  
                  {/* Rating Section - only for demo facilities */}
                  {!isManagedFacility && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        דרג את המתקן:
                      </Typography>
                      <RatingStars
                        value={(facility as any).rating || 0}
                        onChange={(rating) => handleRatingChange(facility.id, rating)}
                        size="small"
                        showLabel={true}
                        totalRatings={(facility as any).totalRatings || 0}
                        averageRating={(facility as any).averageRating || 0}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              
              {index < (managedFacilities.length > 0 ? managedFacilities : facilities).length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FacilitiesCard;
