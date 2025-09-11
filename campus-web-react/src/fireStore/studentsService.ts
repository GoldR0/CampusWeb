import { Student } from "../types/Student";
import { firestore } from "./config";
import { collection, addDoc,getDoc, getDocs,setDoc,doc,deleteDoc,updateDoc, QueryDocumentSnapshot } from "firebase/firestore";
const studentConverter = {
    toFirestore: (student: Student) => student,
    fromFirestore: (snapshot: QueryDocumentSnapshot) => snapshot.data() as Student
};
const studentsCollection = collection(firestore, "students")

export async function addStudent(student: Student) {
    await addDoc(studentsCollection, student).withConverter(studentConverter);
}
export async function listStudents(): Promise<Student[]> {
    const querySnapshot = await getDocs(studentsCollection).withConverter(studentConverter);
    return querySnapshot.docs.map((doc) => doc.data() as Student);
}

export async function getStudentById(id: string): Promise<Student | null> {
    const docSnapshot = await getDoc(doc(studentsCollection, id));
    return docSnapshot.data() as Student | null;
}
export async function updateStudent(student: Student) {
    await setDoc(doc(studentsCollection, student)).withConverter(studentConverter);
}
export async function deleteStudent(id: string) {
    await deleteDoc(doc(studentsCollection, id)).withConverter(studentConverter);
}
