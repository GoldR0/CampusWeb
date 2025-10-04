import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { Student } from '../../types';

interface StudentsTableProps {
  students: Student[];
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
}

interface Column {
  id: keyof Student | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string | number, student: Student) => React.ReactNode;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column[] = [
    {
      id: 'studentNumber',
      label: 'ת״ז',
      minWidth: 120,
      align: 'center'
    },
    {
      id: 'firstName',
      label: 'שם פרטי',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'lastName',
      label: 'שם משפחה',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'email',
      label: 'אימייל',
      minWidth: 200,
      align: 'right',
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>{value}</Typography>
        </Box>
      )
    },
    {
      id: 'year',
      label: 'שנה',
      minWidth: 80,
      align: 'center',
      format: (value) => (
        <Chip label={`שנה ${value}`} size="small" color="secondary" />
      )
    },
    {
      id: 'department',
      label: 'תואר (חוג)',
      minWidth: 140,
      align: 'right',
      format: (value) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      )
    },
    {
      id: 'gpa',
      label: 'ממוצע ציונים',
      minWidth: 120,
      align: 'center',
      format: (value) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        // Handle NaN values
        if (isNaN(numValue)) {
          return (
            <Chip 
              label="לא זמין" 
              size="small" 
              color="default"
            />
          );
        }
        
        // If GPA is in 0-4 scale, convert it for display
        const displayGPA = numValue <= 4.0 ? numValue * 25 : numValue;
        
        return (
          <Chip 
            label={displayGPA.toFixed(1)} 
            size="small" 
            color={displayGPA >= 87.5 ? 'success' : displayGPA >= 75 ? 'warning' : 'error'}
          />
        );
      }
    },
    {
      id: 'phone',
      label: 'טלפון',
      minWidth: 120,
      align: 'right',
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{value}</Typography>
        </Box>
      )
    },
    {
      id: 'actions',
      label: 'פעולות',
      minWidth: 120,
      align: 'center',
      format: (value, student) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onViewStudent && (
            <Tooltip title="צפייה בפרטים">
              <IconButton size="small" onClick={() => onViewStudent(student)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEditStudent && (
            <Tooltip title="עריכה">
              <IconButton size="small" onClick={() => onEditStudent(student)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDeleteStudent && (
            <Tooltip title="מחיקה">
              <IconButton size="small" onClick={() => onDeleteStudent(student)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.includes(searchTerm) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (students.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          אין סטודנטים להצגה
        </Typography>
        <Typography variant="body2" color="text.secondary">
          לא נמצאו נתוני סטודנטים במערכת
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="חיפוש סטודנטים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="students table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: 'rgb(179, 209, 53)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow hover key={student.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format 
                      ? column.format(student[column.id as keyof Student] || '', student)
                      : student[column.id as keyof Student]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ-${to}`}`
        }
      />

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          מציג {paginatedStudents.length} מתוך {filteredStudents.length} סטודנטים
          {searchTerm && ` (מסונן לפי: "${searchTerm}")`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StudentsTable;
