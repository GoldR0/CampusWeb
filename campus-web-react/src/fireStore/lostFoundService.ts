import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

export interface LostFoundReport {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  contactPhone: string;
  timestamp: string; // ISO string for cross-platform serialization
  user: string;
}

const lostFoundConverter = {
  toFirestore: (report: LostFoundReport): DocumentData => {
    const { id, ...data } = report as any;
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): LostFoundReport => {
    const data = snapshot.data() as Omit<LostFoundReport, 'id'>;
    return { id: snapshot.id, ...(data as any) };
  }
};

const lostFoundCollection = collection(firestore, "lostFound").withConverter(lostFoundConverter);

export async function addLostFoundReport(report: LostFoundReport): Promise<void> {
  await addDoc(lostFoundCollection, report);
}

export async function listLostFoundReports(): Promise<LostFoundReport[]> {
  const querySnapshot = await getDocs(lostFoundCollection);
  return querySnapshot.docs.map((d) => d.data());
}

export async function getLostFoundReportById(id: string): Promise<LostFoundReport | null> {
  const ref = doc(lostFoundCollection, id);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  return null;
}

export async function updateLostFoundReport(report: LostFoundReport): Promise<void> {
  const ref = doc(lostFoundCollection, report.id);
  await setDoc(ref, report);
}

export async function patchLostFoundReport(id: string, partial: Partial<LostFoundReport>): Promise<void> {
  const ref = doc(lostFoundCollection, id);
  await updateDoc(ref, partial as any);
}

export async function deleteLostFoundReport(id: string): Promise<void> {
  const ref = doc(lostFoundCollection, id);
  await deleteDoc(ref);
}

export async function getLostFoundByType(type: 'lost' | 'found'): Promise<LostFoundReport[]> {
  const q = query(lostFoundCollection, where("type", "==", type));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => d.data());
}

export async function listLostFoundOrderedByTimestampDesc(): Promise<LostFoundReport[]> {
  const q = query(lostFoundCollection, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => d.data());
}

export async function testLostFoundCollection(): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(lostFoundCollection);
    console.log("✅ LostFound collection connection successful! Found", querySnapshot.docs.length, "documents");
    return true;
  } catch (error) {
    console.error("❌ LostFound collection connection failed:", error);
    return false;
  }
}



