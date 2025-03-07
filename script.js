
document.addEventListener("DOMContentLoaded", () => {

    loadMovies();
    setupStarRating();
    loadWatchList();
});


function navigateTo(section) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(section).style.display = "block";
    window.location.hash = section;
}


function generateStars(score) {
    let stars = Math.round(parseFloat(score) / 2); // Redondeo adecuado
    return "★".repeat(stars) + "☆".repeat(5 - stars);
}

// Función para cargar las películas
function loadMovies() {
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
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


// Función para agregar una película
function addMovie() {
    const titleInput = document.getElementById("movieTitleVistas");
    const scoreInput = document.getElementById("movieScore");
    const commentInput = document.getElementById("movieComment");

    let title = titleInput.value.trim();
    let score = parseFloat(scoreInput.value);
    let comment = commentInput.value.trim();

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

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.push(movie);
    localStorage.setItem("movies", JSON.stringify(movies));

    loadMovies();

    // Limpiar los campos después de agregar la película
    titleInput.value = "";
    scoreInput.value = "";
    commentInput.value = "";
}

// Función para editar una película
function editMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movie = movies[index];

    movieCard.innerHTML = `
        <input type="text" value="${movie.title}" class="edit-title">
        <input type="number" value="${movie.score}" step="0.1" min="1" max="10" class="edit-score">
        <span class="score-error" style="color: red; display: none;"></span>
        <textarea class="edit-comment">${movie.comment}</textarea>
        
        <button onclick="saveMovie(${index}, this)">Guardar</button>
        <button onclick="loadMovies()">Cancelar</button>
    `;
}


// Función para guardar los cambios de una película

function saveMovie(index, button) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movieCard = button.parentElement;

    let newTitle = movieCard.querySelector(".edit-title").value.trim();
    let newScoreInput = movieCard.querySelector(".edit-score");
    let newScore = parseFloat(newScoreInput.value);
    let newComment = movieCard.querySelector(".edit-comment").value.trim();
    let errorMsg = movieCard.querySelector(".score-error");

    errorMsg.style.display = "none";
    newScoreInput.classList.remove("error");

    if (isNaN(newScore) || newScore < 1 || newScore > 10) {
        errorMsg.textContent = "El puntaje debe estar entre 1.0 y 10.0.";
        errorMsg.style.display = "block";
        newScoreInput.classList.add("error");
        return;
    }

    newScore = newScore.toFixed(1);

    movies[index].title = newTitle;
    movies[index].score = newScore;
    movies[index].stars = generateStars(newScore);
    movies[index].comment = newComment;

    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies();
}


//Función para eliminar una película
function deleteMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies.splice(index, 1);

    localStorage.setItem("movies", JSON.stringify(movies));
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


// Función para agregar una película a la lista de "por ver"
function addToWatchList() {
    const titleInput = document.getElementById('movieTitleAgregar');
    const commentInput = document.getElementById('movieCommentAgregar');
    const title = titleInput.value.trim();
    const comment = commentInput.value.trim();

    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    watchList.push({ title, comment });
    localStorage.setItem('watchList', JSON.stringify(watchList));

    loadWatchList();

    titleInput.value = '';
    commentInput.value = '';
}

// Función para cargar la lista de "por ver"
function loadWatchList() {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    const list = document.getElementById('watchList');
    list.innerHTML = '';

    watchList.forEach((movie, index) => {
        const item = document.createElement('li');
        item.classList.add('watch-card');
        item.dataset.index = index;

        item.innerHTML = `
            <p><strong>Película:</strong> ${movie.title}</p>
            <p><strong>Comentario:</strong> ${movie.comment}</p>
            <button onclick="editWatchListMovie(${index})">Editar</button>
            <button onclick="removeFromWatchList(${index})">Eliminar</button>
        `;

        list.appendChild(item);
    });
}

// Función para eliminar una película de la lista de "por ver"
function removeFromWatchList(index) {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

    watchList.splice(index, 1);
    localStorage.setItem('watchList', JSON.stringify(watchList));

    loadWatchList();
}

// Función para editar una película de la lista de "por ver"
function editWatchListMovie(index) {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

    const newTitle = prompt("Editar título:", watchList[index].title);
    const newComment = prompt("Editar comentario:", watchList[index].comment);

    if (newTitle !== null && newComment !== null) {
        watchList[index].title = newTitle.trim();
        watchList[index].comment = newComment.trim();
        localStorage.setItem('watchList', JSON.stringify(watchList));
        loadWatchList();
    }
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