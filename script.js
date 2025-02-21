
document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    setupStarRating();
});

// Función para cargar películas desde localStorage
function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.dataset.index = index;

        li.innerHTML = `
            <input type="text" value="${movie.title}" class="edit-title" disabled>
            <input type="number" value="${movie.score}" class="edit-score" min="1" max="10" disabled>
            <div class="stars-container" data-index="${index}">${generateStars(movie.starRating)}</div>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}

function editMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    li.querySelector(".edit-title").disabled = false;
    li.querySelector(".edit-score").disabled = false;
    li.querySelector("button:nth-child(5)").style.display = "none"; // Oculta "Editar"
    li.querySelector("button:nth-child(6)").style.display = "inline-block"; // Muestra "Guardar"
}

function saveMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    let newTitle = li.querySelector(".edit-title").value.trim();
    let newScore = li.querySelector(".edit-score").value;
    let newStars = li.querySelectorAll(".stars-container .active").length;

    if (newTitle === "" || newScore < 1 || newScore > 10) {
        alert("Ingrese un nombre válido y un puntaje entre 1 y 10.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies[index] = { title: newTitle, score: newScore, starRating: newStars };
    localStorage.setItem("movies", JSON.stringify(movies));

    loadMovies();
}        

// Función para generar las estrellas visualmente
function generateStars(starRating) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="star ${i < starRating ? "active" : ""}" data-value="${i + 1}">★</span>`
    ).join("");
}

// Función para activar las estrellas cuando se edita
function setupStarClickEvents() {
    document.querySelectorAll(".stars-container").forEach(container => {
        container.querySelectorAll(".star").forEach(star => {
            star.addEventListener("click", function () {
                let index = container.dataset.index;
                document.querySelectorAll(`li[data-index="${index}"] .star`).forEach(s => s.classList.remove("active"));
                for (let j = 0; j < this.dataset.value; j++) {
                    document.querySelectorAll(`li[data-index="${index}"] .star`)[j].classList.add("active");
                }
            });
        });
    });
}
}


// Modificar la función `addMovie` para que guarde en localStorage
function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let score = document.getElementById("movieScore").value;
    let starRating = document.getElementById("starRating").dataset.rating || 0;

    if (title === "" || score < 1 || score > 10) {
        alert("Por favor, ingrese un nombre válido y un puntaje entre 1 y 10.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.push({ title, score, starRating: parseInt(starRating) });
    localStorage.setItem("movies", JSON.stringify(movies));

    document.getElementById("movieTitle").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("starRating").dataset.rating = 0;
    document.querySelectorAll(".star").forEach(star => star.classList.remove("active"));

    loadMovies();
}

// Función para eliminar películas
function deleteMovie(index) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.splice(index, 1);
    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}

// Configuración del sistema de estrellas
function setupStarRating() {
    let starsContainer = document.getElementById("starRating");
    starsContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        let star = document.createElement("span");
        star.innerHTML = "★";
        star.classList.add("star");
        star.dataset.value = i;

        star.addEventListener("click", () => {
            document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
            for (let j = 0; j < i; j++) {
                document.querySelectorAll(".star")[j].classList.add("active");
            }
            starsContainer.dataset.rating = i;
        });

        starsContainer.appendChild(star);
    }
}
