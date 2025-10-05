import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Student } from '../types';
import { Box, Typography, Paper } from '@mui/material';
import { CUSTOM_COLORS } from '../constants/theme';

interface StudentsChartProps {
  students: Student[];
}

const StudentsChart: React.FC<StudentsChartProps> = ({ students }) => {
  // Prepare data for the chart
  const chartData = students
    .filter(student => student.status === 'active') // Only active students
    .map((student, index) => {
      // Convert GPA to display scale if needed
      const displayGPA = student.gpa <= 4.0 ? student.gpa * 25 : student.gpa;
      
      return {
        name: `סטודנט ${index + 1}`, // Generic name for X-axis
        gpa: displayGPA,
        fullName: student.fullName,
        firstName: student.firstName,
        lastName: student.lastName,
        department: student.department,
        year: student.year
      };
    })
    .sort((a, b) => b.gpa - a.gpa); // Sort by GPA descending

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper 
          sx={{ 
            p: 2, 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: `2px solid ${CUSTOM_COLORS.primary}`,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h6" sx={{ color: CUSTOM_COLORS.primary, fontWeight: 'bold' }}>
            {data.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.department} - שנה {data.year}
          </Typography>
          <Typography variant="h6" sx={{ color: CUSTOM_COLORS.primary, mt: 1 }}>
            ממוצע ציונים: {data.gpa.toFixed(1)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const averageGPA = students.reduce((sum, student) => {
    const gpa = student.gpa <= 4.0 ? student.gpa * 25 : student.gpa;
    return sum + gpa;
  }, 0) / students.length;
  const outstandingStudents = students.filter(student => {
    const gpa = student.gpa <= 4.0 ? student.gpa * 25 : student.gpa;
    return gpa >= 87.5;
  }).length;

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      {/* Statistics Summary */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: CUSTOM_COLORS.primary, fontWeight: 'bold' }}>
            {totalStudents}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            סה"כ סטודנטים
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: CUSTOM_COLORS.primary, fontWeight: 'bold' }}>
            {activeStudents}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            סטודנטים פעילים
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: CUSTOM_COLORS.primary, fontWeight: 'bold' }}>
            {averageGPA.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ממוצע ציונים
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: CUSTOM_COLORS.primary, fontWeight: 'bold' }}>
            {outstandingStudents}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            סטודנטים מצטיינים
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            mb: 3,
            color: CUSTOM_COLORS.primary,
            fontWeight: 'bold'
          }}
        >
          ציונים לפי סטודנטים
        </Typography>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(179, 209, 53, 0.2)" 
            />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              stroke={CUSTOM_COLORS.primary}
              fontWeight="bold"
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              domain={[0, 100]}
              stroke={CUSTOM_COLORS.primary}
              fontWeight="bold"
              label={{ 
                value: 'ממוצע ציונים', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: CUSTOM_COLORS.primary }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="gpa"
              stroke={CUSTOM_COLORS.primary}
              strokeWidth={3}
              fill="url(#colorGradient)"
              fillOpacity={0.6}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(179, 209, 53, 0.8)" />
                <stop offset="95%" stopColor="rgba(179, 209, 53, 0.1)" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default StudentsChart;
