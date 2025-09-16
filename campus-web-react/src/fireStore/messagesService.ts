import { Message } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const messageConverter = {
    toFirestore: (message: Message): DocumentData => message,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Message => snapshot.data() as Message
};

const messagesCollection = collection(firestore, "messages").withConverter(messageConverter);

export async function addMessage(message: Message): Promise<void> {
    await addDoc(messagesCollection, message);
}

export async function listMessages(): Promise<Message[]> {
    const querySnapshot = await getDocs(messagesCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getMessageById(id: string): Promise<Message | null> {
    const docRef = doc(messagesCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateMessage(message: Message): Promise<void> {
    const docRef = doc(messagesCollection, message.id);
    await setDoc(docRef, message);
}

export async function deleteMessage(id: string): Promise<void> {
    const docRef = doc(messagesCollection, id);
    await deleteDoc(docRef);
}

export async function getMessagesBySender(sender: string): Promise<Message[]> {
    const q = query(messagesCollection, where("sender", "==", sender));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getMessagesByCourse(courseId: string): Promise<Message[]> {
    const q = query(messagesCollection, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getRecentMessages(limit: number = 50): Promise<Message[]> {
    const q = query(messagesCollection, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
        .slice(0, limit)
        .map((doc) => doc.data());
}

export async function getMessagesByTimeRange(startTime: string, endTime: string): Promise<Message[]> {
    const q = query(
        messagesCollection,
        where("timestamp", ">=", startTime),
        where("timestamp", "<=", endTime)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

// Test function to verify Messages collection
export async function testMessagesCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(messagesCollection);
        console.log("✅ Messages collection accessible! Found", querySnapshot.docs.length, "messages");
        return true;
    } catch (error) {
        console.error("❌ Messages collection error:", error);
        return false;
    }
}
