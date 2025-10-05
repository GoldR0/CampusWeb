import { User } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where } from "firebase/firestore";

const userConverter = {
    toFirestore: (user: User): DocumentData => {
        const { id, ...data } = user;
        return data;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): User => {
        const data = snapshot.data() as Omit<User, 'id'>;
        return new User({ id: snapshot.id, ...data });
    }
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

export async function updateUser(user: User): Promise<void> {
    const docRef = doc(usersCollection, user.id);
    await setDoc(docRef, user);
}

// Partial update for existing user document
export async function patchUser(id: string, partial: Partial<User>): Promise<void> {
    const docRef = doc(usersCollection, id);
    await updateDoc(docRef, partial);
}

export async function deleteUser(id: string): Promise<void> {
    const docRef = doc(usersCollection, id);
    await deleteDoc(docRef);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());
    return users.length > 0 ? users[0] : null;
}

export async function getUsersByRole(role: User['role']): Promise<User[]> {
    const q = query(usersCollection, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUsersByCity(city: string): Promise<User[]> {
    const q = query(usersCollection, where("city", "==", city));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUsersByGender(gender: User['gender']): Promise<User[]> {
    const q = query(usersCollection, where("gender", "==", gender));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

// Test function to verify Firestore connection
export async function testUsersCollection(): Promise<boolean> {
    try {
        // Try to read from the users collection
        const querySnapshot = await getDocs(usersCollection);
        console.log("✅ Users collection connection successful! Found", querySnapshot.docs.length, "documents in users collection");
        return true;
    } catch (error) {
        console.error("❌ Users collection connection failed:", error);
        return false;
    }
}