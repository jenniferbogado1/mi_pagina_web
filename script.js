document.addEventListener("DOMContentLoaded", () => {
    loadMovies();

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
});

function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let score = document.getElementById("movieScore").value;
    let starRating = document.getElementById("starRating").dataset.rating || 0;

    if (title === "" || score < 1 || score > 10) {
        alert("Por favor, ingrese un nombre válido y un puntaje entre 1 y 10.");
        return;
    }

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.push({ title, score, starRating });
    localStorage.setItem("movies", JSON.stringify(movies));

    document.getElementById("movieTitle").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("starRating").dataset.rating = 0;
    document.querySelectorAll(".star").forEach(star => star.classList.remove("active"));

    loadMovies();
}

function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    movies.forEach((movie, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${movie.title}</strong> - Puntaje: ${movie.score}/10 - 
                        <span class="stars">${"★".repeat(movie.starRating)}${"☆".repeat(5 - movie.starRating)}</span>
                        <button onclick="deleteMovie(${index})">Eliminar</button>`;
        movieList.appendChild(li);
    });
}

function deleteMovie(index) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.splice(index, 1);
    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}
                        
