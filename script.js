document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    setupStarRating();
    loadWatchList();
});

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

// Agregar película a la lista de vistas
function addMovie() {
    const title = document.getElementById("movieTitleVistas").value.trim();
    const scoreInput = document.getElementById("movieScore");
    let score = parseFloat(scoreInput.value); // Permitir decimales
    const comment = document.getElementById("movieComment").value.trim();

    // Ocultar mensajes de error antes de validar
    document.getElementById("error-title").style.display = "none";
    document.getElementById("error-score").style.display = "none";
    document.getElementById("error-comment").style.display = "none";

    let isValid = true;

    // Validación de datos
    if (!title) {
        document.getElementById("error-title").textContent = "Por favor, ingresa el título de la película.";
        document.getElementById("error-title").style.display = "block";
        isValid = false;
    }

    if (isNaN(score) || score < 1 || score > 10) {
        document.getElementById("error-score").textContent = "Por favor, ingresa un puntaje válido entre 1.0 y 10.0.";
        document.getElementById("error-score").style.display = "block";
        isValid = false;
    }

    if (!comment) {
        document.getElementById("error-comment").textContent = "Por favor, ingresa un comentario.";
        document.getElementById("error-comment").style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    // Ajustar score dentro del rango y redondear a un decimal
    score = Math.min(Math.max(score, 1), 10).toFixed(1); 

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

    loadMovies(); // Recargar la lista

    // Limpiar los campos
    document.getElementById("movieTitleVistas").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("movieComment").value = "";
}

// Cargar películas
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
            <p>⭐ ${generateStars(parseFloat(movie.score))}</p>
            <p>"${movie.comment}"</p>
            <p>📅 Agregada el: ${movie.addedDate}</p>
            <button onclick="editMovie(this)">✏️ Editar</button>
            <button onclick="deleteMovie(this)">🗑️ Eliminar</button>
        `;

        movieList.appendChild(li);
    });
}



//editar película 

function editMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
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
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movieCard = button.parentElement;

    // Obtener los valores editados
    let newTitle = movieCard.querySelector(".edit-title").value.trim();
    let newScore = parseFloat(movieCard.querySelector(".edit-score").value); // Ahora permite decimales
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
    movies[index].stars = generateStars(newScore); // Regenerar estrellas
    movies[index].comment = newComment;

    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies(); // Recargar la lista con los cambios
}

// Eliminar película
function deleteMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    let movies = JSON.parse(localStorage.getItem("movies")) || [];

    movies.splice(index, 1);
    localStorage.setItem("movies", JSON.stringify(movies));
    loadMovies(); // Recargar lista actualizada
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
    if (!title) {
        alert("Ingrese un nombre válido.");
        return;
    }

    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    watchList.push(title);
    localStorage.setItem('watchList', JSON.stringify(watchList));

    loadWatchList();
    document.getElementById('movieTitleAgregar').value = '';
}

// Cargar la lista de "por ver"
function loadWatchList() {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
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
    let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    let title = button.parentElement.querySelector("p").textContent;
    watchList = watchList.filter(movie => movie !== title);

    localStorage.setItem('watchList', JSON.stringify(watchList));
    loadWatchList();
}

function searchMovie() {
    const query = document.getElementById("searchMovie").value.toLowerCase();
    const movies = document.querySelectorAll("#movieList li");

    movies.forEach(movie => {
        const title = movie.querySelector(".movie-title").textContent.toLowerCase();
        if (title.includes(query)) {
            movie.style.display = "block"; // Mostrar si coincide
        } else {
            movie.style.display = "none"; // Ocultar si no coincide
        }
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