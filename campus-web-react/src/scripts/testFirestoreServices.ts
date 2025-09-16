// Test script to verify all Firestore services are working correctly
import { initializeAllCollections, testAllCollections } from '../fireStore/initializeCollections';

async function testFirestoreServices() {
    console.log("🧪 Starting Firestore services test...");
    
    try {
        // Test all collections connectivity
        console.log("\n📡 Testing collections connectivity...");
        const connectivityTest = await testAllCollections();
        
        if (connectivityTest) {
            console.log("✅ All collections are accessible!");
        } else {
            console.log("❌ Some collections failed connectivity test");
            return;
        }
        
        // Initialize all collections with demo data
        console.log("\n🚀 Initializing collections with demo data...");
        await initializeAllCollections();
        
        console.log("\n🎉 All Firestore services are working correctly!");
        console.log("📊 Collections created:");
        console.log("   - users");
        console.log("   - students");
        console.log("   - events");
        console.log("   - facilities");
        console.log("   - tasks");
        console.log("   - courses");
        console.log("   - messages");
        
    } catch (error) {
        console.error("❌ Error testing Firestore services:", error);
    }
}

// Export for use in other files
export { testFirestoreServices };

// Run if this file is executed directly
if (require.main === module) {
    testFirestoreServices();
}
