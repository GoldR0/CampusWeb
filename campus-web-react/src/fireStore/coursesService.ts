import { Course } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where } from "firebase/firestore";

const courseConverter = {
    toFirestore: (course: Course): DocumentData => course,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Course => snapshot.data() as Course
};

const coursesCollection = collection(firestore, "courses").withConverter(courseConverter);

export async function addCourse(course: Course): Promise<void> {
    await addDoc(coursesCollection, course);
}

export async function listCourses(): Promise<Course[]> {
    const querySnapshot = await getDocs(coursesCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCourseById(id: string): Promise<Course | null> {
    const docRef = doc(coursesCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateCourse(course: Course): Promise<void> {
    const docRef = doc(coursesCollection, course.id);
    await setDoc(docRef, course);
}

export async function deleteCourse(id: string): Promise<void> {
    const docRef = doc(coursesCollection, id);
    await deleteDoc(docRef);
}

export async function getCoursesByStatus(status: Course['status']): Promise<Course[]> {
    const q = query(coursesCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCoursesByInstructor(instructor: string): Promise<Course[]> {
    const q = query(coursesCollection, where("instructor", "==", instructor));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCourseByCode(code: string): Promise<Course | null> {
    const q = query(coursesCollection, where("code", "==", code));
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map((doc) => doc.data());
    return courses.length > 0 ? courses[0] : null;
}

export async function updateCourseProgress(id: string, progress: number): Promise<void> {
    const docRef = doc(coursesCollection, id);
    await updateDoc(docRef, { progress });
}

export async function updateCourseStatus(id: string, status: Course['status']): Promise<void> {
    const docRef = doc(coursesCollection, id);
    await updateDoc(docRef, { status });
}

// Test function to verify Courses collection
export async function testCoursesCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(coursesCollection);
        console.log("✅ Courses collection accessible! Found", querySnapshot.docs.length, "courses");
        return true;
    } catch (error) {
        console.error("❌ Courses collection error:", error);
        return false;
    }
}
