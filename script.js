document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
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
            <div class="stars-container" data-index="${index}" data-editable="false">
                ${generateStars(movie.starRating, index)}
            </div>
            <p>🎯 Puntaje: <span class="movie-score">${movie.starRating}</span>/5</p>
            <span>📅 Agregada el: ${movie.addedDate}</span>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}

// Agregar una película
function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let starRating = document.getElementById("starRating").dataset.rating || 0;
    let poster = document.querySelector("#posterPreview img")?.src || ""; 

    if (title === "") {
        alert("Por favor, ingrese un título válido.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let addedDate = new Date().toLocaleDateString();
    movies.push({ title, starRating: parseInt(starRating), addedDate, poster });
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
    li.querySelector(".stars-container").dataset.editable = "true";
    li.querySelector("button[onclick^='editMovie']").style.display = "none";
    li.querySelector("button[onclick^='saveMovie']").style.display = "inline-block";
}

// Guardar edición de película vista
function saveMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    let newTitle = li.querySelector(".edit-title").value.trim();
    let newStars = li.querySelectorAll(".stars-container .star.active").length;

    if (newTitle === "") {
        alert("El título no puede estar vacío.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let originalDate = movies[index].addedDate || new Date().toLocaleDateString();

    movies[index] = { 
        title: newTitle, 
        starRating: newStars, 
        addedDate: originalDate,
        poster: movies[index].poster 
    };

    localStorage.setItem("movies", JSON.stringify(movies));

    // Actualizar visualmente sin recargar
    li.querySelector(".movie-score").textContent = newStars;
    li.querySelector(".stars-container").dataset.editable = "false";
    
    // Restaurar botones
    li.querySelector(".edit-title").disabled = true;
    li.querySelector("button[onclick^='editMovie']").style.display = "inline-block";
    li.querySelector("button[onclick^='saveMovie']").style.display = "none";

    setupStarClickEvents();
}

// Generar estrellas visualmente
function generateStars(starRating, index) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="star ${i < starRating ? "active" : ""}" data-value="${i + 1}" data-index="${index}">★</span>`
    ).join("");
}

// Activar selección de estrellas
function setupStarClickEvents() {
    document.querySelectorAll(".stars-container").forEach(container => {
        if (container.dataset.editable === "true") {
            container.querySelectorAll(".star").forEach(star => {
                star.addEventListener("click", function () {
                    let index = this.dataset.index;
                    let value = this.dataset.value;

                    let li = document.querySelector(`li[data-index="${index}"]`);
                    li.querySelectorAll(".star").forEach(s => s.classList.remove("active"));

                    for (let j = 0; j < value; j++) {
                        li.querySelectorAll(".star")[j].classList.add("active");
                    }

                    // Actualizar visualmente el puntaje
                    li.querySelector(".movie-score").textContent = value;
                });
            });
        }
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