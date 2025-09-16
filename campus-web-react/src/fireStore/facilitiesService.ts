import { Facility } from "../types";
import { firestore } from "./config";
import { collection, addDoc, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, QueryDocumentSnapshot, DocumentData, query, where } from "firebase/firestore";

const facilityConverter = {
    toFirestore: (facility: Facility): DocumentData => facility,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Facility => snapshot.data() as Facility
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

export async function deleteFacility(id: string): Promise<void> {
    const docRef = doc(facilitiesCollection, id);
    await deleteDoc(docRef);
}

export async function getFacilitiesByStatus(status: Facility['status']): Promise<Facility[]> {
    const q = query(facilitiesCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}

export async function updateFacilityRating(id: string, newRating: number): Promise<void> {
    const docRef = doc(facilitiesCollection, id);
    const facility = await getFacilityById(id);
    
    if (facility) {
        const totalRatings = (facility.totalRatings || 0) + 1;
        const currentTotal = (facility.averageRating || 0) * (facility.totalRatings || 0);
        const newAverage = (currentTotal + newRating) / totalRatings;
        
        await updateDoc(docRef, {
            rating: newRating,
            totalRatings: totalRatings,
            averageRating: newAverage
        });
    }
}

// Test function to verify Facilities collection
export async function testFacilitiesCollection(): Promise<boolean> {
    try {
        const querySnapshot = await getDocs(facilitiesCollection);
        console.log("✅ Facilities collection accessible! Found", querySnapshot.docs.length, "facilities");
        return true;
    } catch (error) {
        console.error("❌ Facilities collection error:", error);
        return false;
    }
}
