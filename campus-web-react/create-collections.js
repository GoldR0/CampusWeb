const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

// Firebase configuration
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

// Sample data for all collections
const sampleData = {
  students: [
    {
      studentNumber: "2024001",
      firstName: "ישראל",
      lastName: "ישראלי",
      fullName: "ישראל ישראלי",
      email: "student@campus.ac.il",
      phone: "050-1234567",
      address: "רחוב הרצל 15, תל אביב",
      department: "מדעי המחשב",
      year: 2,
      semester: "א",
      creditsCompleted: 45,
      gpa: 3.2,
      birthDate: "2002-05-15",
      age: 22,
      gender: "male",
      city: "תל אביב",
      status: "active",
      enrollmentDate: "2023-09-01",
      lastActive: "2024-12-10",
      emergencyContact: "רחל ישראלי",
      emergencyPhone: "050-7654321",
      notes: "סטודנט מצטיין"
    },
    {
      studentNumber: "2024002",
      firstName: "שירה",
      lastName: "גולדברג",
      fullName: "שירה גולדברג",
      email: "shira.goldberg@student.ono.ac.il",
      phone: "053-4567890",
      address: "רחוב בן גוריון 8, באר שבע",
      department: "הנדסת תוכנה",
      year: 3,
      semester: "ב",
      creditsCompleted: 78,
      gpa: 3.8,
      birthDate: "2001-03-22",
      age: 23,
      gender: "female",
      city: "באר שבע",
      status: "active",
      enrollmentDate: "2022-09-01",
      lastActive: "2024-12-11",
      emergencyContact: "דוד גולדברג",
      emergencyPhone: "052-9876543"
    },
    {
      studentNumber: "2024003",
      firstName: "אבי",
      lastName: "כהן",
      fullName: "אבי כהן",
      email: "avi.cohen@student.ono.ac.il",
      phone: "054-3210987",
      address: "רחוב הרצל 42, ירושלים",
      department: "מתמטיקה",
      year: 1,
      semester: "א",
      creditsCompleted: 15,
      gpa: 3.5,
      birthDate: "2003-11-08",
      age: 21,
      gender: "male",
      city: "ירושלים",
      status: "active",
      enrollmentDate: "2024-09-01",
      lastActive: "2024-12-09",
      emergencyContact: "רחל כהן",
      emergencyPhone: "050-1111111"
    }
  ],

  events: [
    {
      title: "מיטאפ יזמות",
      description: "מפגש עם יזמים מובילים בתעשייה",
      date: "2024-12-15",
      time: "18:00",
      location: "חדר A101",
      maxParticipants: 50,
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      title: "הרצאה על בינה מלאכותית",
      description: "הרצאה מעמיקה על טכנולוגיות AI מתקדמות",
      date: "2024-12-18",
      time: "14:00",
      location: "אודיטוריום",
      maxParticipants: 100,
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      title: "סדנת פיתוח אפליקציות",
      description: "סדנה מעשית לפיתוח אפליקציות מובייל",
      date: "2024-12-20",
      time: "10:00",
      location: "מעבדה C205",
      maxParticipants: 30,
      createdAt: "2024-12-10T10:00:00Z"
    }
  ],

  tasks: [
    {
      title: "מטלת תכנות בסיסית",
      type: "assignment",
      course: "CS101",
      date: "2024-12-20",
      priority: "urgent",
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      title: "מבחן אלגוריתמים",
      type: "exam",
      course: "CS201",
      date: "2024-12-22",
      priority: "medium",
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      title: "הצגת פרויקט",
      type: "presentation",
      course: "CS301",
      date: "2024-12-25",
      priority: "low",
      createdAt: "2024-12-10T10:00:00Z"
    }
  ],

  facilities: [
    {
      name: "ספרייה",
      type: "library",
      status: "open",
      lastUpdated: "2024-12-10T10:00:00Z"
    },
    {
      name: "קפיטריה",
      type: "cafeteria",
      status: "open",
      lastUpdated: "2024-12-10T10:00:00Z"
    },
    {
      name: "חדר כושר",
      type: "gym",
      status: "busy",
      lastUpdated: "2024-12-10T10:00:00Z"
    },
    {
      name: "מעבדת מחשבים",
      type: "computer_lab",
      status: "open",
      lastUpdated: "2024-12-10T10:00:00Z"
    }
  ],

  courses: [
    {
      courseId: "CS101",
      courseName: "מבוא למדעי המחשב",
      lecturer: "ד\"ר כהן",
      semester: "a",
      year: "2025",
      students: "0",
      credits: "4",
      selectedStudents: [],
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      courseId: "CS201",
      courseName: "אלגוריתמים",
      lecturer: "פרופ' לוי",
      semester: "b",
      year: "2025",
      students: "0",
      credits: "3",
      selectedStudents: [],
      createdAt: "2024-12-10T10:00:00Z"
    },
    {
      courseId: "MATH101",
      courseName: "מתמטיקה 1",
      lecturer: "ד\"ר ישראלי",
      semester: "a",
      year: "2025",
      students: "0",
      credits: "4",
      selectedStudents: [],
      createdAt: "2024-12-10T10:00:00Z"
    }
  ],

  users: [
    {
      id: "123456789",
      name: "ישראל ישראלי",
      email: "student@campus.ac.il",
      role: "student",
      phone: "050-1234567",
      age: 22,
      city: "תל אביב",
      gender: "male"
    },
    {
      id: "987654321",
      name: "ד\"ר כהן",
      email: "lecturer@campus.ac.il",
      role: "lecturer",
      phone: "050-9876543",
      age: 45,
      city: "ירושלים",
      gender: "male"
    },
    {
      id: "4",
      name: "שירה גולדברג",
      email: "shira.goldberg@student.ono.ac.il",
      role: "student",
      phone: "053-4567890",
      age: 24,
      city: "באר שבע",
      gender: "female"
    }
  ],

  messages: [
    {
      id: "1",
      courseId: "CS101",
      studentId: "student-1",
      studentName: "ישראל ישראלי",
      message: "הודעה ראשונה בפורום הקורס",
      timestamp: "2024-12-10T10:00:00Z"
    },
    {
      id: "2",
      courseId: "CS201",
      studentId: "student-2",
      studentName: "שירה גולדברג",
      message: "שאלה לגבי המטלה השבועית",
      timestamp: "2024-12-10T11:00:00Z"
    },
    {
      id: "3",
      courseId: "MATH101",
      studentId: "student-3",
      studentName: "אבי כהן",
      message: "האם יש שיעור נוסף השבוע?",
      timestamp: "2024-12-10T12:00:00Z"
    }
  ]
};

async function createCollections() {
  console.log("🚀 Starting to create all Firestore collections...");
  
  try {
    for (const [collectionName, documents] of Object.entries(sampleData)) {
      console.log(`📝 Creating collection: ${collectionName}`);
      
      for (let i = 0; i < documents.length; i++) {
        const docData = documents[i];
        const docId = `${collectionName}-${i + 1}`;
        
        // Use setDoc with specific ID
        await setDoc(doc(db, collectionName, docId), docData);
        console.log(`  ✅ Created document: ${docId}`);
      }
      
      console.log(`✅ Collection ${collectionName} created with ${documents.length} documents`);
    }
    
    console.log("🎉 All collections created successfully!");
    console.log("🌐 Check your Firebase Console to see the new collections!");
    
  } catch (error) {
    console.error("❌ Error creating collections:", error);
  }
}

// Run the script
createCollections().then(() => {
  console.log("🏁 Script completed");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
