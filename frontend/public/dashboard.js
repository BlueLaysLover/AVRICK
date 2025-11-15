// Firebase imports for authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGpGaJObquI1d6KuDGAkyLjGV-SjKO10Y",
  authDomain: "avrick1.firebaseapp.com",
  projectId: "avrick1",
  storageBucket: "avrick1.firebasestorage.app",
  messagingSenderId: "897272071390",
  appId: "1:897272071390:web:c2d403ea304c601e966e4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global variables for session management
let currentUser = null;
let idToken = null;
let activeSessionId = null;
let sessionStartTime = null;
let timerInterval = null;

// Logout function
window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout");
  }
};

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
  if (!sessionStartTime) return;

  const now = new Date();
  const elapsedSeconds = Math.floor((now - sessionStartTime) / 1000);

  document.getElementById("timerDisplay").textContent = formatTime(elapsedSeconds);
}

// Start a new study session
window.startSession = async function() {
  if (!idToken) {
    alert("Please log in first");
    return;
  }

  const notes = document.getElementById("sessionNotes").value;

  try {
    // Call backend API to start session
    const response = await fetch("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        notes: notes,
        startTime: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to start session");
    }

    const data = await response.json();
    activeSessionId = data.sessionId;

    // Update UI
    sessionStartTime = new Date();
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("endBtn").classList.remove("hidden");
    document.getElementById("timerLabel").textContent = "Session in progress...";

    // Start timer
    timerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay();

    console.log("Session started:", data);
  } catch (error) {
    console.error("Start session error:", error);
    alert(error.message);
  }
};

// End the active study session
window.endSession = async function() {
  if (!idToken || !activeSessionId) {
    alert("No active session");
    return;
  }

  try {
    // Call backend API to end session
    const response = await fetch("/api/session/end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        sessionId: activeSessionId,
        endTime: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Failed to end session");
    }

    const data = await response.json();

    // Stop timer
    clearInterval(timerInterval);
    timerInterval = null;

    // Update UI
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("endBtn").classList.add("hidden");
    document.getElementById("timerDisplay").textContent = "00:00:00";
    document.getElementById("timerLabel").textContent = `Great work! You studied for ${data.duration} minutes`;
    document.getElementById("sessionNotes").value = "";

    // Reset session variables
    activeSessionId = null;
    sessionStartTime = null;

    // Reload today's stats
    loadTodayStats();

    console.log("Session ended:", data);
  } catch (error) {
    console.error("End session error:", error);
    alert("Failed to end session");
  }
};

// Load today's stats from backend (placeholder - you'll implement this later)
async function loadTodayStats() {
  // For now, just display static values
  // You can implement a backend API to fetch user stats

  // Example: fetch user data and calculate today's minutes
  // This would call GET /api/user/stats or similar endpoint

  document.getElementById("todayMinutes").textContent = "0";
  document.getElementById("streakDays").textContent = "0";
  document.getElementById("totalHours").textContent = "0";
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    idToken = await user.getIdToken();

    // Update welcome message with user's name or email
    const firstName = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
    document.getElementById("welcomeMessage").textContent = `Welcome back, ${firstName}`;

    // Load user's stats
    loadTodayStats();

    console.log("User authenticated:", user.email);
  } else {
    // No user logged in, redirect to login page
    window.location.href = "/login.html";
  }
});
