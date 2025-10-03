import { Course } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const courseConverter = {
    toFirestore: (course: Course): DocumentData => {
        const { id, ...data } = course;
        return data;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Course => {
        const data = snapshot.data() as Omit<Course, 'id'>;
        return new Course({ id: snapshot.id, ...data });
    }
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

// Partial update for existing course document
export async function patchCourse(id: string, partial: Partial<Course>): Promise<void> {
    const docRef = doc(coursesCollection, id);
    await updateDoc(docRef, partial);
}

export async function deleteCourse(id: string): Promise<void> {
    const docRef = doc(coursesCollection, id);
    await deleteDoc(docRef);
}

export async function getCourseByCode(code: string): Promise<Course | null> {
    const q = query(coursesCollection, where("code", "==", code));
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map((doc) => doc.data());
    return courses.length > 0 ? courses[0] : null;
}

export async function getCoursesByInstructor(instructor: string): Promise<Course[]> {
    const q = query(coursesCollection, where("instructor", "==", instructor));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCoursesByStatus(status: Course['status']): Promise<Course[]> {
    const q = query(coursesCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getActiveCourses(): Promise<Course[]> {
    const q = query(coursesCollection, where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCompletedCourses(): Promise<Course[]> {
    const q = query(coursesCollection, where("status", "==", "completed"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUpcomingCourses(): Promise<Course[]> {
    const q = query(coursesCollection, where("status", "==", "upcoming"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCoursesByCredits(minCredits: number): Promise<Course[]> {
    const q = query(
        coursesCollection,
        where("credits", ">=", minCredits),
        orderBy("credits", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCoursesByProgress(minProgress: number): Promise<Course[]> {
    const q = query(
        coursesCollection,
        where("progress", ">=", minProgress),
        orderBy("progress", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getCoursesByProgressRange(minProgress: number, maxProgress: number): Promise<Course[]> {
    const q = query(
        coursesCollection,
        where("progress", ">=", minProgress),
        where("progress", "<=", maxProgress),
        orderBy("progress", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function updateCourseProgress(courseId: string, newProgress: number): Promise<void> {
    const docRef = doc(coursesCollection, courseId);
    await updateDoc(docRef, {
        progress: newProgress
    });
}

export async function getTopProgressCourses(limit: number = 5): Promise<Course[]> {
    const q = query(
        coursesCollection,
        orderBy("progress", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => doc.data());
}

// Test function to verify Firestore connection
export async function testCoursesCollection(): Promise<boolean> {
    try {
        // Try to read from the courses collection
        const querySnapshot = await getDocs(coursesCollection);
        console.log("✅ Courses collection connection successful! Found", querySnapshot.docs.length, "documents in courses collection");
        return true;
    } catch (error) {
        console.error("❌ Courses collection connection failed:", error);
        return false;
    }
}