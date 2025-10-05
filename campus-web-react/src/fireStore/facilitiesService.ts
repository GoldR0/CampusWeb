import { Facility } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where, orderBy } from "firebase/firestore";

const facilityConverter = {
    toFirestore: (facility: Facility): DocumentData => {
        const { id, ...data } = facility;
        return data;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Facility => {
        const data = snapshot.data() as Omit<Facility, 'id'>;
        return new Facility({ id: snapshot.id, ...data });
    }
};

const facilitiesCollection = collection(firestore, "facilities").withConverter(facilityConverter);

export async function addFacility(facility: Facility): Promise<void> {
    await addDoc(facilitiesCollection, facility);
}

export async function listFacilities(): Promise<Facility[]> {
    const querySnapshot = await getDocs(facilitiesCollection);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getFacilityById(id: string): Promise<Facility | null> {
    const docRef = doc(facilitiesCollection, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function updateFacility(facility: Facility): Promise<void> {
    const docRef = doc(facilitiesCollection, facility.id);
    await setDoc(docRef, facility);
}

// Partial update for existing facility document
export async function patchFacility(id: string, partial: Partial<Facility>): Promise<void> {
    const docRef = doc(facilitiesCollection, id);
    await updateDoc(docRef, partial);
}

export async function deleteFacility(id: string): Promise<void> {
    const docRef = doc(facilitiesCollection, id);
    await deleteDoc(docRef);
}

export async function getFacilitiesByStatus(status: Facility['status']): Promise<Facility[]> {
    const q = query(facilitiesCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getOpenFacilities(): Promise<Facility[]> {
    const q = query(facilitiesCollection, where("status", "==", "open"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getClosedFacilities(): Promise<Facility[]> {
    const q = query(facilitiesCollection, where("status", "==", "closed"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getBusyFacilities(): Promise<Facility[]> {
    const q = query(facilitiesCollection, where("status", "==", "busy"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getFacilitiesByRating(minRating: number): Promise<Facility[]> {
    const q = query(
        facilitiesCollection,
        where("averageRating", ">=", minRating),
        orderBy("averageRating", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function getTopRatedFacilities(limit: number = 5): Promise<Facility[]> {
    const q = query(
        facilitiesCollection,
        orderBy("averageRating", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => doc.data());
}

export async function updateFacilityRating(facilityId: string, newRating: number): Promise<void> {
    const docRef = doc(facilitiesCollection, facilityId);
    const facility = await getFacilityById(facilityId);
    
    if (facility) {
        const totalRatings = (facility.totalRatings || 0) + 1;
        const currentTotal = (facility.averageRating || 0) * (facility.totalRatings || 0);
        const newAverage = (currentTotal + newRating) / totalRatings;
        
        await updateDoc(docRef, {
            rating: newRating,
            totalRatings: totalRatings,
            averageRating: Math.round(newAverage * 10) / 10 // Round to 1 decimal place
        });
    }
}

// Test function to verify Firestore connection
export async function testFacilitiesCollection(): Promise<boolean> {
    try {
        // Try to read from the facilities collection
        const querySnapshot = await getDocs(facilitiesCollection);
        console.log("✅ Facilities collection connection successful! Found", querySnapshot.docs.length, "documents in facilities collection");
        return true;
    } catch (error) {
        console.error("❌ Facilities collection connection failed:", error);
        return false;
    }
}