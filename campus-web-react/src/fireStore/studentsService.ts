import { Student } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where } from "firebase/firestore";

const studentConverter = {
    toFirestore: (student: Student): DocumentData => student,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Student => ({
        ...snapshot.data() as Student,
        id: snapshot.id
    })
};

const studentsCollection = collection(firestore, "students").withConverter(studentConverter);

export async function addStudent(student: Student): Promise<void> {
    await addDoc(studentsCollection, student);
}

export async function listStudents(): Promise<Student[]> {
    const querySnapshot = await getDocs(studentsCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getStudentById(id: string): Promise<Student | null> {
    const docRef = doc(studentsCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateStudent(student: Student): Promise<void> {
    const docRef = doc(studentsCollection, student.id);
    await setDoc(docRef, student);
}

export async function deleteStudent(id: string): Promise<void> {
    const docRef = doc(studentsCollection, id);
    await deleteDoc(docRef);
}

export async function getStudentByEmail(email: string): Promise<Student | null> {
    const q = query(studentsCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map((doc) => doc.data());
    return students.length > 0 ? students[0] : null;
}

export async function getStudentsByDepartment(department: string): Promise<Student[]> {
    const q = query(studentsCollection, where("department", "==", department));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getStudentsByYear(year: number): Promise<Student[]> {
    const q = query(studentsCollection, where("year", "==", year));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getStudentsByStatus(status: Student['status']): Promise<Student[]> {
    const q = query(studentsCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getStudentByStudentNumber(studentNumber: string): Promise<Student | null> {
    const q = query(studentsCollection, where("studentNumber", "==", studentNumber));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map((doc) => doc.data());
    return students.length > 0 ? students[0] : null;
}

// Test function to verify Firestore connection
export async function testFirestoreConnection(): Promise<boolean> {
    try {
        // Try to read from the students collection
        const querySnapshot = await getDocs(studentsCollection);
        console.log("✅ Firestore connection successful! Found", querySnapshot.docs.length, "documents in students collection");
        return true;
    } catch (error) {
        console.error("❌ Firestore connection failed:", error);
        return false;
    }
}
