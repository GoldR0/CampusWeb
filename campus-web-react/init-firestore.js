// Simple script to initialize Firestore collections
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmHfF_rxekXqHCWPGrCXElP4zxQD_A1S0",
  authDomain: "campusweb-6cd91.firebaseapp.com",
  projectId: "campusweb-6cd91",
  storageBucket: "campusweb-6cd91.firebasestorage.app",
  messagingSenderId: "738008487160",
  appId: "1:738008487160:web:a1af0d87eee2177200970d",
  measurementId: "G-YG8DR4VE22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data to create collections
const sampleStudents = [
  {
    studentNumber: "2024001",
    firstName: "ישראל",
    lastName: "ישראלי",
    fullName: "ישראל ישראלי",
    email: "student@campus.ac.il",
    phone: "050-1234567",
    department: "מדעי המחשב",
    year: 2,
    status: "active"
  },
  {
    studentNumber: "2024002", 
    firstName: "שירה",
    lastName: "גולדברג",
    fullName: "שירה גולדברג",
    email: "shira.goldberg@student.ono.ac.il",
    phone: "053-4567890",
    department: "הנדסת תוכנה",
    year: 3,
    status: "active"
  }
];

async function initializeCollections() {
  try {
    console.log("🚀 Starting Firestore initialization...");
    
    // Create students collection
    console.log("📝 Creating students collection...");
    for (const student of sampleStudents) {
      await addDoc(collection(db, 'students'), student);
    }
    console.log("✅ Students collection created with", sampleStudents.length, "students");
    
    console.log("🎉 Firestore initialization completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during initialization:", error);
  }
}

// Run initialization
initializeCollections();
