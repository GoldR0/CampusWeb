export class User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  phone?: string;
  age?: number;
  city?: string;
  gender?: 'male' | 'female';

  constructor(init: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'lecturer' | 'admin';
    phone?: string;
    age?: number;
    city?: string;
    gender?: 'male' | 'female';
  }) {
    this.id = init.id;
    this.name = init.name;
    this.email = init.email;
    this.role = init.role;
    this.phone = init.phone;
    this.age = init.age;
    this.city = init.city;
    this.gender = init.gender;
  }
}

export class Task {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'homework' | 'quiz' | 'presentation';
  course: string;
  dueDate: string;
  priority: 'urgent' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  description?: string;

  constructor(init: {
    id: string;
    title: string;
    type: 'exam' | 'assignment' | 'homework' | 'quiz' | 'presentation';
    course: string;
    dueDate: string;
    priority: 'urgent' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    description?: string;
  }) {
    this.id = init.id;
    this.title = init.title;
    this.type = init.type;
    this.course = init.course;
    this.dueDate = init.dueDate;
    this.priority = init.priority;
    this.status = init.status;
    this.description = init.description;
  }
}

export class Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  roomId: string;
  urgent: boolean;

  constructor(init: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    roomId: string;
    urgent: boolean;
  }) {
    this.id = init.id;
    this.title = init.title;
    this.description = init.description;
    this.date = init.date;
    this.time = init.time;
    this.roomId = init.roomId;
    this.urgent = init.urgent;
  }
}

export class Facility {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'busy';
  hours: string;
  rating?: number;
  totalRatings?: number;
  averageRating?: number;

  constructor(init: {
    id: string;
    name: string;
    status: 'open' | 'closed' | 'busy';
    hours: string;
    rating?: number;
    totalRatings?: number;
    averageRating?: number;
  }) {
    this.id = init.id;
    this.name = init.name;
    this.status = init.status;
    this.hours = init.hours;
    this.rating = init.rating;
    this.totalRatings = init.totalRatings;
    this.averageRating = init.averageRating;
  }
}

export class Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  status: 'active' | 'completed' | 'upcoming';
  progress: number;

  constructor(init: {
    id: string;
    name: string;
    code: string;
    instructor: string;
    credits: number;
    status: 'active' | 'completed' | 'upcoming';
    progress: number;
  }) {
    this.id = init.id;
    this.name = init.name;
    this.code = init.code;
    this.instructor = init.instructor;
    this.credits = init.credits;
    this.status = init.status;
    this.progress = init.progress;
  }
}

export class Student {
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

  constructor(init: {
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
  }) {
    this.id = init.id;
    this.studentNumber = init.studentNumber;
    this.firstName = init.firstName;
    this.lastName = init.lastName;
    this.fullName = init.fullName;
    this.email = init.email;
    this.phone = init.phone;
    this.address = init.address;
    this.department = init.department;
    this.year = init.year;
    this.semester = init.semester;
    this.creditsCompleted = init.creditsCompleted;
    this.gpa = init.gpa;
    this.birthDate = init.birthDate;
    this.age = init.age;
    this.gender = init.gender;
    this.city = init.city;
    this.status = init.status;
    this.enrollmentDate = init.enrollmentDate;
    this.lastActive = init.lastActive;
    this.emergencyContact = init.emergencyContact;
    this.emergencyPhone = init.emergencyPhone;
    this.notes = init.notes;
  }
}

export class Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  courseId?: string;

  constructor(init: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    courseId?: string;
  }) {
    this.id = init.id;
    this.sender = init.sender;
    this.content = init.content;
    this.timestamp = init.timestamp;
    this.courseId = init.courseId;
  }
} 