document.addEventListener("DOMContentLoaded", () => {
    let stars = document.querySelectorAll(".stars span");
    let starContainer = document.getElementById("starRating");
    
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            stars.forEach((s, i) => {
                s.classList.toggle("active", i <= index);
            });
            starContainer.dataset.rating = index + 1;
        });
    });
});

function addMovie() {
    let title = document.getElementById("movieTitle").value.trim();
    let score = document.getElementById("movieScore").value;
    let starRating = document.getElementById("starRating").dataset.rating || 0;

    if (title === "" || score < 1 || score > 10) {
        alert("Por favor, ingrese un nombre válido y un puntaje entre 1 y 10.");
        return;
    }

    let movieList = document.getElementById("movieList");
    let li = document.createElement("li");
    li.innerHTML = `<strong>${title}</strong> - Puntaje: ${score}/10 - 
                    <span class="stars"> ${"★".repeat(starRating)}${"☆".repeat(5 - starRating)} </span>`;
    movieList.appendChild(li);

    document.getElementById("movieTitle").value = "";
    document.getElementById("movieScore").value = "";
}
