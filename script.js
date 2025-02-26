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
            <span>Agregada el: ${movie.addedDate}</span>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}

// Cargar lista de películas por ver
function loadWatchList() {
    let watchList = document.getElementById("watchList");
    watchList.innerHTML = "";
    let movies = JSON.parse(localStorage.getItem("watchList")) || [];

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.dataset.index = index;
        li.innerHTML = `
            <input type="text" value="${movie.title}" class="edit-title" disabled>
            <button onclick="editWatchMovie(${index})">Editar</button>
            <button onclick="saveWatchMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteWatchMovie(${index})">Eliminar</button>
        `;

        watchList.appendChild(li);
    });
}

// Agregar una película a "Películas Vistas"
function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let starRating = document.getElementById("starRating").dataset.rating || 0;
    let poster = document.querySelector("#posterPreview img")?.src || ""; 

    if (title === "") {
        alert("Por favor, ingrese un nombre válido.");
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

// Agregar una película a "Por Ver"
function addToWatchList() {
    let title = document.getElementById("movieTitle").value.trim();

    if (title === "") {
        alert("Por favor, ingrese un nombre válido.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("watchList")) || [];
    movies.push({ title });
    localStorage.setItem("watchList", JSON.stringify(movies));

    document.getElementById("movieTitle").value = "";
    loadWatchList();
}

// Eliminar películas vistas
function deleteMovie(index) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.splice(index, 1);
    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}

// Eliminar películas por ver
function deleteWatchMovie(index) {
    let movies = JSON.parse(localStorage.getItem("watchList")) || [];
    movies.splice(index, 1);
    localStorage.setItem("watchList", JSON.stringify(movies));
    loadWatchList();
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

    if (newTitle === "") {
        alert("Ingrese un nombre válido.");
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
    loadMovies();
}

// Editar película de "Por Ver"
function editWatchMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    li.querySelector(".edit-title").disabled = false;
    li.querySelector("button[onclick^='editWatchMovie']").style.display = "none";
    li.querySelector("button[onclick^='saveWatchMovie']").style.display = "inline-block";
}

// Guardar edición de película "Por Ver"
function saveWatchMovie(index) {
    let li = document.querySelector(`li[data-index="${index}"]`);
    let newTitle = li.querySelector(".edit-title").value.trim();

    if (newTitle === "") {
        alert("Ingrese un nombre válido.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("watchList")) || [];
    movies[index].title = newTitle;

    localStorage.setItem("watchList", JSON.stringify(movies));
    loadWatchList();
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