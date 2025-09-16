/**
 * Firestore Collections Initialization Script
 * 
 * This script initializes all Firestore collections with demo data.
 * Run this script once to populate your Firestore database with sample data.
 * 
 * Usage:
 * 1. Import and call initializeAllCollections() from your app
 * 2. Or run this script directly in a development environment
 */

import { initializeAllCollections, testAllCollections } from '../fireStore/initializeCollections';

// Main initialization function
export async function runInitialization(): Promise<void> {
    console.log("🚀 Starting Firestore Collections Initialization...");
    console.log("=" .repeat(50));
    
    try {
        // Initialize all collections with demo data
        await initializeAllCollections();
        
        console.log("=" .repeat(50));
        console.log("🧪 Testing all collections...");
        
        // Test all collections to ensure they work correctly
        const testResults = await testAllCollections();
        
        if (testResults) {
            console.log("=" .repeat(50));
            console.log("🎉 SUCCESS! All collections initialized and tested successfully!");
            console.log("📊 Collections created:");
            console.log("   • users - User accounts and profiles");
            console.log("   • students - Student records with academic info");
            console.log("   • events - Campus events and activities");
            console.log("   • facilities - Campus facilities and their status");
            console.log("   • tasks - Academic tasks and assignments");
            console.log("   • courses - Course information and progress");
            console.log("   • messages - Communication messages");
            console.log("=" .repeat(50));
        } else {
            console.log("❌ Some collections failed testing. Please check the logs above.");
        }
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        throw error;
    }
}

// Auto-run if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    runInitialization()
        .then(() => {
            console.log("✅ Initialization completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Initialization failed:", error);
            process.exit(1);
        });
}

export default runInitialization;
