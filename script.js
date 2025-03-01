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
           const title = document.getElementById('movieTitleVistas').value.trim();
           const starRating = document.querySelectorAll('#starRating .star.active').length;
           const score = parseInt(document.getElementById('movieScore').value);

           if (!title || isNaN(score) || score < 1 || score > 10) {
               alert("Por favor, ingrese un título válido y un puntaje entre 1 y 10.");
               return;
           }

           const list = document.getElementById('movieList');
           const item = document.createElement('li');
           const date = new Date().toLocaleDateString();

           item.innerHTML = `
               <div class="movie-card">
                   <input type="text" value="${title}" class="edit-title" disabled>
                   <div class="stars-container">${generateStars(starRating)}</div>
                   <p>Puntaje: ${score}/10</p>
                   <p>📅 ${date}</p>
                   <button onclick="editMovie(this)">Editar</button>
                   <button onclick="deleteMovie(this)">Eliminar</button>
               </div>
           `;

           list.appendChild(item);
           saveMovies();
       }

       function editMovie(button) {
           const card = button.parentElement;
           const input = card.querySelector('.edit-title');
           if (button.textContent === 'Editar') {
               input.disabled = false;
               button.textContent = 'Guardar';
           } else {
               input.disabled = true;
               button.textContent = 'Editar';
               saveMovies();
           }
       }

       function deleteMovie(button) {
           button.parentElement.remove();
           saveMovies();
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