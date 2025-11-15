// Firebase imports for authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show error message in the UI
function showError(msg) {
  const errorElement = document.getElementById("error-message");
  errorElement.innerText = msg;

  // Auto-clear error after 5 seconds
  setTimeout(() => {
    errorElement.innerText = "";
  }, 5000);
}

// Switch between Login and Signup tabs
window.switchTab = function(tab) {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }

  // Clear error message when switching tabs
  document.getElementById("error-message").innerText = "";
};

// Create new user account with email and password
async function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Basic validation
  if (!email || !password || !confirmPassword) {
    showError("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token to send to backend
    const idToken = await user.getIdToken();

    // Call backend signup endpoint to store user in MongoDB
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to complete signup on server");
    }

    console.log("Signup successful");
    // Redirect to dashboard after successful signup
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.error("Signup error:", error);
    showError(error.message);
  }
}

// Login existing user with email and password
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("Please enter email and password");
    return;
  }

  try {
    // Sign in with Firebase
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful");
    // Redirect to dashboard
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    // User-friendly error messages
    if (error.code === "auth/user-not-found") {
      showError("No account found with this email");
    } else if (error.code === "auth/wrong-password") {
      showError("Incorrect password");
    } else if (error.code === "auth/invalid-email") {
      showError("Invalid email address");
    } else {
      showError(error.message);
    }
  }
}

// Login with Google popup
async function googleLogin() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get ID token
    const idToken = await user.getIdToken();

    // Try to register user in backend (if new user)
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });
    } catch (err) {
      // Ignore error if user already exists
      console.log("User may already exist in database");
    }

    console.log("Google login successful");
    // Redirect to dashboard
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.error("Google login error:", error);
    showError(error.message);
  }
}

// Logout function (not used on this page, but available)
async function logout() {
  await signOut(auth);
  console.log("Logged out");
}

// Expose functions to global scope for onclick handlers
window.signup = signup;
window.login = login;
window.googleLogin = googleLogin;
window.logout = logout;

// Listen to auth state changes
// If user is already logged in, redirect to dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User already logged in:", user.email);
    // Uncomment to auto-redirect if already logged in
    // window.location.href = "/dashboard.html";
  } else {
    console.log("No user logged in");
  }
});
