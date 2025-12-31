// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Project: Fedup Cup
// Admin: steveeski@gmail.com
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyDtZdB4SEVUlVcdlsWp1IKwKMqh8orpwqM",
    authDomain: "fedup-cup-1d36d.firebaseapp.com",
    databaseURL: "https://fedup-cup-1d36d-default-rtdb.firebaseio.com",
    projectId: "fedup-cup-1d36d",
    storageBucket: "fedup-cup-1d36d.firebasestorage.app",
    messagingSenderId: "263126614674",
    appId: "1:263126614674:web:d41e1dc77c066b17215c4b",
    measurementId: "G-9ZQKG1V9RK"
};

// Admin password
const ADMIN_PASSWORD = "steveisgreat";

// Initialize Firebase
let db = null;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    showStatus("Firebase configuration error. Please check your settings.", "error");
}

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let isAdmin = false;
let currentTournament = null;
let wizardState = {
    step: 1,
    winnerPick: null,
    altWinner: null,
    alternate1: null,
    alternate2: null,
    tiebreaker: null,
    basePlayers: []
};

// ============================================
// FIREBASE SETUP INSTRUCTIONS
// ============================================
/*
To set up Firebase for this project:

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing "Fedup Cup" project
3. Enable Realtime Database:
   - Go to Build > Realtime Database
   - Click "Create Database"
   - Start in "test mode" (we'll add security rules later)
   - Choose location (us-central1 recommended)

4. Get your configuration:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register app as "Fedup Cup Golf Pickem"
   - Copy the firebaseConfig object
   - Replace the placeholder values above

5. Set up initial data structure:
   - Go to Realtime Database
   - Click the three dots > Import JSON
   - Import the initial tournament data (or use admin panel to add)

6. Security Rules (after testing):
{
  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    },
    "tournaments": {
      ".read": true,
      ".write": false
    },
    "picks": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid || auth.uid === 'admin'"
      }
    },
    "leaderboards": {
      ".read": true,
      ".write": false
    }
  }
}
*/
