import { Task } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const taskConverter = {
    toFirestore: (task: Task): DocumentData => task,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Task => snapshot.data() as Task
};

const tasksCollection = collection(firestore, "tasks").withConverter(taskConverter);

export async function addTask(task: Task): Promise<void> {
    await addDoc(tasksCollection, task);
}

export async function listTasks(): Promise<Task[]> {
    const querySnapshot = await getDocs(tasksCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getTaskById(id: string): Promise<Task | null> {
    const docRef = doc(tasksCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateTask(task: Task): Promise<void> {
    const docRef = doc(tasksCollection, task.id);
    await setDoc(docRef, task);
}

export async function deleteTask(id: string): Promise<void> {
    const docRef = doc(tasksCollection, id);
    await deleteDoc(docRef);
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const q = query(tasksCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    const q = query(tasksCollection, where("priority", "==", priority));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getTasksByType(type: Task['type']): Promise<Task[]> {
    const q = query(tasksCollection, where("type", "==", type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getTasksByCourse(course: string): Promise<Task[]> {
    const q = query(tasksCollection, where("course", "==", course));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUrgentTasks(): Promise<Task[]> {
    const q = query(tasksCollection, where("priority", "==", "urgent"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<void> {
    const docRef = doc(tasksCollection, id);
    await updateDoc(docRef, { status });
}

// Test function to verify Tasks collection
export async function testTasksCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(tasksCollection);
        console.log("✅ Tasks collection accessible! Found", querySnapshot.docs.length, "tasks");
        return true;
    } catch (error) {
        console.error("❌ Tasks collection error:", error);
        return false;
    }
}
