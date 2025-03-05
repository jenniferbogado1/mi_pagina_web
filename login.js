
// Usuarios predefinidos
const users = {
    "user": { password: "1234", role: "user" },
    "admin": { password: "admin", role: "admin" }
};

// Función para iniciar sesión
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("login-error");

    // Limpiar el mensaje de error antes de intentar iniciar sesión
    errorMsg.style.display = "none"; 

    if (users[username] && users[username].password === password) {
        // Guardar usuario en sesión
        localStorage.setItem("loggedUser", username);
        window.location.href = "menu.html"; // Redirigir a la página de películas
    } else {
        errorMsg.style.display = "block"; // Mostrar mensaje de error si las credenciales son incorrectas
    }
}

// Verificar si ya hay sesión activa
if (localStorage.getItem("loggedUser")) {
    window.location.href = "menu.html"; // Si ya está logueado, redirige automáticamente
}
