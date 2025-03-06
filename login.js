// login.js
import { auth } from './firebase-config.js'; // Importa auth desde firebase-config.js
import { signInWithEmailAndPassword } from "firebase/auth"; // Importa la función para hacer login

// Función de login usando Firebase
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("login-error");

  // Usamos Firebase Auth para autenticar al usuario
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // El usuario ha iniciado sesión correctamente
      const user = userCredential.user;
      localStorage.setItem("loggedUser", user.uid); // Guardamos el UID en el localStorage
      window.location.href = "menu.html"; // Redirigir a la página del menú
    })
    .catch((error) => {
      // Si hay un error (usuario o contraseña incorrectos)
      errorMsg.style.display = "block";
      console.error(error.message);
    });
}

// Verificar si ya hay sesión activa
if (localStorage.getItem("loggedUser")) {
  window.location.href = "menu.html"; // Redirige automáticamente si ya está logueado
}