import { User } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

const userConverter = {
    toFirestore: (user: User): DocumentData => user,
    fromFirestore: (snapshot: QueryDocumentSnapshot): User => snapshot.data() as User
};

const usersCollection = collection(firestore, "users").withConverter(userConverter);

export async function addUser(user: User): Promise<void> {
    await addDoc(usersCollection, user);
}

export async function listUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUserById(id: string): Promise<User | null> {
    const docRef = doc(usersCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const querySnapshot = await getDocs(usersCollection);
    const user = querySnapshot.docs.find(doc => doc.data().email === email);
    return user ? user.data() : null;
}

export async function updateUser(user: User): Promise<void> {
    const docRef = doc(usersCollection, user.id);
    await setDoc(docRef, user);
}

export async function deleteUser(id: string): Promise<void> {
    const docRef = doc(usersCollection, id);
    await deleteDoc(docRef);
}

export async function getUsersByRole(role: User['role']): Promise<User[]> {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.role === role);
}

// Test function to verify Users collection
export async function testUsersCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(usersCollection);
        console.log("✅ Users collection accessible! Found", querySnapshot.docs.length, "users");
        return true;
    } catch (error) {
        console.error("❌ Users collection error:", error);
        return false;
    }
}
