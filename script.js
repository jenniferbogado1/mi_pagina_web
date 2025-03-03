document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
    setupStarRating();
});

       function navigateTo(section) {
           window.location.hash = section;
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

       function addMovie() {
    const title = document.getElementById("movieTitleVistas").value;
    const scoreInput = document.getElementById("movieScore");
    const score = parseInt(scoreInput.value);
    const comment = document.getElementById("movieComment").value;
    const moviesContainer = document.getElementById("moviesContainer");

    // Validar que el puntaje esté dentro del rango 1-10
    if (isNaN(score) || score < 1) {
        scoreInput.value = 1;
    } else if (score > 10) {
        scoreInput.value = 10;
    }

    // Validar que todos los campos estén completos
    if (!title || !score || !comment) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear la tarjeta de la película
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
        <div class="movie-title">${title.toUpperCase()}</div>
        <div class="movie-rating">${score}/10</div>
        <div class="movie-stars">${"⭐".repeat(Math.round(score / 2))}</div>
        <div class="movie-comment">"${comment}"</div>
        <div class="movie-date">${new Date().toLocaleDateString()}</div>
        <div class="movie-actions">
            <button class="edit-btn" onclick="editMovie(this)">✏️</button>
            <button class="delete-btn" onclick="deleteMovie(this)">🗑️</button>
        </div>
    `;

    // Agregar la película al contenedor
    moviesContainer.appendChild(movieCard);

    // Limpiar los campos después de agregar la película
    document.getElementById("movieTitleVistas").value = "";
    document.getElementById("movieScore").value = "";
    document.getElementById("movieComment").value = "";
}

// Validación de input en tiempo real
document.getElementById("movieScore").addEventListener("input", function () {
    let value = this.value.trim(); // Obtener el valor sin espacios

    // Permitir que el usuario borre el input sin establecer un valor forzado
    if (value === "") return;

    let numValue = parseInt(value);

    if (!isNaN(numValue)) {
        if (numValue < 1) this.value = 1;
        if (numValue > 10) this.value = 10;
    }
});

// Validación al perder el foco (cuando el usuario deja de escribir)
document.getElementById("movieScore").addEventListener("blur", function () {
    let value = this.value.trim();
    if (value === "" || isNaN(value)) {
        this.value = ""; // Dejar vacío si el usuario no ingresa nada
    }
});

function editMovie(button) {
    const movieCard = button.parentElement.parentElement;
    const title = prompt("Nuevo nombre de la película:", movieCard.querySelector(".movie-title").innerText);
    const score = prompt("Nuevo puntaje (1-10):", movieCard.querySelector(".movie-rating").innerText.split("/")[0]);
    const comment = prompt("Nuevo comentario:", movieCard.querySelector(".movie-comment").innerText.replace(/"/g, ''));

    if (title) movieCard.querySelector(".movie-title").innerText = title.toUpperCase();
    if (score) {
        movieCard.querySelector(".movie-rating").innerText = `${score}/10`;
        movieCard.querySelector(".movie-stars").innerHTML = "⭐".repeat(Math.round(score / 2));
    }
    if (comment) movieCard.querySelector(".movie-comment").innerText = `"${comment}"`;
}

function deleteMovie(button) {
    const movieCard = button.parentElement.parentElement;
    movieCard.remove();
}

       function saveMovies() {
           let movies = [];
           document.querySelectorAll('.movie-card').forEach(card => {
               movies.push({
                   title: card.querySelector('.edit-title').value,
                   stars: card.querySelectorAll('.star.active').length,
                   score: card.querySelector('p:nth-of-type(1)').textContent.replace('Puntaje: ', '').replace('/10', ''),
                   date: card.querySelector('p:nth-of-type(2)').textContent.replace('📅 ', '')
               });
           });
           localStorage.setItem('movies', JSON.stringify(movies));
       }

       function generateStars(starRating) {
           return Array.from({ length: 5 }, (_, i) =>
               `<span class="star ${i < starRating ? 'active' : ''}" data-value="${i + 1}">★</span>`
           ).join("");
       }

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
               });

               starsContainer.appendChild(star);
           }
       }
       
       function addToWatchList() {
           const title = document.getElementById('movieTitleAgregar').value.trim();
           if (!title) {
               alert("Ingrese un nombre válido.");
               return;
           }

           const list = document.getElementById('watchList');
           const item = document.createElement('li');
           item.classList.add('watch-card');

           item.innerHTML = `
               <p>${title}</p>
               <button onclick="removeFromWatchList(this)">Eliminar</button>
           `;

           list.appendChild(item);
           saveWatchList();
           document.getElementById('movieTitleAgregar').value = '';
       }

       function removeFromWatchList(button) {
           button.parentElement.remove();
           saveWatchList();
       }

       function saveWatchList() {
           let watchList = [];
           document.querySelectorAll('#watchList .watch-card p').forEach(p => {
               watchList.push(p.textContent);
           });
           localStorage.setItem('watchList', JSON.stringify(watchList));
       }

       function loadWatchList() {
           let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
           const list = document.getElementById('watchList');
           list.innerHTML = '';
           watchList.forEach(title => {
               const item = document.createElement('li');
               item.classList.add('watch-card');
               item.innerHTML = `<p>${title}</p>
                   <button onclick="removeFromWatchList(this)">Eliminar</button>`;
               list.appendChild(item);
           });
       }



       window.addEventListener('hashchange', checkRoute);
       window.addEventListener('load', () => {
           checkRoute();
           setupStarRating();
       });



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
                ${generateStars(Math.round(movie.score / 2))}  <!-- Convertimos el puntaje de 10 a 5 estrellas -->
            </div>
            <p>🎯 Puntaje: <span class="movie-score">${movie.score}</span>/10</p>
            <span>📅 Agregada el: ${movie.addedDate}</span>
            <button onclick="editMovie(${index})">Editar</button>
            <button onclick="saveMovie(${index})" style="display:none;">Guardar</button>
            <button onclick="deleteMovie(${index})">Eliminar</button>
        `;

        movieList.appendChild(li);
    });

    setupStarClickEvents();
}


function loadSection(section) {
    fetch(`${section}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
            setupStarRating(); // Asegura que las estrellas funcionen
            checkRoute(); // Verifica la sección activa
        })
        .catch(error => console.log("Error al cargar la sección: ", error));
}


function navigateTo(page) {
    window.location.href = page;
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
