document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    setupStarRating();
    loadWatchList();
});


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFezlQ68RTmss1HFnZyWFAmhjm8bstqAU",
  authDomain: "trackermovie-10156.firebaseapp.com",
  projectId: "trackermovie-10156",
  storageBucket: "trackermovie-10156.firebasestorage.app",
  messagingSenderId: "1062742578352",
  appId: "1:1062742578352:web:b512d48c4aba27bb449775",
  measurementId: "G-GT8CZQKM5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);





// Navegación entre secciones
function navigateTo(section) {
    window.location.hash = section;
}



function generateStars(score) {
    let fullStars = Math.floor(score / 2); // Estrellas completas
    let halfStar = (score % 2) >= 1 ? "⭐" : ""; // Media estrella si es necesario
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Estrellas vacías restantes

    return "⭐".repeat(fullStars) + halfStar + "☆".repeat(emptyStars);
}


// Obtener usuario logueado
const loggedUser = localStorage.getItem("loggedUser");

// Si no hay usuario logueado, redirigir a login
if (!loggedUser) {
    window.location.href = "index.html";
}

// Cargar películas solo del usuario logueado
function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.classList.add("movie-card");
        li.dataset.index = index;

        li.innerHTML = `
            <strong class="movie-title">${movie.title.toUpperCase()}</strong>
            <p>🎯 Puntaje: ${movie.score}/10</p>
            <p>⭐ ${generateStars(movie.score)}</p>
            <p>"${movie.comment}"</p>
            <p>📅 Agregada el: ${movie.addedDate}</p>
            <button onclick="editMovie(this)">✏️ Editar</button>
            <button onclick="deleteMovie(this)">🗑️ Eliminar</button>
        `;

        movieList.appendChild(li);
    });
}

// Guardar película en la lista del usuario logueado
function addMovie() {
    const title = document.getElementById("movieTitleVistas").value.trim();
    const scoreInput = document.getElementById("movieScore");
    let score = parseFloat(scoreInput.value);
    const comment = document.getElementById("movieComment").value.trim();

    if (!title || isNaN(score) || score < 1 || score > 10 || !comment) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    score = score.toFixed(1);

    const movie = {
        title: title,
        score: score,
        stars: generateStars(score),
        comment: comment,
        addedDate: new Date().toLocaleDateString()
    };

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    movies.push(movie);
    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));

    loadMovies(); 

    document.getElementById("movieTitleVistas").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("movieComment").value = "";
}

// Cerrar sesión
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

function editMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    const loggedUser = localStorage.getItem("loggedUser");

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    let movie = movies[index];

    // Crear inputs para la edición en línea
    movieCard.innerHTML = `
        <input type="text" value="${movie.title}" class="edit-title">
        <input type="number" value="${movie.score}" step="0.1" min="1" max="10" class="edit-score">
        <textarea class="edit-comment">${movie.comment}</textarea>
        
        <button onclick="saveMovie(${index}, this)">Guardar</button>
        <button onclick="loadMovies()">Cancelar</button>
    `;
}

function saveMovie(index, button) {
    const loggedUser = localStorage.getItem("loggedUser");
    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    const movieCard = button.parentElement;

    // Obtener los valores editados
    let newTitle = movieCard.querySelector(".edit-title").value.trim();
    let newScore = parseFloat(movieCard.querySelector(".edit-score").value);
    let newComment = movieCard.querySelector(".edit-comment").value.trim();

    // Validar el puntaje
    if (isNaN(newScore) || newScore < 1 || newScore > 10) {
        alert("El puntaje debe estar entre 1.0 y 10.0.");
        return;
    }

    // Redondear a un decimal para mantener consistencia
    newScore = newScore.toFixed(1);

    // Actualizar los datos
    movies[index].title = newTitle;
    movies[index].score = newScore;
    movies[index].stars = generateStars(newScore);
    movies[index].comment = newComment;

    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));
    loadMovies();
}

// Eliminar película

function deleteMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    const loggedUser = localStorage.getItem("loggedUser");

    let movies = JSON.parse(localStorage.getItem(`movies_${loggedUser}`)) || [];
    movies.splice(index, 1);

    localStorage.setItem(`movies_${loggedUser}`, JSON.stringify(movies));
    loadMovies();
}

// Configurar la calificación con estrellas
function setupStarRating() {
    let starsContainer = document.getElementById("starRating");
    if (!starsContainer) return;

    starsContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        let star = document.createElement("span");
        star.innerHTML = "★";
        star.classList.add("star");
        star.dataset.value = i;

        star.addEventListener("click", () => {
            document.querySelectorAll("#starRating .star").forEach(s => s.classList.remove("active"));
            for (let j = 0; j < i; j++) {
                document.querySelectorAll("#starRating .star")[j].classList.add("active");
            }
        });

        starsContainer.appendChild(star);
    }
}



// Agregar película a la lista de "por ver"
function addToWatchList() {
    const title = document.getElementById('movieTitleAgregar').value.trim();
    const loggedUser = localStorage.getItem("loggedUser");

    if (!title) {
        alert("Ingrese un nombre válido.");
        return;
    }

    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];
    watchList.push(title);
    localStorage.setItem(`watchList_${loggedUser}`, JSON.stringify(watchList));

    loadWatchList();
    document.getElementById('movieTitleAgregar').value = '';
}

// Cargar la lista de "por ver"
function loadWatchList() {
    const loggedUser = localStorage.getItem("loggedUser");
    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];
    const list = document.getElementById('watchList');
    list.innerHTML = '';

    watchList.forEach(title => {
        const item = document.createElement('li');
        item.classList.add('watch-card');
        item.innerHTML = `
            <p>${title}</p>
            <button onclick="removeFromWatchList(this)">Eliminar</button>
        `;
        list.appendChild(item);
    });
}

// Eliminar película de la lista de "por ver"
function removeFromWatchList(button) {
    const loggedUser = localStorage.getItem("loggedUser");
    let watchList = JSON.parse(localStorage.getItem(`watchList_${loggedUser}`)) || [];
    let title = button.parentElement.querySelector("p").textContent;

    watchList = watchList.filter(movie => movie !== title);
    localStorage.setItem(`watchList_${loggedUser}`, JSON.stringify(watchList));
    loadWatchList();
}

function searchMovie() {
    const query = document.getElementById("searchMovie").value.toLowerCase();
    const movies = document.querySelectorAll("#movieList li");

    movies.forEach(movie => {
        const title = movie.querySelector(".movie-title").textContent.toLowerCase();
        movie.style.display = title.includes(query) ? "block" : "none";
    });
}

// Verificar la ruta al cargar la página
window.addEventListener('hashchange', checkRoute);
window.addEventListener('load', () => {
    checkRoute();
    setupStarRating();
    loadWatchList();
    loadMovies();
});