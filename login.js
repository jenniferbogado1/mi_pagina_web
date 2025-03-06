// Importa los módulos necesarios de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Función para iniciar sesión
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("login-error");

    // Limpiar el mensaje de error antes de intentar iniciar sesión
    errorMsg.style.display = "none"; 

    if (!username || !password) {
        errorMsg.style.display = "block"; // Usuario o contraseña vacíos
        return;
    }

    try {
        // Verificar usuario en Firestore
        const userDoc = await getDoc(doc(db, "usuarios", username));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.password === password) {
                // Guardar usuario en sesión
                localStorage.setItem("loggedUser", username);
                window.location.href = "menu.html"; // Redirigir a la página de películas
            } else {
                errorMsg.style.display = "block"; // Contraseña incorrecta
            }
        } else {
            errorMsg.style.display = "block"; // Usuario no encontrado
        }
    } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        errorMsg.style.display = "block"; // Error al conectarse con Firestore
    }
}

// Verificar si ya hay sesión activa
if (localStorage.getItem("loggedUser")) {
    window.location.href = "menu.html"; // Si ya está logueado, redirige automáticamente
}