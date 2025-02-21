document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    setupStarRating();
});

// Función para cargar películas desde localStorage

function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    movies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.dataset.index = index;

        li.innerHTML = `
            <img src="${movie.poster}" alt="Póster de ${movie.title}" class="poster-img">
            <input type="text" value="${movie.title}" class="edit-title" disabled>
            <input type="number" value="${movie.score}" class="edit-score" min="1" max="10" disabled>
            <div class="stars-container" data-index="${index}">${generateStars(movie.starRating)}</div>
            <span>Agregada el: ${movie.addedDate}</span>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}

// Función para buscar películas
function searchMovies() {
    loadMovies();
}

// Función para agregar una nueva película
function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let score = document.getElementById("movieScore").value;
    let starRating = document.getElementById("starRating").dataset.rating || 0;
    let poster = document.querySelector("#posterPreview img")?.src || ""; // Obtener el póster si existe

    if (title === "" || score < 1 || score > 10) {
        alert("Por favor, ingrese un nombre válido y un puntaje entre 1 y 10.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let addedDate = new Date().toLocaleDateString();
    movies.push({ title, score, starRating: parseInt(starRating), addedDate, poster });
    localStorage.setItem("movies", JSON.stringify(movies));

    document.getElementById("movieTitle").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("starRating").dataset.rating = 0;
    document.getElementById("posterPreview").innerHTML = ""; // Limpiar el póster
    document.querySelectorAll("#starRating .star").forEach(star => star.classList.remove("active"));

    loadMovies();
}

// Función para eliminar películas
function deleteMovie(index) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.splice(index, 1);
    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}

// Función para editar una película
function editMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    li.querySelector(".edit-title").disabled = false;
    li.querySelector(".edit-score").disabled = false;
    li.querySelector("button:nth-child(5)").style.display = "none"; // Oculta "Editar"
    li.querySelector("button:nth-child(6)").style.display = "inline-block"; // Muestra "Guardar"
}

// Función para guardar la edición de una película
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
    
    // ✅ Mantener la fecha original al editar
    let originalDate = movies[index].addedDate || new Date().toLocaleDateString();

    movies[index] = { 
        title: newTitle, 
        score: newScore, 
        starRating: newStars, 
        addedDate: originalDate,  // 🔥 Se mantiene la fecha original
        poster: movies[index].poster // 🔥 Mantiene el póster original si existe
    };

    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}


// Función para generar estrellas visualmente
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

// Configuración del sistema de estrellas en el formulario
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



async function searchMovieFromAPI(title) {
    const apiKey =  'dbd32ea66d8c5fcd290b231b56374d89';// Reemplaza con tu clave de API
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.results && data.results.length > 0) {
            let movie = data.results[0]; // Obtener la primera película encontrada
            return {
                title: movie.title,
                releaseDate: movie.release_date,
                rating: movie.vote_average,
                poster: `https://image.tmdb.org/t/p/w200${movie.poster_path}` // Imagen del póster
            };
        } else {
            alert("No se encontraron resultados.");
            return null;
        }
    } catch (error) {
        console.error("Error al buscar la película:", error);
    }
}

// Evento para buscar automáticamente la película en la API al escribir
document.getElementById("movieTitle").addEventListener("change", async function () {
    let title = this.value;
    let movieData = await searchMovieFromAPI(title);

    if (movieData) {
        document.getElementById("movieScore").value = movieData.rating.toFixed(1); // Asigna la puntuación de la API
        document.getElementById("starRating").dataset.rating = Math.round(movieData.rating / 2); // Escalar de 10 a 5 estrellas
        document.querySelectorAll(".star").forEach(star => star.classList.remove("active"));
        for (let i = 0; i < Math.round(movieData.rating / 2); i++) {
            document.querySelectorAll(".star")[i].classList.add("active");
        }

        // Mostrar la imagen del póster
        let posterContainer = document.getElementById("posterPreview");
        posterContainer.innerHTML = `<img src="${movieData.poster}" alt="Póster de ${movieData.title}">`;
    }
});



