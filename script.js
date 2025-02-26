document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    loadWatchList();
    setupStarRating();
});

// Cargar películas vistas desde localStorage
function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.dataset.index = index;

        li.innerHTML = `
            <img src="${movie.poster}" alt="Póster de ${movie.title}" class="poster-img">
	        <span class="popcorn">🍿</span> 
            <input type="text" value="${movie.title}" class="edit-title" disabled>
            <div class="stars-container" data-index="${index}">${generateStars(movie.starRating)}</div>
            <p>🎯 Puntaje: ${movie.score}/10</p>
            <span>📅 Agregada el: ${movie.addedDate}</span>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}

// Agregar una película a "Películas Vistas"
function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let starRating = document.getElementById("starRating").dataset.rating || 0;
    let score = parseInt(prompt("¿Qué puntaje le das a la película? (1-10)"));
    let poster = document.querySelector("#posterPreview img")?.src || ""; 

    if (title === "" || isNaN(score) || score < 1 || score > 10) {
        alert("Por favor, ingrese un título válido y un puntaje entre 1 y 10.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let addedDate = new Date().toLocaleDateString();
    movies.push({ title, starRating: parseInt(starRating), score, addedDate, poster });
    localStorage.setItem("movies", JSON.stringify(movies));

    document.getElementById("movieTitle").value = "";
    document.getElementById("starRating").dataset.rating = 0;
    document.getElementById("posterPreview").innerHTML = ""; 

    loadMovies();
}

// Editar película vista
function editMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    li.querySelector(".edit-title").disabled = false;
    li.querySelector(".stars-container").dataset.editing = "true";
    li.querySelector("button[onclick^='editMovie']").style.display = "none";
    li.querySelector("button[onclick^='saveMovie']").style.display = "inline-block";
}

// Guardar edición de película vista
function saveMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    let newTitle = li.querySelector(".edit-title").value.trim();
    let newStars = li.querySelectorAll(".stars-container .star.active").length;
    let newScore = parseInt(prompt("Ingrese el nuevo puntaje (1-10):"));

    if (newTitle === "" || isNaN(newScore) || newScore < 1 || newScore > 10) {
        alert("Datos inválidos.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    
    let originalDate = movies[index].addedDate || new Date().toLocaleDateString();

    movies[index] = { 
        title: newTitle, 
        starRating: newStars, 
        score: newScore,
        addedDate: originalDate,
        poster: movies[index].poster 
    };

    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}

// Generar estrellas visualmente
function generateStars(starRating) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="star ${i < starRating ? "active" : ""}" data-value="${i + 1}">★</span>`
    ).join("");
}

// Activar selección de estrellas
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

// Configurar sistema de estrellas en formulario
function setupStarRating() {
    let starsContainer = document.getElementById("starRating");
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
            starsContainer.dataset.rating = i;
        });

        starsContainer.appendChild(star);
    }
}