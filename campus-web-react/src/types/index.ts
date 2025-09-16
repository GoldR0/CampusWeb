export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  phone?: string;
  age?: number;
  city?: string;
  gender?: 'male' | 'female';
}

export interface Task {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'homework' | 'quiz' | 'presentation';
  course: string;
  dueDate: string;
  priority: 'urgent' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  roomId: string;
  urgent: boolean;
}

export interface Facility {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'busy';
  hours: string;
  rating?: number;
  totalRatings?: number;
  averageRating?: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  status: 'active' | 'completed' | 'upcoming';
  progress: number;
}

export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  year: number;
  semester: 'א' | 'ב' | 'ג';
  creditsCompleted: number;
  gpa: number;
  birthDate: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: string;
  lastActive: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  courseId?: string;
} 