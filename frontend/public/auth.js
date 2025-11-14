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

const firebaseConfig = {
  apiKey: "AIzaSyDGpGaJObquI1d6KuDGAkyLjGV-SjKO10Y",
  authDomain: "avrick1.firebaseapp.com",
  projectId: "avrick1",
  storageBucket: "avrick1.firebasestorage.app",
  messagingSenderId: "897272071390",
  appId: "1:897272071390:web:c2d403ea304c601e966e4f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function showError(msg) {
  document.getElementById("error-message").innerText = msg;
}

async function signup() {
  const email1 = document.getElementById("email").value;
  const password1 = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email1, password1);
  } catch (error) {
    showError(error.message);
  }
}

async function login() {
  const email1 = document.getElementById("email").value;
  const password1 = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email1, password1);
  } catch (error) {
    showError(error.message);
  }
}

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function logout() {
  await signOut(auth);
}

// expose functions to global scope
window.signup = signup;
window.login = login;
window.googleLogin = googleLogin;
window.logout = logout;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    user.getIdToken().then((token) => console.log("TOKEN:", token));
  } else {
    console.log("Logged out");
  }
});
