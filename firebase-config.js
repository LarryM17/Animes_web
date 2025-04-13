
// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCoDBMuMqkdBMFPE-PTeM2gpm-suApXquE",
  authDomain: "animes-e4f26.firebaseapp.com",
  projectId: "animes-e4f26",
  storageBucket: "animes-e4f26.firebasestorage.app",
  messagingSenderId: "155204318646",
  appId: "1:155204318646:web:2df6ba726fb0ca6115fd17"
};

firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();
window.firebase = firebase;
