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
    let title = document.getElementById("movieTitleVistas").value;
    let score = document.getElementById("movieScore").value;
    
    if (title.trim() === "" || score.trim() === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let stars = "⭐".repeat(Math.round(score / 2)); // Estrellas basadas en puntaje
    let today = new Date().toLocaleDateString();

    let movieHTML = `
        <div class="movie-card">
            <div class="movie-title">${title}</div>
            <div class="movie-rating">${score}/10</div>
            <div class="movie-stars">${stars}</div>
            <div class="movie-comment">"Comentario aquí"</div>
            <div class="movie-date">${today}</div>
            <div class="movie-actions">
                <button class="edit-btn" onclick="editMovie(this)">✏️</button>
                <button class="delete-btn" onclick="deleteMovie(this)">🗑️</button>
            </div>
        </div>
    `;

    document.querySelector(".movies-container").innerHTML += movieHTML;

    // Limpiar campos
    document.getElementById("movieTitleVistas").value = "";
    document.getElementById("movieScore").value = "";
}

// Función para eliminar película
function deleteMovie(button) {
    button.parentElement.parentElement.remove();
}

// Función para editar película
function editMovie(button) {
    let movieCard = button.parentElement.parentElement;
    let title = prompt("Editar título:", movieCard.querySelector(".movie-title").innerText);
    let score = prompt("Editar puntaje (1-10):", movieCard.querySelector(".movie-rating").innerText.split("/")[0]);

    if (title && score) {
        movieCard.querySelector(".movie-title").innerText = title;
        movieCard.querySelector(".movie-rating").innerText = `${score}/10`;
        movieCard.querySelector(".movie-stars").innerText = "⭐".repeat(Math.round(score / 2));
    }
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
