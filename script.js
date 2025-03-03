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
    let starRating = Math.round(score / 2); // Convertimos el puntaje (1-10) a estrellas (1-5)
    return "⭐".repeat(starRating) + "☆".repeat(5 - starRating); // Rellena con estrellas vacías si es necesario
}

function checkRoute() {
    const hash = window.location.hash.substring(1);
    document.querySelectorAll('.container').forEach(div => div.style.display = 'none');
    if (hash === 'agregar') {
        document.getElementById('agregar').style.display = 'block';
    } else if (hash === 'vistas') {
        document.getElementById('vistas').style.display = 'block';
    } else {
        document.getElementById('inicio').style.display = 'block';
    }
}



// Agregar película a la lista de vistas
function addMovie() {
    const title = document.getElementById("movieTitleVistas").value.trim();
    const scoreInput = document.getElementById("movieScore");
    let score = parseInt(scoreInput.value);
    const comment = document.getElementById("movieComment").value.trim();

    // Ocultar los mensajes de error antes de validaciones
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
        document.getElementById("error-score").textContent = "Por favor, ingresa un puntaje válido entre 1 y 10.";
        document.getElementById("error-score").style.display = "block";
        isValid = false;
    }

    if (!comment) {
        document.getElementById("error-comment").textContent = "Por favor, ingresa un comentario.";
        document.getElementById("error-comment").style.display = "block";
        isValid = false;
    }

    // Si los campos no son válidos, detener la ejecución
    if (!isValid) {
        return;
    }

    // Si todo es válido, ocultar los mensajes de error
    document.getElementById("error-title").style.display = "none";
    document.getElementById("error-score").style.display = "none";
    document.getElementById("error-comment").style.display = "none";

    // Continuar con la lógica de agregar la película
    score = Math.min(Math.max(score, 1), 10); // Asegurar que esté entre 1 y 10
    scoreInput.value = score; // Ajustar el valor en el input

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



//cargar películas
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

//editar película 

function editMovie(button) {
    const movieCard = button.parentElement;
    const index = movieCard.dataset.index;
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let movie = movies[index];

    // Crear inputs para la edición en línea
    movieCard.innerHTML = `
        <input type="text" value="${movie.title}" class="edit-title">
        <input type="number" value="${movie.score}" min="1" max="10" class="edit-score">
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
    let newScore = parseInt(movieCard.querySelector(".edit-score").value);
    let newComment = movieCard.querySelector(".edit-comment").value.trim();

    // Validar el puntaje
    if (isNaN(newScore) || newScore < 1 || newScore > 10) {
        alert("El puntaje debe estar entre 1 y 10.");
        return;
    }

    // Actualizar los datos
    movies[index].title = newTitle;
    movies[index].score = newScore;
    movies[index].starRating = Math.round(newScore / 2);
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