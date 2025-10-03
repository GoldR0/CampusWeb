import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

export interface Inquiry {
  id: string;
  category: 'complaint' | 'improvement';
  description: string;
  date: string; // YYYY-MM-DD
  location: string;
  createdAt: string; // locale/he string or ISO as used by UI
  user: string;
}

const inquiryConverter = {
  toFirestore: (inquiry: Inquiry): DocumentData => {
    const { id, ...data } = inquiry;
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Inquiry => {
    const data = snapshot.data() as Omit<Inquiry, 'id'>;
    return { id: snapshot.id, ...data };
  }
};

const inquiriesCollection = collection(firestore, "inquiries").withConverter(inquiryConverter);

export async function addInquiry(inquiry: Inquiry): Promise<void> {
  await addDoc(inquiriesCollection, inquiry);
}

export async function listInquiries(): Promise<Inquiry[]> {
  const querySnapshot = await getDocs(inquiriesCollection);
  return querySnapshot.docs.map((d) => d.data());
}

export async function deleteInquiry(id: string): Promise<void> {
  const ref = doc(inquiriesCollection, id);
  await deleteDoc(ref);
}

// Optional helpers
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const ref = doc(inquiriesCollection, id);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  return null;
}

export async function listInquiriesOrderedByDateDesc(): Promise<Inquiry[]> {
  const q = query(inquiriesCollection, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => d.data());
}


