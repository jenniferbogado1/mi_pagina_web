
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
            <p> ${generateStars(movie.score)}</p>
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

    const errorTitle = document.getElementById("errorTitle");
    const errorScore = document.getElementById("errorScore");
    const errorComment = document.getElementById("errorComment");

    let title = titleInput.value.trim();
    let score = parseFloat(scoreInput.value);
    let comment = commentInput.value.trim();

    // Reiniciar los mensajes de error
    errorTitle.textContent = "";
    errorScore.textContent = "";
    errorComment.textContent = "";

    let hasError = false;

    if (!title) {
        errorTitle.textContent = "El título es obligatorio.";
        hasError = true;
    }
    
    if (isNaN(score) || score < 1 || score > 10) {
        errorScore.textContent = "El puntaje debe estar entre 1 y 10.";
        hasError = true;
    }

    if (!comment) {
        errorComment.textContent = "El comentario es obligatorio.";
        hasError = true;
    }

    if (hasError) return; // Detiene la función si hay errores

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

    // Limpiar los mensajes de error previos
    const errorTitle = document.getElementById('errorTitle');
    const errorComment = document.getElementById('errorComment');
    errorTitle.textContent = '';
    errorComment.textContent = '';

    // Verificar si los campos están vacíos y mostrar mensaje de error
    let isValid = true;
    if (!title) {
        errorTitle.textContent = 'Por favor, ingresa un título.';
        isValid = false;
    }
    if (!comment) {
        errorComment.textContent = 'Por favor, ingresa un comentario.';
        isValid = false;
    }

    if (!isValid) return;  // Si hay un error, no continuar

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

    // Verificar si la lista está vacía
    if (watchList.length === 0) {
        list.innerHTML = '<p>No hay películas en la lista.</p>';
    }

    watchList.forEach((movie, index) => {
        const item = document.createElement('li');
        item.classList.add('watch-card');
        item.dataset.index = index;

        item.innerHTML = `
            <p><strong>Película:</strong></p>
            <input type="text" id="title-${index}" value="${movie.title}" class="editable-input" onchange="saveEdit(${index})">
            <br>
            <p><strong>Comentario:</strong></p>
            <input type="text" id="comment-${index}" value="${movie.comment}" class="editable-input" onchange="saveEdit(${index})">
            <br>
            <button onclick="removeFromWatchList(${index})">Eliminar</button>
        `;

        list.appendChild(item);
    });
}

// Función para guardar los cambios después de editar
function saveEdit(index) {
    const newTitle = document.getElementById(`title-${index}`).value.trim();
    const newComment = document.getElementById(`comment-${index}`).value.trim();

    // Verificar que los campos no estén vacíos
    if (newTitle && newComment) {
        let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
        watchList[index].title = newTitle;
        watchList[index].comment = newComment;
        localStorage.setItem('watchList', JSON.stringify(watchList));
    } else {
        alert("Por favor, completa tanto el título como el comentario.");
    }
    loadWatchList();  // Recargar la lista para reflejar los cambios
}

// Función para eliminar una película de la lista de "por ver"
function removeFromWatchList(index) {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

    watchList.splice(index, 1);
    localStorage.setItem('watchList', JSON.stringify(watchList));

    loadWatchList();
}

// Cargar la lista de películas cuando se cargue la página
window.onload = function() {
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