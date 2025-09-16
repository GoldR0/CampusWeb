import { demoUsers, demoEvents, demoFacilities, demoTasks } from "../data/demoData";
import { addUser } from "./usersService";
import { addEvent } from "./eventsService";
import { addFacility } from "./facilitiesService";
import { addTask } from "./tasksService";
import { addCourse } from "./coursesService";
import { addMessage } from "./messagesService";
import { addStudent } from "./studentsService";
import { Course, Message, Student } from "../types";

// Demo Courses data
const demoCourses: Course[] = [
    {
        id: "1",
        name: "מתמטיקה 1",
        code: "MATH101",
        instructor: "ד\"ר כהן",
        credits: 4,
        status: "active",
        progress: 75
    },
    {
        id: "2",
        name: "פיזיקה 1",
        code: "PHYS101",
        instructor: "פרופ' לוי",
        credits: 4,
        status: "active",
        progress: 60
    },
    {
        id: "3",
        name: "תכנות מתקדם",
        code: "CS201",
        instructor: "ד\"ר ישראלי",
        credits: 3,
        status: "active",
        progress: 40
    },
    {
        id: "4",
        name: "מבני נתונים",
        code: "CS202",
        instructor: "ד\"ר כהן",
        credits: 3,
        status: "upcoming",
        progress: 0
    }
];

// Demo Messages data
const demoMessages: Message[] = [
    {
        id: "1",
        sender: "ד\"ר כהן",
        content: "שלום לכולם, מבחן המתמטיקה יתקיים ביום ראשון בשעה 10:00",
        timestamp: "2024-12-10T09:00:00Z",
        courseId: "1"
    },
    {
        id: "2",
        sender: "פרופ' לוי",
        content: "תזכורת: יש להגיש את העבודה בפיזיקה עד יום חמישי",
        timestamp: "2024-12-10T14:30:00Z",
        courseId: "2"
    },
    {
        id: "3",
        sender: "ד\"ר ישראלי",
        content: "השיעור הבא יתקיים במעבדה C205",
        timestamp: "2024-12-11T08:00:00Z",
        courseId: "3"
    }
];

// Demo Students data (using the new Student type)
const demoStudents: Student[] = [
    {
        id: "1",
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
        id: "2",
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
        id: "3",
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
];

export async function initializeAllCollections(): Promise<void> {
    console.log("🚀 Starting to initialize all Firestore collections...");
    
    try {
        // Initialize Users collection
        console.log("📝 Initializing Users collection...");
        for (const user of Object.values(demoUsers)) {
            await addUser(user);
        }
        console.log("✅ Users collection initialized with", Object.keys(demoUsers).length, "users");

        // Initialize Students collection
        console.log("👨‍🎓 Initializing Students collection...");
        for (const student of demoStudents) {
            await addStudent(student);
        }
        console.log("✅ Students collection initialized with", demoStudents.length, "students");

        // Initialize Events collection
        console.log("📅 Initializing Events collection...");
        for (const event of demoEvents) {
            await addEvent(event);
        }
        console.log("✅ Events collection initialized with", demoEvents.length, "events");

        // Initialize Facilities collection
        console.log("🏢 Initializing Facilities collection...");
        for (const facility of demoFacilities) {
            await addFacility(facility);
        }
        console.log("✅ Facilities collection initialized with", demoFacilities.length, "facilities");

        // Initialize Tasks collection
        console.log("📋 Initializing Tasks collection...");
        for (const task of demoTasks) {
            await addTask(task);
        }
        console.log("✅ Tasks collection initialized with", demoTasks.length, "tasks");

        // Initialize Courses collection
        console.log("📚 Initializing Courses collection...");
        for (const course of demoCourses) {
            await addCourse(course);
        }
        console.log("✅ Courses collection initialized with", demoCourses.length, "courses");

        // Initialize Messages collection
        console.log("💬 Initializing Messages collection...");
        for (const message of demoMessages) {
            await addMessage(message);
        }
        console.log("✅ Messages collection initialized with", demoMessages.length, "messages");

        console.log("🎉 All collections initialized successfully!");
        
    } catch (error) {
        console.error("❌ Error initializing collections:", error);
        throw error;
    }
}

export async function testAllCollections(): Promise<boolean> {
    console.log("🧪 Testing all Firestore collections...");
    
    try {
        const { testUsersCollection } = await import("./usersService");
        const { testEventsCollection } = await import("./eventsService");
        const { testFacilitiesCollection } = await import("./facilitiesService");
        const { testTasksCollection } = await import("./tasksService");
        const { testCoursesCollection } = await import("./coursesService");
        const { testMessagesCollection } = await import("./messagesService");
        const { testFirestoreConnection } = await import("./studentsService");

        const results = await Promise.all([
            testUsersCollection(),
            testEventsCollection(),
            testFacilitiesCollection(),
            testTasksCollection(),
            testCoursesCollection(),
            testMessagesCollection(),
            testFirestoreConnection()
        ]);

        const allPassed = results.every(result => result === true);
        
        if (allPassed) {
            console.log("✅ All collections are accessible and working correctly!");
        } else {
            console.log("❌ Some collections failed the test");
        }
        
        return allPassed;
    } catch (error) {
        console.error("❌ Error testing collections:", error);
        return false;
    }
}
