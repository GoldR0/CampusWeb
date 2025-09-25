import { Message } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const messageConverter = {
    toFirestore: (message: Message): DocumentData => {
        const { id, ...data } = message as any;
        return data;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Message => {
        const data = snapshot.data() as Omit<Message, 'id'>;
        return new Message({ id: snapshot.id, ...(data as any) });
    }
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

// Partial update for existing message document
export async function patchMessage(id: string, partial: Partial<Message>): Promise<void> {
    const docRef = doc(messagesCollection, id);
    await updateDoc(docRef, partial as any);
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
    const q = query(
        messagesCollection,
        where("courseId", "==", courseId),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getMessagesByDateRange(startDate: string, endDate: string): Promise<Message[]> {
    const q = query(
        messagesCollection,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getRecentMessages(limit: number = 10): Promise<Message[]> {
    const q = query(
        messagesCollection,
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => doc.data());
}

export async function getMessagesByDate(date: string): Promise<Message[]> {
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;
    
    const q = query(
        messagesCollection,
        where("timestamp", ">=", startOfDay),
        where("timestamp", "<=", endOfDay),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getMessagesByContent(searchTerm: string): Promise<Message[]> {
    // Note: This is a simple implementation. For better search, consider using Algolia or similar
    const querySnapshot = await getDocs(messagesCollection);
    const allMessages = querySnapshot.docs.map((doc) => doc.data());
    
    return allMessages.filter(message => 
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

export async function getMessagesBySenderAndCourse(sender: string, courseId: string): Promise<Message[]> {
    const q = query(
        messagesCollection,
        where("sender", "==", sender),
        where("courseId", "==", courseId),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getLatestMessageByCourse(courseId: string): Promise<Message | null> {
    const q = query(
        messagesCollection,
        where("courseId", "==", courseId),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => doc.data());
    return messages.length > 0 ? messages[0] : null;
}

export async function getMessagesCountByCourse(courseId: string): Promise<number> {
    const q = query(messagesCollection, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
}

export async function getMessagesCountBySender(sender: string): Promise<number> {
    const q = query(messagesCollection, where("sender", "==", sender));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
}

// Test function to verify Firestore connection
export async function testMessagesCollection(): Promise<boolean> {
    try {
        // Try to read from the messages collection
        const querySnapshot = await getDocs(messagesCollection);
        console.log("✅ Messages collection connection successful! Found", querySnapshot.docs.length, "documents in messages collection");
        return true;
    } catch (error) {
        console.error("❌ Messages collection connection failed:", error);
        return false;
    }
}