// Students Table Component
// Displays student data in a structured table format
// Receives data as props and handles only display logic

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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { Student, getStudentStatusInHebrew, getSemesterInHebrew } from '../../types/Student';

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
  format?: (value: any, student: Student) => React.ReactNode;
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

  // Define table columns
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
      align: 'right',
      format: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      )
    },
    {
      id: 'lastName',
      label: 'שם משפחה',
      minWidth: 120,
      align: 'right',
      format: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      )
    },
    {
      id: 'email',
      label: 'אימייל',
      minWidth: 200,
      align: 'right',
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {value}
          </Typography>
        </Box>
      )
    },
    {
      id: 'year',
      label: 'שנה',
      minWidth: 80,
      align: 'center',
      format: (value) => (
        <Chip 
          label={`שנה ${value}`} 
          size="small" 
          color="secondary"
        />
      )
    },
    {
      id: 'department',
      label: 'תואר (חוג)',
      minWidth: 140,
      align: 'right',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<SchoolIcon />}
        />
      )
    },
    {
      id: 'gpa',
      label: 'ממוצע ציונים',
      minWidth: 120,
      align: 'center',
      format: (value) => (
        <Chip 
          label={value.toFixed(2)} 
          size="small" 
          color={value >= 3.5 ? 'success' : value >= 3.0 ? 'warning' : 'error'}
          variant="filled"
        />
      )
    },
    {
      id: 'phone',
      label: 'טלפון',
      minWidth: 120,
      align: 'right',
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {value}
          </Typography>
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
              <IconButton
                size="small"
                onClick={() => onViewStudent(student)}
                sx={{ color: 'primary.main' }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEditStudent && (
            <Tooltip title="עריכה">
              <IconButton
                size="small"
                onClick={() => onEditStudent(student)}
                sx={{ color: 'warning.main' }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDeleteStudent && (
            <Tooltip title="מחיקה">
              <IconButton
                size="small"
                onClick={() => onDeleteStudent(student)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.includes(searchTerm) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
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

  // Handle empty state
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
      {/* Search Bar */}
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

      {/* Table */}
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
              <TableRow
                hover
                key={student.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format 
                      ? column.format(student[column.id as keyof Student], student)
                      : student[column.id as keyof Student]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            direction: 'rtl'
          }
        }}
      />

      {/* Summary */}
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
