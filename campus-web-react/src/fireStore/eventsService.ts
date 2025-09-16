import { Event } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const eventConverter = {
    toFirestore: (event: Event): DocumentData => event,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Event => ({
        ...snapshot.data() as Event,
        id: snapshot.id
    })
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

export async function getUrgentEvents(): Promise<Event[]> {
    const q = query(eventsCollection, where("urgent", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    const q = query(
        eventsCollection,
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("date")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getUpcomingEvents(): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
        eventsCollection,
        where("date", ">=", today),
        orderBy("date")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

// Test function to verify Firestore connection
export async function testEventsCollection(): Promise<boolean> {
    try {
        // Try to read from the events collection
        const querySnapshot = await getDocs(eventsCollection);
        console.log("✅ Events collection connection successful! Found", querySnapshot.docs.length, "documents in events collection");
        return true;
    } catch (error) {
        console.error("❌ Events collection connection failed:", error);
        return false;
    }
}