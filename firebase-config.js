// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa Auth para usarlo

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFezlQ68RTmss1HFnZyWFAmhjm8bstqAU",
  authDomain: "trackermovie-10156.firebaseapp.com",
  projectId: "trackermovie-10156",
  storageBucket: "trackermovie-10156.firebasestorage.app",
  messagingSenderId: "1062742578352",
  appId: "1:1062742578352:web:b512d48c4aba27bb449775",
  measurementId: "G-GT8CZQKM5C"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa la autenticación
const auth = getAuth(app);

export { auth }; // Exporta el objeto auth