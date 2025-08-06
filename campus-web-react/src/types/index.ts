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
  location: string;
  urgent: boolean;
}

export interface Facility {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'busy';
  hours: string;
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
  name: string;
  email: string;
  major: string;
  year: number;
  gpa: number;
  courses: string[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  courseId?: string;
}

// New form interfaces
export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'open' | 'claimed' | 'closed';
  imageUrl?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'books' | 'electronics' | 'furniture' | 'clothing' | 'other';
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  datePosted: string;
  status: 'available' | 'sold' | 'reserved';
  imageUrl?: string;
}

export interface ServiceRequest {
  id: string;
  type: 'maintenance' | 'cleaning' | 'security' | 'technical' | 'other';
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  dateRequested: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

export interface ForumPost {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  datePosted: string;
  tags: string[];
  status: 'active' | 'closed' | 'deleted';
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  datePosted: string;
  status: 'active' | 'deleted';
}

export interface CafeteriaOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CafeteriaOrderItem[];
  totalPrice: number;
  orderDate: string;
  pickupTime: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  specialInstructions?: string;
}

export interface CafeteriaOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface CafeteriaMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'side' | 'drink' | 'dessert' | 'breakfast';
  available: boolean;
  imageUrl?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  maxParticipants: number;
  currentParticipants: number;
  category: 'social' | 'academic' | 'sports' | 'cultural' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationRequired: boolean;
  participants: string[];
}

export interface HelpTicket {
  id: string;
  category: 'technical' | 'academic' | 'administrative' | 'financial' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  dateCreated: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
} 