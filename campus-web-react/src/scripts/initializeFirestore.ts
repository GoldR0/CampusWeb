import { initializeAllCollections, testAllCollections } from '../fireStore/initializeCollections.js';

// Initialize Firestore collections with demo data
async function main() {
    console.log("🚀 Starting Firestore initialization...");
    
    try {
        // Test connection first
        console.log("🔍 Testing Firestore connection...");
        const connectionTest = await testAllCollections();
        
        if (!connectionTest) {
            console.log("❌ Firestore connection test failed. Please check your configuration.");
            return;
        }
        
        console.log("✅ Firestore connection successful!");
        
        // Initialize all collections
        console.log("📝 Initializing all collections...");
        await initializeAllCollections();
        
        console.log("🎉 Firestore initialization completed successfully!");
        
        // Test again to verify
        console.log("🧪 Running final verification...");
        const finalTest = await testAllCollections();
        
        if (finalTest) {
            console.log("✅ All collections verified and working!");
        } else {
            console.log("❌ Some collections failed verification");
        }
        
    } catch (error) {
        console.error("❌ Error during Firestore initialization:", error);
    }
}

// Run the initialization
main().then(() => {
    console.log("🏁 Initialization script completed");
    process.exit(0);
}).catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
});