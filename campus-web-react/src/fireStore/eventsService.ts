import { Event } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const eventConverter = {
    toFirestore: (event: Event): DocumentData => event,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Event => snapshot.data() as Event
};

const eventsCollection = collection(firestore, "events").withConverter(eventConverter);

export async function addEvent(event: Event): Promise<void> {
    await addDoc(eventsCollection, event);
}

export async function listEvents(): Promise<Event[]> {
    const querySnapshot = await getDocs(eventsCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getEventById(id: string): Promise<Event | null> {
    const docRef = doc(eventsCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateEvent(event: Event): Promise<void> {
    const docRef = doc(eventsCollection, event.id);
    await setDoc(docRef, event);
}

export async function deleteEvent(id: string): Promise<void> {
    const docRef = doc(eventsCollection, id);
    await deleteDoc(docRef);
}

export async function getUrgentEvents(): Promise<Event[]> {
    const q = query(eventsCollection, where("urgent", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getEventsByDate(date: string): Promise<Event[]> {
    const q = query(eventsCollection, where("date", "==", date));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getEventsByRoom(roomId: string): Promise<Event[]> {
    const q = query(eventsCollection, where("roomId", "==", roomId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

// Test function to verify Events collection
export async function testEventsCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(eventsCollection);
        console.log("✅ Events collection accessible! Found", querySnapshot.docs.length, "events");
        return true;
    } catch (error) {
        console.error("❌ Events collection error:", error);
        return false;
    }
}
